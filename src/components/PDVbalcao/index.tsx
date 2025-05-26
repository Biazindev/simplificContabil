import React, { useState, useEffect } from 'react'
import InputMask from 'react-input-mask';
import Select from 'react-select';
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import {
    Container,
    LeftPane,
    ProductList,
    RightPane,
    PdvButton,
    Input,
    Top,
    ImgContainer,
    Description,
    Icon
} from '../PDVmesa/styles';
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
import VendaEntrega from '../PDVentrega';
import { VendaData, Pagamento } from '../PDVmesa';


const VendaBalcao: React.FC = () => {
    const [showNf, setShowNf] = useState(false);
    const [showEnt, setShowEnt] = useState(false);
    const [clienteBusca, setClienteBusca] = useState('');
    const [produtoBusca, setProdutoBusca] = useState('');
    const [addVenda, { isLoading: enviandoVenda, error: erroVenda }] = useAddVendaMutation();
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [selectedValuePag, setSelectedValuePag] = useState<string | null>(null);
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
                precoUnitario: parseFloat(p.precoUnitario.toString().replace(',', '.')),
                quantidade: p.quantidade,
                totalItem: parseFloat(p.precoUnitario.toString().replace(',', '.')) * p.quantidade,
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
        (total, p) =>
            total + (parseFloat(p.precoUnitario?.toString().replace(',', '.') || '0') * p.quantidade),
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


    const handleFinalizarVenda = async () => {
        if (produtosSelecionados.length === 0) {
            alert('Adicione pelo menos um produto antes de finalizar a venda.');
            return;
        }

        if (!clienteBusca && !clienteEncontrado?.id) {
            alert('Informe o telefone ou selecione um cliente.');
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
            console.log('payload final enviado:', JSON.stringify(payload, null, 2));
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
    }

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
                itens: [{ produtoId: produto.id, quantidade: 1 }]
            }).unwrap();
        } catch (err) {
            console.error('Erro ao adicionar produto:');
        }
    }

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

    const limparEstado = () => {
        setClienteBusca('');
        setProdutosSelecionados([]);
    }

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
            <div style={{ padding: '1rem' }}>
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
                                    {produtosSelecionados.map((produto, index) => {
                                        const preco = parseFloat(produto.precoUnitario.toString().replace(',', '.')) || 0;
                                        const quantidade = produto.quantidade || 0;
                                        const total = preco * quantidade;

                                        return (
                                            <li key={index}>
                                                {produto.nome} - R$ {preco.toFixed(2)} x {quantidade} = R$ {total.toFixed(2)}
                                            </li>
                                        );
                                    })}
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
                                <HiMiniMagnifyingGlass style={{ color: '#ccc', fontSize: '28px', position: 'relative', left: '240px', top: '15px' }} />
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
                                                        {produto.imagem && (
                                                            <img src={`data:image/webp;base64,${produto.imagem}`} alt="Preview" />
                                                        )}
                                                    </ImgContainer>
                                                    <span>
                                                        {produto.nome}
                                                    </span>
                                                    <Description>
                                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dicta, porro optio sed quia alias </p>
                                                    </Description>
                                                    <span>
                                                        R${' '}
                                                        {parseFloat(produto.precoUnitario.toString().replace(',', '.') || '0').toFixed(2)}{' '}
                                                    </span>
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
        </>
    );
}

export default VendaBalcao;
