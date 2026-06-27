export type DiagnosisChoice = {
  id: string
  label: string
}

export type DiagnosisQuestionData = {
  id: string
  question: string
  options: readonly DiagnosisChoice[]
}

export type DiagnosisAnswers = Record<string, string>
