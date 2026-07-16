import { useRef, useState } from 'react'
import { exportProgress, importProgress, resetProgress } from '../store'

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const doExport = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ailearner-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg('Progress exported.')
  }

  const doImport = async (f: File) => {
    const text = await f.text()
    setMsg(importProgress(text) ? 'Progress imported!' : 'Import failed: that is not a valid progress file.')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-zinc-700 bg-zinc-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-zinc-100">Settings</h2>
        <div className="mt-4 space-y-2.5">
          <button
            onClick={doExport}
            className="w-full rounded-lg border border-zinc-700 hover:border-zinc-500 px-4 py-2.5 text-sm text-left text-zinc-200"
          >
            ⬇️ Export progress (JSON)
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-lg border border-zinc-700 hover:border-zinc-500 px-4 py-2.5 text-sm text-left text-zinc-200"
          >
            ⬆️ Import progress
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])}
          />
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full rounded-lg border border-rose-900 hover:border-rose-700 px-4 py-2.5 text-sm text-left text-rose-400"
            >
              🗑️ Reset all progress…
            </button>
          ) : (
            <button
              onClick={() => {
                resetProgress()
                setConfirmReset(false)
                setMsg('Progress reset.')
              }}
              className="w-full rounded-lg bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-sm text-left text-white font-semibold"
            >
              ⚠️ Click again to confirm full reset
            </button>
          )}
        </div>
        {msg && <p className="mt-3 text-sm text-emerald-400">{msg}</p>}
        <button onClick={onClose} className="mt-5 w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-sm text-zinc-200">
          Close
        </button>
      </div>
    </div>
  )
}
