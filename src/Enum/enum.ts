export enum StatusOrdemServico {
  ABERTA = "ABERTA",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  CONCLUIDA = "CONCLUIDA",
  CANCELADA = "CANCELADA",
}
export interface OrdemServicoDTO {
  id?: number;
  clienteId: number;
  nomeCliente: string;
  descricao: string;
  dataAbertura: string;
  dataConclusao?: string;
  status: StatusOrdemServico;
  valor: number;
}