import React, { useState, useEffect } from 'react';
import { Container, 
    LeftPane, 
    ProductList, 
    RightPane, 
    TableSelector, 
    PdvButton, 
    Wrapper, 
    SwitchContainer, 
    ToggleSwitch, 
    Slider, 
    Input, 
    Title,
    Top
} from './styles';
import {
    ProdutoProps,
    useGetProdutosQuery,
    useLazyGetClientesByPhoneQuery,
    useAddVendaMutation,
    useCriarOuReutilizarMesaMutation,
    ClienteProps,
    useFinalizarMesaMutation,
    useAdicionarPedidoMutation,
    useSairParaEntregaMutation,
} from '../../services/api';
import NfContainer from '../NotaFiscal'
import plus from '../../assets/image/plus.svg'
import VendaEntrega from '../PDVentrega';
import VendaBalcao from '../PDVbalcao';

type VendaData = {
    clienteBusca: string;
    produtosSelecionados: ProdutoProps[];
};

const VendaMesa: React.FC = () => {
    const [showNf, setShowNf] = useState(false);
    const [showEnt, setShowEnt] = useState(false);
    const [mesaAtual, setMesaAtual] = useState<number | null>(null);
    const [clienteBusca, setClienteBusca] = useState('');
    const [produtoBusca, setProdutoBusca] = useState('');
    const [vendasPorMesa, setVendasPorMesa] = useState<Record<number, VendaData>>({});
    const [addVenda, { isLoading: enviandoVenda, error: erroVenda }] = useAddVendaMutation();

    const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([]);
    const [setClienteEncontrado] = useState<ClienteProps | null>(null);
    const [dadosEntrega, setDadosEntrega] = useState<{ clienteBusca: string; produtosSelecionados: ProdutoSelecionado[] } | null>(null);
    const [addPedidoEntrega, { isLoading: enviandoPedido }] = useFinalizarMesaMutation();
    const [bloqueado, setBloqueado] = React.useState(false);
    const [criarOuReutilizarMesa] = useCriarOuReutilizarMesaMutation();
    const [adicionarPedido] = useAdicionarPedidoMutation();
    const [tipoAtendimento, setTipoAtendimento] = useState<'mesa' | 'entrega' | 'balcao'>('mesa');
    const [sairParaEntrega] = useSairParaEntregaMutation()

    type ProdutoSelecionado = ProdutoProps & { quantidade: number };

    const { data: produtos = [], isLoading, error } = useGetProdutosQuery();
    const [buscarCliente, { data: clienteEncontrado, isFetching: buscandoCliente, error: erroCliente }] =
        useLazyGetClientesByPhoneQuery();


    const somaProdutos = produtosSelecionados.reduce(
        (total, p) => total + p.precoUnitario * p.quantidade,
        0
    );
    useEffect(() => {
        adicionarPedido
        const delayDebounce = setTimeout(() => {
            if (clienteBusca.trim().length >= 3) {
                buscarCliente(clienteBusca);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [clienteBusca, buscarCliente]);

    useEffect(() => {
        if (showEnt) {
            const clienteSalvo = localStorage.getItem('clienteBusca');
            const produtosSalvos = localStorage.getItem('produtosSelecionados');

            if (clienteSalvo && produtosSalvos) {
                setDadosEntrega({
                    clienteBusca: clienteSalvo,
                    produtosSelecionados: JSON.parse(produtosSalvos),
                });
            }
        }
    }, [showEnt]);

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
    useEffect(() => {
        const clienteSalvo = localStorage.getItem('clienteBusca');
        const produtosSalvos = localStorage.getItem('produtosSelecionados');

        if (clienteSalvo) setClienteBusca(clienteSalvo);
        if (produtosSalvos) setProdutosSelecionados(JSON.parse(produtosSalvos));
    }, []);

    const mesas = Array.from({ length: 20 }, (_, i) => i + 1);

    const handleSelecionarMesa = async (mesa: number) => {
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

        try {
            await criarOuReutilizarMesa(mesa).unwrap();
            console.log(`Mesa ${mesa} registrada como aberta.`);
        } catch (error) {
            console.error(`Erro ao criar mesa ${mesa}:`, error);
        }
    }

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

            // NÃO limpar o estado, comentado:
            // setVendasPorMesa((prev) => {
            //     const copy = { ...prev };
            //     delete copy[mesaAtual];
            //     return copy;
            // });
            // setClienteBusca('');
            // setProdutosSelecionados([]);
            // setMesaAtual(null);
        } catch (error) {
            alert('Erro ao finalizar venda.');
            console.error(error);
        }
    };

    const limparEstado = () => {
        setVendasPorMesa((prev) => {
            const copy = { ...prev };
            if (mesaAtual !== null) {
                delete copy[mesaAtual];
            }
            return copy;
        });
        setClienteBusca('');
        setProdutosSelecionados([]);
        setMesaAtual(null);
    };


    const handleAdicionarProduto = async (produto: ProdutoProps) => {
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

        try {
            await adicionarPedido({
                numeroMesa: mesaAtual!,
                itens: [{ produtoId: produto.id, quantidade: 1 }]
            }).unwrap();

            console.log('Pedido adicionado com sucesso');
        } catch (err) {
            console.error('Erro ao adicionar pedido:', err);
        }
    };

    const renderTableInfo = (orderData: any) => {
        if (orderData?.type === 'mesa' && orderData?.table?.tableNumber) {
            return <h3>Mesa {orderData.table.tableNumber}</h3>;
        }
        return null;
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <button
                    onClick={() => setTipoAtendimento('mesa')}
                    style={{
                        margin: '0 10px',
                        padding: '10px 20px',
                        backgroundColor: tipoAtendimento === 'mesa' ? '#007bff' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                >
                    Mesa
                </button>
                <button
                    onClick={() => setTipoAtendimento('balcao')}
                    style={{
                        margin: '0 10px',
                        padding: '10px 20px',
                        backgroundColor: tipoAtendimento === 'balcao' ? '#007bff' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                >
                    Balcão
                </button>
                <button
                    onClick={() => setTipoAtendimento('entrega')}
                    style={{
                        margin: '0 10px',
                        padding: '10px 20px',
                        backgroundColor: tipoAtendimento === 'entrega' ? '#007bff' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                >
                    Entrega
                </button>
            </div>

            {/* Conteúdo abaixo da navbar */}
            <div style={{ padding: '1rem' }}>
                <div>
                    {renderTableInfo(VendaMesa)}
                    {/* Sua lógica de venda por mesa aqui */}
                </div>
                {tipoAtendimento === 'entrega' && <VendaEntrega />}
                {tipoAtendimento === 'balcao' && <VendaBalcao />}
            </div>
            {tipoAtendimento === 'mesa' && (
                <>
                    <Top>
                        <Title>Venda por Mesa</Title>
                    </Top>
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
                                <Input
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
                            <PdvButton onClick={limparEstado}>Limpar mesa</PdvButton>
                        </LeftPane>

                        <RightPane>
                            <Input
                                type="text"
                                placeholder="Buscar produto"
                                value={produtoBusca}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setProdutoBusca(e.target.value)}
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
                                            <div key={produto.id} onClick={() => handleAdicionarProduto(produto)}>
                                                {produto.nome} - R$ {produto.precoUnitario.toFixed(2)}{' '}
                                                <span>
                                                    <img src={plus} alt="Adicionar" style={{ width: 20, height: 20 }} />
                                                </span>
                                            </div>
                                        ))}
                            </ProductList>
                        </RightPane>
                    </Container>
                </>
            )}
            <Wrapper>
                <SwitchContainer>
                    <span>Emitir Nota Fiscal</span>
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
            {showNf && <NfContainer />}
        </>
    );
}

export default VendaMesa;
