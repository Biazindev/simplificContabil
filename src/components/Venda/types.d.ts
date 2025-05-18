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
  totalItem: any
  nomeProduto: any
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
export interface EmitirNotaPayloadPf {
  emitirNotaFiscal: boolean;
  documentoCliente: string;
  cliente: ClientePayload;
  emitenteId: number;
  modelo: 'NFE' | 'NFSE' | string;
  itens: Item[];
  pagamento: Pagamento;
  dataVenda: string;
  status: 'CONCLUIDO' | 'PENDENTE' | string;
  vendaAnonima: boolean;
}

export interface ClientePayload {
  tipoPessoa: 'FISICA' | 'JURIDICA';
  pessoaFisica?: PessoaFisica | null;
  pessoaJuridica?: PessoaJuridica | null;
}

export interface PessoaFisica {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: Endereco;
}

export interface PessoaJuridica {
  razaoSocial: string;
  cnpj: string;
  inscricaoMunicipal?: string;
  inscricaoEstadual?: string;
  email: string;
  telefone: string;
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
  codigoIbge: string;
}

export interface Item {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  totalItem: number;
}

export interface Pagamento {
  formaPagamento: 'DINHEIRO' | 'CARTAO' | 'PIX' | string;
  valorPago: number;
  valorRestante: number;
  dataPagamento: string;
  status: 'PAGO' | 'PENDENTE' | string;
  numeroParcelas: number;
  totalVenda: number;
  totalDesconto: number;
  totalPagamento: number;
}


export interface EmitirNotaPayload {
  cpfCnpjTomador: string;
  nomeTomador: string;
  telefone: string;
  email: string;
  endereco: {
    cep: string;
    bairro: string;
    municipio: string;
    logradouro: string;
    numero: string;
    uf: string;
    complemento: string | null;
    codigoIbge: string;
  }
  servico: {
    descricao: string;
    valor: number;
    codigoTributacaoMunicipal: string;
    codigoTributacaoNacional: string;
    cnae: string;
    nbs: string;
    informacoesComplementares: string;

    locPrest: {
      cLocPrestacao: string;
      cPaisPrestacao: string;
    },
    cServ: {
      cTribNac: string;
      cTribMun: string;
      CNAE: string;
      xDescServ: string;
      cNBS: string;
    },
    infoCompl: {
      xInfComp: string;
      idDocTec: string | null,
      docRef: string | null
  }
 }
}

export interface ClientePayload {
  pessoaFisica?: PessoaFisica | null;
  pessoaJuridica?: PessoaJuridica | null;
  tipoPessoa: 'FISICA' | 'JURIDICA';
}

export interface PessoaFisica {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: Endereco;
}

export interface PessoaJuridica {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: Endereco;
}

export interface ItemVenda {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  totalItem: number;
}
