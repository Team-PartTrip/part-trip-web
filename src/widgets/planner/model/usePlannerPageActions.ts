import { useState } from 'react'

type Props = {
  handleConfirmPlan: () => Promise<boolean>
  isConfirmed: boolean
  plannerInviteLink: string
}

export function usePlannerPageActions({
  handleConfirmPlan,
  isConfirmed,
  plannerInviteLink,
}: Props) {
  const [inviteLinkFeedback, setInviteLinkFeedback] = useState('')
  const [inviteLinkError, setInviteLinkError] = useState('')
  const [shareError, setShareError] = useState('')

  const handleSharePlan = async () => {
    if (!isConfirmed && !(await handleConfirmPlan())) return
    try {
      if (!navigator.clipboard) throw new Error('clipboard is unavailable')
      await navigator.clipboard.writeText(window.location.href)
      setShareError('')
    } catch {
      setShareError('일정 공유 링크를 복사하지 못했습니다.')
    }
  }

  const handleCopyInviteLink = async () => {
    setInviteLinkFeedback('')
    setInviteLinkError('')
    if (!plannerInviteLink) {
      setInviteLinkError('초대 링크를 찾을 수 없습니다.')
      return
    }
    try {
      if (!navigator.clipboard) throw new Error('clipboard is unavailable')
      await navigator.clipboard.writeText(plannerInviteLink)
      setInviteLinkFeedback('초대 링크를 복사했습니다.')
    } catch {
      setInviteLinkError('초대 링크를 복사하지 못했습니다.')
    }
  }

  return {
    handleCopyInviteLink,
    handleSharePlan,
    inviteLinkError,
    inviteLinkFeedback,
    shareError,
  }
}
