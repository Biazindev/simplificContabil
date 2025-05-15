export interface PessoaFisica {
  nome: string
  cpf: string
  email: string
  dataNascimento: string
  telefone: string
  endereco: Endereco
}

export interface Cliente {
  nomeFantasia: string | number | readonly string[] | undefined
  pessoaJuridica: any
  telefone: string | number | readonly string[] | undefined
  email: string | number | readonly string[] | undefined
  nome: string | number | readonly string[] | undefined
  id: number
  pessoaFisica: PessoaFisica
  municipio: string
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

interface Endereco {
  municipio: string
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  codigoIbge?: string;
  uf: string;
}

interface ItemVenda {
  produto: {
    id: number;
    nome: string;
    descricao: string;
    ncm: string;
    precoUnitario: number;
  };
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  totalItem: number;
}
