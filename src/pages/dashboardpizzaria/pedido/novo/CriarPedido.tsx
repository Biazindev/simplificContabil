import { useEffect, useState, useRef } from "react";
import * as S from "./style";


interface Produto {
    id: number;
    nome: string;
    precoUnitario: number;
}

interface Mesa {
    id: number;
    numero: number;
}

interface Cliente {
    id: number;
    nome: string;
    endereco: string;
}

const CriarPedido = () => {
    const [cliente, setCliente] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [bairro, setBairro] = useState("");
    const [numeroEndereco, setNumeroEndereco] = useState("");

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

    const [produtoId, setProdutoId] = useState<number | "">("");
    const [quantidade, setQuantidade] = useState(1);
    const [observacao, setObservacao] = useState("");
    const [itens, setItens] = useState<
        { produtoId: number; nome: string; quantidade: number; valor: number; observacao: string }[]
    >([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [mesaId, setMesaId] = useState<number | "">("");
    const [precoSelecionado, setPrecoSelecionado] = useState<number>(0);
    const sugestaoRef = useRef<HTMLDivElement>(null);
    const [sessao, setSessao] = useState(() => {
        const agora = new Date();
        return agora.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).replace(",", "");
    });
    const [clienteId, setClienteId] = useState<number | null>(null);
    const [mesaNumero, setMesaNumero] = useState<number | "">("");



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sugestaoRef.current && !sugestaoRef.current.contains(event.target as Node)) {
                setMostrarSugestoes(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    useEffect(() => {
        fetch("https://simplifica-contabil.onrender.com/produtos")
            .then((res) => res.json())
            .then(setProdutos);

        fetch("https://simplifica-contabil.onrender.com/mesas/ativas")
            .then((res) => res.json())
            .then(setMesas);
    }, []);

    const buscarClientes = async (valor: string) => {
        if (valor.length < 2) return;
        try {
            const res = await fetch(`https://simplifica-contabil.onrender.com/clientes/search?valor=${encodeURIComponent(valor)}`);
            if (res.ok) {
                const data = await res.json();
                setClientes(data); // Lista de sugestões
                setMostrarSugestoes(true);
            }
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    };

    const selecionarCliente = async (cli: Cliente) => {
        setCliente(cli.nome);
        setClienteId(cli.id); 
        setMostrarSugestoes(false);

        try {
            const res = await fetch(`https://simplifica-contabil.onrender.com/clientes/buscar-endereco?nomeOuTelefone=${encodeURIComponent(cli.nome)}`);
            if (res.ok) {
                const enderecoData = await res.json();
                setLogradouro(enderecoData.logradouro || "");
                setNumeroEndereco(enderecoData.numero || "");
                setBairro(enderecoData.bairro || "");
            }
        } catch (error) {
            console.error("Erro ao buscar endereço:", error);
        }
    };

    const adicionarItem = () => {
        const produtoSelecionado = produtos.find((p) => p.id === produtoId);
        if (!produtoSelecionado) return;

        setItens([
            ...itens,
            {
                produtoId: produtoSelecionado.id,
                nome: produtoSelecionado.nome,
                quantidade,
                valor: produtoSelecionado.precoUnitario,
                observacao,
            },
        ]);

        setProdutoId("");
        setQuantidade(1);
        setObservacao("");
    };

    const total = itens.reduce((acc, item) => acc + item.quantidade * item.valor, 0);

    const salvarPedido = async () => {
        if (itens.length === 0) {
            alert("Adicione ao menos um item ao pedido.");
            return;
        }

        const payload: any = {
            pago: false,
            clienteId, 
            endereco: {
                logradouro,
                numero: numeroEndereco,
                bairro,
            },
            itens: itens.map(({ produtoId, quantidade, observacao }) => ({
                produtoId,
                quantidade,
                observacao,
            })),
        };
        
        if (mesaNumero !== "") {
            try {
                const mesaRes = await fetch(`https://simplifica-contabil.onrender.com/mesas/criar-ou-reutilizar?numero=${mesaNumero}&sessao=${encodeURIComponent(sessao)}`, {
                    method: "POST",
                });
                if (mesaRes.ok) {
                    const mesaData = await mesaRes.json();
                    payload.mesaId = mesaData.id;
                } else {
                    alert("Erro ao criar ou reutilizar a mesa.");
                    return;
                }
            } catch (err) {
                console.error("Erro ao criar mesa:", err);
                alert("Erro de conexão ao criar mesa.");
                return;
            }
        } else {
            payload.tipoEntrega = "ENTREGA";
        }

        try {
            const response = await fetch("https://simplifica-contabil.onrender.com/pedidos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Pedido salvo com sucesso!");
                setItens([]);
                setMesaNumero("");
                setCliente("");
                setLogradouro("");
                setBairro("");
                setNumeroEndereco("");
            } else {
                const erro = await response.text();
                console.error("Erro ao salvar:", erro);
                alert("Erro ao salvar pedido");
            }
        } catch (err) {
            console.error("Falha na requisição:", err);
            alert("Erro de conexão");
        }
    };

    return (
        <>
            <S.Titulo>📝 Criar Novo Pedido</S.Titulo>

            <S.AddProdutoWrapper>
                <div className="form-row">
                    <div className="input-group" style={{ position: "relative" }} ref={sugestaoRef}>
                        <label>Cliente</label>
                        <input
                            value={cliente}
                            onChange={(e) => {
                                setCliente(e.target.value);
                                buscarClientes(e.target.value);
                            }}
                            onFocus={() => cliente.length >= 2 && setMostrarSugestoes(true)}
                        />
                        {mostrarSugestoes && clientes.length > 0 && (
                            <S.Sugestoes>
                                {clientes.map((cli) => (
                                    <li
                                        key={cli.id}
                                        onClick={() => selecionarCliente(cli)}
                                    >
                                        {cli.nome}
                                    </li>
                                ))}
                            </S.Sugestoes>
                        )}
                    </div>
                    <div className="input-group">
                        <label>Rua</label>
                        <input value={logradouro} onChange={(e) => setLogradouro(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Bairro</label>
                        <input value={bairro} onChange={(e) => setBairro(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Número</label>
                        <input value={numeroEndereco} onChange={(e) => setNumeroEndereco(e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label>Número da Mesa</label>
                        <input
                            type="number"
                            value={mesaNumero === "" ? "" : mesaNumero}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                setMesaNumero(isNaN(value) ? "" : value);
                            }}
                        />
                    </div>
                    <div className="input-group">
                        <label>Sessão</label>
                        <input
                            type="text"
                            value={sessao}
                            onChange={(e) => setSessao(e.target.value)}
                            disabled
                        />
                    </div>

                </div>

                <h4>Adicionar Produto</h4>
                <div className="produto-row">
                    <div className="input-group">
                        <label>Produto</label>
                        <select
                            value={produtoId === "" ? "" : String(produtoId)}
                            onChange={(e) => {
                                const value = e.target.value;
                                setProdutoId(value === "" ? "" : Number(value));

                                // Busca o produto pelo ID e atualiza o preço
                                const produto = produtos.find(p => p.id === Number(value));
                                if (produto) {
                                    setPrecoSelecionado(produto.precoUnitario);
                                } else {
                                    setPrecoSelecionado(0);
                                }

                            }}
                        >
                            <option value="">Selecione</option>
                            {produtos.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Qtd.</label>
                        <input
                            type="number"
                            value={quantidade}
                            onChange={(e) => setQuantidade(parseInt(e.target.value))}
                        />
                    </div>
                    <div className="input-group">
                        <label>Preço (R$)</label>
                        <input
                            type="number"
                            value={precoSelecionado.toFixed(2)}
                            disabled
                        />
                    </div>

                    <div className="form-row">
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Observação</label>
                            <textarea
                                rows={2}
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                placeholder="Ex: bem passada, sem cebola..."
                            />
                        </div>
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
                            <td>{item.observacao || "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </S.Tabela>

            <p><strong>Total do Pedido:</strong> R$ {total.toFixed(2)}</p>

            <div className="modal-buttons">
                <button className="finalizar" onClick={salvarPedido}>Salvar Pedido</button>
                <button className="fechar">Cancelar</button>
            </div>
        </>
    );
};

export default CriarPedido;
