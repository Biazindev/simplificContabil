interface Endereco {
  cep: string
  bairro: string
  municipio: string
  logradouro: string
  numero: string
  uf: string
  complemento?: string
}

export type Perfil = 'ADMIN' | 'COMUM';

export interface Usuario {
  id?: number;
  username: string;
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
}

interface PessoaFisica {
  id?: number;
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco: Endereco
  dataNascimento: string
}

interface PessoaJuridica {
  razaoSocial: string
  cnpj: string
}

interface ClienteProps {
  id: number
  nome: string
  cpf?: string
  cnpj?: string
  email?: string
  telefone?: string
  endereco?: Endereco
  dataNascimento?: string
  razaoSocial?: string
}

type ProdutoProps = {
  mensagem: string
  id: number
  nome: string
  descricao: string
  precoUnitario: number
  ncm: string
  EAN: string
  ativo: boolean
  dataCadastro: number[]
  imagem: string | null
  quantidade: number
  observacao: string | null
}


interface LoginRequest {
  username: string
  password: string
}

interface ForgotPasswordRequest { email: string }
interface ResetPasswordRequest {
  token: string
  newPassword: string
}

interface Mesa {
  id: number;
  numero: number;
  aberta: boolean;
  // você pode adicionar mais campos que existam na sua entidade Mesa
}

interface Pedido {
  id: number;
  mesaId: number;
  status: StatusPedido;
  itens: PedidoItem[];
  cliente?: string;
}

interface PedidoItem {
  produtoId: number;
  quantidade: number;
  // outros campos se existirem, ex: preço, nome, etc
}

interface PedidoMesaDTO {
  numeroMesa: number;
  pedido: {
    itens: PedidoItem[];
    // outros campos que compõem o pedido para adicionar à mesa
  };
}

interface ItemMesaDTO {
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

interface enderecoEntrega {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
    estado: string;
    complemento: string;
}
