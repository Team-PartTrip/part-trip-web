import { useEffect, useRef } from 'react'

import { logout } from '../../model/api'
import * as S from './LogoutDialog.styles'

interface Props {
  onClose: () => void
  moveToLogin: () => void | Promise<void>
}

const LogoutDialog = ({ onClose, moveToLogin }: Props) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

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
    await logout()
    onClose()
    await moveToLogin()
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
        <S.Actions>
          <S.CloseButton ref={closeButtonRef} type="button" onClick={onClose}>
            닫기
          </S.CloseButton>
          <S.LogoutButton type="button" onClick={() => void handleLogout()}>
            로그아웃
          </S.LogoutButton>
        </S.Actions>
      </S.Dialog>
    </S.Dimmer>
  )
}

export default LogoutDialog
