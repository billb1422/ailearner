/**
 * Content invariant checks for the curriculum.
 *
 * Run with `npm run validate:content`. Guards the rules in CLAUDE.md that
 * TypeScript can't express: lesson ids must be unique (progress in
 * src/store.ts is keyed by id, so a collision makes two lessons share one
 * completion + quiz record), quiz shapes are fixed, and every in-prose
 * `lesson:<id>` jump link has to point at a lesson that exists.
 */
import { MODULES } from '../src/content/curriculum'

const errors: string[] = []

const lessonIds = new Set<string>()
let lessonCount = 0

for (const mod of MODULES) {
  for (const lesson of mod.lessons) {
    lessonCount++
    const where = `${lesson.id} ("${lesson.title}", module ${mod.id})`

    if (lessonIds.has(lesson.id)) {
      errors.push(`duplicate lesson id: ${where} reuses an id already taken by another lesson`)
    }
    lessonIds.add(lesson.id)

    if (lesson.skipQuiz.length !== 5) {
      errors.push(`${where}: skipQuiz has ${lesson.skipQuiz.length} questions, expected 5`)
    }
    if (lesson.checkQuiz.length !== 4) {
      errors.push(`${where}: checkQuiz has ${lesson.checkQuiz.length} questions, expected 4`)
    }

    const quizzes = [
      ['skipQuiz', lesson.skipQuiz],
      ['checkQuiz', lesson.checkQuiz],
    ] as const

    for (const [quizName, questions] of quizzes) {
      questions.forEach((q, i) => {
        if (q.options.length !== 4) {
          errors.push(`${where}: ${quizName}[${i}] has ${q.options.length} options, expected 4`)
        }
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
          errors.push(`${where}: ${quizName}[${i}] answer index ${q.answer} is out of range`)
        }
      })
    }
  }
}

// Cross-reference links live inside md/prose strings all over the content, so
// scan the serialized tree rather than trying to enumerate every field.
const linkRefs = new Map<string, number>()
for (const match of JSON.stringify(MODULES).matchAll(/lesson:([a-zA-Z0-9-]+)/g)) {
  linkRefs.set(match[1], (linkRefs.get(match[1]) ?? 0) + 1)
}
for (const [ref, count] of linkRefs) {
  if (!lessonIds.has(ref)) {
    errors.push(`broken cross-reference: lesson:${ref} (${count} link${count === 1 ? '' : 's'}) matches no lesson id`)
  }
}

const summary =
  `${MODULES.length} modules, ${lessonCount} lessons, ` +
  `${lessonIds.size} unique ids, ${linkRefs.size} distinct lesson: links`

if (errors.length > 0) {
  console.error(`FAIL (${summary})\n`)
  for (const err of errors) console.error(`  - ${err}`)
  console.error(`\n${errors.length} problem${errors.length === 1 ? '' : 's'} found.`)
  process.exit(1)
}

console.log(`PASS (${summary})`)
