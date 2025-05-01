import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Endereco {
    cep: string;
    bairro: string;
    municipio: string;
    logradouro: string;
    numero: string;
    uf: string;
    complemento: string;
  }
  
  export interface PessoaFisica {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    endereco: Endereco;
    dataNascimento: ''
  }

  export interface PessoaJuridica {
    razaoSocial: string;
    cnpj: string;
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

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '56.124.21.33:8080'
  }),
  tagTypes: ['Produto', 'Venda', 'Cliente'],
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
    }),
    getClientes: builder.query<ClienteProps[], void>({
        query: () => '/clientes',
        providesTags: ['Cliente']
      }),

      getClienteByCpf: builder.query<ClienteProps, string>({
        query: (cpf) => `/clientes/buscar-cpf?cpf=${cpf}`,
      }),
      
      addCliente: builder.mutation<string, ClienteProps>({
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
        invalidatesTags: ['Cliente'],
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
    useDeleteVendaMutation,
    useGetClientesQuery,
    useGetClienteByCpfQuery,
    useAddClienteMutation,
    useUpdateClienteMutation,
    useDeleteClienteMutation
  } = api

export default api
