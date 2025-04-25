import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export type ProdutoProps = {
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

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://simplifica-contabil.onrender.com'
  }),
  tagTypes: ['Produto', 'Venda'],
  endpoints: (builder) => ({
    getProdutos: builder.query<ProdutoProps[], void>({
      query: () => '/produtos',
      providesTags: ['Produto']
    }),
    
    addProduto: builder.mutation<ProdutoProps, Partial<ProdutoProps>>({
      query: (novoProduto) => ({
        url: '/produtos',
        method: 'POST',
        body: novoProduto
      }),
      invalidatesTags: ['Produto']
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
    })
  })
})

export const {
  useGetProdutosQuery,
  useAddProdutoMutation,
  useUpdateProdutoMutation,
  useDeleteProdutoMutation,
  useGetVendasQuery,
  useAddVendaMutation,
  useUpdateVendaMutation,
  useDeleteVendaMutation
} = api

export default api
