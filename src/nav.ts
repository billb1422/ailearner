// Tiny navigation registry so the markdown renderer can jump to lessons
// via [label](lesson:<id>) links without threading callbacks through every component.

type LessonNavigator = (lessonId: string) => void

let navigator: LessonNavigator | null = null

export function registerLessonNavigator(fn: LessonNavigator) {
  navigator = fn
}

export function goToLesson(lessonId: string) {
  navigator?.(lessonId)
}
