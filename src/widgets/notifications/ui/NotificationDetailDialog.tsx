import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { NotificationResponseDto } from '@/entities/notification'
import { detailActionLabel, detailCopy } from '../model/notification-presentation'
import { useNotificationDetail } from '../model/useNotifications'
import { NotificationDetailView } from './NotificationModeViews'
import * as S from './NotificationPage.styles'

export function NotificationDetailDialog({ notification, readError, isMarkReadPending, onClose }: {
  notification: NotificationResponseDto
  readError: string
  isMarkReadPending: boolean
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { actionError, detail, handleNotificationAction, markReadMutation } = useNotificationDetail(notification)

  useEffect(() => {
    const dialog = dialogRef.current
    const trigger = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
  }, [])

  return createPortal(<S.DetailDialog ref={dialogRef} aria-label="알림 상세"
    onCancel={(event) => { event.preventDefault(); onClose() }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    {readError || actionError ? <S.ErrorMessage role="alert">{readError || actionError}</S.ErrorMessage> : null}
    <NotificationDetailView detail={detail} content={detail ? detailCopy(detail) : undefined}
      actionLabel={detail ? detailActionLabel(detail) : undefined} backLabel="닫기"
      isError={false} isLoading={false}
      isMarkReadPending={isMarkReadPending || markReadMutation.isPending}
      onAction={() => void handleNotificationAction()} onBack={onClose} />
  </S.DetailDialog>, document.body)
}
