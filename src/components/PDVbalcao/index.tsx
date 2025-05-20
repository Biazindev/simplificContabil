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
    Title,
    Top
} from '../PDVmesa/styles'

const VendaBalcao: React.FC = () => {
    const [addVenda, { isLoading: enviandoVenda, error: erroVenda }] = useAddVendaMutation();
    const [clienteBusca, setClienteBusca] = useState('');
    const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([]);
    const [produtoBusca, setProdutoBusca] = useState('');
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
            alert('Venda realizada com sucesso!');

            setClienteBusca('');
            setProdutosSelecionados([]);
        } catch (error) {
            alert('Erro ao cadastrar venda.');
            console.error(error);
        }
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
                <Title>Vendas Balcão</Title>
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


export default VendaBalcao