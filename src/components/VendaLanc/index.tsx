import React, { useState, useEffect } from 'react';
import { Container, LeftPane, ProductList, RightPane, TableSelector, PdvButton, Wrapper, SwitchContainer, ToggleSwitch, Slider  } from './styles';
import {
    ProdutoProps,
    useGetProdutosQuery,
    useLazyGetClientesByPhoneQuery,
    useAddVendaMutation,
    ClienteProps
} from '../../services/api';
import NfContainer from '../NotaFiscal';

type VendaData = {
    clienteBusca: string;
    produtosSelecionados: ProdutoProps[];
};

const VendaLanc: React.FC = () => {
    const [showNf, setShowNf] = useState(false);
    const [mesaAtual, setMesaAtual] = useState<number | null>(null);
    const [clienteBusca, setClienteBusca] = useState('');
    const [produtoBusca, setProdutoBusca] = useState('');
    const [vendasPorMesa, setVendasPorMesa] = useState<Record<number, VendaData>>({});
    const [addVenda, { isLoading: enviandoVenda, error: erroVenda }] = useAddVendaMutation();
    type ProdutoSelecionado = ProdutoProps & { quantidade: number };
    const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([]);
    const [setClienteEncontrado] = useState<ClienteProps | null>(null);




    const { data: produtos = [], isLoading, error } = useGetProdutosQuery();
    const [buscarCliente, { data: clienteEncontrado, isFetching: buscandoCliente, error: erroCliente }] =
        useLazyGetClientesByPhoneQuery();


    const somaProdutos = produtosSelecionados.reduce(
        (total, p) => total + p.precoUnitario * p.quantidade,
        0
    );
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (clienteBusca.trim().length >= 3) {
                buscarCliente(clienteBusca);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [clienteBusca, buscarCliente]);

    useEffect(() => {
        if (clienteEncontrado) {
            localStorage.setItem('clienteEncontrado', JSON.stringify(clienteEncontrado));
        }
    }, [clienteEncontrado]);

    useEffect(() => {
        localStorage.setItem('clienteBusca', clienteBusca);
    }, [clienteBusca]);

    useEffect(() => {
        localStorage.setItem('produtosSelecionados', JSON.stringify(produtosSelecionados));
    }, [produtosSelecionados]);

    const agora = new Date().toISOString().slice(0, 16);
    // Restaura dados do localStorage ao montar o componente
    useEffect(() => {
        const clienteSalvo = localStorage.getItem('clienteBusca');
        const produtosSalvos = localStorage.getItem('produtosSelecionados');

        if (clienteSalvo) setClienteBusca(clienteSalvo);
        if (produtosSalvos) setProdutosSelecionados(JSON.parse(produtosSalvos));
    }, []);

    const mesas = Array.from({ length: 20 }, (_, i) => i + 1);

    const handleSelecionarMesa = (mesa: number) => {
        if (mesaAtual !== null) {
            setVendasPorMesa((prev) => ({
                ...prev,
                [mesaAtual]: {
                    clienteBusca,
                    produtosSelecionados
                }
            }));
        }

        const dadosMesa = vendasPorMesa[mesa];
        setClienteBusca(dadosMesa?.clienteBusca || '');
        setProdutosSelecionados(dadosMesa?.produtosSelecionados || []);
        setMesaAtual(mesa);
    };

    const handleFinalizarVenda = async () => {
        if (mesaAtual === null) {
            alert('Selecione uma mesa antes de finalizar a venda.');
            return;
        }

        const vendaAtual = vendasPorMesa[mesaAtual] || {
            clienteBusca,
            produtosSelecionados,
        };

        const payload = {
            emitirNotaFiscal: false,
            vendaAnonima: true,
            documentoCliente: null,
            cliente: null,
            emitenteId: null,
            modelo: null,
            itens: produtosSelecionados.map((p) => ({
                produtoId: p.id,
                nomeProduto: p.nome,
                precoUnitario: p.precoUnitario,
                quantidade: p.quantidade,
                totalItem: p.precoUnitario * p.quantidade,
            })),
            pagamento: {
                formaPagamento: 'DINHEIRO',
                valorPago: somaProdutos,
                valorRestante: 0.00,
                dataPagamento: agora,
                status: 'PAGO',
                numeroParcelas: 1,
                totalVenda: somaProdutos,
                totalDesconto: 0.00,
                totalPagamento: somaProdutos,
            },
            dataVenda: agora,
            status: 'CONCLUIDO',
        };

        try {
            await addVenda(payload).unwrap();
            alert('Venda finalizada com sucesso!');
            // Limpar estado da mesa após enviar
            setVendasPorMesa((prev) => {
                const copy = { ...prev };
                delete copy[mesaAtual];
                return copy;
            });
            setClienteBusca('');
            setProdutosSelecionados([]);
            setMesaAtual(null);
        } catch (error) {
            alert('Erro ao finalizar venda.');
            console.error(error);
        }
    };

    const handleAdicionarProduto = (produto: ProdutoProps) => {
        setProdutosSelecionados((prev) => {
            const existente = prev.find(p => p.id === produto.id);
            if (existente) {
                return prev.map(p =>
                    p.id === produto.id ? { ...p, quantidade: p.quantidade + 1 } : p
                );
            } else {
                return [...prev, { ...produto, quantidade: 1 }];
            }
        });
    };


    return (
        <>
        <Container>
            <LeftPane>
                <TableSelector>
                    {mesas.map((mesa) => (
                        <button
                            key={mesa}
                            onClick={() => handleSelecionarMesa(mesa)}
                            style={{ backgroundColor: mesa === mesaAtual ? '#ccc' : undefined }}
                        >
                            Mesa {mesa}
                        </button>
                    ))}
                </TableSelector>

                <div>
                    <input
                        type="text"
                        placeholder="Buscar cliente por telefone"
                        value={clienteBusca}
                        onChange={(e) => setClienteBusca(e.target.value)}
                    />
                    {buscandoCliente && <p>Buscando cliente...</p>}
                    {Boolean(erroCliente) && <p>Erro ao buscar cliente.</p>}

                    {clienteBusca.trim().length >= 3 && !buscandoCliente && (
                        clienteEncontrado ? (
                            <p>
                                Cliente: <strong>{clienteEncontrado.pessoaFisica?.nome}</strong> (CPF: {clienteEncontrado.pessoaFisica?.cpf})
                            </p>
                        ) : (
                            <p>Nenhum cliente encontrado.</p>
                        )
                    )}
                </div>

                <PdvButton onClick={() => alert('Cadastrar cliente')}>Cadastrar Cliente</PdvButton>

                <div>
                    <h4>Produtos Selecionados:</h4>
                    <ul>
                        {produtosSelecionados.map((produto, index) => (
                            <li key={index}>
                                {produto.nome} - R$ {produto.precoUnitario.toFixed(2)} x {produto.quantidade} = R$ {(produto.precoUnitario * produto.quantidade).toFixed(2)}
                            </li>
                        ))}
                    </ul>

                </div>

                <div>
                    <strong>Total: R$ {somaProdutos.toFixed(2)}</strong>
                </div>
                <PdvButton onClick={handleFinalizarVenda} disabled={enviandoVenda}>
                    {enviandoVenda ? 'Enviando...' : 'Finalizar Venda'}
                </PdvButton>
            </LeftPane>

            <RightPane>
                <input
                    type="text"
                    placeholder="Buscar produto"
                    value={produtoBusca}
                    onChange={(e) => setProdutoBusca(e.target.value)}
                />

                <ProductList>
                    {isLoading && <p>Carregando produtos...</p>}
                    {Boolean(error) && <p>Erro ao carregar produtos.</p>}
                    {!isLoading &&
                        !error &&
                        produtos
                            .filter((produto: ProdutoProps) =>
                                produto.nome.toLowerCase().includes(produtoBusca.toLowerCase())
                            )
                            .map((produto: ProdutoProps) => (
                                <div key={produto.id}>
                                    {produto.nome} - R$ {produto.precoUnitario.toFixed(2)}{' '}
                                    <button onClick={() => handleAdicionarProduto(produto)}>Adicionar</button>
                                </div>
                            ))}
                </ProductList>
            </RightPane>
            <Wrapper>
                <SwitchContainer>
                    <span>Nota Fiscal</span>
                    <ToggleSwitch>
                        <input
                            type="checkbox"
                            checked={showNf}
                            onChange={() => setShowNf((prev) => !prev)}
                        />
                        <Slider />
                    </ToggleSwitch>
                </SwitchContainer>
            </Wrapper>
        </Container>
        {showNf && <NfContainer />}
        </>
    );
};

export default VendaLanc;
