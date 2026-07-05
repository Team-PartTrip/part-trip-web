import { useEffect, useRef, useState } from 'react'

import { logout } from '../../model/api'
import * as S from './LogoutDialog.styles'

interface Props {
  onClose: () => void
  moveToLogin: () => void | Promise<void>
}

const LogoutDialog = ({ onClose, moveToLogin }: Props) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleLogout = async () => {
    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      await logout()
      onClose()
      await moveToLogin()
    } catch {
      setErrorMessage('로그아웃에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <S.Dimmer
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <S.Dialog role="dialog" aria-modal="true" aria-labelledby="logout-title">
        <S.Title id="logout-title">정말 로그아웃할까요?</S.Title>
        <S.Description>다시 로그인해야 해요.</S.Description>
        {errorMessage ? <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage> : null}
        <S.Actions>
          <S.CloseButton
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            닫기
          </S.CloseButton>
          <S.LogoutButton
            type="button"
            onClick={() => void handleLogout()}
            disabled={isSubmitting}
          >
            {isSubmitting ? '로그아웃 중' : '로그아웃'}
          </S.LogoutButton>
        </S.Actions>
      </S.Dialog>
    </S.Dimmer>
  )
}

export default LogoutDialog
