import type { DiagnosisQuestionProps } from '../model/types'
import * as S from './DiagnosisQuestion.styles'

export function DiagnosisQuestion({
  questionNumber,
  question,
  options,
  selectedOptionId,
  onSelect,
  onNext,
}: DiagnosisQuestionProps) {
  return (
    <S.Container aria-labelledby="diagnosis-question-title">
      <S.Title id="diagnosis-question-title">
        Q{questionNumber}. {question}
      </S.Title>

      <S.Options aria-label={`질문 ${questionNumber} 답변`}>
        {options.map((option) => {
          const isSelected = option.id === selectedOptionId

          return (
            <S.OptionButton
              key={option.id}
              type="button"
              $selected={isSelected}
              aria-pressed={isSelected}
              onClick={() => onSelect(option.id)}
            >
              {option.label}
            </S.OptionButton>
          )
        })}
      </S.Options>

      <S.NextButton type="button" onClick={onNext}>
        다음
      </S.NextButton>
    </S.Container>
  )
}
