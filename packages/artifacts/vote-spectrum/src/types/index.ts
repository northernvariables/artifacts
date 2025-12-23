/**
 * TypeScript types for Vote Spectrum
 */

// Province/Territory codes
export type ProvinceCode =
  | 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU'
  | 'ON' | 'PE' | 'QC' | 'SK' | 'YT'

// Question types
export interface Question {
  qid: string
  text: string
  jurisdiction: 'federal' | 'provincial'
  province_gate?: ProvinceCode[]
  axis_map: AxisMapping[]
  fact?: string
  bucket?: string
}

export interface AxisMapping {
  axis_id: string
  weight: number
  polarity: 1 | -1
}

// Party types
export interface Party {
  name: string
  color: string
  logo?: string
  jurisdiction: 'federal' | 'provincial'
  province?: ProvinceCode
  [axis: string]: string | number | undefined
}

// User response types
export interface QuestionResponse {
  qid: string
  position: number
  important: boolean
  skipped: boolean
}

// App state types
export type Screen =
  | 'welcome'
  | 'province'
  | 'pastVote'
  | 'importance'
  | 'questions'
  | 'knowledge'
  | 'results'
  | 'consent'

export interface AppState {
  screen: Screen
  province: ProvinceCode | null
  pastVote: string | null
  responses: QuestionResponse[]
  currentQuestionIndex: number
  language: 'en' | 'fr'
}

// Result types
export interface PartyAlignment {
  party: string
  color: string
  logo?: string
  alignment: number
  jurisdiction: 'federal' | 'provincial'
}

export interface AxisScore {
  axis_id: string
  score: number
}

export const TERRITORY_CODES = new Set<ProvinceCode>(['YT', 'NT', 'NU'])
