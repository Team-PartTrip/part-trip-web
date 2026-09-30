import { useCallback, useRef, useState } from 'react'

import { ACTIVE_PLANNER_ID_KEY, PLANNER_GROUP_SETTINGS_KEY } from '@/shared/config'
import { readSessionId, readSessionValue } from '@/shared/libs/session-storage'

import { activatePlannerSession } from './planner-session'
import { parsePlannerGroupSettings } from './storage'

export function usePlannerState() {
  const initialGroupSettings = parsePlannerGroupSettings(readSessionValue(PLANNER_GROUP_SETTINGS_KEY))
  const [storedActivePlannerId, setStoredActivePlannerId] = useState(() =>
    readSessionId(ACTIVE_PLANNER_ID_KEY),
  )
  const [memberCount, setMemberCount] = useState(() => String(initialGroupSettings.memberCount))
  const [isSolo, setIsSolo] = useState(() => initialGroupSettings.isSolo)
  const [inviteCode, setInviteCode] = useState(() =>
    typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('inviteCode') ?? '',
  )
  const inviteCodeFromUrlRef = useRef(inviteCode)
  const autoJoinInviteCodeRef = useRef('')
  const [errorMessage, setErrorMessage] = useState('')

  const activatePlanner = useCallback((plannerId: number) => {
    activatePlannerSession(plannerId)
    setStoredActivePlannerId(plannerId)
  }, [])

  return {
    activePlannerId: storedActivePlannerId,
    activatePlanner,
    autoJoinInviteCodeRef,
    errorMessage,
    inviteCode,
    inviteCodeFromUrlRef,
    isSolo,
    memberCount,
    setErrorMessage,
    setInviteCode,
    setIsSolo,
    setMemberCount,
    setStoredActivePlannerId,
  }
}
