interface Endereco {
  cep: string
  bairro: string
  municipio: string
  logradouro: string
  numero: string
  uf: string
  complemento?: string
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
  ativo: boolean
  dataCadastro: number[]
  imagem: string | null
  quantidade: number
  observacao: string | null
}

type VendaProps = {
  id: number
  cliente: string
  produtos: { id: number; quantidade: number }[]
  metodoPagamento: string
  valorPago: number
  totalVenda: number
  dataVenda: string
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