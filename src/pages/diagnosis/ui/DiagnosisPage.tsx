import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const currentQuestion = DIAGNOSIS_QUESTIONS[currentQuestionIndex]

  const handleSelect = (optionId: string) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: optionId,
    }))
  }

  const handleNext = () => {
    const isLastQuestion =
      currentQuestionIndex === DIAGNOSIS_QUESTIONS.length - 1

    if (isLastQuestion) {
      navigate(paths.main)
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
        onSelect={handleSelect}
        onNext={handleNext}
      />
    </S.Page>
  )
}
