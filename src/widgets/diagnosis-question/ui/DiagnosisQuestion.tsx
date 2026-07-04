import type { DiagnosisQuestionProps } from '../model/types'
import * as S from './DiagnosisQuestion.styles'

export function DiagnosisQuestion({
  questionNumber,
  question,
  options,
  selectedOptionId,
  isLastQuestion = false,
  isSubmitting = false,
  onPrevious,
  onSelect,
  onNext,
  totalQuestions = 9,
}: DiagnosisQuestionProps) {
  return (
    <S.Container aria-labelledby="diagnosis-question-title">
      <S.ProgressHeader>
        <span>여행 성향 진단</span>
        <strong>{questionNumber} / {totalQuestions}</strong>
      </S.ProgressHeader>
      <S.ProgressTrack aria-hidden="true">
        <S.ProgressBar $value={(questionNumber / totalQuestions) * 100} />
      </S.ProgressTrack>
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

      <S.Actions>
        <S.PreviousButton type="button" onClick={onPrevious} disabled={!onPrevious || isSubmitting}>
          이전
        </S.PreviousButton>
        <S.NextButton type="button" onClick={onNext} disabled={isSubmitting}>
          {isSubmitting ? '결과 확인 중' : isLastQuestion ? '결과 보기' : '다음'}
        </S.NextButton>
      </S.Actions>
    </S.Container>
  )
}
