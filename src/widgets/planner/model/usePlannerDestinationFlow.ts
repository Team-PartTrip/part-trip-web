import type { FormEvent } from 'react'
import { useState } from 'react'
import { type useNavigate } from '@tanstack/react-router'

import { dedupeDestinations, findExactDestinationMatches, getPersistedPlannerCities, getPlannerCityPlans, validatePlannerCityRanges } from './destination'
import { isValidPlannerMemberCount } from './member-count'
import { type usePlannerData } from './usePlannerData'
import { type usePlannerMutations } from './usePlannerMutations'
import { type usePlannerState } from './usePlannerState'
import type { CountryInfoResponseDto } from '@/entities/travel'
import type { PlannerCityRequestDto } from '@/entities/planner'
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
  const [cityEdits, setCityEdits] = useState<{ plannerId: number; cities: PlannerCityRequestDto[] }>()
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
    setPlannerPlaceCityName,
    setPlannerPlaceCountryName,
    startDate,
    voteCategory,
  } = state
  const { countries, plannerDetail, popularCities, setPlan } = data
  const plannerCities = cityEdits?.plannerId === activePlannerId
    ? cityEdits.cities
    : getPlannerCityPlans(plannerDetail)
  const setEditedCities = (cities: PlannerCityRequestDto[]) => setCityEdits({ plannerId: activePlannerId, cities })
  const selectedCountryName = countryName ?? ''
  const selectedCityName = cityName ?? ''
  const selectedStartDate = startDate ?? ''
  const selectedEndDate = endDate ?? ''
  const selectedHeadcount = headcount.trim() || String(plannerDetail?.memberCount ?? savedGroupSettings.memberCount)

  const findSelectedCountry = () => {
    const destinationCandidates = dedupeDestinations([
      ...countries,
      ...popularCities.map(({ cityName, countryName }) => ({ cityName, countryName })),
    ])
    const matchingDestinations = findExactDestinationMatches(
      destinationCandidates,
      selectedCityName,
      selectedCountryName,
    )
    return countryInfoId
      ? countries.find((item) => String(item.countryInfoId) === countryInfoId) ?? selectedDestination
      : selectedDestination ?? (matchingDestinations.length === 1 ? matchingDestinations[0] : undefined)
  }

  const addCurrentCity = () => {
    const selectedCountry = findSelectedCountry()
    const nextCity = selectedCountry?.cityName || selectedCityName.trim()
    const nextCountry = selectedCountry?.countryName || selectedCountryName.trim()
    if (!selectedCountry || !nextCountry || !nextCity || !selectedStartDate || !selectedEndDate) {
      setErrorMessage('국가와 도시를 선택하고 체류 기간을 입력해주세요.')
      return undefined
    }
    const nextCities = [...plannerCities, {
      countryName: nextCountry,
      cityName: nextCity,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    }]
    const error = validatePlannerCityRanges(nextCities)
    if (error) {
      setErrorMessage(error)
      return undefined
    }
    return nextCities
  }

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

  const handleAddCity = () => {
    const nextCities = addCurrentCity()
    if (!nextCities) return
    setEditedCities(nextCities)
    setErrorMessage('')
    setSelectedDestination(undefined)
    setCountryInfoId('')
    setCountryName('')
    setCityName('')
    setStartDate('')
    setEndDate('')
  }

  const handleRemoveCity = (index: number) => {
    setEditedCities(plannerCities.filter((_, cityIndex) => cityIndex !== index))
  }

  const saveDestination = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextHeadcount = Number(selectedHeadcount)
    const nextMemberCount = isSolo ? 1 : nextHeadcount
    const hasCityDraft = Boolean(selectedCityName || selectedCountryName || selectedStartDate || selectedEndDate)
    let nextCities = plannerCities
    if (hasCityDraft) {
      const addedCities = addCurrentCity()
      if (!addedCities) return
      nextCities = addedCities
    }
    const cityError = validatePlannerCityRanges(nextCities)
    if (cityError) {
      setErrorMessage(cityError)
      return
    }
    if (!isValidPlannerMemberCount(nextMemberCount, isSolo)) {
      setErrorMessage(isSolo ? '혼자 여행은 1명에서 30명 사이로 입력해주세요.' : '함께 여행은 2명에서 30명 사이로 입력해주세요.')
      return
    }
    try {
      if (!isPositiveSafeInteger(activePlannerId)) {
        setErrorMessage('먼저 여행 그룹을 저장해주세요.')
        return
      }
      const orderedCities = [...nextCities].sort((left, right) => left.startDate.localeCompare(right.startDate))
      const primaryCity = orderedCities[0]
      const overallStartDate = orderedCities[0].startDate
      const overallEndDate = orderedCities[orderedCities.length - 1].endDate
      const savedPlan = await updatePlannerMutation.mutateAsync({
        plannerId: activePlannerId,
        payload: {
          cities: orderedCities,
          cityName: primaryCity.cityName,
          countryName: primaryCity.countryName,
          endDate: overallEndDate,
          isSolo,
          memberCount: nextMemberCount,
          startDate: overallStartDate,
        },
      })
      const persistedCities = getPersistedPlannerCities(orderedCities, savedPlan.cities)
      setPlan({
        cityName: savedPlan.cityName ?? primaryCity.cityName,
        countryName: savedPlan.countryName ?? primaryCity.countryName,
        cities: persistedCities,
        endDate: savedPlan.endDate ?? overallEndDate,
        headcount: nextMemberCount,
        startDate: savedPlan.startDate ?? overallStartDate,
      })
      setEditedCities(persistedCities)
      setPlannerPlaceCityName(primaryCity.cityName)
      setPlannerPlaceCountryName(primaryCity.countryName)
      resetVoteSession()
      writeSessionValue(ACTIVE_VOTE_CATEGORY_KEY, voteCategory)
      navigate({ to: paths.plannerExplore })
    } catch {
      setErrorMessage('여행 정보를 저장하지 못했습니다.')
    }
  }

  return {
    countries,
    handleAddCity,
    handleDestinationSelect,
    handleRemoveCity,
    popularCities,
    plannerCities,
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
