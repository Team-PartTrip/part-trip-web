import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveDiagnosisResultMock } from '@shared/api'
import { paths } from '@shared/config'
import { DiagnosisQuestion } from '@widgets/diagnosis-question'

import { DIAGNOSIS_QUESTIONS } from '../model/questions'
import type { DiagnosisAnswers } from '../model/types'
import * as S from './DiagnosisPage.styles'

const INITIAL_ANSWERS = Object.fromEntries(
  DIAGNOSIS_QUESTIONS.map((question) => [
    question.id,
    question.options[0].id,
  ]),
) as DiagnosisAnswers

export function DiagnosisPage() {
  const navigate = useNavigate()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<DiagnosisAnswers>(INITIAL_ANSWERS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const currentQuestion = DIAGNOSIS_QUESTIONS[currentQuestionIndex]

  const handleSelect = (optionId: string) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: optionId,
    }))
  }

  const handleNext = async () => {
    const isLastQuestion =
      currentQuestionIndex === DIAGNOSIS_QUESTIONS.length - 1

    if (isLastQuestion) {
      try {
        setIsSubmitting(true)
        setErrorMessage(null)
        await saveDiagnosisResultMock()
        navigate(paths.diagnosisResult)
      } catch {
        setErrorMessage('진단 결과를 저장하지 못했습니다. 다시 시도해주세요.')
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    setCurrentQuestionIndex((index) => index + 1)
  }

  return (
    <S.Page>
      <DiagnosisQuestion
        questionNumber={currentQuestionIndex + 1}
        question={currentQuestion.question}
        options={currentQuestion.options}
        selectedOptionId={answers[currentQuestion.id]}
        isLastQuestion={currentQuestionIndex === DIAGNOSIS_QUESTIONS.length - 1}
        isSubmitting={isSubmitting}
        onSelect={handleSelect}
        onNext={() => void handleNext()}
      />
      {errorMessage ? <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage> : null}
    </S.Page>
  )
}
