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