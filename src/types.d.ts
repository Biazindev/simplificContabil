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

type ProdutoProps = {
    id: any
    produto: {
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
  }

  type ProdutoProps = {
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
  
  interface PessoaJuridica {
    razaoSocial: string;
    cnpj: string;
  }
  
  interface ClienteProps {
    id: number;
    pessoaFisica: PessoaFisica;
    pessoaJuridica?: PessoaJuridica;
    tipoPessoa: 'FISICA' | 'JURIDICA';
  }
  
  type ProdutoProps = {
    mensagem: string;
    id: number;
    nome: string;
    descricao: string;
    precoUnitario: number;
    ncm: string;
    ativo: boolean;
    dataCadastro: number[];
    imagem: string | null;
    quantidade: number;
    observacao: string | null;
  }
  
  type VendaProps = {
    id: number;
    cliente: string;
    produtos: { id: number; quantidade: number }[];
    metodoPagamento: string;
    valorPago: number;
    totalVenda: number;
    dataVenda: string;
  }