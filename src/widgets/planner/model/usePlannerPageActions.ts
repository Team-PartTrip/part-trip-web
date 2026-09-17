import { useState } from 'react'

export function usePlannerPageActions(plannerInviteLink: string) {
  const [inviteLinkFeedback, setInviteLinkFeedback] = useState('')
  const [inviteLinkError, setInviteLinkError] = useState('')

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
    inviteLinkError,
    inviteLinkFeedback,
  }
}
