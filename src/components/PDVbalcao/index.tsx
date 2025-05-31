import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import InputMask from 'react-input-mask';
import Select from 'react-select';
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
    Icon,
    OrderList,
    TotaisContainer,
    ClienteInfoContainer,
    NameProduct,
} from '../PDVmesa/styles';
import {
    ProdutoProps,
    useGetProdutosQuery,
    useLazyGetClientesByPhoneQuery,
    useAddVendaMutation,
    ClienteProps,
    useAdicionarPedidoMutation,
    useEnviarParaEntregaMutation,
    Endereco,
} from '../../services/api';
import { ItemVenda } from '../../types';
import { SwitchContainer, ToggleSwitch, Slider } from './styles';

type StatusPedido = 'EM_PREPARO' | 'SAIU_PARA_ENTREGA' | 'ENTREGUE' | 'CANCELADO';

interface EntregaData {
    pedidoId: number;
    cliente_id?: number | null;
    fone: string;
    enderecoEntrega: Endereco;
    observacao?: string;
    nomeMotoboy?: string;
    precisaTroco?: boolean;
    trocoPara?: number;
    status?: 'EM_PREPARO' | 'SAIU_PARA_ENTREGA' | 'ENTREGUE' | 'CANCELADO';
}

export type VendaData = {
    emitirNotaFiscal?: boolean;
    vendaAnonima?: boolean;
    documentoCliente?: string | null;
    cliente?: any | null;
    emitenteId?: number | null;
    modelo?: string | null;
    itens?: ItemVenda[];
    pagamento?: Pagamento;
    dataVenda?: string;
    status?: string;
};

export interface PedidoItem {
    produto: {
        id?: number;
    };
    quantidade: number;
    observacao?: string;
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
    id?: number;
    nome?: string;
    nomeProduto?: string;
    preco?: string;
    precoUnitario?: string;
    quantidade: number;
    formPagamento?: string;
    numeroParcelas?: number;
    totalItem?: string;
}

export type Pagamento = {
    formaPagamento: string;
    valorPago: string;
    valorRestante: string;
    dataPagamento: string;
    status: string;
    numeroParcelas: number;
    totalVenda: string;
    totalDesconto: string;
    totalPagamento: string;
};

const VendaBalcao: React.FC = () => {
    const [showNf, setShowNf] = useState(false);
    const [clienteBusca, setClienteBusca] = useState('');
    const [produtoBusca, setProdutoBusca] = useState('');
    const [addVenda, { isLoading: enviandoVenda }] = useAddVendaMutation();
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [selectedValuePag, setSelectedValuePag] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [enviarParaEntrega] = useEnviarParaEntregaMutation();

    const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([]);
    const [adicionarPedido] = useAdicionarPedidoMutation();
    const [tipoAtendimento] = useState<'mesa' | 'entrega' | 'balcao'>('mesa');
    const [mostrarFormEntrega, setMostrarFormEntrega] = useState(false);
    const [pedidoId, setPedidoId] = useState<number | null>(null);
    const [entregaData, setEntregaData] = useState<EntregaData>({
        pedidoId: 0,
        fone: '',
        enderecoEntrega: {
            logradouro: '',
            numero: '',
            bairro: '',
            municipio: '',
            uf: '',
            cep: ''
        },
        observacao: '',
        nomeMotoboy: '',
        precisaTroco: false,
        trocoPara: 0,
        status: 'EM_PREPARO'
    });
    const { data: produtos = [], isLoading, error } = useGetProdutosQuery();
    const [buscarCliente, { data: clienteEncontrado, isFetching: buscandoCliente, error: erroCliente }] =
        useLazyGetClientesByPhoneQuery();
    const [totalDesconto, setTotalDesconto] = useState('0,00');

    const handleEnviarParaEntrega = async () => {
        console.log('Botão clicado');
        if (!pedidoId) return;

        try {
            console.log('Enviando dados:', entregaData);
            const dadosEnvio = {
                ...entregaData,
                status: entregaData.status || 'EM_PREPARO' as const
            };

            await enviarParaEntrega(dadosEnvio).unwrap();
            alert('Pedido enviado para entrega com sucesso!');
            setMostrarFormEntrega(false);
            setProdutosSelecionados([]);
            setClienteBusca('');
        } catch (error) {
            console.error('Erro ao enviar:', error);
            alert('Erro ao enviar pedido para entrega.');
        }
    };

    const sanitizeNumber = (value: string | number) => {
        if (typeof value === 'string') {
            return parseFloat(value.replace(',', '.'));
        }
        return value;
    };

    const parsePreco = (preco: string | number): number => {
        if (typeof preco === 'number') {
            return preco;
        }
        return Number(preco.replace(',', '.').replace(/[^\d.-]/g, '')) || 0;
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const formatarApenasNumeros = (valor: string) => valor.replace(/\D/g, '');

    const formatPreco = (valor: number): string => {
        return valor.toFixed(2).replace('.', ',');
    };

    const formatPrecoBackend = (valor: number): string => {
        return valor.toFixed(2);
    };

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
            documentoCliente: clienteEncontrado?.documento || '',
            cliente: showNf ? clienteEncontrado : null,
            emitenteId: showNf ? 1 : null,
            modelo: showNf ? 'NFE' : null,
            itens: produtosSelecionados.map((p) => ({
                produtoId: p.produtoId,
                nomeProduto: p.nome,
                precoUnitario: sanitizeNumber(p.precoUnitario || '0'),
                quantidade: p.quantidade,
                totalItem: sanitizeNumber(p.totalItem || '0'),
            })),
            pagamento: {
                formaPagamento: selectedValuePag || 'DINHEIRO',
                valorPago: formatPrecoBackend(sanitizeNumber(somaProdutos)),
                valorRestante: formatPrecoBackend(0),
                dataPagamento: agora,
                status: 'PAGO',
                numeroParcelas: Number(selectedValue) || 1,
                totalVenda: formatPrecoBackend(sanitizeNumber(somaProdutos)),
                totalDesconto: formatPrecoBackend(sanitizeNumber(totalDesconto)),
                totalPagamento: formatPrecoBackend(sanitizeNumber(somaProdutos)),
            },
            dataVenda: agora,
            status: 'EM_PREPARO',
            vendaAnonima: !clienteEncontrado,
        };
    };

    const pagamento: Pagamento = {
        formaPagamento: '',
        valorPago: '0,00',
        valorRestante: '0,00',
        dataPagamento: '',
        status: '',
        numeroParcelas: 0,
        totalVenda: '0,00',
        totalDesconto: '0,00',
        totalPagamento: '0,00',
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (clienteBusca.trim().length >= 3) {
                buscarCliente(clienteBusca);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [clienteBusca, buscarCliente]);

    const somaProdutos = produtosSelecionados.reduce((total, p) => {
        const preco = sanitizeNumber(p.precoUnitario || '0');
        const quantidade = sanitizeNumber(p.quantidade || 1);
        return total + preco * quantidade;
    }, 0);

    const handleFinalizarVenda = async () => {
        const payload = gerarPayloadVenda(
            clienteEncontrado ?? null,
            produtosSelecionados,
            pagamento,
            somaProdutos,
            showNf,
        );
        try {
            const response = await addVenda(payload).unwrap();

            // 1. Corrigindo o tipo do pedidoId
            setPedidoId(response.id ?? null);

            // 2. Solução para o endereco (mantendo a interface original)
            const enderecoCliente = clienteEncontrado?.endereco
                ? [clienteEncontrado.endereco] // Converte para array
                : [];

            setEntregaData({
                ...entregaData,
                pedidoId: response.id ?? 0, // Fallback para 0 se undefined
                cliente_id: clienteEncontrado?.id || null,
                fone: clienteBusca,
                enderecoEntrega: enderecoCliente[0] || { // Pega o primeiro item do array
                    logradouro: '',
                    numero: '',
                    bairro: '',
                    municipio: '',
                    uf: '',
                    cep: ''
                }
            });

            setMostrarFormEntrega(true);
        } catch (error) {
            alert('Erro ao finalizar venda.');
        }
    }
    const handleRemoverProduto = (indexToRemove: number) => {
        setProdutosSelecionados((prev) => prev.filter((_, i) => i !== indexToRemove));
    };

    const handleAdicionarProduto = async (produto: ProdutoProps) => {
        const precoUnitario = sanitizeNumber(produto.precoUnitario);
        const quantidade = 1;
        const totalItem = precoUnitario * quantidade;

        const novoItem: ProdutoSelecionado = {
            id: produto.id,
            produtoId: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            precoUnitario: precoUnitario.toFixed(2),
            quantidade,
            totalItem: totalItem.toFixed(2),
        };

        setProdutosSelecionados((prev) => {
            const existente = prev.find(p => p.produtoId === produto.id);

            if (existente) {
                const novaQuantidade = existente.quantidade + 1;
                const preco = sanitizeNumber(existente.precoUnitario ?? "0");
                const novoTotal = preco * novaQuantidade;

                return prev.map(p =>
                    p.produtoId === produto.id
                        ? {
                            ...p,
                            precoUnitario: precoUnitario.toFixed(2),
                            quantidade: novaQuantidade,
                            totalItem: novoTotal.toFixed(2),
                        }
                        : p
                );
            }

            return [...prev, novoItem];
        });

        try {
            await adicionarPedido({
                itens: [{
                    produtoId: produto.id,
                    quantidade: 1,
                    observacao: "",
                }],
            }).unwrap();
        } catch (err) {
            console.error('Erro ao adicionar pedido:', err);
        }
    };

    const opcoesPagamento = [
        { value: 'PIX', label: 'Pix' },
        { value: 'DINHEIRO', label: 'Dinheiro' },
        { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
        { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
        { value: 'PARCELADO_LOJA', label: 'Parcelado Loja' },
        { value: 'CARTAO', label: 'Cartão Genérico' }
    ];

    const parcelas = [
        { value: '1', label: '1x' },
        { value: '2', label: '2x' },
        { value: '3', label: '3x' },
        { value: '4', label: '4x' },
        { value: '5', label: '5x' },
        { value: '6', label: '6x' }
    ];

    const descontoNumerico = parsePreco(totalDesconto);
    const totalComDesconto = somaProdutos - (isNaN(descontoNumerico) ? 0 : descontoNumerico);

    const formatarTelefone = (telefone: string) => {
        if (!telefone) return '';
        const numeros = telefone.replace(/\D/g, '');
        if (numeros.length === 11) {
            return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
        }
        return telefone;
    };

    const formatarCpf = (cpf: string) => {
        if (!cpf) return '';
        const numeros = cpf.replace(/\D/g, '');
        if (numeros.length === 11) {
            return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
        }
        return cpf;
    };

    const limitarTexto = (texto: string, limite: number = 17): string => {
        return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
    };

    const limitar = (texto: string, limite: number = 30): string => {
        return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
    };

    return (
        <>
            <div style={{ margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            </div>
            <div style={{ padding: '1rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'end',
                    width: '100%',
                    margin: '0 auto'
                }}>
                    <div style={{
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        fontSize: '28px',
                        alignItems: 'center',
                        backgroundColor: '#ccc'
                    }}>
                    </div>
                </div>
            </div>
            <>
                <Top></Top>
                <Container>
                    <LeftPane>
                        <div>
                            <InputMask
                                mask="(99) 99999-9999"
                                value={clienteBusca}
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
                                    <ClienteInfoContainer>
                                        <div className="info">
                                            <p><strong>Nome:</strong> {clienteEncontrado?.pessoaFisica?.nome}</p>
                                            <p><strong>CPF:</strong> {formatarCpf(clienteEncontrado?.pessoaFisica?.cpf || '')}</p>
                                            <p><strong>Telefone:</strong> {formatarTelefone(clienteEncontrado?.pessoaFisica?.telefone || '')}</p>
                                        </div>

                                        <div className="pagamento">
                                            <div>
                                                <label>Forma de Pagamento</label>
                                                <Select
                                                    options={opcoesPagamento}
                                                    value={opcoesPagamento.find(op => op.value === selectedValuePag)}
                                                    onChange={option => setSelectedValuePag(option ? option.value : null)}
                                                    placeholder="Selecione uma forma de pagamento"
                                                />
                                            </div>

                                            <div>
                                                <label>Parcelamento</label>
                                                <Select
                                                    options={parcelas}
                                                    value={parcelas.find(op => op.value === selectedValue)}
                                                    onChange={option => setSelectedValue(option ? option.value : null)}
                                                    placeholder="Selecione parcelamento"
                                                />
                                            </div>

                                            <div>
                                                <label>Desconto</label>
                                                <Input
                                                    type="text"
                                                    value={totalDesconto}
                                                    placeholder="Valor desconto"
                                                    onChange={e => setTotalDesconto(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </ClienteInfoContainer>
                                ) : (
                                    <p>Nenhum cliente encontrado.</p>
                                )
                            )}
                        </div>
                        <Link to={'/cadastro-clientes'}>
                            <PdvButton>Cadastrar Cliente</PdvButton>
                        </Link>
                        <OrderList>
                            <h4>Produtos Selecionados:</h4>
                            <ul>
                                {produtosSelecionados.map((produto, index) => {
                                    const id = produto.id ?? produto.produtoId ?? 'N/A';
                                    const nome = produto.nome ?? 'Sem nome';
                                    const preco = produto.precoUnitario ?? '0';
                                    const quantidade = produto.quantidade ?? 0;
                                    const total = formatPreco(parsePreco(preco) * quantidade);

                                    return (
                                        <li key={index}>
                                            <div className="produto-info">
                                                <div><strong>{nome}</strong></div>
                                                <span>ID: {id}</span>
                                                <div>
                                                    R$ {Number(parsePreco(preco)).toFixed(2)} x {quantidade}<strong>
                                                    </strong>
                                                </div>
                                            </div>
                                            <button title='remover' className="remover" onClick={() => handleRemoverProduto(index)}>×</button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </OrderList>
                        <TotaisContainer>
                            <div className="linha">
                                <strong>Total:</strong> <span>R$ {somaProdutos.toFixed(2)}</span>
                            </div>
                            <div className="linha">
                                <strong>Desconto:</strong> <span>R$ {descontoNumerico.toFixed(2)}</span>
                            </div>
                            <div className="linha total-com-desconto">
                                <strong>Total com desconto:</strong> <span>R$ {totalComDesconto.toFixed(2)}</span>
                            </div>
                        </TotaisContainer>
                        <PdvButton onClick={handleFinalizarVenda} disabled={enviandoVenda}>
                            {enviandoVenda ? 'Enviando...' : 'Finalizar Venda'}
                        </PdvButton>
                    </LeftPane>
                    <RightPane>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h2><span></span>Catálogos de produtos</h2>
                            <HiMiniMagnifyingGlass style={{ color: '#ccc', fontSize: '28px', position: 'relative', left: '140px', top: '15px' }} />
                            <div style={{ width: '300px' }}>
                                <Input
                                    ref={inputRef}
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
                                            <div key={produto.id} onClick={() => handleAdicionarProduto(produto)}>
                                                <ImgContainer>
                                                    {produto.imagem && (
                                                        <img
                                                            src={produto.imagem.startsWith("data:") ? produto.imagem : produto.imagem}
                                                            alt="Produto"
                                                            style={{ width: "100%", height: "120px", objectFit: "contain" }}
                                                        />
                                                    )}
                                                </ImgContainer>
                                                <NameProduct>
                                                    {limitarTexto(produto.nome)}
                                                </NameProduct>
                                                <Description>
                                                    <div>
                                                        <p>{limitar(produto.descricao ?? '')}</p>
                                                    </div>
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
                {mostrarFormEntrega && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '8px',
                            width: '90%',
                            maxWidth: '800px',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 1001,
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                paddingBottom: '1rem',
                                marginBottom: '1rem',
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'white',
                                zIndex: 1
                            }}>
                                <h2 style={{ margin: 0 }}>Informações de Entrega</h2>
                            </div>
                            <div style={{
                                overflowY: 'auto',
                                flex: 1,
                                paddingRight: '0.5rem',
                                marginRight: '-0.5rem'
                            }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label>Endereço Completo:</label>
                                    <Input
                                        value={entregaData.enderecoEntrega.logradouro}
                                        onChange={(e) => setEntregaData({
                                            ...entregaData,
                                            enderecoEntrega: {
                                                ...entregaData.enderecoEntrega,
                                                logradouro: e.target.value
                                            }
                                        })}
                                        placeholder="Rua, Avenida, etc."
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label>Número:</label>
                                        <Input
                                            value={entregaData.enderecoEntrega.numero}
                                            onChange={(e) => setEntregaData({
                                                ...entregaData,
                                                enderecoEntrega: {
                                                    ...entregaData.enderecoEntrega,
                                                    numero: e.target.value
                                                }
                                            })}
                                            placeholder="Nº"
                                        />
                                    </div>
                                    <div style={{ flex: 2 }}>
                                        <label>Bairro:</label>
                                        <Input
                                            value={entregaData.enderecoEntrega.bairro}
                                            onChange={(e) => setEntregaData({
                                                ...entregaData,
                                                enderecoEntrega: {
                                                    ...entregaData.enderecoEntrega,
                                                    bairro: e.target.value
                                                }
                                            })}
                                            placeholder="Bairro"
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ flex: 2 }}>
                                        <label>Cidade:</label>
                                        <Input
                                            value={entregaData.enderecoEntrega.municipio}
                                            onChange={(e) => setEntregaData({
                                                ...entregaData,
                                                enderecoEntrega: {
                                                    ...entregaData.enderecoEntrega,
                                                    municipio: e.target.value
                                                }
                                            })}
                                            placeholder="Cidade"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label>Estado:</label>
                                        <Input
                                            value={entregaData.enderecoEntrega.uf}
                                            onChange={(e) => setEntregaData({
                                                ...entregaData,
                                                enderecoEntrega: {
                                                    ...entregaData.enderecoEntrega,
                                                    uf: e.target.value
                                                }
                                            })}
                                            placeholder="UF"
                                            maxLength={2}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label>CEP:</label>
                                    <InputMask
                                        mask="99999-999"
                                        value={entregaData.enderecoEntrega.cep}
                                        onChange={(e) => setEntregaData({
                                            ...entregaData,
                                            enderecoEntrega: {
                                                ...entregaData.enderecoEntrega,
                                                cep: e.target.value
                                            }
                                        })}
                                    >
                                        {(inputProps: any) => (
                                            <Input
                                                {...inputProps}
                                                placeholder="CEP"
                                            />
                                        )}
                                    </InputMask>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label>Telefone:</label>
                                    <InputMask
                                        mask="(99) 99999-9999"
                                        value={entregaData.fone}
                                        onChange={(e) => setEntregaData({
                                            ...entregaData,
                                            fone: e.target.value
                                        })}
                                    >
                                        {(inputProps: any) => (
                                            <Input
                                                {...inputProps}
                                                placeholder="Telefone para contato"
                                            />
                                        )}
                                    </InputMask>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label>Observações:</label>
                                    <Input
                                        value={entregaData.observacao || ''}
                                        onChange={(e) => setEntregaData({
                                            ...entregaData,
                                            observacao: e.target.value
                                        })}
                                        placeholder="Alguma informação adicional?"
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label>Nome do Entregador:</label>
                                    <Input
                                        value={entregaData.nomeMotoboy || ''}
                                        onChange={(e) => setEntregaData({
                                            ...entregaData,
                                            nomeMotoboy: e.target.value
                                        })}
                                        placeholder="Quem vai entregar?"
                                    />
                                </div>

                                <SwitchContainer>
                                    <label>Precisa de troco?</label>
                                    <ToggleSwitch>
                                        <input
                                            type="checkbox"
                                            checked={entregaData.precisaTroco || false}
                                            onChange={(e) => setEntregaData({
                                                ...entregaData,
                                                precisaTroco: e.target.checked
                                            })}
                                        />
                                        <Slider />
                                    </ToggleSwitch>
                                </SwitchContainer>

                                {entregaData.precisaTroco && (
                                    <div style={{ marginBottom: '2rem' }}>
                                        <label>Troco para:</label>
                                        <Input
                                            type="number"
                                            value={entregaData.trocoPara || ''}
                                            onChange={(e) => setEntregaData({
                                                ...entregaData,
                                                trocoPara: Number(e.target.value)
                                            })}
                                            placeholder="Ex: 50.00"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Rodapé Fixo */}
                            <div style={{
                                paddingTop: '1rem',
                                marginTop: '1rem',
                                position: 'sticky',
                                bottom: 0,
                                backgroundColor: 'white',
                                zIndex: 1
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '1rem'
                                }}>
                                    <PdvButton
                                        onClick={() => setMostrarFormEntrega(false)}
                                        style={{ background: '#ccc', color: '#333' }}
                                    >
                                        Cancelar
                                    </PdvButton>
                                    <PdvButton
                                        onClick={handleEnviarParaEntrega}
                                        disabled={!entregaData.enderecoEntrega.logradouro}
                                    >
                                        Confirmar Entrega
                                    </PdvButton>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </>
    );
};

export default VendaBalcao;