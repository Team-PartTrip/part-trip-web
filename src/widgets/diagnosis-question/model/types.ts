export type DiagnosisOption = {
  id: string
  label: string
}

export type DiagnosisQuestionProps = {
  questionNumber: number
  question: string
  options: readonly DiagnosisOption[]
  selectedOptionId: string
  isLastQuestion?: boolean
  isSubmitting?: boolean
  onSelect: (optionId: string) => void
  onNext: () => void
}
