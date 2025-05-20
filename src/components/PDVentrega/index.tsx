import React, { useEffect, useState } from 'react'
import {
    ClienteProps, useAddVendaMutation,
    useAdicionarPedidoMutation,
    useGetProdutosQuery,
    useLazyGetClientesByPhoneQuery,
    useSairParaEntregaMutation
} from '../../services/api'
import { ProdutoProps } from '../../services/api'

import plus from '../../assets/image/plus.svg'

import {
    LeftPane,
    ProductList,
    RightPane,
    PdvButton,
    Input,
    Container,
    Top,
    Title
} from '../PDVmesa/styles'

interface EnderecoEntrega {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
    estado: string;
    complemento: string;
}

interface ProdutoSelecionado {
    produtoId: string | number;
    quantidade: number;
}

type StatusPedido = 'EM_PREPARO' | 'FINALIZADO' | 'CANCELADO';

interface PedidoPayload {
    cliente_id: string | number | null;
    fone: string | null;
    enderecoEntrega: EnderecoEntrega;
    pago: boolean;
    observacao: string;
    nomeMotoboy: string;
    precisaTroco: boolean;
    trocoPara: number;
    produtos: ProdutoSelecionado[];
    status: StatusPedido;
}

const VendaEntrega: React.FC = ({ }) => {
    const [addVenda, { isLoading: enviandoVenda, error: erroVenda }] = useAddVendaMutation();
    const [clienteBusca, setClienteBusca] = useState('');
    const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([]);
    const [showNf, setShowNf] = useState(false);
    const [showEnt, setShowEnt] = useState(false);
    const [mesaAtual, setMesaAtual] = useState<number | null>(null);
    const [produtoBusca, setProdutoBusca] = useState('');
    const [setClienteEncontrado] = useState<ClienteProps | null>(null);
    const [dadosEntrega, setDadosEntrega] = useState<{ clienteBusca: string; produtosSelecionados: ProdutoSelecionado[] } | null>(null);
    const [bloqueado, setBloqueado] = React.useState(false);
    const [sairParaEntrega] = useSairParaEntregaMutation();
    const [adicionarPedido] = useAdicionarPedidoMutation();
    const [tipoAtendimento, setTipoAtendimento] = useState<'mesa' | 'entrega' | 'balcao'>('mesa');
    const { data: produtos = [], isLoading, error } = useGetProdutosQuery();
    const [buscarCliente, { data: clienteEncontrado, isFetching: buscandoCliente, error: erroCliente }] = useLazyGetClientesByPhoneQuery();

    type ProdutoSelecionado = ProdutoProps & { quantidade: number };

    const somaProdutos = produtosSelecionados.reduce(
        (total, p) => total + p.precoUnitario * p.quantidade,
        0
    )

    const limparEstado = () => {
        setClienteBusca('');
        setProdutosSelecionados([]);
    };


    const agora = new Date().toISOString().slice(0, 16);
    useEffect(() => {
        const clienteSalvo = localStorage.getItem('clienteBusca');
        const produtosSalvos = localStorage.getItem('produtosSelecionados');

        if (clienteSalvo) setClienteBusca(clienteSalvo);
        if (produtosSalvos) setProdutosSelecionados(JSON.parse(produtosSalvos));
    }, []);

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
        const clienteSalvo = localStorage.getItem('clienteBusca');
        const produtosSalvos = localStorage.getItem('produtosSelecionados');

        if (clienteSalvo) setClienteBusca(clienteSalvo);
        if (produtosSalvos) setProdutosSelecionados(JSON.parse(produtosSalvos));
    }, [])

    const handleFinalizarVenda = async () => {
        if (produtosSelecionados.length === 0) {
            alert('Adicione pelo menos um produto antes de finalizar a venda.');
            return;
        }

        if (!clienteBusca && !clienteEncontrado?.id) {
            alert('Informe o telefone ou selecione um cliente.');
            return;
        }

        const payload: PedidoPayload = {
            cliente_id: clienteEncontrado?.id || null,
            fone: clienteBusca || null,
            enderecoEntrega: {
                rua: 'Rua Exemplo',
                numero: '123',
                bairro: 'Centro',
                cidade: 'Cidade Teste',
                cep: '00000-000',
                estado: 'SP',
                complemento: 'Casa',
            },
            pago: true,
            observacao: 'Entrega urgente',
            nomeMotoboy: 'João',
            precisaTroco: true,
            trocoPara: 100,
            produtos: produtosSelecionados.map((p) => ({
                produtoId: p.id,
                quantidade: p.quantidade,
            })),
            status: 'EM_PREPARO',
        };

        try {
            // Cria o pedido e obtém o ID
            const response = await addVenda(payload).unwrap();
            if (response.id !== undefined) {
                const pedidoId = response.id;
                await sairParaEntrega(pedidoId).unwrap();
            } else {
                alert('Erro: Pedido não retornou um ID válido');
            }


            alert('Pedido de entrega enviado com sucesso!');

            // Limpa os campos do formulário
            setClienteBusca('');
            setProdutosSelecionados([]);
        } catch (error) {
            console.error('Erro ao criar ou enviar o pedido para entrega:', error);
            alert('Erro ao enviar o pedido para entrega.');
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
            // Como não há mesa, essa parte pode ser removida ou adaptada se tiver lógica de acompanhamento:
            // await adicionarPedido({ ... });

            console.log('Produto adicionado com sucesso');
        } catch (err) {
            console.error('Erro ao adicionar produto:', err);
        }
    }


    return (
        <>
            <Top>
                <Title>Entregas</Title>
            </Top>
            <Container>
                <LeftPane>
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

                    <PdvButton onClick={limparEstado}>Limpar Pedido</PdvButton>
                </LeftPane>

                <RightPane>
                    <Input
                        type="text"
                        placeholder="Buscar produto"
                        value={produtoBusca}
                        onChange={(e: { target: { value: React.SetStateAction<string> } }) => setProdutoBusca(e.target.value)}
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
    )
}


export default VendaEntrega