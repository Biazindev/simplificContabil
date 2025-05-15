import { VendaProps } from '../components/SaleList/index'
import { Usuario } from '../../src/components/User/User'
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { EmitirNotaPayload } from '../components/Venda/index';

export interface ForgotPasswordRequest { email: string }
export interface ResetPasswordRequest { token: string; newPassword: string }
export interface Endereco {
  cep: string; bairro: string; municipio: string; logradouro: string; numero: string; uf: string; complemento?: string
}
export interface PessoaFisica {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: Endereco;
}

export interface Endereco {
  cep: string;
  bairro: string;
  municipio: string;
  logradouro: string;
  numero: string;
  uf: string;
  complemento?: string;
}


export interface PessoaJuridica {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacao: string;
  tipo: string;
  naturezaJuridica: string;
  porte: string;
  dataAbertura: string;
  ultimaAtualizacao: string | null;
  atividadesPrincipais: Atividade[];
  atividadesSecundarias: Atividade[];
  socios: Socio[];
  endereco: Endereco;
  simples: SimplesNacional;
  telefone?: string;
  inscricaoEstadual: string;
  capitalSocial: number;
  email: string;
}



export interface Atividade {
  codigo: string;
  descricao: string;
}

export interface Socio {
  nome: string;
  qualificacao: string;
  cpf: string;
}

export interface SimplesNacional {
  optante: boolean;
  mei?: boolean;
  dataExclusao?: string | null;
  ultimaAtualizacao?: string | null;
}


export interface Simples {
  simples: boolean;
}

export interface Endereco {
  cep: string;
  bairro: string;
  municipio: string;
  logradouro: string;
  numero: string;
  uf: string;
  complemento?: string;
}


export interface ClienteProps {
  tipoPessoa: string;
  cliente: void | ClienteProps;
  id: number; nome: string; cpf?: string; cnpj?: string; email?: string; telefone?: string;
  endereco?: Endereco; dataNascimento?: string; razaoSocial?: string;
  pessoaFisica?: PessoaFisica; pessoaJuridica?: PessoaJuridica; municipio: string
}

export interface CreateClienteRequest {
  tipoPessoa?: 'FISICA' | 'JURIDICA';
  pessoaFisica?: PessoaFisica | null;
  pessoaJuridica?: PessoaJuridica | null;
}



export type ProdutoProps = {
  mensagem: string
  id: number
  nome: string
  descricao: string
  precoUnitario: number
  ncm: string
  EAN: string
  ativo: boolean
  dataVencimento: string
  imagem: string | null
  quantidade: number
  observacao: string | null
}
export interface LoginRequest { username: string; password: string, accessToken: string }
export interface LoginResponse {
  id: number;
  accessToken: string;
}

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.biazinsistemas.com',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('SIMPLIFICA-API-KEY', 'biaza');

    return headers;
  }

})

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && (result.error as any).status === 401) {
    console.log('401, tentando refresh…')
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST' } as FetchArgs,
      api,
      extraOptions
    )
    if (refreshResult.data) {
      const newToken = (refreshResult.data as any).accessToken
      localStorage.setItem('ACCESS_TOKEN', newToken)

      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch({ type: 'auth/logout' })
    }
  }

  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Produto', 'Venda', 'Cliente', 'Filial'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (creds) => ({
        url: '/auth/login',
        method: 'POST',
        body: creds
      })
    }),

    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/help/forgot-password',
        method: 'POST',
        body
      })
    }),

    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: '/help/reset-password',
        method: 'POST',
        body
      })
    }),
    criarUsuario: builder.mutation<string, Usuario>({
      query: (usuario) => ({
        url: 'usuario',
        method: 'POST',
        body: usuario,
      }),
    }),
    buscarUsuario: builder.query<Usuario[], void>({
      query: () => ({
        url: '/usuario/listar',
        method: 'GET',
      }),
    }),
    buscarUsuarioPorId: builder.query<Usuario, number>({
      query: (id) => ({
        url: `/usuario/${id}`,
        method: 'GET',
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        responseHandler: (response) => response.text(),
      }),
    }),
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
    getProdutosByName: builder.query<ProdutoProps[], string>({
      query: (nome) => `/produtos/buscar/nome?nome=${encodeURIComponent(nome)}`,
      providesTags: ['Produto']
    }),
    searchProdutos: builder.query<ProdutoProps[], string>({
      query: (searchTerm) => `/produtos?search=${searchTerm}`,
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
    getVendas: builder.query<VendaProps[], void>({
      query: () => '/venda',
      providesTags: ['Venda']
    }),
    getTotalDia: builder.query<number, void>({
      query: () => '/venda/totais-semana',
      providesTags: ['Venda'],
    }),
    getTotalDiaSing: builder.query<number, void>({
      query: () => 'venda/totais-diario',
      providesTags: ['Venda'],
    }),
    getTotalDiaSingle: builder.query<number, void>({
      query: () => 'venda/total-dia',
      providesTags: ['Venda'],
    }),
    getTotalSemana: builder.query<number, void>({
      query: () => '/venda/total-semana',
      providesTags: ['Venda'],
    }),
    getTotalSemanas: builder.query<number, void>({
      query: () => 'venda/totais-semanais',
      providesTags: ['Venda'],
    }),

    getTotalMes: builder.query<number, void>({
      query: () => '/venda/total-mes',
      providesTags: ['Venda'],
    }),
    getTotalMeses: builder.query<number, void>({
      query: () => '/venda/totais-mensais',
      providesTags: ['Venda'],
    }),

    getTotalAno: builder.query<number, void>({
      query: () => '/venda/total-ano',
      providesTags: ['Venda'],
    }),
    addVenda: builder.mutation<Blob, any>({
      query: (venda) => ({
        url: '/venda',
        method: 'POST',
        body: venda,
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: ['Venda']
    }),
    updateVenda: builder.mutation<VendaProps, VendaProps>({
      query: (venda) => ({
        url: `'/venda'${venda.id}`,
        method: 'PUT',
        body: venda
      }),
      invalidatesTags: ['Venda']
    }),
    deleteVenda: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `'/venda'${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Venda']
    }),

    getClientes: builder.query<ClienteProps[], void>({
      query: () => '/clientes',
      providesTags: ['Cliente']
    }),
    getClienteByDocumento: builder.query<ClienteProps, string>({
      query: (documento) => `/clientes/buscar-documento?documento=${documento}`,
    }),

    addCliente: builder.mutation<ClienteProps, CreateClienteRequest>({
      query: (cliente) => ({
        url: '/clientes',
        method: 'POST',
        body: cliente
      }),
      invalidatesTags: ['Cliente']
    }),

    updateCliente: builder.mutation<void, {
      id: number;
      pessoaFisica?: PessoaFisica | null;
      pessoaJuridica?: PessoaJuridica | null;
    }>({
      query: ({ id, pessoaFisica, pessoaJuridica }) => ({
        url: `/clientes/${id}`,
        method: 'PUT',
        body: {
          pessoaFisica: pessoaFisica ?? null,
          pessoaJuridica: pessoaJuridica ?? null
        },
      }),
    }),

    deleteCliente: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/clientes/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Cliente']
    }),

    getClienteIdByCpf: builder.query<{ id: string }, string>({
      query: (cpf) => `/clientes/cpf/${cpf}`,
    }),

    getClienteById: builder.query<any, string>({
      query: (id) => `/clientes/${id}`,
    }),
    getClientesPf: builder.query<ClienteProps[], string>({
      query: () => '/pessoas-fisicas',
      providesTags: ['Cliente']
    }),
    getClienteByCpfPf: builder.query<ClienteProps, string>({
      query: (cpf) => `/pessoas-fisicas/buscar-cpf?cpf=${cpf}`
    }),
    addClientePf: builder.mutation<ClienteProps, CreateClienteRequest>({
      query: (cliente) => ({
        url: '/pessoas-fisicas',
        method: 'POST',
        body: cliente,
        tipoPessoa: undefined
      }),
      invalidatesTags: ['Cliente']
    }),
    updateClientePf: builder.mutation<ClienteProps, ClienteProps>({
      query: (cliente) => ({
        url: `/pessoas-fisicas/${cliente.id}`,
        method: 'PUT',
        body: cliente,
        tipoPessoa: undefined,
      }),
      invalidatesTags: ['Cliente']
    }),
    deleteClientePf: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/pessoas-fisicas/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Cliente']
    }),
    getClientesPj: builder.query<ClienteProps[], void>({
      query: () => '/pessoas-juridicas',
      providesTags: ['Cliente']
    }),
    getClienteByCpfPj: builder.query<ClienteProps, string>({
      query: (cpf) => `/pessoas-juridicas/buscar-cpf?cpf=${cpf}`
    }),
    addClientePj: builder.mutation<ClienteProps, CreateClienteRequest>({
      query: (cliente) => ({
        url: '/pessoas-juridicas',
        method: 'POST',
        body: cliente,
        tipoPessoa: undefined,
      }),
      invalidatesTags: ['Cliente']
    }),
    updateClientePj: builder.mutation<ClienteProps, ClienteProps>({
      query: (cliente) => ({
        url: `/pessoas-juridicas/${cliente.id}`,
        method: 'PUT',
        body: cliente,
      }),
      invalidatesTags: ['Cliente']
    }),
    deleteClientePj: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/pessoas-juridicas/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Cliente']
    }),
    importarProdutosXml: builder.mutation<string, { file: File; filialId: number }>({
      query: ({ file, filialId }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filialId', filialId.toString()); // 👈 esse era o ponto

        return {
          url: '/produtos/importar-xml',
          method: 'POST',
          body: formData,
          responseHandler: (res) => res.text()
        };
      },
      invalidatesTags: ['Produto']
    }),

    importarProdutosXmlFilial: builder.mutation<any, { file: File, filialId: number }>({
      query: ({ file, filialId }) => {
        const formData = new FormData();
        formData.append('file', file); // só o file vai no body

        return {
          url: `/estoque/${filialId}`, // filialId vai na URL
          method: 'POST',
          body: formData,
        };
      },
    }),
    listarFiliais: builder.query<any[], void>({
      query: () => 'filial',
      providesTags: ['Filial'],
    }),
    addNfe: builder.mutation<any, EmitirNotaPayload>({
      query: (body) => ({
        url: '/nfe/emitir  ',
        method: 'POST',
        body
      })
    })
  })
})

export const {
  useAddNfeMutation,
  useGetTotalDiaSingleQuery,
  useImportarProdutosXmlFilialMutation,
  useGetTotalDiaSingQuery,
  useLoginMutation,
  useLogoutMutation,
  useBuscarUsuarioPorIdQuery,
  useBuscarUsuarioQuery,
  useGetTotalDiaQuery,
  useGetTotalSemanaQuery,
  useGetTotalSemanasQuery,
  useGetTotalMesQuery,
  useGetTotalMesesQuery,
  useGetClienteByDocumentoQuery,
  useGetProdutosQuery,
  useGetProdutosByNameQuery,
  useAddProdutoMutation,
  useUpdateProdutoMutation,
  useDeleteProdutoMutation,
  useGetVendasQuery,
  useAddVendaMutation,
  useUpdateVendaMutation,
  useDeleteVendaMutation,
  useGetClientesQuery,
  useAddClienteMutation,
  useUpdateClienteMutation,
  useDeleteClienteMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetClientesPfQuery,
  useGetClienteByCpfPfQuery,
  useAddClientePfMutation,
  useUpdateClientePfMutation,
  useDeleteClientePfMutation,
  useGetClientesPjQuery,
  useGetClienteByCpfPjQuery,
  useAddClientePjMutation,
  useUpdateClientePjMutation,
  useDeleteClientePjMutation,
  useLazyGetClienteIdByCpfQuery,
  useLazyGetClienteByIdQuery,
  useGetClienteByIdQuery,
  useLazyGetClienteByDocumentoQuery,
  useSearchProdutosQuery,
  useCriarUsuarioMutation,
  useImportarProdutosXmlMutation,
  useListarFiliaisQuery,
} = api

