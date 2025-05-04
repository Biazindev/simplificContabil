// services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_BASE =
  process.env.REACT_APP_API_BASE_URL ?? 'https://api.biazinsistemas.com'

// ——— Tipos de domínio —————————————————————————————————————————

export interface Endereco {
  cep: string
  bairro: string
  municipio: string
  logradouro: string
  numero: string
  uf: string
  complemento?: string
}

export interface PessoaFisica {
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco: Endereco
  dataNascimento: string
}

export interface PessoaJuridica {
  razaoSocial: string
  cnpj: string
}

export interface ClienteProps {
  id: number
  nome: string
  cpf?: string
  cnpj?: string
  email?: string
  telefone?: string
  endereco?: Endereco
  dataNascimento?: string
  razaoSocial?: string
  pessoaFisica?: PessoaFisica
  pessoaJuridica?: PessoaJuridica
}

export interface CreateClienteRequest {
  nome: string
  cpf?: string
  telefone?: string
  email?: string
  endereco: string
  dataNascimento?: string
  pessoaFisica?: PessoaFisica
  pessoaJuridica?: PessoaJuridica
}

export type ProdutoProps = {
  mensagem: string
  id: number
  nome: string
  descricao: string
  precoUnitario: number
  ncm: string
  ativo: boolean
  dataCadastro: number[]
  imagem: string | null
  quantidade: number
  observacao: string | null
}

export type VendaProps = {
  id: number
  cliente: string
  produtos: { id: number; quantidade: number }[]
  metodoPagamento: string
  valorPago: number
  totalVenda: number
  dataVenda: string
}

export interface LoginRequest {
  username: string
  password: string
}

// A resposta JSON ainda devolve esses campos,
// mas o JWT real fica no cookie HttpOnly.
export interface LoginResponse {
  accessToken: string
  username: string
  roles: string[]
}

// ——— RTK Query setup ——————————————————————————————————————————————————

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    // 📨 manda sempre os cookies de autenticação
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    }
  }),
  tagTypes: ['Auth', 'Produto', 'Venda', 'Cliente'],
  endpoints: (builder) => ({
    // Autenticação — cookie é setado pelo backend
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (creds) => ({
        url: '/auth/login',
        method: 'POST',
        body: creds
      })
    }),

    // Produtos
    addProduto: builder.mutation<ProdutoProps, Partial<ProdutoProps>>({
      query: (novoProduto) => ({
        url: '/produtos',
        method: 'POST',
        body: novoProduto
      }),
      invalidatesTags: ['Produto']
    }),
    getProdutos: builder.query<ProdutoProps[], void>({
      query: () => '/produtos',
      providesTags: ['Produto']
    }),
    updateProduto: builder.mutation<ProdutoProps, ProdutoProps>({
      query: (produto) => ({
        url: `/produtos/${produto.id}`,
        method: 'PUT',
        body: produto
      }),
      invalidatesTags: ['Produto']
    }),
    deleteProduto: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/produtos/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Produto']
    }),

    // Vendas
    getVendas: builder.query<VendaProps[], void>({
      query: () => '/pdv',
      providesTags: ['Venda']
    }),
    addVenda: builder.mutation<VendaProps, Partial<VendaProps>>({
      query: (novaVenda) => ({
        url: '/pdv',
        method: 'POST',
        body: novaVenda
      }),
      invalidatesTags: ['Venda']
    }),
    updateVenda: builder.mutation<VendaProps, VendaProps>({
      query: (venda) => ({
        url: `/pdv/${venda.id}`,
        method: 'PUT',
        body: venda
      }),
      invalidatesTags: ['Venda']
    }),
    deleteVenda: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/pdv/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Venda']
    }),

    // Clientes
    getClientes: builder.query<ClienteProps[], void>({
      query: () => '/clientes',
      providesTags: ['Cliente']
    }),
    getClienteByCpf: builder.query<ClienteProps, string>({
      query: (cpf) => `/clientes/buscar-cpf?cpf=${cpf}`
    }),
    addCliente: builder.mutation<ClienteProps, CreateClienteRequest>({
      query: (cliente) => ({
        url: '/clientes',
        method: 'POST',
        body: cliente
      }),
      invalidatesTags: ['Cliente']
    }),
    updateCliente: builder.mutation<ClienteProps, ClienteProps>({
      query: (cliente) => ({
        url: `/clientes/${cliente.id}`,
        method: 'PUT',
        body: cliente
      }),
      invalidatesTags: ['Cliente']
    }),
    deleteCliente: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/clientes/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Cliente']
    })
  })
})

export const {
  useLoginMutation,
  useGetProdutosQuery,
  useAddProdutoMutation,
  useUpdateProdutoMutation,
  useDeleteProdutoMutation,
  useGetVendasQuery,
  useAddVendaMutation,
  useUpdateVendaMutation,
  useDeleteVendaMutation,
  useGetClientesQuery,
  useGetClienteByCpfQuery,
  useAddClienteMutation,
  useUpdateClienteMutation,
  useDeleteClienteMutation
} = api

export default api
