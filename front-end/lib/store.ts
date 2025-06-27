import { configureStore } from "@reduxjs/toolkit"
import hadithsReducer from "./features/hadiths/hadithsSlice"
import booksReducer from "./features/books/booksSlice"

export const store = configureStore({
  reducer: {
    hadiths: hadithsReducer,
    books: booksReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
