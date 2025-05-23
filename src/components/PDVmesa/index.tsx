import React, { useState, useEffect } from 'react'
import InputMask from 'react-input-mask';
import Select from 'react-select';
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { BiBarcodeReader } from "react-icons/bi";
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
    Top,
    Legend,
    ImgContainer,
    Description,
    Icon
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
    useListarMesasAbertasQuery,
    useLazyGetItensMesaQuery,
    useLazyListarPedidosQuery,
    StatusPedido,
    PedidoItem,
} from '../../services/api';
import NfContainer from '../NotaFiscal'
import VendaEntrega from '../PDVentrega';
import VendaBalcao from '../PDVbalcao';
import { ItemVenda } from '../../types';

export interface ItemMesa {
    numeroParcelas: number;
    formPagamento: number;
    preco: number;
    produtoId: number;
    nome: string;
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


export interface ProdutoSelecionado {
    produtoId: number;
    id: number;
    nome?: string;
    nomeProduto?: string;
    preco?: number;
    precoUnitario?: number;
    quantidade: number;
    formPagamento?: string;
    numeroParcelas?: number;
    totalItem?: number;
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

type MesaLocal = {
    numero: number;
    ocupada: boolean;
}


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
    const { data: mesasAbertas } = useListarMesasAbertasQuery();


    const numerosMesasAtivas = mesasAbertas?.map((mesa) => mesa.numero) ?? [];

    const [mesas, setMesas] = useState<MesaLocal[]>(
        () =>
            Array.from({ length: 20 }, (_, i) => ({
                numero: i + 1,
                ocupada: false,
            }))
    );

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
                produtoId: p.produtoId,
                nomeProduto: p.nome,
                precoUnitario: p.precoUnitario,
                quantidade: p.quantidade,
                totalItem: p.precoUnitario! * p.quantidade,
            })) as unknown as ItemVenda[]

            ,
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
                    // 1. Buscar os itens da mesa
                    const itensResponse = await getItensMesa(mesaAtual).unwrap();

                    // Mapear os itens para o formato ProdutoSelecionado
                    const produtosMapeados = itensResponse.map((item: any) => {
                        // Verifica se é do tipo ItemMesa ou ItemMesaDTO
                        const produtoId = item.produtoId;
                        const nome = item.nome || item.produto?.nome || item.nomeProduto;
                        const precoUnitario = item.precoUnitario || item.produto?.precoUnitario || item.preco || 0;
                        const preco = item.preco || precoUnitario;
                        const quantidade = item.quantidade || 1;
                        const formPagamento = item.formPagamento?.toString() || 'DINHEIRO';
                        const numeroParcelas = item.numeroParcelas || 1;

                        return {
                            produtoId,
                            id: produtoId,
                            nome,
                            precoUnitario,
                            preco,
                            quantidade,
                            formPagamento,
                            numeroParcelas,
                            totalItem: preco * quantidade
                        } as unknown as ProdutoSelecionado;
                    });

                    setProdutosSelecionados(produtosMapeados);

                    // 2. Buscar os pedidos da mesa
                    const pedidosResponse = await listarPedidos({ mesaId: mesaAtual }).unwrap();
                    const ultimoPedido = Array.isArray(pedidosResponse)
                        ? pedidosResponse.at(-1)
                        : undefined;

                    if (ultimoPedido?.cliente) {
                        if (typeof ultimoPedido.cliente === 'string') {
                            setClienteBusca(ultimoPedido.cliente);
                        } else {
                            const cliente = ultimoPedido.cliente as Cliente;
                            const documento = cliente.tipoPessoa === 'FISICA'
                                ? cliente.pessoaFisica?.cpf
                                : cliente.pessoaJuridica?.cnpj;

                            if (documento) {
                                setClienteBusca(documento);
                            }
                        }
                    }

                } catch (error) {
                    console.error('Erro ao buscar dados da mesa:', error);
                }
            }
        };

        carregarDadosMesa();
    }, [mesaAtual, getItensMesa, listarPedidos]);
    useEffect(() => {
        const carregarItensMesa = async () => {
            if (mesaAtual !== null) {
                try {
                    const itensResponse = await getItensMesa(mesaAtual).unwrap() as unknown as ItemMesa[];
                    const produtosMapeados = itensResponse.map((item) => ({
                        produtoId: item.produtoId,
                        id: item.produtoId,
                        nome: item.nome,
                        precoUnitario: item.preco,
                        quantidade: item.quantidade,
                        formPagamento: item.formPagamento.toString(),
                        numeroParcelas: item.numeroParcelas,
                    }));
                    setProdutosSelecionados(produtosSelecionados);
                } catch (error) {
                    console.error('Erro ao carregar itens da mesa:', error);
                }
            }
        };

        carregarItensMesa();
    }, [mesaAtual, getItensMesa]);


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
            salvarDadosMesaAtual();
            setMesaAtual(mesa);
        }

        try {
            // 1. Criar/reutilizar mesa
            await criarOuReutilizarMesa(mesa).unwrap();

            // 2. Buscar itens da mesa
            const itensResponse = await getItensMesa(mesa).unwrap();

            // 3. Mapear itens para o formato esperado
            const produtosMapeados = itensResponse.map((item: any) => ({
                produtoId: item.produtoId || item.id,
                id: item.produtoId || item.id,
                nome: item.nome || item.nomeProduto,
                precoUnitario: item.preco || item.precoUnitario || 0,
                quantidade: item.quantidade || 1,
                formPagamento: item.formPagamento?.toString() || 'DINHEIRO',
                numeroParcelas: item.numeroParcelas || 1,
                mensagem: '',
                descricao: '',
                ncm: '',
                EAN: '',
                CEST: '',
                unidade: 'UN',
                precoCompra: 0,
                estoqueAtual: 0
            }));

            setProdutosSelecionados(produtosMapeados);

            // 4. Buscar informações do cliente
            const pedidosResponse = await listarPedidos({ mesaId: mesa }).unwrap();
            const ultimoPedido = Array.isArray(pedidosResponse) ? pedidosResponse.at(-1) : null;

            if (ultimoPedido?.cliente) {
                if (typeof ultimoPedido.cliente === 'string') {
                    setClienteBusca(ultimoPedido.cliente);
                } else {
                    const cliente = ultimoPedido.cliente as Cliente;
                    const documento = cliente.tipoPessoa === 'FISICA'
                        ? cliente.pessoaFisica?.cpf
                        : cliente.pessoaJuridica?.cnpj;

                    if (documento) {
                        setClienteBusca(documento);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao selecionar mesa:', error);
            // Você pode adicionar tratamento de erro mais específico aqui
            // Por exemplo, mostrar uma mensagem para o usuário:
            alert('Ocorreu um erro ao selecionar a mesa. Por favor, tente novamente.');
        }
    }

    const somaProdutos = produtosSelecionados.reduce(
        (total, p) => total + (p.precoUnitario || p.precoUnitario || 0) * (p.quantidade || 1),
        0
    );


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
        const novoItem = {
            produtoId: produto.id,
            nomeProduto: produto.nome,
            precoUnitario: produto.precoUnitario,
            quantidade: 1,
            totalItem: produto.precoUnitario
        };

        setProdutosSelecionados((prev) => {
            const existente = prev.find(p => p.produtoId === produto.id);
            if (existente) {
                return prev.map(p =>
                    p.produtoId === produto.id
                        ? {
                            ...p,
                            quantidade: p.quantidade + 1,
                            totalItem: (p.precoUnitario || 0) * (p.quantidade + 1)
                        }
                        : p
                );
            } else {
                return [...prev, {
                    ...novoItem,
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.precoUnitario
                }];
            }
        });

        try {
            await adicionarPedido({
                numeroMesa: mesaAtual!,
                itens: [novoItem]
            }).unwrap();
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
            <div style={{ margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', width: '400px', padding: '3px 0 3px 0', height: '36px', backgroundColor: '#ccc', borderRadius: '24px' }}>
                    <button
                        onClick={() => setTipoAtendimento('mesa')}
                        style={{
                            width: '130px',
                            backgroundColor: tipoAtendimento === 'mesa' ? '#5f27cd' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '24px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}
                    >
                        Mesa
                    </button>
                    <button
                        onClick={() => setTipoAtendimento('balcao')}
                        style={{
                            width: '130px',
                            backgroundColor: tipoAtendimento === 'balcao' ? '#5f27cd' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '24px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}
                    >
                        Balcão
                    </button>
                    <button
                        onClick={() => setTipoAtendimento('entrega')}
                        style={{
                            backgroundColor: tipoAtendimento === 'entrega' ? '#5f27cd' : '#ccc',
                            width: '130px',
                            color: 'white',
                            border: 'none',
                            borderRadius: '24px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}
                    >
                        Entrega
                    </button>
                </div>
            </div>
            <div style={{ padding: '1rem' }}>
                <div>
                    {renderTableInfo(VendaMesa)}
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'end',
                    width: '100%',
                    margin: '0 auto'
                }}><div style={{
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '28px',
                    alignItems: 'center',
                    backgroundColor: '#ccc'
                }}>
                        <div style={{ margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'px' }}>
                            <BiBarcodeReader />
                            <span style={{
                                fontSize: '16px',
                                marginRight: '56px'
                            }}>Leitor</span>
                        </div>
                    </div>
                </div>
                {tipoAtendimento === 'entrega' && <VendaEntrega />}
                {tipoAtendimento === 'balcao' && <VendaBalcao />}
            </div>
            {tipoAtendimento === 'mesa' && (
                <>
                    <Top>
                    </Top>
                    <Container>
                        <LeftPane>
                            <div>
                                <Legend>Mesas vazias<span><div></div></span> Mesas ocupadas <span><div className='container'></div></span></Legend>
                                <div className='container'><span><GiHamburgerMenu /></span><h3>Mesas</h3></div>
                            </div>
                            <TableSelector>
                                {mesas.map((mesa) => (
                                    <button
                                        key={mesa.numero}
                                        onClick={() => handleSelecionarMesa(mesa.numero)}
                                        style={{
                                            backgroundColor:
                                                mesa.numero === mesaAtual
                                                    ? '#ccc'
                                                    : numerosMesasAtivas!.includes(mesa.numero)
                                                        ? '#b33939'
                                                        : '#218c74',
                                        }}
                                    >
                                        {mesa.numero}
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
                                          id:{produto.id || produto.produtoId} {produto.nome || produto.nome} - R$ {(produto.precoUnitario || produto.precoUnitario || 0).toFixed(2)}
                                            x {produto.quantidade}
                                            = R$ {((produto.precoUnitario || produto.precoUnitario || 0) * produto.quantidade!).toFixed(2)}
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
                            <PdvButton onClick={limparEstado}>Limpar mesa</PdvButton>
                        </LeftPane>

                        <RightPane>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h2><span></span>Catálogos de produtos</h2>
                                <HiMiniMagnifyingGlass style={{ color: '#ccc', fontSize: '28px', position: 'relative', left: '140px', top: '15px' }} />
                                <div style={{ width: '300px' }}>
                                    <Input
                                        style={{ textAlign: 'right' }}
                                        type="text"
                                        placeholder="Buscar produto"
                                        value={produtoBusca}
                                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setProdutoBusca(e.target.value)}
                                    />
                                </div>

                            </div>
                            <div>
                                {isLoading && <p>Carregando produtos...</p>}
                                {Boolean(error) && <p>Erro ao carregar produtos.</p>}

                                {!isLoading && !error && (
                                    <ProductList>
                                        {produtos
                                            .filter((produto: ProdutoProps) =>
                                                produto.nome.toLowerCase().includes(produtoBusca.toLowerCase())
                                            )
                                            .map((produto: ProdutoProps) => (
                                                <div onClick={() => handleAdicionarProduto(produto)}>
                                                    <ImgContainer>
                                                        <span><img src="https://picsum.photos/seed/produto123/100" alt="produtos" /></span>
                                                    </ImgContainer>
                                                    <span>
                                                        {produto.nome}
                                                    </span>
                                                    <Description>
                                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dicta, porro optio sed quia alias </p>
                                                    </Description>
                                                    <span>R$ {produto.precoUnitario.toFixed(2)}{' '}</span>
                                                    <Icon><span>+</span></Icon>
                                                </div>
                                            ))}
                                    </ProductList>
                                )}
                            </div>
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
