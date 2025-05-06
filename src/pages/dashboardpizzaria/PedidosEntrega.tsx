    import React, { useState } from "react"
    import * as S from "./style"
import { PedidoEntrega, ProdutoPedido } from "@/types"

    const PedidosEntrega: React.FC = () => {
        const [pedidos, setPedidos] = useState<PedidoEntrega[]>([
            {
                id: 1,
                cliente: "João Silva",
                endereco: "Rua A, 123",
                status: "EM PREPARO",
                pago: false,
                produtos: [
                    { id: 1, nome: "Pizza Calabresa", valor: 65.0, quantidade: 1 },
                    { id: 2, nome: "Coca-Cola 2L", valor: 10.0, quantidade: 2 }
                ]
            },
            {
                id: 2,
                cliente: "Maria Oliveira",
                endereco: "Rua B, 456",
                status: "EM PREPARO",
                pago: true,
                produtos: [
                    { id: 1, nome: "Lasanha", valor: 45.0, quantidade: 1 }
                ]
            },
            {
                id: 3,
                cliente: "Maria Fernanda",
                endereco: "Rua B, 456",
                status: "EM PREPARO",
                pago: true,
                produtos: [
                    { id: 1, nome: "X Tudo", valor: 45.0, quantidade: 1 }
                ]
            },
            {
                id: 4,
                cliente: "Carlos Henrique",
                endereco: "Av. Brasil, 1500",
                status: "Saiu para entrega",
                pago: true,
                motoboy: "João Motoca",
                produtos: [
                    {
                        id: 1,
                        nome: "Pizza Portuguesa",
                        valor: 70.0,
                        quantidade: 1,
                        observacao: "Sem pimentão, por favor"
                    },
                    {
                        id: 2,
                        nome: "Guaraná 2L",
                        valor: 8.0,
                        quantidade: 1
                    }
                ]
            }


        ])

        const [modalAberto, setModalAberto] = useState(false)
        const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoEntrega | null>(null);
        const [modalTrocoAberto, setModalTrocoAberto] = useState(false)
        const [troco, setTroco] = useState<number>(0)
        const [motoboy, setMotoboy] = useState<string>("")
        const [valorPagoPeloCliente, setValorPagoPeloCliente] = useState<number>(0);

        const [nomeProduto, setNomeProduto] = useState("")
        const [valorProduto, setValorProduto] = useState<number>(0)
        const [quantidadeProduto, setQuantidadeProduto] = useState<number>(1)

        const abrirModal = (pedido: PedidoEntrega) => {
            setPedidoSelecionado(pedido)
            setModalAberto(true)
        }

        const confirmarSaidaParaEntrega = () => {
            if (!pedidoSelecionado) return

            const atualizados = pedidos.map(p =>
                p.id === pedidoSelecionado.id
                    ? { ...p, status: "Saiu para entrega", troco, motoboy }
                    : p
            )

            setPedidos(atualizados)
            setModalTrocoAberto(false)
            setPedidoSelecionado(null)
            setTroco(0)
            setMotoboy("")
            setValorPagoPeloCliente(0)
        }

        const finalizarEntrega = (id: number) => {
            setPedidos(prev => prev.filter(p => p.id !== id))
            setModalAberto(false)
        }

        const [precisaDeTroco, setPrecisaDeTroco] = useState<boolean>(false)

        const abrirModalTroco = (pedido: PedidoEntrega) => {
            setPedidoSelecionado(pedido)
            setTroco(0)
            setMotoboy("")
            setValorPagoPeloCliente(0)
            setPrecisaDeTroco(false)
            setModalTrocoAberto(true)
        }

        const handleAdicionarProduto = () => {
            if (!pedidoSelecionado || !nomeProduto || valorProduto <= 0 || quantidadeProduto <= 0) 
                return
            const novoProduto: ProdutoPedido = {
                id: Date.now(),
                nome: nomeProduto,
                valor: valorProduto,
                quantidade: quantidadeProduto
            }

            const atualizados = pedidos.map(p =>
                p.id === pedidoSelecionado.id
                    ? { ...p, produtos: [...p.produtos, novoProduto] }
                    : p
            )

            setPedidos(atualizados)
            setPedidoSelecionado({
                ...pedidoSelecionado,
                produtos: [...pedidoSelecionado.produtos, novoProduto]
            })

            setNomeProduto("")
            setValorProduto(0)
            setQuantidadeProduto(1)
        }

        return (
            <>
                <h2>📦 Pedidos Para Entrega</h2>
                <S.PedidosContainer>
                    {pedidos.map((pedido) => {
                        const total = pedido.produtos.reduce((acc: number, p: { valor: number; quantidade: number }) => acc + p.valor * p.quantidade, 0);
                        return (
                            <S.PedidoCard key={pedido.id}>
                                <h3>📦 Pedido #{pedido.id} - {pedido.cliente}</h3>
                                <p><strong>Endereço:</strong> {pedido.endereco} — <strong>Status:</strong> {pedido.status} — <strong>Pago:</strong> {pedido.pago ? "Sim" : "Não"}</p>
                                {pedido.motoboy && <p><strong>Motoboy:</strong> {pedido.motoboy}</p>}
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Produto</th>
                                            <th>Valor</th>
                                            <th>Quantidade</th>
                                            <th>Valor</th>
                                            <th>Observação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedido.produtos.map((produto, i) => (
                                            <tr key={produto.id}>
                                                <td>{i + 1}</td>
                                                <td>{produto.nome}</td>
                                                <td>R$ {produto.valor.toFixed(2)}</td>
                                                <td>{produto.quantidade}</td>
                                                <td>R$ {(produto.valor * produto.quantidade).toFixed(2)}</td>
                                                <td>{produto.observacao || "—"}</td> {/* novo */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p style={{ textAlign: "right", marginTop: "0.5rem" }}>
                                    <strong>Total do Pedido:</strong> R$ {total.toFixed(2)}
                                </p>
                                {pedido.status === "Saiu para entrega" && pedido.motoboy && (
                                    <p style={{
                                        color: '#dc2626',
                                        fontWeight: 'bold',
                                        border: '1px solid red',
                                        padding: '0.25rem 0.5rem',
                                        display: 'inline-block',
                                        marginTop: '0.5rem',
                                        borderRadius: '0.375rem'
                                    }}>
                                        🚴‍♂️ Entregador: {pedido.motoboy}
                                    </p>
                                )}
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button onClick={() => abrirModal(pedido)}>Editar Pedido</button>
                                    <button onClick={() => finalizarEntrega(pedido.id)}>Cancelar Pedido</button>
                                    {pedido.status === "Saiu para entrega" && (
                                        <button onClick={() => finalizarEntrega(pedido.id)}>Finalizar Entrega</button>
                                    )}
                                    {pedido.status === "EM PREPARO" && (
                                        <button onClick={() => abrirModalTroco(pedido)}>Sair para Entrega</button>
                                    )}
                                </div>
                            </S.PedidoCard>
                        );
                    })}
                </S.PedidosContainer>
                {modalAberto && pedidoSelecionado && (
                    <S.ModalOverlay onClick={() => setModalAberto(false)}>
                        <S.ModalContent onClick={(e) => e.stopPropagation()}>
                            <h3>Editar Pedido - ID {pedidoSelecionado.id}</h3>
                            <S.AddProdutoWrapper>
                                <div className="form-row">
                                    <div className="input-group">
                                        <label>Nome do Cliente</label>
                                        <input
                                            type="text"
                                            value={pedidoSelecionado.cliente}
                                            onChange={(e) =>
                                                setPedidoSelecionado({ ...pedidoSelecionado, cliente: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Endereço</label>
                                        <input
                                            type="text"
                                            value={pedidoSelecionado.endereco}
                                            onChange={(e) =>
                                                setPedidoSelecionado({ ...pedidoSelecionado, endereco: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="input-group">
                                        <label>Status</label>
                                        <input
                                            type="text"
                                            value={pedidoSelecionado.status}
                                            onChange={(e) =>
                                                setPedidoSelecionado({ ...pedidoSelecionado, status: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Pago</label>
                                        <select
                                            value={pedidoSelecionado.pago ? "sim" : "nao"}
                                            onChange={(e) =>
                                                setPedidoSelecionado({
                                                    ...pedidoSelecionado,
                                                    pago: e.target.value === "sim",
                                                })
                                            }
                                        >
                                            <option value="sim">Sim</option>
                                            <option value="nao">Não</option>
                                        </select>
                                    </div>
                                </div>
                                <h4>Adicionar Produto</h4>
                                <div className="produto-row">
                                    <div className="input-group">
                                        <label>Nome</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Batata Frita"
                                            value={nomeProduto}
                                            onChange={(e) => setNomeProduto(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Valor (R$)</label>
                                        <input
                                            type="number"
                                            placeholder="Ex: 20.00"
                                            value={valorProduto}
                                            onChange={(e) => setValorProduto(parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Qtd.</label>
                                        <input
                                            type="number"
                                            placeholder="1"
                                            value={quantidadeProduto}
                                            onChange={(e) => setQuantidadeProduto(parseInt(e.target.value))}
                                        />
                                    </div>
                                    <button onClick={handleAdicionarProduto}>Adicionar</button>
                                </div>
                            </S.AddProdutoWrapper>
                            <div className="modal-buttons">
                                <button className="finalizar" onClick={() => finalizarEntrega(pedidoSelecionado.id)}>
                                    Finalizar Entrega
                                </button>
                                <button className="fechar" onClick={() => setModalAberto(false)}>
                                    Fechar
                                </button>
                            </div>
                        </S.ModalContent>
                    </S.ModalOverlay>
                )}
                {modalTrocoAberto && pedidoSelecionado && (
                    <S.ModalOverlay onClick={() => setModalTrocoAberto(false)}>
                        <S.ModalContent onClick={(e) => e.stopPropagation()}>
                            <h3>🛵 Saída para Entrega</h3>
                            <p><strong>Cliente:</strong> {pedidoSelecionado.cliente}</p>
                            {(() => {
                                const total = pedidoSelecionado.produtos.reduce((acc, p) => acc + p.valor * p.quantidade, 0)
                                const trocoCliente = valorPagoPeloCliente - total
                                const trocoInvalido = precisaDeTroco && trocoCliente < 0
                                return (
                                    <S.AddProdutoWrapper>
                                        <p><strong>Valor Total:</strong> R$ {total.toFixed(2)}</p>
                                        <div className="form-row">
                                            <div className="input-group">
                                                <label>Nome do Motoboy</label>
                                                <input
                                                    type="text"
                                                    value={motoboy}
                                                    onChange={(e) => setMotoboy(e.target.value)}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Precisa de troco?</label>
                                                <select
                                                    value={precisaDeTroco ? "sim" : "nao"}
                                                    onChange={(e) => setPrecisaDeTroco(e.target.value === "sim")}
                                                >
                                                    <option value="nao">Não</option>
                                                    <option value="sim">Sim</option>
                                                </select>
                                            </div>
                                        </div>
                                        {precisaDeTroco && (
                                            <>
                                                <div className="form-row">
                                                    <div className="input-group">
                                                        <label>Troco para (R$)</label>
                                                        <input
                                                            type="number"
                                                            value={valorPagoPeloCliente}
                                                            onChange={(e) => setValorPagoPeloCliente(parseFloat(e.target.value))}
                                                        />
                                                    </div>
                                                </div>
                                                <p><strong>Troco para o cliente:</strong> R$ {trocoCliente.toFixed(2)}</p>
                                                {trocoInvalido && (
                                                    <p style={{ color: 'red' }}><strong>O valor informado é menor que o total do pedido!</strong></p>
                                                )}
                                            </>
                                        )}
                                        <div className="modal-buttons">
                                            <button
                                                className="finalizar"
                                                onClick={confirmarSaidaParaEntrega}
                                                disabled={!motoboy || (precisaDeTroco && trocoInvalido)}
                                            >
                                                Confirmar Saída
                                            </button>
                                            <button className="fechar" onClick={() => setModalTrocoAberto(false)}>Cancelar</button>
                                        </div>
                                    </S.AddProdutoWrapper>
                                )
                            })()}
                        </S.ModalContent>
                    </S.ModalOverlay>
                )}
            </>
        )
    }

    export default PedidosEntrega