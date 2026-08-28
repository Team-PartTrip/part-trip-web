import { useDeferredValue, useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'

import {
  getVotes,
  useAddPlannerPlacesMutation,
  useAddVoteOptionMutation,
  useCastBallotMutation,
  useCloseVoteMutation,
  useConfirmPlannerMutation,
  useCreatePlannerMutation,
  useCreateVoteMutation,
  useJoinPlannerMutation,
  useRemindPlannerMembersMutation,
  useUpdatePlannerMutation,
} from '@/entities/planner'
import type { CountryInfoResponseDto } from '@/entities/travel'
import { paths } from '@/shared/config'
import { isPositiveSafeInteger } from '@/shared/utils'

import { parsePlannerGroupSettings, parsePlannerSelectedIndexes } from './storage'
import type { PlannerStep } from './types'
import { usePlannerData } from './usePlannerData'

export const plannerCategories = ['맛집', '명소', '숙소', '카페', '액티비티', '쇼핑'] as const

const PLANNER_GROUP_SETTINGS_KEY = 'parttrip:planner-group-settings'
const ACTIVE_PLANNER_ID_KEY = 'parttrip:active-planner-id'
const PLANNER_SELECTED_KEY = 'parttrip:planner-selected'
const PLANNER_CONFIRMED_KEY = 'parttrip:planner-confirmed'
const ACTIVE_VOTE_ID_KEY = 'parttrip:active-vote-id'
const ACTIVE_VOTE_CATEGORY_KEY = 'parttrip:active-vote-category'
const PLANNER_INVITE_CODE_KEY = 'parttrip:planner-invite-code'

function normalizeVoteStatus(status?: string) {
  return status?.trim().toLocaleUpperCase() ?? ''
}

function isPlannerLeader(role?: string) {
  const normalizedRole = role?.trim().toLocaleUpperCase() ?? ''
  return ['ADMIN', 'CREATOR', 'GROUP_LEADER', 'HOST', 'LEADER', 'OWNER', '그룹장', '방장'].some((value) => normalizedRole.includes(value))
}

export function usePlannerFlow(step: PlannerStep) {
  const navigate = useNavigate()
  const { placeId } = useParams({ strict: false })
  const savedGroupSettings = parsePlannerGroupSettings(sessionStorage.getItem(PLANNER_GROUP_SETTINGS_KEY))
  const activePlannerId = Number(sessionStorage.getItem(ACTIVE_PLANNER_ID_KEY))
  const activeVoteId = Number(sessionStorage.getItem(ACTIVE_VOTE_ID_KEY))
  const [countryInfoId, setCountryInfoId] = useState('')
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const [countryName, setCountryName] = useState<string>()
  const [cityName, setCityName] = useState<string>()
  const [voteCategory, setVoteCategory] = useState<(typeof plannerCategories)[number]>(() => {
    const stored = sessionStorage.getItem(ACTIVE_VOTE_CATEGORY_KEY)
    return plannerCategories.includes(stored as (typeof plannerCategories)[number])
      ? stored as (typeof plannerCategories)[number]
      : '명소'
  })
  const searchKeyword = useDeferredValue(cityName?.trim() ?? '')
  const {
    countries,
    confirmedPlaces,
    hasError,
    isLoading,
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
    step === 'create' ? [] : parsePlannerSelectedIndexes(sessionStorage.getItem(PLANNER_SELECTED_KEY)),
  )
  const [headcount, setHeadcount] = useState(String(savedGroupSettings.memberCount))
  const [plannerTitle, setPlannerTitle] = useState('나의 여행 계획')
  const [memberCount, setMemberCount] = useState(() => String(savedGroupSettings.memberCount))
  const [isSolo, setIsSolo] = useState(() => savedGroupSettings.isSolo)
  const [inviteCode, setInviteCode] = useState(() =>
    typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('inviteCode') ?? '',
  )
  const [plannerInviteCode, setPlannerInviteCode] = useState(() =>
    step === 'create' ? '' : sessionStorage.getItem(PLANNER_INVITE_CODE_KEY) ?? '',
  )
  const [manualPlaceName, setManualPlaceName] = useState('')
  const [selectedOptionId, setSelectedOptionId] = useState<number>()
  const [lineupChoice, setLineupChoice] = useState<number | null>(null)
  const plannerConfirmationKey = `${PLANNER_CONFIRMED_KEY}:${activePlannerId}`
  const [isConfirmed, setIsConfirmed] = useState(() => step !== 'create' && sessionStorage.getItem(plannerConfirmationKey) === 'true')
  const [errorMessage, setErrorMessage] = useState('')
  const [remindFeedback, setRemindFeedback] = useState('')
  const createPlannerMutation = useCreatePlannerMutation()
  const createVoteMutation = useCreateVoteMutation()
  const joinPlannerMutation = useJoinPlannerMutation()
  const updatePlannerMutation = useUpdatePlannerMutation()
  const addPlannerPlacesMutation = useAddPlannerPlacesMutation()
  const addVoteOptionMutation = useAddVoteOptionMutation()
  const remindPlannerMembersMutation = useRemindPlannerMembersMutation()
  const confirmPlannerMutation = useConfirmPlannerMutation()
  const castBallotMutation = useCastBallotMutation()
  const closeVoteMutation = useCloseVoteMutation()
  const isSaving = createPlannerMutation.isPending || updatePlannerMutation.isPending

  useEffect(() => {
    sessionStorage.setItem(PLANNER_SELECTED_KEY, JSON.stringify(selected))
  }, [selected])

  useEffect(() => {
    sessionStorage.setItem(ACTIVE_VOTE_CATEGORY_KEY, voteCategory)
  }, [voteCategory])

  useEffect(() => {
    if (step !== 'create') return
    sessionStorage.removeItem(ACTIVE_PLANNER_ID_KEY)
    sessionStorage.removeItem(ACTIVE_VOTE_ID_KEY)
    sessionStorage.removeItem(ACTIVE_VOTE_CATEGORY_KEY)
    sessionStorage.removeItem(PLANNER_INVITE_CODE_KEY)
    sessionStorage.removeItem(PLANNER_SELECTED_KEY)
  }, [step])

  const continueTo = (next: string) => navigate({ to: next })
  const selectedCountryInfoId = countryInfoId
  const selectedCountryName = countryName ?? plannerDetail?.countryName ?? ''
  const selectedCityName = cityName ?? plannerDetail?.cityName ?? ''
  const selectedStartDate = startDate ?? plannerDetail?.startDate ?? ''
  const selectedEndDate = endDate ?? plannerDetail?.endDate ?? ''
  const selectedHeadcount = headcount ?? String(plannerDetail?.memberCount ?? savedGroupSettings.memberCount)
  const selectedPlaces = places.flatMap((item, index) => selected.includes(index) ? [{ index, item }] : [])
  const placeParam = Number(placeId)
  const place = places.find((item) => item.tourPlaceId === placeParam) || places[placeParam] || places[0]
  const categoryVote = votes.find((vote) => vote.category === voteCategory || vote.categoryLabel === voteCategory)
  const activeVote = (voteDetail?.category === voteCategory || voteDetail?.categoryLabel === voteCategory ? voteDetail : undefined) ??
    categoryVote ??
    (voteDetail?.voteId === activeVoteId ? voteDetail : undefined) ??
    votes.find((vote) => vote.voteId === activeVoteId)
  const visiblePlannerInviteCode = plannerDetail?.inviteCode || plannerInviteCode
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
    sessionStorage.removeItem(ACTIVE_VOTE_ID_KEY)
    setVoteCategory(category)
    setSelected([])
    setSelectedOptionId(undefined)
    setManualPlaceName('')
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
      const groupSettings = parsePlannerGroupSettings(sessionStorage.getItem(PLANNER_GROUP_SETTINGS_KEY))
      if (isPositiveSafeInteger(activePlannerId)) {
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
      } else {
        const planner = await createPlannerMutation.mutateAsync({
          cityName: nextCity,
          countryName: nextCountry,
          endDate: selectedEndDate,
          isSolo: groupSettings.isSolo,
          memberCount: groupSettings.isSolo ? 1 : nextHeadcount,
          startDate: selectedStartDate,
          title: plannerTitle.trim() || `${nextCity} 여행 계획`,
        })
        const plannerId = planner.plannerId
        if (!isPositiveSafeInteger(plannerId)) throw new Error('plannerId is missing')
        sessionStorage.setItem(ACTIVE_PLANNER_ID_KEY, String(plannerId))
        if (planner.inviteCode) {
          sessionStorage.setItem(PLANNER_INVITE_CODE_KEY, planner.inviteCode)
          setPlannerInviteCode(planner.inviteCode)
        }
        setPlan({
          cityName: planner.cityName ?? nextCity,
          countryName: planner.countryName ?? nextCountry,
          endDate: planner.endDate ?? selectedEndDate,
          headcount: planner.memberCount ?? nextHeadcount,
          startDate: planner.startDate ?? selectedStartDate,
        })
      }
      sessionStorage.removeItem(ACTIVE_VOTE_ID_KEY)
      sessionStorage.setItem(ACTIVE_VOTE_CATEGORY_KEY, voteCategory)
      setSelected([])
      setManualPlaceName('')
      continueTo(paths.plannerExplore)
    } catch {
      setErrorMessage('여행 정보를 저장하지 못했습니다.')
    }
  }

  const saveGroupSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextMemberCount = isSolo ? 1 : Number(memberCount)
    const minimumMemberCount = isSolo ? 1 : 2
    if (!Number.isSafeInteger(nextMemberCount) || nextMemberCount < minimumMemberCount || nextMemberCount > 30) {
      setErrorMessage(isSolo ? '혼자 여행은 1명으로 설정해주세요.' : '함께 여행은 2명에서 30명 사이로 입력해주세요.')
      return
    }
    sessionStorage.setItem(PLANNER_GROUP_SETTINGS_KEY, JSON.stringify({ isSolo, memberCount: nextMemberCount }))
    setErrorMessage('')
    navigate({ to: paths.plannerDestination })
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
      sessionStorage.setItem(ACTIVE_PLANNER_ID_KEY, String(plannerId))
      navigate({ to: paths.plannerProgress })
    } catch {
      setErrorMessage('초대 코드로 여행 그룹에 참여하지 못했습니다.')
    }
  }

  const handleSaveCandidates = async () => {
    const plannerId = Number(sessionStorage.getItem(ACTIVE_PLANNER_ID_KEY))
    const placeIds = [...new Set(selectedPlaces
      .map(({ item }) => item.tourPlaceId)
      .filter((placeId): placeId is number => isPositiveSafeInteger(placeId)))]
    const manualName = manualPlaceName.trim()

    if (!isPositiveSafeInteger(plannerId)) {
      setErrorMessage('먼저 여행 계획을 저장해주세요.')
      return
    }
    if (placeIds.length === 0 && !manualName) {
      setErrorMessage('검색 결과를 선택하거나 직접 장소를 입력해주세요.')
      return
    }

    try {
      setErrorMessage('')
      if (placeIds.length > 0) {
        await addPlannerPlacesMutation.mutateAsync({ plannerId, payload: { placeIds } })
      }

      if (manualName) {
        let vote = activeVote
        if (!isPositiveSafeInteger(vote?.voteId) && placeIds.length > 0) {
          const refreshedVotes = await getVotes(plannerId)
          vote = refreshedVotes.find((item) => item.category === voteCategory || item.categoryLabel === voteCategory)
        }
        if (vote && normalizeVoteStatus(vote.status) !== '' && normalizeVoteStatus(vote.status) !== 'OPEN') {
          throw new Error('closed vote')
        }
        if (!isPositiveSafeInteger(vote?.voteId)) {
          if (!canManagePlanner) throw new Error('owner required')
          vote = await createVoteMutation.mutateAsync({ plannerId, payload: { category: voteCategory } })
        }
        if (!isPositiveSafeInteger(vote.voteId)) throw new Error('voteId is missing')
        await addVoteOptionMutation.mutateAsync({
          payload: { placeName: manualName },
          plannerId,
          voteId: vote.voteId,
        })
        sessionStorage.setItem(ACTIVE_VOTE_ID_KEY, String(vote.voteId))
      } else {
        sessionStorage.removeItem(ACTIVE_VOTE_ID_KEY)
      }

      sessionStorage.setItem(ACTIVE_VOTE_CATEGORY_KEY, voteCategory)
      setSelected([])
      setManualPlaceName('')
      navigate({ to: paths.plannerVote })
    } catch {
      setErrorMessage('후보를 저장하지 못했습니다.')
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
    if (lineupChoice === index) setLineupChoice(null)
  }

  const handleRandomLineup = () => {
    if (selectedPlaces.length === 0) {
      setErrorMessage('먼저 장바구니에 장소를 담아주세요.')
      return
    }
    const choice = selectedPlaces[Math.floor(Math.random() * selectedPlaces.length)]
    setLineupChoice(choice.index)
    setSelected([choice.index])
    setErrorMessage('')
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
      sessionStorage.setItem(plannerConfirmationKey, 'true')
      setIsConfirmed(true)
    } catch {
      setErrorMessage('최종 계획을 확정하지 못했습니다.')
    }
  }

  const handleSelectPlanner = (plannerId?: number) => {
    if (!isPositiveSafeInteger(plannerId)) {
      setErrorMessage('선택한 여행 계획을 확인할 수 없습니다.')
      return
    }
    sessionStorage.setItem(ACTIVE_PLANNER_ID_KEY, String(plannerId))
    sessionStorage.removeItem(ACTIVE_VOTE_ID_KEY)
    setSelected([])
    setSelectedOptionId(undefined)
    setManualPlaceName('')
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
    handleConfirmPlan,
    handleCastBallot,
    handleCloseVote,
    handleDestinationSelect,
    handleJoinPlanner,
    handleRemindMembers,
    handleSaveCandidates,
    handleRandomLineup,
    handleRemoveFromLineup,
    handleSelectPlanner,
    hasError,
    headcount,
    inviteCode,
    isConfirmed,
    isLoading,
    isSaving,
    isSolo,
    isRemindAvailable,
    lineupChoice,
    manualPlaceName,
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
    setMemberCount,
    setPlannerTitle,
    setSelected,
    setStartDate: handleStartDateChange,
    setManualPlaceName,
    setVoteCategory: handleVoteCategoryChange,
    startDate,
    voteCategory,
    votes,
    confirmPlannerMutation,
    createVoteMutation,
    addPlannerPlacesMutation,
    addVoteOptionMutation,
    castBallotMutation,
    closeVoteMutation,
    joinPlannerMutation,
    remindPlannerMembersMutation,
    remindFeedback,
    members,
    memberCount,
  }
}
