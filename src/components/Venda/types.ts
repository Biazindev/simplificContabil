export interface Endereco {
  logradouro: string
  numero: string
  bairro: string
  municipio: string
  uf: string
  cep: string
}

export interface PessoaFisica {
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco: Endereco
}

export interface Cliente {
  id: number
  pessoaFisica: PessoaFisica
}

export interface Produto {
  id: number
  nome: string
  descricao: string
  precoUnitario: number
  ncm: string
  ativo: boolean
  quantidade: number
  observacao?: string | null
  imagem?: string | null
}

export interface PayloadVenda {
  documentoCliente: string
  itensVenda: {
    produtoId: number
    quantidade: number
    precoUnitario: number
  }[]
  totalVenda: number
  totalDesconto: number
  totalPagamento: number
  formaPagamento: string
  dataVenda: string
  status: string
  clienteId: number
}
