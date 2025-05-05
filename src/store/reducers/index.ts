import { configureStore } from "@reduxjs/toolkit"
import api from '../../services/api'

import cart from './cart'
import cliente from './ClienteSlice'

export const store = configureStore({
    reducer: {
        cart: cart,
        cliente,
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(api.middleware)
})

export type RootReducer = ReturnType<typeof store.getState>

export {}