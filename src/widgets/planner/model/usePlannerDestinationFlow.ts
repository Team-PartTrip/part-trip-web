import type { FormEvent } from 'react'
import { type useNavigate } from '@tanstack/react-router'

import { dedupeDestinations, findExactDestinationMatches } from './destination'
import { type usePlannerData } from './usePlannerData'
import { type usePlannerMutations } from './usePlannerMutations'
import { type usePlannerState } from './usePlannerState'
import type { CountryInfoResponseDto } from '@/entities/travel'
import { ACTIVE_VOTE_CATEGORY_KEY, paths } from '@/shared/config'
import { writeSessionValue } from '@/shared/libs/session-storage'
import { isPositiveSafeInteger } from '@/shared/utils'

type State = ReturnType<typeof usePlannerState>
type Data = ReturnType<typeof usePlannerData>
type Navigate = ReturnType<typeof useNavigate>
type UpdatePlannerMutation = ReturnType<typeof usePlannerMutations>['updatePlannerMutation']

type Props = {
  data: Data
  navigate: Navigate
  state: State
  updatePlannerMutation: UpdatePlannerMutation
}

export function usePlannerDestinationFlow({ data, navigate, state, updatePlannerMutation }: Props) {
  const {
    activePlannerId,
    cityName,
    countryInfoId,
    countryName,
    endDate,
    headcount,
    isSolo,
    resetVoteSession,
    savedGroupSettings,
    selectedDestination,
    setCityName,
    setCountryInfoId,
    setCountryName,
    setEndDate,
    setErrorMessage,
    setHeadcount,
    setSelectedDestination,
    setStartDate,
    startDate,
    clearSelected,
    voteCategory,
  } = state
  const { countries, plannerDetail, popularCities, setPlan } = data
  const selectedCountryName = countryName ?? plannerDetail?.countryName ?? ''
  const selectedCityName = cityName ?? plannerDetail?.cityName ?? ''
  const selectedStartDate = startDate ?? plannerDetail?.startDate ?? ''
  const selectedEndDate = endDate ?? plannerDetail?.endDate ?? ''
  const selectedHeadcount = headcount.trim() || String(plannerDetail?.memberCount ?? savedGroupSettings.memberCount)

  const handleDestinationSelect = (country: CountryInfoResponseDto) => {
    setSelectedDestination(country)
    setCountryInfoId(String(country.countryInfoId ?? ''))
    setCountryName(country.countryName ?? '')
    setCityName(country.cityName ?? country.countryName ?? '')
  }

  const handleCityNameChange = (value: string) => {
    setSelectedDestination(undefined)
    setCountryInfoId('')
    setCountryName('')
    setCityName(value)
  }

  const saveDestination = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const destinationCandidates = dedupeDestinations([
      ...countries,
      ...popularCities.map(({ cityName, countryName }) => ({ cityName, countryName })),
    ])
    const matchingDestinations = findExactDestinationMatches(
      destinationCandidates,
      selectedCityName,
      selectedCountryName,
    )
    const selectedCountry = countryInfoId
      ? countries.find((item) => String(item.countryInfoId) === countryInfoId) ?? selectedDestination
      : selectedDestination ?? (matchingDestinations.length === 1 ? matchingDestinations[0] : undefined)
    const nextCountry = selectedCountry?.countryName || selectedCountryName.trim()
    const nextCity = selectedCountry?.cityName || selectedCityName.trim()
    const nextHeadcount = Number(selectedHeadcount)
    const nextMemberCount = isSolo ? 1 : nextHeadcount
    if (!nextCountry || !nextCity || !selectedStartDate || !selectedEndDate || selectedStartDate > selectedEndDate) {
      setErrorMessage('여행지와 올바른 여행 기간을 입력해주세요.')
      return
    }
    if (!selectedCountry) {
      setErrorMessage('국가와 도시가 일치하는 여행지를 선택해주세요.')
      return
    }
    const minimumMemberCount = isSolo ? 1 : 2
    if (!Number.isSafeInteger(nextMemberCount) || nextMemberCount < minimumMemberCount || nextMemberCount > 30) {
      setErrorMessage(isSolo ? '혼자 여행은 1명에서 30명 사이로 입력해주세요.' : '함께 여행은 2명에서 30명 사이로 입력해주세요.')
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
          isSolo,
          memberCount: nextMemberCount,
          startDate: selectedStartDate,
        },
      })
      setPlan({
        cityName: savedPlan.cityName ?? nextCity,
        countryName: savedPlan.countryName ?? nextCountry,
        endDate: savedPlan.endDate ?? selectedEndDate,
        headcount: nextMemberCount,
        startDate: savedPlan.startDate ?? selectedStartDate,
      })
      resetVoteSession()
      writeSessionValue(ACTIVE_VOTE_CATEGORY_KEY, voteCategory)
      clearSelected()
      navigate({ to: paths.plannerExplore })
    } catch {
      setErrorMessage('여행 정보를 저장하지 못했습니다.')
    }
  }

  return {
    countries,
    handleDestinationSelect,
    popularCities,
    saveDestination,
    selectedCityName,
    selectedCountryInfoId: countryInfoId,
    selectedCountryName,
    selectedEndDate,
    selectedHeadcount,
    selectedStartDate,
    setCityName: handleCityNameChange,
    setEndDate,
    setHeadcount,
    setStartDate,
  }
}
