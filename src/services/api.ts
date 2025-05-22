import { VendaProps } from '../components/SaleList/index'
import { Usuario } from '../../src/components/User/User'
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { EmitirNotaPayload } from '../components/Venda/types'
import { OrdemServicoDTO } from '../Enum/enum'
import { ItemMesa } from '../components/PDVmesa/index'

export interface ForgotPasswordRequest { email: string }
export interface ResetPasswordRequest { token: string; newPassword: string }
export interface Endereco {
  cep: string; bairro: string; municipio: string; logradouro: string; numero: string; uf: string; complemento?: string
}

export interface Mesa {
  id: number;
  numero: number;
  aberta: boolean;
  // você pode adicionar mais campos que existam na sua entidade Mesa
}

export interface Pedido {
  cliente: string;
  id: number;
  mesaId: number;
  status: StatusPedido;
  itens: PedidoItem[];
  // adicione outros campos conforme seu modelo
}

export interface PedidoItem {
  produtoId: number;
  quantidade: number;
  // outros campos se existirem, ex: preço, nome, etc
}

export interface PedidoMesaDTO {
  numeroMesa?: number;
  itens: PedidoItem[];
}

export interface ItemMesaDTO {
  produtoId: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  totalItem: number;
}

export enum StatusPedido {
  ABERTO = 'ABERTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
  // adicione outros status conforme seu enum Java
}

export interface PessoaFisica {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: Endereco;
}

export interface PedidoPayload {
  itens: {
    produtoId: number;
    quantidade: number;
    fone: string;
  }[];
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
  id: number;
  nome: string;
  cpf?: string;
  documento: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: Endereco;
  dataNascimento?: string;
  razaoSocial?: string;
  pessoaFisica?: PessoaFisica;
  pessoaJuridica?: PessoaJuridica;
  municipio: string
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
  tagTypes: ['Auth', 'Produto', 'Venda', 'Cliente', 'Filial', 'Mesa', 'Pedido'],
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
    getVendas: builder.query<VendaProps[], { inicio?: string; fim?: string } | void>({
      query: (params) => {
        const { inicio, fim } = params || {};
        return {
          url: '/venda',
          params: inicio && fim ? { inicio, fim } : undefined,
        };
      },
      providesTags: ['Venda'],
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
    getByTime: builder.query<number, void>({
      query: () => '/venda/totais-mensais',
      providesTags: ['Venda'],
    }),
    getTotalAno: builder.query<number, void>({
      query: () => '/venda/total-ano',
      providesTags: ['Venda'],
    }),
    getVendasPorPeriodo: builder.query<VendaProps[], { inicio: string; fim: string }>({
      query: ({ inicio, fim }) => `vendas-por-periodo?inicio=${inicio}&fim=${fim}`,
    }),
    getTotalPorPeriodo: builder.query<number, { inicio: string; fim: string }>({
      query: ({ inicio, fim }) => `total-por-periodo?inicio=${inicio}&fim=${fim}`,
    }),
    addVenda: builder.mutation<{ id?: number; blob?: Blob }, any>({
      query: (venda) => ({
        url: '/venda/finalizar',
        method: 'POST',
        body: venda,
        responseHandler: (response) => response.blob(), // Sempre trata como Blob primeiro
      }),
      transformResponse: async (blob: Blob): Promise<{ id?: number; blob?: Blob }> => {
        try {
          const text = await blob.text();
          const json = JSON.parse(text);

          // Se conseguir converter em JSON com id, retornamos o id
          if (json && typeof json.id === 'number') {
            return { id: json.id };
          }

          // Se não tiver id, assumimos que não é um JSON de id válido
          return { blob };
        } catch (e) {
          // Se falhar ao parsear, é realmente um blob (ex: PDF)
          return { blob };
        }
      },
      invalidatesTags: ['Venda'],
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
    getClientesByPhone: builder.query<ClienteProps, string>({
      query: (telefone) => `/clientes/buscar-telefone?telefone=${telefone}`,
      providesTags: ['Cliente']
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
        url: 'api/nfse/dps/emitir?empresaId=1',
        method: 'POST',
        body
      })
    }),
    CreateServiceOrder: builder.mutation<OrdemServicoDTO, Partial<OrdemServicoDTO>>({
      query: (novoProduto) => ({
        url: '/ordens-servico',
        method: 'POST',
        body: novoProduto
      }),
      invalidatesTags: ['Produto']
    }),
    addPedidoEntrega: builder.mutation<{ id: number }, PedidoPayload>({
      query: (body) => ({
        url: '/pedidos',
        method: 'POST',
        body,
      }),
    }),
    finalizarPedido: builder.mutation<void, number>({
      query: (id) => ({
        url: `/pedidos/${id}/entregar`,
        method: 'POST',
      }),
    }),
    // Criar nova mesa
    criarMesa: builder.mutation<{ id: number }, { numero: number; aberta: boolean }>({
      query: (payload) => ({
        url: 'mesas/criar-ou-reutilizar',      // ou a rota correta do backend
        method: 'POST',
        body: payload,      // aqui vai { numero: x, aberta: true }
      }),
    }),

    // Criar ou reutilizar mesa por número
    criarOuReutilizarMesa: builder.mutation({
      query: (numero: number) => ({
        url: `mesas/criar-ou-reutilizar?numero=${numero}`,
        method: 'POST',
      }),
    }),

    // Listar mesas abertas
    listarMesasAbertas: builder.query<Mesa[], void>({
      query: () => 'mesas/ativas',
      providesTags: ['Mesa'],
    }),

    // Calcular total da mesa
    calcularTotalMesa: builder.query<number, number>({
      query: (numeroMesa: any) => `mesas${numeroMesa}/total`,
    }),

    // Finalizar mesa e obter PDF (retorno em blob)
    finalizarMesa: builder.mutation<Blob, number>({
      query: (numeroMesa: any) => ({
        url: `mesas${numeroMesa}/finalizar`,
        method: 'POST',
        responseHandler: async (response: { blob: () => any }) => {
          const blob = await response.blob();
          return blob;
        },
      }),
      invalidatesTags: ['Mesa'],
    }),

    // Listar itens da mesa
    listarItensDaMesa: builder.query<ItemMesa[], number>({
      query: (numeroMesa: any) => `mesas${numeroMesa}/itens`,
      providesTags: ['Mesa'],
    }),

    listarPedidos: builder.query<Pedido[], { status?: string; mesaId?: number }>({
      query: ({ status, mesaId }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (mesaId !== undefined) params.append('mesaId', mesaId.toString());
        return {
          url: '/mesas',
          params,
        };
      },
      providesTags: ['Pedido'],
    }),


    // Adicionar pedido à mesa
    adicionarPedido: builder.mutation<void, PedidoMesaDTO>({
      query: (dto: any) => ({
        url: 'mesas/pedido',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Mesa', 'Pedido'],
    }),
    sairParaEntrega: builder.mutation<void, number>({
      query: (id) => ({
        url: `/pedidos/${id}/entregar`,
        method: 'PUT',
      }),
    }),

    // GET /ativas
    getMesasAtivas: builder.query<Mesa[], void>({
      query: () => 'mesas/ativas',
      providesTags: ['Mesa'],
    }),

    // GET /{numeroMesa}/total
    getTotalMesa: builder.query<number, number>({
      query: (numeroMesa) => `/${numeroMesa}/total`,
    }),
    // GET /{numeroMesa}/itens
    getItensMesa: builder.query<ItemMesaDTO[], number>({
      query: (numeroMesa) => `mesas/${numeroMesa}/itens`,
      providesTags: ['Pedido'],
    }),
  }),
})

export const {
  useLazyGetItensMesaQuery,
  useLazyListarPedidosQuery,
  useLazyGetMesasAtivasQuery,
  useGetMesasAtivasQuery,
  useGetTotalMesaQuery,
  useGetItensMesaQuery,
  useSairParaEntregaMutation,
  useCriarMesaMutation,
  useCriarOuReutilizarMesaMutation,
  useListarMesasAbertasQuery,
  useCalcularTotalMesaQuery,
  useFinalizarMesaMutation,
  useListarItensDaMesaQuery,
  useListarPedidosQuery,
  useAdicionarPedidoMutation,
  useLazyGetClientesByPhoneQuery,
  useAddPedidoEntregaMutation,
  useFinalizarPedidoMutation,
  useGetClientesByPhoneQuery,
  useCreateServiceOrderMutation,
  useAddNfeMutation,
  useGetTotalPorPeriodoQuery,
  useGetByTimeQuery,
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
  useGetTotalAnoQuery,
} = api

