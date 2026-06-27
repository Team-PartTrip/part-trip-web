export type DiagnosisOption = {
  id: string
  label: string
}

export type DiagnosisQuestionProps = {
  questionNumber: number
  question: string
  options: readonly DiagnosisOption[]
  selectedOptionId: string
  onSelect: (optionId: string) => void
  onNext?: () => void
}
