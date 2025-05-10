export interface ProdutoVenda {
  id: number
  quantidade: number
}

export interface Venda {
  id: number
  cliente: string
  produtos: ProdutoVenda[]
  metodoPagamento: string
  valorPago: number
  totalVenda: number
  dataVenda: string
}
