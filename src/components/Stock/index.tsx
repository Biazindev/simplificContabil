import React, { useState, useRef, useEffect } from 'react';
import * as S from './styles';
import {
  useListarFiliaisQuery,
  useGetProdutosQuery,
  useGetProdutosByNameQuery,
  useUpdateProdutoMutation,
  useDeleteProdutoMutation
} from '../../services/api';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Input } from './styles';
import { ProdutoProps } from '../../services/api';
import { string } from 'yup';
import Loader from '../Loader';

const Stock = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'codigo'>('manual');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [produtoNome, setProdutoNome] = useState('');
  const [produtoPreco, setProdutoPreco] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [editingProduto, setEditingProduto] = useState<number | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editCodigoBarras, setEditCodigoBarras] = useState('');
  const [editNcm, setEditNcm] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editPrecoUnitario, setEditPrecoUnitario] = useState('');
  const [editEan, setEditEan] = useState('');
  const [editAtivo, setEditAtivo] = useState(true);
  const [editDataVencimento, setEditDataVencimento] = useState('');
  const [editQuantidade, setEditQuantidade] = useState(0);
  const [editObservacao, setEditObservacao] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: filiais, isLoading: loadingFiliais, error: errorFiliais } = useListarFiliaisQuery();
  const { data: produtos, isLoading: loadingProdutos, error: errorProdutos, refetch } = useGetProdutosQuery();
  const { data: searchedProdutos, isLoading: loadingSearch, refetch: refetchSearch } = useGetProdutosByNameQuery(searchTerm, {
    skip: searchTerm === ''
  });
  const [updateProduto] = useUpdateProdutoMutation();
  const [deleteProduto] = useDeleteProdutoMutation();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scanning, setScanning] = useState(false);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const iniciarLeituraCodigo = async () => {
    if (!videoRef.current || !codeReader.current) return;
    setScanning(true);

    try {
      const result = await codeReader.current.decodeOnceFromVideoDevice(undefined, videoRef.current);
      const codigo = result.getText();
      setCodigoBarras(codigo);

      const produtoEncontrado = produtosParaExibir.find(p => p.codigoBarras === codigo);

      if (!produtoEncontrado) {
        setProdutoNome('');
        setProdutoPreco('');
        setMensagem('❌ Produto não encontrado.');
        return;
      }

      setProdutoNome(produtoEncontrado.nome || '');
      setProdutoPreco(produtoEncontrado.precoUnitario?.toString() || '');
      setMensagem('✅ Produto carregado com sucesso!');
    } catch (error) {
      console.error('Erro ao ler código:', error);
      setMensagem('❌ Erro ao ler o código ou buscar produto.');
    } finally {
      setScanning(false);

      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const pararLeituraCodigo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setScanning(false);
  };

  const handleBuscarProdutos = async () => {
    try {
      await refetch();
      setMensagem('✅ Produtos atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setMensagem('❌ Erro ao buscar produtos.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetchSearch();
  };

  const handleEditarProduto = (produto: ProdutoProps) => {
    setEditingProduto(produto.id);
    setEditCodigoBarras(produto.codigoBarras || '');
    setEditNcm(produto.ncm);
    setEditNome(produto.nome);
    setEditDescricao(produto.descricao);
    setEditPrecoUnitario(produto.precoUnitario.toString());
    setEditEan(produto.ean.toString());
    setEditAtivo(produto.ativo);
    setEditDataVencimento(produto.dataVencimento);
    setEditQuantidade(produto.quantidade);
    setEditObservacao(produto.observacao);
  };

  const handleCancelarEdicao = () => {
    setEditingProduto(null);
    setEditCodigoBarras('');
    setEditNcm('');
    setEditNome('');
    setEditDescricao('');
    setEditPrecoUnitario('');
    setEditEan('');
    setEditAtivo(true);
    setEditDataVencimento('');
    setEditQuantidade(0);
    setEditObservacao(null);
  };

  const handleSalvarEdicao = async (id: number) => {
    try {
      await updateProduto({
        id,
        codigoBarras: editCodigoBarras,
        ncm: editNcm,
        nome: editNome,
        descricao: editDescricao,
        precoUnitario: parseFloat(editPrecoUnitario),
        ean: Number(editEan),
        ativo: editAtivo,
        dataVencimento: editDataVencimento,
        quantidade: editQuantidade,
        observacao: editObservacao,
        mensagem: '',
        imagem: null,
      }).unwrap();

      setMensagem('✅ Produto atualizado com sucesso!');
      setEditingProduto(null);
      refetch();
      if (searchTerm) refetchSearch();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      setMensagem('❌ Erro ao atualizar produto');
    }
  };

  const handleExcluirProduto = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduto(id).unwrap();
        setMensagem('✅ Produto excluído com sucesso!');
        refetch();
        if (searchTerm) refetchSearch();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        setMensagem('❌ Erro ao excluir produto');
      }
    }
  };

  const produtosParaExibir = searchTerm ? searchedProdutos || [] : produtos || [];

  return (
    <S.Container>
      <div>
        <S.Title>Consulta de Produtos</S.Title>

        <S.Form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
          <S.ContainerSerch style={{ display: 'flex', gap: '10px' }}>
            <div>
              <S.Input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1 }}
              />
              <S.Button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  handleBuscarProdutos();
                }}
                color="#3b82f6"
              >
                Limpar Busca
              </S.Button>
            </div>
          </S.ContainerSerch>
        </S.Form>
        <S.TabContainer>
          <S.TabButton active={activeTab === 'manual'} onClick={() => setActiveTab('manual')}>Manual</S.TabButton>
          <S.TabButton active={activeTab === 'codigo'} onClick={() => setActiveTab('codigo')}>Código de Barras</S.TabButton>
        </S.TabContainer>

        {activeTab === 'manual' && (
          <div>
            {loadingProdutos || (searchTerm && loadingSearch) ? (
              <p><Loader /></p>
            ) : errorProdutos ? (
              <p>Erro ao carregar produtos</p>
            ) : (
              <div>
                <h3>{searchTerm ? `Resultados para "${searchTerm}"` : 'Lista de Produtos'}</h3>
                <S.ProdutosList>
                  {produtosParaExibir.map((produto) => (
                    <S.ProdutoItem key={produto.id}>
                      {editingProduto === produto.id ? (
                        <S.Form>
                          <div>
                            <label>Código de Barras</label>
                            <S.Input
                              type="text"
                              value={editCodigoBarras}
                              onChange={(e) => setEditCodigoBarras(e.target.value)}
                            />
                          </div>

                          <div>
                            <label>NCM</label>
                            <S.Input
                              type="text"
                              value={editNcm}
                              onChange={(e) => setEditNcm(e.target.value)}
                            />
                          </div>

                          <div>
                            <label>Nome</label>
                            <S.Input
                              type="text"
                              value={editNome}
                              onChange={(e) => setEditNome(e.target.value)}
                            />
                          </div>

                          <div>
                            <label>Descrição</label>
                            <S.Input
                              as="textarea"
                              value={editDescricao}
                              onChange={(e) => setEditDescricao(e.target.value)}
                            />
                          </div>

                          <div>
                            <label>Preço Unitário</label>
                            <S.Input
                              type="number"
                              value={editPrecoUnitario}
                              onChange={(e) => setEditPrecoUnitario(e.target.value)}
                              step="0.01"
                            />
                          </div>

                          <div>
                            <label>EAN</label>
                            <S.Input
                              type="number"
                              value={editEan}
                              onChange={(e) => setEditEan(e.target.value)}
                            />
                          </div>

                          <div>
                            <label>Ativo</label>
                            <S.Input
                              as="select"
                              value={editAtivo ? 'true' : 'false'}
                              onChange={(e) => setEditAtivo(e.target.value === 'true')}
                            >
                              <option value="true">Sim</option>
                              <option value="false">Não</option>
                            </S.Input>
                          </div>

                          <div>
                            <label>Data de Vencimento</label>
                            <S.Input
                              type="date"
                              value={editDataVencimento}
                              onChange={(e) => setEditDataVencimento(e.target.value)}
                            />
                          </div>

                          <div>
                            <label>Quantidade</label>
                            <S.Input
                              type="number"
                              value={editQuantidade}
                              onChange={(e) => setEditQuantidade(Number(e.target.value))}
                            />
                          </div>

                          <div>
                            <label>Observação</label>
                            <S.Input
                              as="textarea"
                              value={editObservacao || ''}
                              onChange={(e) => setEditObservacao(e.target.value)}
                            />
                          </div>

                          <S.ButtonGroup>
                            <S.ActionButton
                              type="button"
                              onClick={() => handleSalvarEdicao(produto.id)}
                              color="#10b981"
                            >
                              Salvar
                            </S.ActionButton>
                            <S.ActionButton
                              type="button"
                              onClick={handleCancelarEdicao}
                              color="#ef4444"
                            >
                              Cancelar
                            </S.ActionButton>
                          </S.ButtonGroup>
                        </S.Form>
                      ) : (
                        <>
                          {produto.imagem && (
                            <img
                              src={produto.imagem.startsWith("data:") ? produto.imagem : produto.imagem}
                              alt="Produto"
                              style={{ width: "100%", height: "120px", objectFit: "contain" }}
                            />
                          )}
                          <div><strong>NCM:</strong> {produto.ncm}</div>
                          <div><strong>Nome:</strong> {produto.nome}</div>
                          <div><strong>Descrição:</strong> {produto.descricao}</div>
                          <div><strong>Preço:</strong> R$ {produto.precoUnitario?.toFixed(2)}</div>
                          <div><strong>EAN:</strong> {produto.ean}</div>
                          <div><strong>Status:</strong> {produto.ativo ? 'Ativo' : 'Inativo'}</div>
                          <div><strong>Vencimento:</strong> {produto.dataVencimento}</div>
                          <div><strong>Quantidade:</strong> {produto.quantidade}</div>
                          <div><strong>Observação:</strong> {produto.observacao || 'Nenhuma'}</div>
                          <S.ButtonGroup>
                            <S.ActionButton
                              type="button"
                              onClick={() => handleEditarProduto(produto)}
                              color="#3b82f6"
                            >
                              Editar
                            </S.ActionButton>
                            <S.ActionButton
                              type="button"
                              onClick={() => handleExcluirProduto(produto.id)}
                              color="#ef4444"
                            >
                              Excluir
                            </S.ActionButton>
                          </S.ButtonGroup>
                        </>
                      )}
                    </S.ProdutoItem>
                  ))}
                </S.ProdutosList>
              </div>
            )}
          </div>
        )}

        {activeTab === 'codigo' && (
          <S.Form onSubmit={(e) => e.preventDefault()}>
            <Input
              type="text"
              placeholder="Digite o código de barras"
              value={codigoBarras}
              onChange={(e) => setCodigoBarras(e.target.value)}
              required
            />

            {!scanning ? (
              <S.Button type="button" onClick={iniciarLeituraCodigo}>
                📷 Ler código pela câmera
              </S.Button>
            ) : (
              <S.Button type="button" onClick={pararLeituraCodigo}>
                ✋ Parar leitura
              </S.Button>
            )}

            <video
              ref={videoRef}
              style={{ width: '100%', maxHeight: '300px', margin: '10px 0', display: scanning ? 'block' : 'none' }}
            />

            {codigoBarras && (
              <div>
                <h4>Informações do Produto</h4>
                {produtoNome ? (
                  <>
                    <p>Nome: {produtoNome}</p>
                    <p>Preço: R$ {produtoPreco}</p>
                  </>
                ) : (
                  <p>Nenhum produto encontrado com este código</p>
                )}
              </div>
            )}

            {mensagem && <p>{mensagem}</p>}
          </S.Form>
        )}
      </div>
    </S.Container>
  );
};

export default Stock;