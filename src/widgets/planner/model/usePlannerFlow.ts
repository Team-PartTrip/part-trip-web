import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'

import {
  useCastBallotMutation,
  useCloseVoteMutation,
  useConfirmVoteMutation,
  useCreatePlannerMutation,
  useCreateVoteMutation,
  useJoinPlannerMutation,
  useSavePlannerTravelPlanMutation,
} from '@/entities/planner'
import { paths } from '@/shared/config'
import { isPositiveSafeInteger } from '@/shared/utils'

import { parsePlannerGroupSettings, parsePlannerSelectedIndexes } from './storage'
import type { PlannerStep } from './types'
import { usePlannerData } from './usePlannerData'

export const plannerCategories = ['맛집', '명소', '숙소', '카페', '액티비티'] as const

const PLANNER_GROUP_SETTINGS_KEY = 'parttrip:planner-group-settings'
const ACTIVE_PLANNER_ID_KEY = 'parttrip:active-planner-id'
const PLANNER_SELECTED_KEY = 'parttrip:planner-selected'
const PLANNER_CONFIRMED_KEY = 'parttrip:planner-confirmed'
const ACTIVE_VOTE_ID_KEY = 'parttrip:active-vote-id'
const PLANNER_INVITE_CODE_KEY = 'parttrip:planner-invite-code'

export function usePlannerFlow(step: PlannerStep) {
  const navigate = useNavigate()
  const { placeId } = useParams({ strict: false })
  const savedGroupSettings = parsePlannerGroupSettings(sessionStorage.getItem(PLANNER_GROUP_SETTINGS_KEY))
  const activePlannerId = Number(sessionStorage.getItem(ACTIVE_PLANNER_ID_KEY))
  const activeVoteId = Number(sessionStorage.getItem(ACTIVE_VOTE_ID_KEY))
  const [voteCategory, setVoteCategory] = useState<(typeof plannerCategories)[number]>('명소')
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
  } = usePlannerData(step, voteCategory, activePlannerId, activeVoteId)
  const [selected, setSelected] = useState<number[]>(() =>
    parsePlannerSelectedIndexes(sessionStorage.getItem(PLANNER_SELECTED_KEY)),
  )
  const [countryInfoId, setCountryInfoId] = useState('')
  const [startDate, setStartDate] = useState(plan?.startDate ?? '')
  const [endDate, setEndDate] = useState(plan?.endDate ?? '')
  const [countryName, setCountryName] = useState(plan?.countryName ?? '')
  const [cityName, setCityName] = useState(plan?.cityName ?? '')
  const [headcount, setHeadcount] = useState(String(plan?.headcount ?? savedGroupSettings.memberCount))
  const [plannerTitle, setPlannerTitle] = useState('나의 여행 계획')
  const [memberCount, setMemberCount] = useState(() => String(savedGroupSettings.memberCount))
  const [isSolo, setIsSolo] = useState(() => savedGroupSettings.isSolo)
  const [inviteCode, setInviteCode] = useState('')
  const [plannerInviteCode, setPlannerInviteCode] = useState(() =>
    sessionStorage.getItem(PLANNER_INVITE_CODE_KEY) ?? '',
  )
  const [lineupChoice, setLineupChoice] = useState<number | null>(null)
  const plannerConfirmationKey = `${PLANNER_CONFIRMED_KEY}:${activePlannerId}`
  const [isConfirmed, setIsConfirmed] = useState(() => sessionStorage.getItem(plannerConfirmationKey) === 'true')
  const [errorMessage, setErrorMessage] = useState('')
  const createPlannerMutation = useCreatePlannerMutation()
  const createVoteMutation = useCreateVoteMutation()
  const joinPlannerMutation = useJoinPlannerMutation()
  const savePlannerTravelPlanMutation = useSavePlannerTravelPlanMutation()
  const confirmVoteMutation = useConfirmVoteMutation()
  const castBallotMutation = useCastBallotMutation()
  const closeVoteMutation = useCloseVoteMutation()
  const isSaving = createPlannerMutation.isPending || savePlannerTravelPlanMutation.isPending

  useEffect(() => {
    sessionStorage.setItem(PLANNER_SELECTED_KEY, JSON.stringify(selected))
  }, [selected])

  useEffect(() => {
    if (step !== 'create') return
    sessionStorage.removeItem(ACTIVE_PLANNER_ID_KEY)
    sessionStorage.removeItem(ACTIVE_VOTE_ID_KEY)
    sessionStorage.removeItem(PLANNER_INVITE_CODE_KEY)
  }, [step])

  const continueTo = (next: string) => navigate({ to: next })
  const currentCountry = countries.find((country) =>
    country.countryName === plan?.countryName && country.cityName === plan?.cityName,
  )
  const selectedCountryInfoId = countryInfoId || String(currentCountry?.countryInfoId ?? '')
  const selectedCountryName = countryName || plan?.countryName || ''
  const selectedCityName = cityName || plan?.cityName || ''
  const selectedStartDate = startDate || plan?.startDate || ''
  const selectedEndDate = endDate || plan?.endDate || ''
  const selectedHeadcount = headcount || String(plan?.headcount ?? 1)
  const selectedPlaces = places.flatMap((item, index) => selected.includes(index) ? [{ index, item }] : [])
  const place = places[Number(placeId)] || places[0]
  const categoryVote = votes.find((vote) => vote.category === voteCategory || vote.categoryLabel === voteCategory)
  const activeVote = (voteDetail?.category === voteCategory || voteDetail?.categoryLabel === voteCategory ? voteDetail : undefined) ??
    categoryVote ??
    (voteDetail?.voteId === activeVoteId ? voteDetail : undefined) ??
    votes.find((vote) => vote.voteId === activeVoteId)
  const visiblePlannerInviteCode = plannerDetail?.inviteCode || plannerInviteCode
  const selectedPlace = lineupChoice == null ? undefined : places[lineupChoice]
  const selectedOptionId = selectedPlace
    ? activeVote?.options?.find((option) =>
        option.tourPlaceId === selectedPlace.tourPlaceId || option.placeName === selectedPlace.placeName,
      )?.optionId
    : undefined

  const saveDestination = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const selectedCountry = countries.find((item) =>
      String(item.countryInfoId) === selectedCountryInfoId
      || item.cityName?.toLocaleLowerCase() === selectedCityName.trim().toLocaleLowerCase()
      || item.countryName?.toLocaleLowerCase() === selectedCityName.trim().toLocaleLowerCase(),
    )
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
        const savedPlan = await savePlannerTravelPlanMutation.mutateAsync({
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
      continueTo(paths.plannerProgress)
    } catch {
      setErrorMessage('여행 정보를 저장하지 못했습니다.')
    }
  }

  const saveGroupSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextMemberCount = isSolo ? 1 : Number(memberCount)
    if (!Number.isSafeInteger(nextMemberCount) || nextMemberCount < 1 || nextMemberCount > 30) {
      setErrorMessage('여행 인원은 1명에서 30명 사이로 입력해주세요.')
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

  const handleCreateVote = async () => {
    const currentVote = votes.find((vote) => vote.category === voteCategory || vote.categoryLabel === voteCategory) ??
      (voteDetail?.category === voteCategory || voteDetail?.categoryLabel === voteCategory ? voteDetail : undefined)
    if (isPositiveSafeInteger(currentVote?.voteId)) {
      sessionStorage.setItem(ACTIVE_VOTE_ID_KEY, String(currentVote.voteId))
      navigate({ to: paths.plannerVote })
      return
    }
    const plannerId = Number(sessionStorage.getItem(ACTIVE_PLANNER_ID_KEY))
    if (!isPositiveSafeInteger(plannerId)) {
      setErrorMessage('먼저 여행 계획을 저장해주세요.')
      return
    }
    try {
      setErrorMessage('')
      const vote = await createVoteMutation.mutateAsync({ plannerId, payload: { category: voteCategory } })
      if (!isPositiveSafeInteger(vote.voteId)) throw new Error('voteId is missing')
      sessionStorage.setItem(ACTIVE_VOTE_ID_KEY, String(vote.voteId))
      navigate({ to: paths.plannerVote })
    } catch {
      setErrorMessage('투표를 만들지 못했습니다.')
    }
  }

  const handleCastBallot = async (optionId?: number) => {
    if (!isPositiveSafeInteger(activePlannerId) || !isPositiveSafeInteger(activeVote?.voteId) || !isPositiveSafeInteger(optionId)) {
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
    } catch {
      setErrorMessage('투표를 저장하지 못했습니다.')
    }
  }

  const handleCloseVote = async () => {
    if (!isPositiveSafeInteger(activePlannerId) || !isPositiveSafeInteger(activeVote?.voteId)) {
      setErrorMessage('마감할 투표 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await closeVoteMutation.mutateAsync({ plannerId: activePlannerId, voteId: activeVote.voteId })
    } catch {
      setErrorMessage('투표를 마감하지 못했습니다.')
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
    setErrorMessage('')
  }

  const handleConfirmPlan = async () => {
    if (!isPositiveSafeInteger(activePlannerId)) {
      setErrorMessage('먼저 여행 계획을 저장해주세요.')
      return
    }
    try {
      setErrorMessage('')
      const confirmTargets = votes.flatMap((vote) => {
        const optionId = vote.confirmedOptionId ?? vote.options?.find((option) => option.confirmed)?.optionId
        return isPositiveSafeInteger(vote.voteId) && isPositiveSafeInteger(optionId)
          ? [{ optionId, voteId: vote.voteId }]
          : []
      })
      if (confirmTargets.length === 0 && isPositiveSafeInteger(activeVote?.voteId) && isPositiveSafeInteger(selectedOptionId)) {
        confirmTargets.push({ optionId: selectedOptionId, voteId: activeVote.voteId })
      }
      if (confirmTargets.length === 0) {
        setErrorMessage('확정할 투표 결과를 확인할 수 없습니다.')
        return
      }
      await Promise.all(confirmTargets.map(({ optionId, voteId }) => confirmVoteMutation.mutateAsync({
        plannerId: activePlannerId,
        voteId,
        payload: { optionId },
      })))
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
    navigate({ to: paths.plannerProgress })
  }

  return {
    activeVote,
    countries,
    confirmedPlaces,
    countryInfoId,
    continueTo,
    endDate,
    errorMessage,
    handleConfirmPlan,
    handleCastBallot,
    handleCloseVote,
    handleCreateVote,
    handleJoinPlanner,
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
    lineupChoice,
    navigate,
    paths,
    place,
    places,
    plan,
    plannerCategories,
    plannerDetail,
    plannerInviteCode: visiblePlannerInviteCode,
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
    selectedStartDate,
    setCityName,
    setCountryInfoId,
    setCountryName,
    setEndDate,
    setHeadcount,
    setInviteCode,
    setIsSolo,
    setLineupChoice,
    setMemberCount,
    setPlannerTitle,
    setSelected,
    setStartDate,
    setVoteCategory,
    startDate,
    voteCategory,
    votes,
    confirmVoteMutation,
    createVoteMutation,
    castBallotMutation,
    closeVoteMutation,
    joinPlannerMutation,
    members,
    memberCount,
  }
}
