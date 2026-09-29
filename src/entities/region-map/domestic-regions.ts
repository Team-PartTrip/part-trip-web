export const DOMESTIC_REGIONS = [
  { code: '11', mapCode: '11', mapName: '서울특별시', name: '서울', aliases: ['서울특별시'] },
  { code: '26', mapCode: '21', mapName: '부산광역시', name: '부산', aliases: ['부산광역시'] },
  { code: '27', mapCode: '22', mapName: '대구광역시', name: '대구', aliases: ['대구광역시'] },
  { code: '28', mapCode: '23', mapName: '인천광역시', name: '인천', aliases: ['인천광역시'] },
  { code: '29', mapCode: '24', mapName: '광주광역시', name: '광주', aliases: ['광주광역시'] },
  { code: '30', mapCode: '25', mapName: '대전광역시', name: '대전', aliases: ['대전광역시'] },
  { code: '31', mapCode: '26', mapName: '울산광역시', name: '울산', aliases: ['울산광역시'] },
  { code: '36', mapCode: '29', mapName: '세종특별자치시', name: '세종', aliases: ['세종특별자치시'] },
  { code: '41', mapCode: '31', mapName: '경기도', name: '경기', aliases: [] },
  { code: '51', mapCode: '32', mapName: '강원도', name: '강원', aliases: ['강원특별자치도'] },
  { code: '43', mapCode: '33', mapName: '충청북도', name: '충북', aliases: ['충북'] },
  { code: '44', mapCode: '34', mapName: '충청남도', name: '충남', aliases: ['충남'] },
  { code: '52', mapCode: '35', mapName: '전라북도', name: '전북', aliases: ['전북', '전북특별자치도'] },
  { code: '46', mapCode: '36', mapName: '전라남도', name: '전남', aliases: ['전남'] },
  { code: '47', mapCode: '37', mapName: '경상북도', name: '경북', aliases: ['경북'] },
  { code: '48', mapCode: '38', mapName: '경상남도', name: '경남', aliases: ['경남'] },
  { code: '50', mapCode: '39', mapName: '제주특별자치도', name: '제주', aliases: ['제주도'] },
] as const

function normalize(value?: string | null) {
  return value?.trim().replaceAll(' ', '') ?? ''
}

export function getDomesticRegion(regionCode?: string | null, regionName?: string | null) {
  const code = normalize(regionCode)
  const name = normalize(regionName)
  return DOMESTIC_REGIONS.find((region) =>
    (code && region.code === code) ||
    (name && [region.mapName, region.name, ...region.aliases].some((candidate) => normalize(candidate) === name)),
  )
}

export function getDomesticRegionByMapCode(mapCode?: string | null) {
  const code = normalize(mapCode)
  return DOMESTIC_REGIONS.find((region) => region.mapCode === code)
}
