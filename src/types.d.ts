interface ProdutoPedido {
    id: number
    nome: string
    valor: number
    quantidade: number
    observacao?: string

}

interface PedidoEntrega {
    id: number
    cliente: string
    endereco: string
    status: string
    pago: boolean
    produtos: ProdutoPedido[]
    troco?: number
    motoboy?: string
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    variant?: "default" | "outline"
}

interface CardProps {
    children: React.ReactNode
    className?: string
}

  type VendaProps = {
    id: number
    cliente: string
    produtos: { id: number
    quantidade: number }[]
    metodoPagamento: string
    valorPago: number
    totalVenda: number
    dataVenda: string
  }
  
interface Endereco {
    cep: string;
    bairro: string;
    municipio: string;
    logradouro: string;
    numero: string;
    uf: string;
    complemento: string;
  }
  
interface PessoaFisica {
    id?: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    endereco: Endereco;
    dataNascimento: string;
  }
  
  interface PessoaJuridica {
    tipo: string
    simples: SimplesNacional
    capitalSocial: number
    socios: Socio[]
    atividadesSecundarias: Atividade[]
    atividadesPrincipais: Atividade[]
    ultimaAtualizacao: string | null
    porte: string
    tipo: string
    situacao: string
    nomeFantasia: string | number | readonly string[] | undefined
    email: string | number | readonly string[] | undefined
    telefone: string | number | readonly string[] | undefined
    inscricaoEstadual: string | number | readonly string[] | undefined
    naturezaJuridica: string | number | readonly string[] | undefined
    dataAbertura: string | number | readonly string[] | undefined
    endereco: any
    razaoSocial: string;
    cnpj: string;
  }
  
  interface ClienteProps {
    dataNascimento: string
    telefone: string
    email: string
    cpf: string
    nome: string
    endereco: any
    endereco: { cep: string; 
        bairro: string; 
        municipio: string; 
        logradouro: string; 
        numero: string; 
        uf: string; 
        complemento: string }
    endereco(endereco: any): unknown
    cpf: any
    id?: any
    tipoPessoa?: 'FISICA' | 'JURIDICA';
    pessoaFisica?: PessoaFisica;
    pessoaJuridica?: PessoaJuridica;
  }

interface ClienteProps {
    pessoaFisica: PessoaFisica;
    pessoaJuridica?: PessoaJuridica;
  }
  
  interface Endereco {
    cep: string;
    bairro: string;
    municipio: string;
    logradouro: string;
    numero: string;
    uf: string;
    complemento: string;
  }
  
  interface PessoaFisica {
    id?: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    endereco: Endereco;
    dataNascimento: string;
  }

  
  interface ClienteProps {
    id: number;
    pessoaFisica: PessoaFisica;
    pessoaJuridica?: PessoaJuridica;
  }

  
 export type VendaProps = {
    id: number;
    cliente: string;
    produtos: { id: number; quantidade: number }[];
    metodoPagamento: string;
    valorPago: number;
    totalVenda: number;
    dataVenda: string;
  }

export interface ResponseData {
  status: number;
  data: {
      cliente: {
          pessoaFisica: any
          pessoaJuridica: any
      }
  }
}

export interface Endereco {
  cep: string
  bairro: string
  municipio: string
  logradouro: string
  numero: string
  uf: string
  complemento?: string
}
interface ClienteForm {
  pessoaFisica: PessoaFisica | null
  pessoaJuridica: PessoaJuridica | null
}


interface ClienteResponse {
  cliente: ClienteProps;
  message: string;
}
