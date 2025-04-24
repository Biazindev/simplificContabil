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