import { configureStore } from "@reduxjs/toolkit"
import api from '../../services/api'

import vendaReducer from '../reducers/vendaSlice'
import cart from './cart'
import cliente from './ClienteSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart,
    cliente,
    venda: vendaReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar paths onde blobs podem estar
        ignoredActions: [
          'api/executeQuery/fulfilled',
          'api/executeMutation/fulfilled',
          'api/executeMutation/rejected',
        ],
        ignoredPaths: ['api.mutations'], // onde geralmente blobs aparecem
      },
    }).concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
