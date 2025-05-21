import React, { useState, useEffect } from 'react'
import InputMask from 'react-input-mask';
import Select from 'react-select';
import {
    Container,
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
    useGetItensMesaQuery,
    useLazyGetItensMesaQuery,
    useLazyListarPedidosQuery,
} from '../../services/api';
import NfContainer from '../NotaFiscal'
import plus from '../../assets/image/plus.svg'
import VendaEntrega from '../PDVentrega';
import VendaBalcao from '../PDVbalcao';

export interface ItemMesa {
  produto: {
    id: number;
    nome: string;
    precoUnitario: number;
  };
  quantidade: number;
}

export interface ClientePessoaFisica {
  cpf: string;
}

export interface ClientePessoaJuridica {
  cnpj: string;
}

export interface Cliente {
  tipoPessoa: 'FISICA' | 'JURIDICA';
  pessoaFisica?: ClientePessoaFisica;
  pessoaJuridica?: ClientePessoaJuridica;
}

export interface Pedido {
  cliente: Cliente;
}

export interface ProdutoSelecionado {
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
  formPagamento: string;
  numeroParcelas: number;
}


type Pagamento = {
    formaPagamento: string;
    valorPago: number;
    valorRestante: number;
    dataPagamento: string;
    status: string;
    numeroParcelas: number;
    totalVenda: number;
    totalDesconto: number;
    totalPagamento: number;
};

const VendaMesa: React.FC = () => {
    const [showNf, setShowNf] = useState(false);
    const [showEnt, setShowEnt] = useState(false);
    const [mesaAtual, setMesaAtual] = useState<number | null>(null);
    const [clienteBusca, setClienteBusca] = useState('');
    const [produtoBusca, setProdutoBusca] = useState('');
    const [vendasPorMesa, setVendasPorMesa] = useState<Record<number, VendaData>>({});
    const [addVenda, { isLoading: enviandoVenda, error: erroVenda }] = useAddVendaMutation();
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [selectedValuePag, setSelectedValuePag] = useState<string | null>(null);

    const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([]);
    const [dadosEntrega, setDadosEntrega] = useState<{ clienteBusca: string; produtosSelecionados: ProdutoSelecionado[] } | null>(null);
    const [addPedidoEntrega, { isLoading: enviandoPedido }] = useFinalizarMesaMutation();
    const [bloqueado, setBloqueado] = React.useState(false);
    const [criarOuReutilizarMesa] = useCriarOuReutilizarMesaMutation();
    const [adicionarPedido] = useAdicionarPedidoMutation();
    const [tipoAtendimento, setTipoAtendimento] = useState<'mesa' | 'entrega' | 'balcao'>('mesa');
    const [sairParaEntrega] = useSairParaEntregaMutation()
    const [getItensMesa] = useLazyGetItensMesaQuery();
    const [listarPedidos] = useLazyListarPedidosQuery();

    type ProdutoSelecionado = ProdutoProps & { quantidade: number };


    type VendaData = {
        emitirNotaFiscal: boolean;
        vendaAnonima: boolean;
        documentoCliente: string | null;
        cliente: any | null;
        emitenteId: number | null;
        modelo: string | null;
        itens: ItemVenda[];
        pagamento: Pagamento;
        dataVenda: string;
        status: string;
        clienteBusca?: string;
        produtosSelecionados?: ProdutoSelecionado[];
    };

    const formatarApenasNumeros = (valor: string) => valor.replace(/\D/g, '');

    const gerarPayloadVenda = (
        clienteEncontrado: ClienteProps | null,
        produtosSelecionados: ProdutoSelecionado[],
        pagamento: Pagamento,
        somaProdutos: number,
        showNf: boolean,
    ): VendaData => {
        const agora = new Date().toISOString();

        return {
            emitirNotaFiscal: showNf,
            vendaAnonima: !clienteEncontrado,
            documentoCliente: clienteEncontrado?.documento || null,
            cliente: clienteEncontrado?.nome || null,
            emitenteId: 1,
            modelo: 'NFE',
            itens: produtosSelecionados.map((p) => ({
                produtoId: p.id,
                nomeProduto: p.nome,
                precoUnitario: p.precoUnitario,
                quantidade: p.quantidade,
                totalItem: p.precoUnitario * p.quantidade,
            })),
            pagamento: {
                formaPagamento: selectedValuePag || 'DINHEIRO',
                valorPago: somaProdutos,
                valorRestante: 0.00,
                dataPagamento: agora,
                status: 'PAGO',
                numeroParcelas: Number(selectedValue) || 1,
                totalVenda: somaProdutos,
                totalDesconto: totalComDesconto,
                totalPagamento: somaProdutos,
            },
            dataVenda: agora,
            status: 'EM_PREPARO',
        };
    };

    const pagamento: Pagamento = {
        formaPagamento: '',
        valorPago: 0,
        valorRestante: 0,
        dataPagamento: '',
        status: '',
        numeroParcelas: 0,
        totalVenda: 0,
        totalDesconto: 0,
        totalPagamento: 0,
    }

    const { data: produtos = [], isLoading, error } = useGetProdutosQuery();
    const [buscarCliente, { data: clienteEncontrado, isFetching: buscandoCliente, error: erroCliente }] =
        useLazyGetClientesByPhoneQuery();
    const [totalDesconto, setTotalDesconto] = React.useState(pagamento?.totalDesconto || '');



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
        if (mesaAtual !== null) {
            const dadosMesa = vendasPorMesa[mesaAtual];
            setClienteBusca(dadosMesa?.clienteBusca || '');
            setProdutosSelecionados(dadosMesa?.produtosSelecionados || []);
        }
    }, [mesaAtual, vendasPorMesa]);

    useEffect(() => {
    const carregarDadosMesa = async () => {
        if (mesaAtual !== null) {
            try {
                // 1. Buscar os itens da mesa tipados
                const itensResponse: ItemMesa[] = await getItensMesa(mesaAtual).unwrap();

                const produtosMapeados: ProdutoSelecionado[] = itensResponse.map((item) => ({
                    produtoId: item.produto.id,
                    nome: item.produto.nome,
                    preco: item.produto.precoUnitario,
                    quantidade: item.quantidade,
                    formPagamento: pagamento.formaPagamento,
                    numeroParcelas: pagamento.numeroParcelas,
                }));

                setProdutosSelecionados(produtosMapeados);

                // 2. Buscar os pedidos da mesa tipados
                const pedidosResponse: Pedido[] = await listarPedidos({ mesaId: mesaAtual }).unwrap();
                const ultimoPedido = pedidosResponse.at(-1);

                const clienteCpf =
                    ultimoPedido?.cliente?.pessoaFisica?.cpf ||
                    ultimoPedido?.cliente?.pessoaJuridica?.cnpj;

                if (clienteCpf) {
                    setClienteBusca(clienteCpf);
                }

            } catch (error) {
                console.error('Erro ao buscar dados da mesa:', error);
            }
        }
    };

    carregarDadosMesa();
}, [mesaAtual]);


    useEffect(() => {
        if (clienteEncontrado) {
            localStorage.setItem('clienteEncontrado', JSON.stringify(clienteEncontrado));
            console.log('📦 clienteBusca salvo no localStorage:', clienteBusca);
        }
    }, [clienteEncontrado]);

    useEffect(() => {
        localStorage.setItem('clienteBusca', clienteBusca);
    }, [clienteBusca]);

    useEffect(() => {
        localStorage.setItem('produtosSelecionados', JSON.stringify(produtosSelecionados));
        console.log('📦 produtosSelecionados salvos no localStorage:', produtos);
    }, [produtosSelecionados]);

    useEffect(() => {
        const clienteSalvo = localStorage.getItem('clienteBusca');
        const produtosSalvos = localStorage.getItem('produtosSelecionados');

        console.log('📥 clienteBusca recuperado do localStorage:', clienteSalvo);
        console.log('📥 produtosSelecionados recuperados do localStorage:', produtosSalvos);
        if (clienteSalvo) setClienteBusca(clienteSalvo);
        if (produtosSalvos) setProdutosSelecionados(JSON.parse(produtosSalvos));
    }, []);

    const mesas = Array.from({ length: 24 }, (_, i) => i + 1);

    const salvarDadosMesaAtual = () => {
        if (mesaAtual !== null) {
            const payload = gerarPayloadVenda(
                clienteEncontrado ?? null,
                produtosSelecionados,
                pagamento,
                somaProdutos,
                showNf
            );

            setVendasPorMesa((prev) => ({
                ...prev,
                [mesaAtual]: {
                    ...payload,
                    clienteBusca,
                    produtosSelecionados,
                },
            }));
        }
    };

    const handleSelecionarMesa = async (mesa: number) => {
        if (mesa !== mesaAtual) {
            salvarDadosMesaAtual(); // salvar antes de mudar a mesa
            setTimeout(() => setMesaAtual(mesa), 0); // deferir update da mesa para garantir ordem
        }

        try {
            await criarOuReutilizarMesa(mesa).unwrap();
        } catch (error) {
            console.error(`Erro ao criar mesa ${mesa}:`, error);
        }
    };



    const handleFinalizarVenda = async () => {
        if (mesaAtual === null) {
            alert('Selecione uma mesa antes de finalizar a venda.');
            return;
        }

        const payload = gerarPayloadVenda(
            clienteEncontrado ?? null,
            produtosSelecionados,
            pagamento,
            somaProdutos,
            showNf,
        )
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
        }
    };

    // const limparEstado = () => {
    //     setVendasPorMesa((prev) => {
    //         const copy = { ...prev };
    //         if (mesaAtual !== null) {
    //             delete copy[mesaAtual];
    //         }
    //         return copy;
    //     });
    //     setClienteBusca('');
    //     setProdutosSelecionados([]);
    //     setMesaAtual(null);
    // };


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

        } catch (err) {
            console.error('Erro ao adicionar pedido:');
        }
    };

    const renderTableInfo = (orderData: any) => {
        if (orderData?.type === 'mesa' && orderData?.table?.tableNumber) {
            return <h3>Mesa {orderData.table.tableNumber}</h3>;
        }
        return null;
    };

    const opcoesPagamento = [
        { value: 'PIX', label: 'Pix' },
        { value: 'DINHEIRO', label: 'Dinheiro' },
        { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
        { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
        { value: 'PARCELADO_LOJA', label: 'Parcelado Loja' },
        { value: 'CARTAO', label: 'Cartão Genérico' }
    ]

    const parcelas = [
        { value: '1', label: '1x' },
        { value: '2', label: '2x' },
        { value: '3', label: '3x' },
        { value: '4', label: '4x' },
        { value: '5', label: '5x' },
        { value: '6', label: '6x' }
    ]

    let descontoNumerico = 0;

    if (typeof totalDesconto === 'string') {
        descontoNumerico = parseFloat(totalDesconto.replace(',', '.')) || 0;
    } else {
        descontoNumerico = totalDesconto;
    }

    const totalComDesconto = somaProdutos - (isNaN(descontoNumerico) ? 0 : descontoNumerico);

    const formatarTelefone = (telefone: string) => {
        if (!telefone) return '';
        const numeros = telefone.replace(/\D/g, '');
        if (numeros.length === 11) {
            return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
        }
        return telefone;
    }

    const formatarCpf = (cpf: string) => {
        if (!cpf) return '';
        const numeros = cpf.replace(/\D/g, '');
        if (numeros.length === 11) {
            return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
        }
        return cpf;
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
            <div style={{ padding: '1rem' }}>
                <div>
                    {renderTableInfo(VendaMesa)}
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
                                <InputMask
                                    mask="(99) 99999-9999"
                                    value={(clienteBusca)}
                                    onChange={(e) => setClienteBusca(formatarApenasNumeros(e.target.value))}
                                >
                                    {(inputProps: any) => (
                                        <Input
                                            {...inputProps}
                                            type="text"
                                            placeholder="Buscar cliente por telefone"
                                        />
                                    )}
                                </InputMask>
                                {buscandoCliente && <p>Buscando cliente...</p>}
                                {Boolean(erroCliente) && <p>Erro ao buscar cliente.</p>}

                                {clienteBusca.trim().length >= 3 && !buscandoCliente && (
                                    clienteEncontrado ? (
                                        <>
                                            <div>
                                                <p>{clienteEncontrado?.pessoaFisica?.nome}</p>
                                            </div>
                                            <div>
                                                <p>{formatarCpf(clienteEncontrado?.pessoaFisica?.cpf || '')}</p>
                                            </div>
                                            <div>
                                                <p>{formatarTelefone(clienteEncontrado?.pessoaFisica?.telefone || '')}</p>
                                                <div>
                                                    <Select
                                                        options={opcoesPagamento}
                                                        value={opcoesPagamento.find(op => op.value === selectedValue)}
                                                        onChange={option => setSelectedValuePag(option ? option.value : null)}
                                                        placeholder="Selecione uma forma de pagamento"
                                                    />
                                                </div>
                                                <div>
                                                    <Select
                                                        options={parcelas}
                                                        value={opcoesPagamento.find(op => op.value === selectedValue)}
                                                        onChange={option => setSelectedValue(option ? option.value : null)}
                                                        placeholder="Selecione parcelamento"
                                                    />

                                                </div>
                                                <div>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={totalDesconto}
                                                        placeholder="Valor desconto"
                                                        onChange={e => setTotalDesconto(e.target.value)}
                                                    />

                                                </div>
                                            </div>
                                        </>
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
                                <strong>Total:</strong> R$ {somaProdutos.toFixed(2)}
                            </div>
                            <div>
                                <strong>Desconto:</strong> R$ {(isNaN(descontoNumerico) ? 0 : descontoNumerico).toFixed(2)}
                            </div>
                            <div>
                                <strong>Total com desconto:</strong> R$ {totalComDesconto.toFixed(2)}
                            </div>
                            <PdvButton onClick={handleFinalizarVenda} disabled={enviandoVenda}>
                                {enviandoVenda ? 'Enviando...' : 'Finalizar Venda'}
                            </PdvButton>
                            {/* <PdvButton onClick={limparEstado}>Limpar mesa</PdvButton> */}
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
