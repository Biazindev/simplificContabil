import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ClienteState {
  clienteSelecionado: any | null
}

const initialState: ClienteState = {
  clienteSelecionado: null
}

const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: {
    setClienteSelecionado(state, action: PayloadAction<any>) {
      state.clienteSelecionado = action.payload
    },
    limparClienteSelecionado(state) {
      state.clienteSelecionado = null
    }
  }
})

export const { setClienteSelecionado, limparClienteSelecionado } = clienteSlice.actions

export default clienteSlice.reducer
