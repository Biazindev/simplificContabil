export interface Endereco {
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
}

export interface PessoaFisica {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: Endereco;
}

export interface Cliente {
  id: number;
  pessoaFisica: PessoaFisica;
}

export interface Produto {
  id: number;
  nome: string;
  precoUnitario: number;
  quantidade: number;
}
