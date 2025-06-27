import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Hadith, HadithsState } from "./types"

// Load initial state from localStorage
const loadFromLocalStorage = (): Hadith[] => {
  if (typeof window === "undefined") return []
  try {
    const serializedState = localStorage.getItem("hadiths")
    if (serializedState === null) return []
    return JSON.parse(serializedState)
  } catch (err) {
    return []
  }
}

// Save to localStorage
const saveToLocalStorage = (hadiths: Hadith[]) => {
  if (typeof window === "undefined") return
  try {
    const serializedState = JSON.stringify(hadiths)
    localStorage.setItem("hadiths", serializedState)
  } catch (err) {
    console.error("Could not save hadiths to localStorage:", err)
  }
}

const initialState: HadithsState = {
  hadiths: loadFromLocalStorage(),
  loading: false,
  error: null,
}

const hadithsSlice = createSlice({
  name: "hadiths",
  initialState,
  reducers: {
    addHadith: (state, action: PayloadAction<Hadith>) => {
      state.hadiths.unshift(action.payload)
      saveToLocalStorage(state.hadiths)
    },
    updateHadith: (state, action: PayloadAction<Hadith>) => {
      const index = state.hadiths.findIndex((h) => h.id === action.payload.id)
      if (index !== -1) {
        state.hadiths[index] = action.payload
        saveToLocalStorage(state.hadiths)
      }
    },
    deleteHadith: (state, action: PayloadAction<string>) => {
      state.hadiths = state.hadiths.filter((h) => h.id !== action.payload)
      saveToLocalStorage(state.hadiths)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { addHadith, updateHadith, deleteHadith, setLoading, setError } = hadithsSlice.actions
export default hadithsSlice.reducer
