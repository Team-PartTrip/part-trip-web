import { useDeferredValue, useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'

import {
  useAcceptPlannerInvitationMutation,
  useAddPlannerPlacesMutation,
  useCastBallotMutation,
  useCloseVoteMutation,
  useConfirmVoteMutation,
  useConfirmPlannerMutation,
  useCreatePlannerMutation,
  useDeleteVoteOptionMutation,
  useCancelPlannerInvitationMutation,
  useJoinPlannerMutation,
  useRemovePlannerMemberMutation,
  useRejectPlannerInvitationMutation,
  useRemindPlannerMembersMutation,
  useSelectRandomPlannerPlaceMutation,
  useUpdatePlannerMutation,
} from '@/entities/planner'
import type { CountryInfoResponseDto } from '@/entities/travel'
import { paths } from '@/shared/config'
import { isPositiveSafeInteger } from '@/shared/utils'

import { ACTIVE_VOTE_ID_KEY, parsePlannerGroupSettings, parsePlannerSelectedIndexes } from './storage'
import type { PlannerStep } from './types'
import { usePlannerData } from './usePlannerData'

export const plannerCategories = ['맛집', '명소', '숙소', '카페', '액티비티', '쇼핑'] as const

const PLANNER_GROUP_SETTINGS_KEY = 'parttrip:planner-group-settings'
const ACTIVE_PLANNER_ID_KEY = 'parttrip:active-planner-id'
const PLANNER_SELECTED_KEY = 'parttrip:planner-selected'
const PLANNER_CONFIRMED_KEY = 'parttrip:planner-confirmed'
const ACTIVE_VOTE_CATEGORY_KEY = 'parttrip:active-vote-category'
const PLANNER_INVITE_CODE_KEY = 'parttrip:planner-invite-code'

function readSessionValue(key: string) {
  return typeof window === 'undefined' ? null : window.sessionStorage.getItem(key)
}

function writeSessionValue(key: string, value: string) {
  if (typeof window !== 'undefined') window.sessionStorage.setItem(key, value)
}

function removeSessionValue(key: string) {
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(key)
}

function readSessionId(key: string) {
  const value = Number(readSessionValue(key))
  return isPositiveSafeInteger(value) ? value : 0
}

function normalizeVoteStatus(status?: string) {
  return status?.trim().toUpperCase() ?? ''
}

function isPlannerLeader(role?: string) {
  const normalizedRole = role?.trim().toUpperCase() ?? ''
  return ['ADMIN', 'CREATOR', 'GROUP_LEADER', 'HOST', 'LEADER', 'OWNER', '그룹장', '방장'].some((value) => normalizedRole.includes(value))
}

export function usePlannerFlow(step: PlannerStep) {
  const navigate = useNavigate()
  const { placeId } = useParams({ strict: false })
  const [savedGroupSettings, setSavedGroupSettings] = useState(() => parsePlannerGroupSettings(readSessionValue(PLANNER_GROUP_SETTINGS_KEY)))
  const [storedActivePlannerId, setStoredActivePlannerId] = useState(() => readSessionId(ACTIVE_PLANNER_ID_KEY))
  const [storedActiveVoteId, setStoredActiveVoteId] = useState(() => readSessionId(ACTIVE_VOTE_ID_KEY))
  const activePlannerId = step === 'create' ? 0 : storedActivePlannerId
  const activeVoteId = step === 'create' ? 0 : storedActiveVoteId
  const [countryInfoId, setCountryInfoId] = useState('')
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const [countryName, setCountryName] = useState<string>()
  const [cityName, setCityName] = useState<string>()
  const [voteCategory, setVoteCategory] = useState<(typeof plannerCategories)[number]>(() => {
    const stored = readSessionValue(ACTIVE_VOTE_CATEGORY_KEY)
    return plannerCategories.includes(stored as (typeof plannerCategories)[number])
      ? stored as (typeof plannerCategories)[number]
      : '명소'
  })
  const searchKeyword = useDeferredValue(cityName?.trim() ?? '')
  const {
    countries,
    confirmedPlaces,
    hasError,
    invitationError,
    invitationLoading,
    isLoading,
    invitations,
    members,
    places,
    plan,
    plannerDetail,
    planners,
    setPlan,
    votes,
    voteDetail,
  } = usePlannerData(step, voteCategory, activePlannerId, activeVoteId, searchKeyword)
  const [selected, setSelected] = useState<number[]>(() =>
    step === 'create' ? [] : parsePlannerSelectedIndexes(readSessionValue(PLANNER_SELECTED_KEY)),
  )
  const [headcount, setHeadcount] = useState(String(savedGroupSettings.memberCount))
  const [plannerTitle, setPlannerTitle] = useState('나의 여행 계획')
  const [memberCount, setMemberCount] = useState(() => String(savedGroupSettings.memberCount))
  const [isSolo, setIsSolo] = useState(() => savedGroupSettings.isSolo)
  const [inviteCode, setInviteCode] = useState(() =>
    typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('inviteCode') ?? '',
  )
  const [plannerInviteCode, setPlannerInviteCode] = useState(() =>
    step === 'create' ? '' : readSessionValue(PLANNER_INVITE_CODE_KEY) ?? '',
  )
  const [selectedOptionId, setSelectedOptionId] = useState<number>()
  const [lineupChoice, setLineupChoice] = useState<number | null>(null)
  const [lineupMode, setLineupMode] = useState<'direct' | 'random'>('direct')
  const plannerConfirmationKey = `${PLANNER_CONFIRMED_KEY}:${activePlannerId}`
  const [confirmedPlannerId, setConfirmedPlannerId] = useState(() => step !== 'create' && readSessionValue(plannerConfirmationKey) === 'true' ? activePlannerId : 0)
  const hasConfirmedLocally = step !== 'create' && confirmedPlannerId === activePlannerId
  const [errorMessage, setErrorMessage] = useState('')
  const [remindFeedback, setRemindFeedback] = useState('')
  const createPlannerMutation = useCreatePlannerMutation()
  const joinPlannerMutation = useJoinPlannerMutation()
  const updatePlannerMutation = useUpdatePlannerMutation()
  const acceptPlannerInvitationMutation = useAcceptPlannerInvitationMutation()
  const rejectPlannerInvitationMutation = useRejectPlannerInvitationMutation()
  const cancelPlannerInvitationMutation = useCancelPlannerInvitationMutation()
  const removePlannerMemberMutation = useRemovePlannerMemberMutation()
  const addPlannerPlacesMutation = useAddPlannerPlacesMutation()
  const remindPlannerMembersMutation = useRemindPlannerMembersMutation()
  const selectRandomPlannerPlaceMutation = useSelectRandomPlannerPlaceMutation()
  const confirmPlannerMutation = useConfirmPlannerMutation()
  const castBallotMutation = useCastBallotMutation()
  const closeVoteMutation = useCloseVoteMutation()
  const confirmVoteMutation = useConfirmVoteMutation()
  const deleteVoteOptionMutation = useDeleteVoteOptionMutation()
  const isSaving = createPlannerMutation.isPending || updatePlannerMutation.isPending

  useEffect(() => {
    writeSessionValue(PLANNER_SELECTED_KEY, JSON.stringify(selected))
  }, [selected])

  useEffect(() => {
    writeSessionValue(ACTIVE_VOTE_CATEGORY_KEY, voteCategory)
  }, [voteCategory])

  useEffect(() => {
    if (step !== 'create') return
    removeSessionValue(ACTIVE_PLANNER_ID_KEY)
    removeSessionValue(ACTIVE_VOTE_ID_KEY)
    removeSessionValue(ACTIVE_VOTE_CATEGORY_KEY)
    removeSessionValue(PLANNER_INVITE_CODE_KEY)
    removeSessionValue(PLANNER_SELECTED_KEY)
  }, [step])

  const continueTo = (next: string) => navigate({ to: next })
  const selectedCountryInfoId = countryInfoId
  const selectedCountryName = countryName ?? plannerDetail?.countryName ?? ''
  const selectedCityName = cityName ?? plannerDetail?.cityName ?? ''
  const selectedStartDate = startDate ?? plannerDetail?.startDate ?? ''
  const selectedEndDate = endDate ?? plannerDetail?.endDate ?? ''
  const selectedHeadcount = headcount.trim() || String(plannerDetail?.memberCount ?? savedGroupSettings.memberCount)
  const selectedPlaces = places.flatMap((item, index) => selected.includes(index) ? [{ index, item }] : [])
  const placeParam = Number(placeId)
  const place = places.find((item) => item.tourPlaceId === placeParam)
  const categoryVote = votes.find((vote) => vote.category === voteCategory || vote.categoryLabel === voteCategory)
  const activeVote = (voteDetail?.category === voteCategory || voteDetail?.categoryLabel === voteCategory ? voteDetail : undefined) ??
    categoryVote ??
    (voteDetail?.voteId === activeVoteId ? voteDetail : undefined) ??
    votes.find((vote) => vote.voteId === activeVoteId)
  const visiblePlannerInviteCode = plannerDetail?.inviteCode || plannerInviteCode
  const isConfirmed = hasConfirmedLocally || normalizeVoteStatus(plannerDetail?.status) === 'CONFIRMED'
  const plannerInviteLink = visiblePlannerInviteCode && typeof window !== 'undefined'
    ? `${window.location.origin}/planner/group?inviteCode=${encodeURIComponent(visiblePlannerInviteCode)}`
    : ''
  const openVotes = votes.filter((vote) => normalizeVoteStatus(vote.status) === 'OPEN' && isPositiveSafeInteger(vote.voteId))
  const closeableVote = normalizeVoteStatus(activeVote?.status) === 'OPEN' && isPositiveSafeInteger(activeVote?.voteId)
    ? activeVote
    : openVotes[0]
  const canManagePlanner = isPositiveSafeInteger(activePlannerId) && isPlannerLeader(plannerDetail?.role)
  const isRemindAvailable = canManagePlanner && openVotes.length > 0
  const handleDestinationSelect = (country: CountryInfoResponseDto) => {
    setCountryInfoId(String(country.countryInfoId ?? ''))
    setCountryName(country.countryName ?? '')
    setCityName(country.cityName ?? country.countryName ?? '')
  }

  const handleCityNameChange = (value: string) => {
    setCountryInfoId('')
    setCountryName('')
    setCityName(value)
  }

  const handleVoteCategoryChange = (category: (typeof plannerCategories)[number]) => {
    removeSessionValue(ACTIVE_VOTE_ID_KEY)
    setStoredActiveVoteId(0)
    setVoteCategory(category)
    setSelected([])
    setSelectedOptionId(undefined)
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
  }

  const handleEndDateChange = (value: string) => {
    setEndDate(value)
  }

  const saveDestination = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const selectedCountry = countries.find((item) =>
      String(item.countryInfoId) === selectedCountryInfoId
      || item.cityName?.toLocaleLowerCase() === selectedCityName.trim().toLocaleLowerCase()
      || item.countryName?.toLocaleLowerCase() === selectedCityName.trim().toLocaleLowerCase(),
    ) ?? (countries.length === 1 && selectedCityName.trim() ? countries[0] : undefined)
    const nextCountry = selectedCountry?.countryName || selectedCountryName.trim()
    const nextCity = selectedCountry?.cityName || selectedCityName.trim()
    const nextHeadcount = Number(selectedHeadcount)
    if (!nextCountry || !nextCity || !selectedStartDate || !selectedEndDate || selectedStartDate > selectedEndDate) {
      setErrorMessage('여행지와 올바른 여행 기간을 입력해주세요.')
      return
    }
    if (!Number.isSafeInteger(nextHeadcount) || nextHeadcount < 1 || nextHeadcount > 30) {
      setErrorMessage('여행 인원은 1명에서 30명 사이로 입력해주세요.')
      return
    }
    try {
      if (!isPositiveSafeInteger(activePlannerId)) {
        setErrorMessage('먼저 여행 그룹을 저장해주세요.')
        return
      }
      const savedPlan = await updatePlannerMutation.mutateAsync({
        plannerId: activePlannerId,
        payload: {
          cityName: nextCity,
          countryName: nextCountry,
          endDate: selectedEndDate,
          startDate: selectedStartDate,
        },
      })
      setPlan({
        cityName: savedPlan.cityName ?? nextCity,
        countryName: savedPlan.countryName ?? nextCountry,
        endDate: savedPlan.endDate ?? selectedEndDate,
        headcount: plan?.headcount ?? nextHeadcount,
        startDate: savedPlan.startDate ?? selectedStartDate,
      })
      removeSessionValue(ACTIVE_VOTE_ID_KEY)
      setStoredActiveVoteId(0)
      writeSessionValue(ACTIVE_VOTE_CATEGORY_KEY, voteCategory)
      setSelected([])
      continueTo(paths.plannerExplore)
    } catch {
      setErrorMessage('여행 정보를 저장하지 못했습니다.')
    }
  }

  const saveGroupSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextMemberCount = isSolo ? 1 : Number(memberCount)
    const minimumMemberCount = isSolo ? 1 : 2
    if (!Number.isSafeInteger(nextMemberCount) || nextMemberCount < minimumMemberCount || nextMemberCount > 30) {
      setErrorMessage(isSolo ? '혼자 여행은 1명으로 설정해주세요.' : '함께 여행은 2명에서 30명 사이로 입력해주세요.')
      return
    }
    try {
      setErrorMessage('')
      const nextGroupSettings = { isSolo, memberCount: nextMemberCount }
      writeSessionValue(PLANNER_GROUP_SETTINGS_KEY, JSON.stringify(nextGroupSettings))
      setSavedGroupSettings(nextGroupSettings)
      setHeadcount(String(nextMemberCount))
      if (!isPositiveSafeInteger(activePlannerId)) {
        const planner = await createPlannerMutation.mutateAsync({
          isSolo,
          memberCount: nextMemberCount,
          title: plannerTitle.trim() || '나의 여행 계획',
        })
        if (!isPositiveSafeInteger(planner.plannerId)) throw new Error('plannerId is missing')
        writeSessionValue(ACTIVE_PLANNER_ID_KEY, String(planner.plannerId))
        setStoredActivePlannerId(planner.plannerId)
        if (planner.inviteCode) {
          writeSessionValue(PLANNER_INVITE_CODE_KEY, planner.inviteCode)
          setPlannerInviteCode(planner.inviteCode)
        }
      }
      navigate({ to: paths.plannerDestination })
    } catch {
      setErrorMessage('여행 그룹을 저장하지 못했습니다.')
    }
  }

  const handleJoinPlanner = async () => {
    if (!inviteCode.trim()) {
      setErrorMessage('초대 코드를 입력해주세요.')
      return
    }
    try {
      setErrorMessage('')
      const joined = await joinPlannerMutation.mutateAsync({ inviteCode: inviteCode.trim() })
      const plannerId = joined.plannerId
      if (!isPositiveSafeInteger(plannerId)) throw new Error('plannerId is missing')
      writeSessionValue(ACTIVE_PLANNER_ID_KEY, String(plannerId))
      setStoredActivePlannerId(plannerId)
      setConfirmedPlannerId(readSessionValue(`${PLANNER_CONFIRMED_KEY}:${plannerId}`) === 'true' ? plannerId : 0)
      navigate({ to: paths.plannerProgress })
    } catch {
      setErrorMessage('초대 코드로 여행 그룹에 참여하지 못했습니다.')
    }
  }

  const handleAcceptPlannerInvitation = async (invitationId?: number) => {
    if (!isPositiveSafeInteger(invitationId)) {
      setErrorMessage('초대 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      const invitation = await acceptPlannerInvitationMutation.mutateAsync(invitationId)
      if (isPositiveSafeInteger(invitation.plannerId)) {
        writeSessionValue(ACTIVE_PLANNER_ID_KEY, String(invitation.plannerId))
        setStoredActivePlannerId(invitation.plannerId)
        setConfirmedPlannerId(readSessionValue(`${PLANNER_CONFIRMED_KEY}:${invitation.plannerId}`) === 'true' ? invitation.plannerId : 0)
        navigate({ to: paths.plannerProgress })
      }
    } catch {
      setErrorMessage('초대를 수락하지 못했습니다.')
    }
  }

  const handleRejectPlannerInvitation = async (invitationId?: number) => {
    if (!isPositiveSafeInteger(invitationId)) {
      setErrorMessage('초대 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await rejectPlannerInvitationMutation.mutateAsync(invitationId)
    } catch {
      setErrorMessage('초대를 거절하지 못했습니다.')
    }
  }

  const handleCancelPlannerInvitation = async (invitationId?: number) => {
    if (!canManagePlanner || !isPositiveSafeInteger(activePlannerId) || !isPositiveSafeInteger(invitationId)) {
      setErrorMessage('취소할 초대 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await cancelPlannerInvitationMutation.mutateAsync({ invitationId, plannerId: activePlannerId })
    } catch {
      setErrorMessage('초대를 취소하지 못했습니다.')
    }
  }

  const handleRemovePlannerMember = async (memberUserId?: string) => {
    if (!canManagePlanner || !isPositiveSafeInteger(activePlannerId) || !memberUserId?.trim()) {
      setErrorMessage('내보낼 멤버 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await removePlannerMemberMutation.mutateAsync({ memberUserId: memberUserId.trim(), plannerId: activePlannerId })
    } catch {
      setErrorMessage('멤버를 내보내지 못했습니다.')
    }
  }

  const handleSaveCandidates = async () => {
    const plannerId = activePlannerId
    const placeIds = [...new Set(selectedPlaces
      .map(({ item }) => item.tourPlaceId)
      .filter((placeId): placeId is number => isPositiveSafeInteger(placeId)))]

    if (!isPositiveSafeInteger(plannerId)) {
      setErrorMessage('먼저 여행 계획을 저장해주세요.')
      return
    }
    if (placeIds.length === 0) {
      setErrorMessage('검색 결과를 선택해주세요.')
      return
    }

    try {
      setErrorMessage('')
      await addPlannerPlacesMutation.mutateAsync({ plannerId, payload: { placeIds } })
      removeSessionValue(ACTIVE_VOTE_ID_KEY)
      setStoredActiveVoteId(0)

      writeSessionValue(ACTIVE_VOTE_CATEGORY_KEY, voteCategory)
      setSelected([])
      navigate({ to: paths.plannerVote })
    } catch {
      setErrorMessage('후보를 저장하지 못했습니다.')
    }
  }

  const handleAddPlaceCandidate = async () => {
    const plannerId = activePlannerId
    const placeId = place?.tourPlaceId

    if (!isPositiveSafeInteger(plannerId)) {
      setErrorMessage('먼저 여행 계획을 저장해주세요.')
      return
    }
    if (!isPositiveSafeInteger(placeId)) {
      setErrorMessage('추가할 장소 정보를 확인할 수 없습니다.')
      return
    }

    try {
      setErrorMessage('')
      await addPlannerPlacesMutation.mutateAsync({ plannerId, payload: { placeIds: [placeId] } })
      removeSessionValue(ACTIVE_VOTE_ID_KEY)
      setStoredActiveVoteId(0)
      writeSessionValue(ACTIVE_VOTE_CATEGORY_KEY, voteCategory)
      navigate({ to: paths.plannerVote })
    } catch {
      setErrorMessage('투표 후보를 저장하지 못했습니다.')
    }
  }

  const handleCastBallot = async (optionId?: number) => {
    if (normalizeVoteStatus(activeVote?.status) !== 'OPEN' || activeVote?.deadlinePassed === true || !isPositiveSafeInteger(activePlannerId) || !isPositiveSafeInteger(activeVote?.voteId) || !isPositiveSafeInteger(optionId)) {
      setErrorMessage('투표할 후보 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await castBallotMutation.mutateAsync({
        payload: { optionId },
        plannerId: activePlannerId,
        voteId: activeVote.voteId,
      })
      setSelectedOptionId(optionId)
    } catch {
      setErrorMessage('투표를 저장하지 못했습니다.')
    }
  }

  const handleConfirmVote = async (voteId?: number, optionId?: number) => {
    const vote = votes.find((item) => item.voteId === voteId)
    if (!canManagePlanner || !isPositiveSafeInteger(activePlannerId) || !isPositiveSafeInteger(voteId) || !isPositiveSafeInteger(optionId) || normalizeVoteStatus(vote?.status) !== 'CLOSED') {
      setErrorMessage('확정할 마감 투표 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await confirmVoteMutation.mutateAsync({ payload: { optionId }, plannerId: activePlannerId, voteId })
    } catch {
      setErrorMessage('투표 결과를 확정하지 못했습니다.')
    }
  }

  const handleDeleteVoteOption = async (optionId?: number) => {
    if (!isPositiveSafeInteger(activePlannerId) || !isPositiveSafeInteger(activeVote?.voteId) || !isPositiveSafeInteger(optionId) || normalizeVoteStatus(activeVote.status) !== 'OPEN') {
      setErrorMessage('삭제할 후보 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await deleteVoteOptionMutation.mutateAsync({ optionId, plannerId: activePlannerId, voteId: activeVote.voteId })
    } catch {
      setErrorMessage('후보를 삭제하지 못했습니다.')
    }
  }

  const handleCloseVote = async () => {
    if (!canManagePlanner || !isPositiveSafeInteger(closeableVote?.voteId)) {
      setErrorMessage('마감할 투표 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await closeVoteMutation.mutateAsync({ plannerId: activePlannerId, voteId: closeableVote.voteId })
    } catch {
      setErrorMessage('투표를 마감하지 못했습니다.')
    }
  }

  const handleRemindMembers = async () => {
    if (!isRemindAvailable) {
      setErrorMessage('진행 중인 투표가 없거나 그룹장만 사용할 수 있습니다.')
      return
    }
    try {
      setErrorMessage('')
      const result = await remindPlannerMembersMutation.mutateAsync(activePlannerId)
      setRemindFeedback([result.message ?? '재촉 알림을 전송했습니다.', result.notifiedCount == null ? '' : `${result.notifiedCount}명에게 알림 전송`].filter(Boolean).join(' · '))
    } catch {
      setErrorMessage('재촉 알림을 보내지 못했습니다.')
    }
  }

  const handleRemoveFromLineup = (index: number) => {
    setSelected((current) => current.filter((item) => item !== index))
    if (lineupChoice === index) {
      setLineupChoice(null)
      setLineupMode('direct')
    }
  }

  const handleRandomLineup = async () => {
    if (selectedPlaces.length === 0) {
      setErrorMessage('먼저 장바구니에 장소를 담아주세요.')
      return
    }
    const plannerId = activePlannerId
    const placeIds = selectedPlaces
      .map(({ item }) => item.tourPlaceId)
      .filter((placeId): placeId is number => isPositiveSafeInteger(placeId))
    if (!isPositiveSafeInteger(plannerId) || placeIds.length === 0) {
      setErrorMessage('랜덤으로 선택할 장소 정보를 확인할 수 없습니다.')
      return
    }

    try {
      setErrorMessage('')
      await addPlannerPlacesMutation.mutateAsync({ plannerId, payload: { placeIds } })
      const randomPlace = await selectRandomPlannerPlaceMutation.mutateAsync(plannerId)
      const choiceIndex = places.findIndex((item) => item.tourPlaceId === randomPlace.placeId)
      if (choiceIndex < 0) throw new Error('random place is not in the current category')
      setLineupMode('random')
      setLineupChoice(choiceIndex)
      setSelected([choiceIndex])
    } catch {
      setErrorMessage('랜덤 장소를 선택하지 못했습니다.')
    }
  }

  const handleConfirmPlan = async () => {
    if (!canManagePlanner) {
      setErrorMessage('먼저 여행 계획을 저장해주세요.')
      return
    }
    try {
      setErrorMessage('')
      if (!isPositiveSafeInteger(activePlannerId) || votes.length === 0) {
        setErrorMessage('확정할 투표 결과를 확인할 수 없습니다.')
        return
      }
      await confirmPlannerMutation.mutateAsync(activePlannerId)
      writeSessionValue(plannerConfirmationKey, 'true')
      setConfirmedPlannerId(activePlannerId)
    } catch {
      setErrorMessage('최종 계획을 확정하지 못했습니다.')
    }
  }

  const handleSelectPlanner = (plannerId?: number) => {
    if (!isPositiveSafeInteger(plannerId)) {
      setErrorMessage('선택한 여행 계획을 확인할 수 없습니다.')
      return
    }
    writeSessionValue(ACTIVE_PLANNER_ID_KEY, String(plannerId))
    setStoredActivePlannerId(plannerId)
    setConfirmedPlannerId(readSessionValue(`${PLANNER_CONFIRMED_KEY}:${plannerId}`) === 'true' ? plannerId : 0)
    removeSessionValue(ACTIVE_VOTE_ID_KEY)
    setStoredActiveVoteId(0)
    setSelected([])
    setSelectedOptionId(undefined)
    navigate({ to: paths.plannerProgress })
  }

  return {
    activeVote,
    countries,
    canManagePlanner,
    confirmedPlaces,
    countryInfoId,
    continueTo,
    endDate,
    errorMessage,
    handleAcceptPlannerInvitation,
    handleAddPlaceCandidate,
    handleConfirmPlan,
    handleConfirmVote,
    handleCastBallot,
    handleCloseVote,
    handleDeleteVoteOption,
    handleDestinationSelect,
    handleJoinPlanner,
    handleRemindMembers,
    handleCancelPlannerInvitation,
    handleRemovePlannerMember,
    handleRejectPlannerInvitation,
    handleSaveCandidates,
    handleRandomLineup,
    handleRemoveFromLineup,
    handleSelectPlanner,
    hasActivePlanner: isPositiveSafeInteger(activePlannerId),
    hasError,
    headcount,
    inviteCode,
    invitationError,
    invitationLoading,
    invitations,
    isConfirmed,
    isLoading,
    isSaving,
    isSolo,
    isRemindAvailable,
    lineupChoice,
    lineupMode,
    navigate,
    paths,
    place,
    places,
    plan,
    plannerCategories,
    plannerDetail,
    plannerInviteCode: visiblePlannerInviteCode,
    plannerInviteLink,
    plannerTitle,
    planners,
    saveDestination,
    saveGroupSettings,
    selected,
    selectedCountryInfoId,
    selectedCityName,
    selectedEndDate,
    selectedHeadcount,
    selectedPlaces,
    selectedOptionId,
    selectedStartDate,
    setCityName: handleCityNameChange,
    setCountryInfoId,
    setCountryName,
    setEndDate: handleEndDateChange,
    setHeadcount,
    setInviteCode,
    setIsSolo,
    setLineupChoice,
    setLineupMode,
    setMemberCount,
    setPlannerTitle,
    setSelected,
    setStartDate: handleStartDateChange,
    setVoteCategory: handleVoteCategoryChange,
    startDate,
    voteCategory,
    votes,
    confirmPlannerMutation,
    confirmVoteMutation,
    deleteVoteOptionMutation,
    addPlannerPlacesMutation,
    castBallotMutation,
    closeVoteMutation,
    joinPlannerMutation,
    acceptPlannerInvitationMutation,
    rejectPlannerInvitationMutation,
    cancelPlannerInvitationMutation,
    removePlannerMemberMutation,
    remindPlannerMembersMutation,
    selectRandomPlannerPlaceMutation,
    remindFeedback,
    members,
    memberCount,
  }
}
