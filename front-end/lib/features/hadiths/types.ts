export interface Narrator {
  id: string
  name: string
  fullName?: string
  reliability?: string
}

export interface Isnad {
  id: string
  narrators: Narrator[]
  grade: "صحيح" | "حسن" | "ضعيف" | "موضوع"
  notes?: string
}

export interface Reference {
  id: string
  source: string
  volume?: string
  page?: string
  hadithNumber?: string
}

export interface ScholarComment {
  id: string
  scholar: string
  comment: string
  grade?: string
}

export interface Hadith {
  id: string
  arabicText: string
  narrator: string
  isnad: Isnad
  grade: "صحيح" | "حسن" | "ضعيف" | "موضوع"
  references: Reference[]
  scholarComments: ScholarComment[]
  analysisNotes: string
  createdAt: string
  updatedAt: string
}

export interface HadithsState {
  hadiths: Hadith[]
  loading: boolean
  error: string | null
}
