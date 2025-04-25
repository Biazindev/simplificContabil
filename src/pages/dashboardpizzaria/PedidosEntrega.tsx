import React, { useState, useEffect } from "react";
import * as S from "./style";

const PedidosEntrega: React.FC = () => {
    const [pedidos, setPedidos] = useState<PedidoEntrega[]>([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoEntrega | null>(null);
    const [modalTrocoAberto, setModalTrocoAberto] = useState(false);
    const [troco, setTroco] = useState<number>(0);
    const [motoboy, setMotoboy] = useState<string>("");
    const [valorPagoPeloCliente, setValorPagoPeloCliente] = useState<number>(0);
    const [nomeProduto, setNomeProduto] = useState("");
    const [valorProduto, setValorProduto] = useState<number>(0);
    const [quantidadeProduto, setQuantidadeProduto] = useState<number>(1);
    const [preco, setPreco] = useState<number>(0);

    interface ProdutoPedido {
        id: number;
        nome: string;
        precoUnitario: number;
        quantidade: number;
        observacao?: string;
    }

    interface PedidoEntrega {
        id: number;
        cliente: string;
        endereco: string;
        pago: boolean;
        produtos: ProdutoPedido[];
        status?: string;
        motoboy?: string;
    }

    const abrirModal = (pedido: PedidoEntrega) => {
        setPedidoSelecionado(pedido);
        setModalAberto(true);
    };

    const confirmarSaidaParaEntrega = () => {
        if (!pedidoSelecionado) return;
        const atualizados = pedidos.map(p =>
            p.id === pedidoSelecionado.id
                ? { ...p, status: "Saiu para entrega", troco, motoboy }
                : p
        );
        setPedidos(atualizados);
        setModalTrocoAberto(false);
        setPedidoSelecionado(null);
        setTroco(0);
        setMotoboy("");
        setValorPagoPeloCliente(0);
    };

    useEffect(() => {
        fetch("https://simplifica-contabil.onrender.com/pedidos/entrega-em-preparo")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPedidos(data);
                } else {
                    console.warn("Resposta inesperada da API:", data);
                    setPedidos([]);
                }
            })
            .catch(err => {
                console.error("Erro ao buscar pedidos em preparo:", err);
                setPedidos([]);
            });
    }, []);

    const finalizarEntrega = (id: number) => {
        setPedidos(prev => prev.filter(p => p.id !== id));
        setModalAberto(false);
    };

    const [precisaDeTroco, setPrecisaDeTroco] = useState<boolean>(false);

    const abrirModalTroco = (pedido: PedidoEntrega) => {
        setPedidoSelecionado(pedido);
        setTroco(0);
        setMotoboy("");
        setValorPagoPeloCliente(0);
        setPrecisaDeTroco(false);
        setModalTrocoAberto(true);
    };

    const handleAdicionarProduto = () => {
        if (!pedidoSelecionado || !nomeProduto || valorProduto <= 0 || quantidadeProduto <= 0) return;
        const novoProduto: ProdutoPedido = {
            id: Date.now(),
            nome: nomeProduto,
            precoUnitario: valorProduto,
            quantidade: quantidadeProduto
        };
        const atualizados = pedidos.map(p =>
            p.id === pedidoSelecionado.id
                ? { ...p, produtos: [...p.produtos, novoProduto] }
                : p
        );
        setPedidos(atualizados);
        setPedidoSelecionado({
            ...pedidoSelecionado,
            produtos: [...pedidoSelecionado.produtos, novoProduto]
        });
        setNomeProduto("");
        setValorProduto(0);
        setQuantidadeProduto(1);
    };

    const handleRemoverProduto = (produtoId: number) => {
        if (!pedidoSelecionado) return;
        const atualizados = pedidoSelecionado.produtos.filter(p => p.id !== produtoId);
        setPedidoSelecionado({ ...pedidoSelecionado, produtos: atualizados });
    };

    return (
        <>
            <h2>📦 Pedidos Para Entrega</h2>
            <S.PedidosContainer>
                {pedidos.map(pedido => {
                    const total = pedido.produtos.reduce((acc, p) => acc + p.precoUnitario * p.quantidade, 0);
                    return (
                        <S.PedidoCard key={pedido.id}>
                            <h3>📦 Pedido #{pedido.id} - {pedido.cliente}</h3>
                            <p><strong>Endereço:</strong> {pedido.endereco} — <strong>Status:</strong> {pedido.status || "—"} - <strong>Pago:</strong> {pedido.pago ? "Sim" : "Não"}</p>
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
                                        <tr key={`pedido-${pedido.id}-produto-${produto.id}-${i}`}>
                                            <td>{i + 1}</td>
                                            <td>{produto.nome}</td>
                                            <td>R$ {produto.precoUnitario.toFixed(2)}</td>
                                            <td>{produto.quantidade}</td>
                                            <td>R$ {(produto.precoUnitario * produto.quantidade).toFixed(2)}</td>
                                            <td>{produto.observacao || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p style={{ textAlign: "right", marginTop: "0.5rem" }}><strong>Total do Pedido:</strong> R$ {total.toFixed(2)}</p>
                            {pedido.status === "Saiu para entrega" && pedido.motoboy && (
                                <p style={{ color: '#dc2626', fontWeight: 'bold', border: '1px solid red', padding: '0.25rem 0.5rem', display: 'inline-block', marginTop: '0.5rem', borderRadius: '0.375rem' }}>🚴‍♂️ Entregador: {pedido.motoboy}</p>
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
                    <S.ModalContent onClick={e => e.stopPropagation()}>
                        <h3>Editar Pedido - ID {pedidoSelecionado.id}</h3>
                        <S.AddProdutoWrapper>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Nome do Cliente</label>
                                    <input type="text" value={pedidoSelecionado.cliente} onChange={e => setPedidoSelecionado({ ...pedidoSelecionado, cliente: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Endereço</label>
                                    <input type="text" value={pedidoSelecionado.endereco} onChange={e => setPedidoSelecionado({ ...pedidoSelecionado, endereco: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Status</label>
                                    <input type="text" value={pedidoSelecionado.status} onChange={e => setPedidoSelecionado({ ...pedidoSelecionado, status: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Pago</label>
                                    <select value={pedidoSelecionado.pago ? "sim" : "nao"} onChange={e => setPedidoSelecionado({ ...pedidoSelecionado, pago: e.target.value === "sim" })}>
                                        <option value="sim">Sim</option>
                                        <option value="nao">Não</option>
                                    </select>
                                </div>
                            </div>
                            <h4>Produtos</h4>
                            <table style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginBottom: "1rem",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                overflow: "hidden",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)"
                            }}>
                                <thead style={{ backgroundColor: "#f1f5f9" }}>
                                    <tr>
                                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Produto</th>
                                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Valor</th>
                                        <th style={{ padding: "0.75rem", textAlign: "center" }}>Qtd</th>
                                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Total</th>
                                        <th style={{ padding: "0.75rem", textAlign: "center" }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidoSelecionado?.produtos.map((produto, index) => (
                                        <tr key={index} style={{ borderTop: "1px solid #e2e8f0" }}>
                                            <td style={{ padding: "0.75rem" }}>{produto.nome}</td>
                                            <td style={{ padding: "0.75rem" }}>R$ {produto.precoUnitario.toFixed(2)}</td>
                                            <td style={{ padding: "0.75rem", textAlign: "center" }}>{produto.quantidade}</td>
                                            <td style={{ padding: "0.75rem", textAlign: "right" }}>R$ {(produto.precoUnitario * produto.quantidade).toFixed(2)}</td>
                                            <td style={{ padding: "0.75rem", textAlign: "center" }}>
                                                <button className="remover">Remover</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                            <h4>Adicionar Produto</h4>
                            <div className="produto-row">
                                <div className="input-group">
                                    <label>Nome</label>
                                    <input type="text" placeholder="Ex: Batata Frita" value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label>Valor (R$)</label>
                                    <input type="number" placeholder="Ex: 20.00" value={valorProduto} onChange={e => setValorProduto(parseFloat(e.target.value))} />
                                </div>
                                <div className="input-group">
                                    <label>Qtd.</label>
                                    <input type="number" placeholder="1" value={quantidadeProduto} onChange={e => setQuantidadeProduto(parseInt(e.target.value))} />
                                </div>
                                <button onClick={handleAdicionarProduto}>Adicionar</button>
                            </div>
                        </S.AddProdutoWrapper>
                        <div className="modal-buttons">
                            <button className="finalizar" onClick={() => finalizarEntrega(pedidoSelecionado.id)}>Finalizar Entrega</button>
                            <button className="fechar" onClick={() => setModalAberto(false)}>Fechar</button>
                        </div>
                    </S.ModalContent>
                </S.ModalOverlay>
            )}
        </>
    );
};

export default PedidosEntrega;