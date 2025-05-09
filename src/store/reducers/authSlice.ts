import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
interface AuthState {
    isAuthenticated: boolean
    accessToken: string | null
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('ACCESS_TOKEN'), 
    accessToken: localStorage.getItem('ACCESS_TOKEN'),
}

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('ACCESS_TOKEN');
    const response = await axios.get('https://api.biazinsistemas.com/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Erro ao buscar usuário');
  }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<string>) {
            state.isAuthenticated = true
            state.accessToken = action.payload
            localStorage.setItem('ACCESS_TOKEN', action.payload)
        },
       
        logout(state) {
            state.isAuthenticated = false
            state.accessToken = null
            localStorage.removeItem('ACCESS_TOKEN')
        },
    },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
