import { configureStore } from '@reduxjs/toolkit'
import reducer from './Reducer'
import { middleware } from './Middleware'

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch