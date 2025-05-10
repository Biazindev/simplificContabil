import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from './index'
import api, { useAddVendaMutation } from '../../services/api'

type Produto = {
  id: number
  nome: string
  descricao: string
  precoUnitario: number
  ncm: string
  ativo: boolean
  quantidade: number
  observacao?: string | null
  imagem?: string | null
}

type Cliente = any

type VendaState = {
  cliente: Cliente | null
  produtos: Produto[]
  statusEnvio: 'idle' | 'loading' | 'succeeded' | 'failed'
  erro: string | null
}

const initialState: VendaState = {
  cliente: null,
  produtos: [],
  statusEnvio: 'idle',
  erro: null,
}

export const enviarVenda = createAsyncThunk(
  'venda/enviarVenda',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState
    const cliente = state.venda.cliente
    const produtos = state.venda.produtos

    if (!cliente || produtos.length === 0) {
      throw new Error('Cliente ou produtos não encontrados')
    }

    const total = produtos.reduce((acc, p) => acc + p.precoUnitario * p.quantidade, 0)

    const payload = {
      documentoCliente: cliente.pessoaFisica?.cpf ?? '',
      itensVenda: produtos.map(p => ({
        produtoId: p.id,
        quantidade: p.quantidade,
        precoUnitario: p.precoUnitario,
      })),
      totalVenda: total,
      totalDesconto: 0,
      totalPagamento: total,
      formaPagamento: 'DINHEIRO',
      dataVenda: new Date().toISOString(),
      status: 'PAGO',
      clienteId: cliente.id,
    }

    const result = await dispatch(api.endpoints.addVenda.initiate(payload)).unwrap()
    return result
  }
)

const vendaSlice = createSlice({
  name: 'venda',
  initialState,
  reducers: {
    setCliente(state, action) {
      state.cliente = action.payload
    },
    setProdutos(state, action) {
      state.produtos = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(enviarVenda.pending, (state) => {
        state.statusEnvio = 'loading'
        state.erro = null
      })
      .addCase(enviarVenda.fulfilled, (state) => {
        state.statusEnvio = 'succeeded'
      })
      .addCase(enviarVenda.rejected, (state, action) => {
        state.statusEnvio = 'failed'
        state.erro = action.error.message ?? 'Erro desconhecido'
      })
  }
})

export const { setCliente, setProdutos } = vendaSlice.actions
export default vendaSlice.reducer
