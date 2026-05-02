import { Lightbulb } from 'lucide-react'

export function AnswerBlock({ answer }: { answer: string }) {
  return (
    <div className="my-8 rounded-lg border border-amber-200/50 bg-amber-50/30 dark:border-amber-900/50 dark:bg-amber-950/20 p-6">
      <div className="flex gap-4">
        <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-950 dark:text-amber-50 mb-2">AI Answer</p>
          <p className="text-sm text-amber-900/80 dark:text-amber-100/80 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}
