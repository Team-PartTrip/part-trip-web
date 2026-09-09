import { useCallback, useEffect, useRef, useState } from 'react'

import type { CountryInfoResponseDto, TourPlaceResponseDto } from '@/entities/travel'
import {
  ACTIVE_PLANNER_ID_KEY,
  ACTIVE_VOTE_CATEGORY_KEY,
  ACTIVE_VOTE_ID_KEY,
  PLANNER_CONFIRMED_KEY,
  PLANNER_GROUP_SETTINGS_KEY,
  PLANNER_SELECTED_KEY,
} from '@/shared/config'
import { readSessionId, readSessionValue, writeSessionValue } from '@/shared/libs/session-storage'

import { activatePlannerSession, clearPlannerVoteSession } from './planner-session'
import { parsePlannerGroupSettings, parsePlannerSelectedPlacesByCategory } from './storage'
import { plannerCategories, type PlannerCategory } from './types'

export function usePlannerState() {
  const [savedGroupSettings, setSavedGroupSettings] = useState(() => parsePlannerGroupSettings(readSessionValue(PLANNER_GROUP_SETTINGS_KEY)))
  const [storedActivePlannerId, setStoredActivePlannerId] = useState(() => readSessionId(ACTIVE_PLANNER_ID_KEY))
  const [storedActiveVoteId, setStoredActiveVoteId] = useState(() => readSessionId(ACTIVE_VOTE_ID_KEY))
  const activePlannerId = storedActivePlannerId
  const activeVoteId = storedActiveVoteId
  const [countryInfoId, setCountryInfoId] = useState('')
  const [selectedDestination, setSelectedDestination] = useState<CountryInfoResponseDto>()
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const [countryName, setCountryName] = useState<string>()
  const [cityName, setCityName] = useState<string>()
  const [voteCategory, setVoteCategory] = useState<PlannerCategory>(() => {
    const stored = readSessionValue(ACTIVE_VOTE_CATEGORY_KEY)
    return plannerCategories.includes(stored as PlannerCategory) ? stored as PlannerCategory : '명소'
  })
  const [selectedPlacesByCategory, setSelectedPlacesByCategory] = useState<Record<string, TourPlaceResponseDto[]>>(() =>
    parsePlannerSelectedPlacesByCategory(readSessionValue(PLANNER_SELECTED_KEY)),
  )
  const [headcount, setHeadcount] = useState(String(savedGroupSettings.memberCount))
  const [memberCount, setMemberCount] = useState(() => String(savedGroupSettings.memberCount))
  const [isSolo, setIsSolo] = useState(() => savedGroupSettings.isSolo)
  const [inviteCode, setInviteCode] = useState(() =>
    typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('inviteCode') ?? '',
  )
  const inviteCodeFromUrlRef = useRef(inviteCode)
  const [selectedOptionId, setSelectedOptionId] = useState<number>()
  const [lineupChoice, setLineupChoice] = useState<number | null>(null)
  const [lineupMode, setLineupMode] = useState<'direct' | 'random'>('direct')
  const autoJoinInviteCodeRef = useRef('')
  const plannerConfirmationKey = `${PLANNER_CONFIRMED_KEY}:${activePlannerId}`
  const [confirmedPlannerId, setConfirmedPlannerId] = useState(() => readSessionValue(plannerConfirmationKey) === 'true' ? activePlannerId : 0)
  const hasConfirmedLocally = confirmedPlannerId === activePlannerId
  const [errorMessage, setErrorMessage] = useState('')
  const [remindFeedback, setRemindFeedback] = useState('')

  const clearSelected = useCallback(() => setSelectedPlacesByCategory({}), [])
  const resetVoteSession = useCallback(() => {
    clearPlannerVoteSession()
    setStoredActiveVoteId(0)
    setSelectedOptionId(undefined)
  }, [])
  const activatePlanner = useCallback((plannerId: number) => {
    activatePlannerSession(plannerId)
    setStoredActivePlannerId(plannerId)
    resetVoteSession()
    clearSelected()
    setConfirmedPlannerId(readSessionValue(`${PLANNER_CONFIRMED_KEY}:${plannerId}`) === 'true' ? plannerId : 0)
  }, [clearSelected, resetVoteSession])

  useEffect(() => {
    writeSessionValue(PLANNER_SELECTED_KEY, JSON.stringify(selectedPlacesByCategory))
  }, [selectedPlacesByCategory])

  useEffect(() => {
    writeSessionValue(ACTIVE_VOTE_CATEGORY_KEY, voteCategory)
  }, [voteCategory])

  return {
    activePlannerId,
    activeVoteId,
    activatePlanner,
    autoJoinInviteCodeRef,
    cityName,
    clearSelected,
    countryInfoId,
    countryName,
    endDate,
    errorMessage,
    hasConfirmedLocally,
    headcount,
    inviteCode,
    inviteCodeFromUrlRef,
    isSolo,
    lineupChoice,
    lineupMode,
    memberCount,
    plannerConfirmationKey,
    remindFeedback,
    resetVoteSession,
    savedGroupSettings,
    selectedDestination,
    selectedOptionId,
    selectedPlacesByCategory,
    setCityName,
    setConfirmedPlannerId,
    setCountryInfoId,
    setCountryName,
    setEndDate,
    setErrorMessage,
    setHeadcount,
    setInviteCode,
    setIsSolo,
    setLineupChoice,
    setLineupMode,
    setMemberCount,
    setRemindFeedback,
    setSavedGroupSettings,
    setSelectedDestination,
    setSelectedOptionId,
    setSelectedPlacesByCategory,
    setStartDate,
    setStoredActivePlannerId,
    setVoteCategory,
    startDate,
    voteCategory,
  }
}
