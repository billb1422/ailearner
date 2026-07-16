import { useEffect, useState } from 'react'
import { MODULES } from './content/curriculum'
import { registerLessonNavigator } from './nav'
import { useProgress } from './store'
import { levelForXp } from './gamification'
import { isLessonDone } from './awards'
import { Dashboard } from './components/Dashboard'
import { ModuleView } from './components/ModuleView'
import { LessonView } from './components/LessonView'
import { CalendarView } from './components/CalendarView'
import { BadgesView } from './components/BadgesView'
import { CapstoneView } from './components/CapstoneView'
import { SettingsModal } from './components/SettingsModal'
import { BadgeToast } from './components/BadgeToast'

type Nav =
  | { view: 'dashboard' }
  | { view: 'module'; moduleId: string }
  | { view: 'lesson'; moduleId: string; lessonId: string }
  | { view: 'calendar' }
  | { view: 'badges' }
  | { view: 'capstone' }

export default function App() {
  const [nav, setNav] = useState<Nav>({ view: 'dashboard' })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toastBadges, setToastBadges] = useState<string[]>([])
  const p = useProgress()
  const level = levelForXp(p.xp)

  useEffect(() => {
    registerLessonNavigator((lessonId) => {
      const m = MODULES.find((mod) => mod.lessons.some((l) => l.id === lessonId))
      if (m) setNav({ view: 'lesson', moduleId: m.id, lessonId })
    })
  }, [])

  const showBadges = (ids: string[]) => setToastBadges((prev) => [...prev, ...ids])

  const navBtn = (label: string, icon: string, target: Nav, active: boolean) => (
    <button
      onClick={() => setNav(target)}
      className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium w-full text-left transition-colors ${
        active ? 'bg-sky-500/15 text-sky-300' : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200'
      }`}
    >
      <span>{icon}</span>
      <span className="hidden lg:inline">{label}</span>
    </button>
  )

  return (
    <div className="min-h-full flex">
      {/* Sidebar */}
      <aside className="w-16 lg:w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-950 p-3 flex flex-col gap-1 sticky top-0 h-screen overflow-y-auto">
        <button onClick={() => setNav({ view: 'dashboard' })} className="flex items-center gap-2.5 px-2 py-3 mb-2">
          <span className="text-2xl">🧠</span>
          <span className="hidden lg:block font-black text-lg text-zinc-100 tracking-tight">
            ai<span className="text-sky-400">Learner</span>
          </span>
        </button>

        {navBtn('Dashboard', '🏠', { view: 'dashboard' }, nav.view === 'dashboard')}
        {navBtn('Calendar', '📅', { view: 'calendar' }, nav.view === 'calendar')}
        {navBtn('Badges', '🏅', { view: 'badges' }, nav.view === 'badges')}
        {navBtn('Capstone', '👑', { view: 'capstone' }, nav.view === 'capstone')}

        <div className="hidden lg:block mt-4 mb-1 px-3 text-[11px] uppercase tracking-widest text-zinc-600 font-bold">
          Modules
        </div>
        {MODULES.map((m) => {
          const done = m.lessons.filter((l) => isLessonDone(p, l.id)).length
          const active = (nav.view === 'module' || nav.view === 'lesson') && nav.moduleId === m.id
          return (
            <button
              key={m.id}
              onClick={() => setNav({ view: 'module', moduleId: m.id })}
              className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm w-full text-left transition-colors ${
                active ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200'
              }`}
            >
              <span>{m.emoji}</span>
              <span className="hidden lg:inline flex-1 truncate">{m.title}</span>
              <span
                className={`hidden lg:inline text-[11px] font-mono ${
                  done === m.lessons.length ? 'text-emerald-400' : 'text-zinc-600'
                }`}
              >
                {done}/{m.lessons.length}
              </span>
            </button>
          )
        })}

        <div className="mt-auto pt-3 border-t border-zinc-800/80">
          <div className="hidden lg:block px-3 pb-2">
            <div className="text-xs text-zinc-500">
              Lv {level.level} · {level.title}
            </div>
            <div className="text-sm font-bold text-sky-400">{p.xp.toLocaleString()} XP</div>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-zinc-500 hover:bg-zinc-800/70 hover:text-zinc-200 w-full"
          >
            <span>⚙️</span>
            <span className="hidden lg:inline">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-4 sm:p-8">
        {nav.view === 'dashboard' && (
          <Dashboard
            modules={MODULES}
            onOpenModule={(id) => setNav({ view: 'module', moduleId: id })}
            onOpenLesson={(moduleId, lessonId) => setNav({ view: 'lesson', moduleId, lessonId })}
            onOpenBadges={() => setNav({ view: 'badges' })}
            onOpenCalendar={() => setNav({ view: 'calendar' })}
          />
        )}
        {nav.view === 'calendar' && <CalendarView />}
        {nav.view === 'badges' && <BadgesView />}
        {nav.view === 'capstone' && <CapstoneView modules={MODULES} onBadges={showBadges} />}
        {nav.view === 'module' &&
          (() => {
            const m = MODULES.find((x) => x.id === nav.moduleId)
            if (!m) return null
            return (
              <ModuleView
                module={m}
                modules={MODULES}
                onOpenLesson={(lessonId) => setNav({ view: 'lesson', moduleId: m.id, lessonId })}
                onBack={() => setNav({ view: 'dashboard' })}
                onBadges={showBadges}
              />
            )
          })()}
        {nav.view === 'lesson' &&
          (() => {
            const m = MODULES.find((x) => x.id === nav.moduleId)
            const l = m?.lessons.find((x) => x.id === nav.lessonId)
            if (!m || !l) return null
            return (
              <LessonView
                key={l.id}
                lesson={l}
                module={m}
                modules={MODULES}
                onBack={() => setNav({ view: 'module', moduleId: m.id })}
                onBadges={showBadges}
              />
            )
          })()}
      </main>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
      <BadgeToast badgeIds={toastBadges} onDismiss={() => setToastBadges([])} />
    </div>
  )
}
