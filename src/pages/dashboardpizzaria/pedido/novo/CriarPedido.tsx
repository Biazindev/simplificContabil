import React, { useState } from "react";
import * as S from "./style";

const CriarPedido = () => {
    const [cliente, setCliente] = useState("");
    const [endereco, setEndereco] = useState("");
    const [produto, setProduto] = useState("");
    const [quantidade, setQuantidade] = useState(1);
    const [itens, setItens] = useState<{ nome: string, quantidade: number, valor: number }[]>([]);

    const produtosMock = [
        { nome: "Pizza Calabresa", valor: 65 },
        { nome: "Coca-Cola 2L", valor: 10 }
    ];

    const [observacao, setObservacao] = useState("");


    const adicionarItem = () => {
        const produtoSelecionado = produtosMock.find(p => p.nome === produto);
        if (!produtoSelecionado) return;

        setItens([...itens, { nome: produto, quantidade, valor: produtoSelecionado.valor }]);
        setProduto("");
        setQuantidade(1);
    };

    const total = itens.reduce((acc, item) => acc + item.quantidade * item.valor, 0);

    return (
        <>
            <S.Titulo>📝 Criar Novo Pedido</S.Titulo>

            <S.AddProdutoWrapper>
                <div className="form-row">
                    <div className="input-group">
                        <label>Cliente </label>
                        <input value={cliente} onChange={(e) => setCliente(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Endereço </label>
                        <input value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                    </div>
                </div>

                <h4>Adicionar Produto</h4>
                <div className="produto-row">
                    <div className="input-group">
                        <label>Produto</label>
                        <select value={produto} onChange={(e) => setProduto(e.target.value)}>
                            <option value="">Selecione</option>
                            {produtosMock.map((p) => (
                                <option key={p.nome} value={p.nome}>{p.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Observação</label>
                            <textarea
                                rows={2}
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                placeholder="Ex: cachorro quente bem prensado, sem cebola..."
                            />
                        </div>
                    </div>


                    <div className="input-group">
                        <label>Qtd.</label>
                        <input type="number" value={quantidade} onChange={(e) => setQuantidade(parseInt(e.target.value))} />
                    </div>

                    <button onClick={adicionarItem}>Adicionar</button>
                </div>
            </S.AddProdutoWrapper>

            <S.Tabela>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Qtd</th>
                        <th>Valor</th>
                        <th>Total</th>
                        <th>Observação</th>
                    </tr>
                </thead>
                <tbody>
                    {itens.map((item, i) => (
                        <tr key={i}>
                            <td>{item.nome}</td>
                            <td>{item.quantidade}</td>
                            <td>R$ {item.valor.toFixed(2)}</td>
                            <td>R$ {(item.quantidade * item.valor).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </S.Tabela>

            <p><strong>Total do Pedido:</strong> R$ {total.toFixed(2)}</p>

            <div className="modal-buttons">
                <button className="finalizar">Salvar Pedido</button>
                <button className="fechar">Cancelar</button>
            </div>
        </>
    );
};

export default CriarPedido;
