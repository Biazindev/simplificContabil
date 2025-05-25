import { useState, useEffect, useRef } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser';
import {
  useAddProdutoMutation,
  useDeleteProdutoMutation,
  useGetProdutosByNameQuery,
  useImportarProdutosXmlMutation,
  useListarFiliaisQuery
} from '../../services/api'

import { FaArrowRight } from "react-icons/fa"
import * as S from './styles'
import { Input } from '../../styles'
import { useNavigate } from 'react-router-dom'
import ImagePreview from '../Utils/img'

const parseCurrency = (value: string): number => {
  return Number(value.replace(/\./g, '').replace(',', '.')) || 0
}

type ProdutoProps = {
  id: number
  nome: string
  descricao: string
  precoUnitario: number
  ean: number
  ncm: string
  dataVencimento: string
  ativo: boolean
  quantidade: number
  observacao?: string | null
  imagem: string | null;
}



const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { data: produtosFiltrados } = useGetProdutosByNameQuery(searchTerm, {
    skip: searchTerm.length === 0
  })

  const [postProduto] = useAddProdutoMutation()
  const [deleteProduto] = useDeleteProdutoMutation()
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoProps[]>([])
  const [quantidadesTemp, setQuantidadesTemp] = useState<Record<number, number>>({})
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [activeTab, setActiveTab] = useState<'manual' | 'xml' | 'codigo'>('manual');
  const [filialId, setFilialId] = useState<number | null>(null);
  const [codigoBarras, setCodigoBarras] = useState('');
  const [produtoNome, setProdutoNome] = useState('');
  const [produtoPreco, setProdutoPreco] = useState('');
  const [mensagem, setMensagem] = useState('');

  const { data: filiais, isLoading: loadingFiliais, error: errorFiliais } = useListarFiliaisQuery();

  const [importarXml, { isLoading: loadingImport }] = useImportarProdutosXmlMutation();

  const [produto, setProduto] = useState<{
    nome: string;
    descricao: string;
    precoUnitario: number
    ncm: string;
    ean: number;
    dataVencimento: string;
    ativo: boolean;
    quantidade: number;
    observacao: string;
    imagem: string | null;
  }>({
    nome: '',
    descricao: '',
    precoUnitario: 0,
    ncm: '',
    ean: 0,
    dataVencimento: '',
    ativo: true,
    quantidade: 0,
    observacao: '',
    imagem: null,
  });


  const [cliente, setCliente] = useState<any>(null)

  useEffect(() => {
    const clienteString = localStorage.getItem('clienteSelecionado')
    if (clienteString) {
      const clienteParsed = JSON.parse(clienteString)
      setCliente(clienteParsed)
    }
  }, [])

  const formatForJava = (date: Date) =>
    date.toISOString().split('.')[0]


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setProduto((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    }
    else if (type === 'file' && e.target instanceof HTMLInputElement && e.target.files?.length) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];

          setProduto((prev) => ({
            ...prev,
            imagem: base64
          }));
        }
      };

      reader.readAsDataURL(file);
    }
    else if (name === 'precoUnitario') {
      const parsed = parseCurrency(value);
      setProduto(prev => ({
        ...prev,
        precoUnitario: parsed
      }));
    }
    else {
      setProduto((prev) => ({
        ...prev,
        [name]: name === 'quantidade' ? Number(value) : value,
        dataVencimento: name === 'dataVencimento' ? value : formatForJava(new Date())
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!filialId) {
    setMensagem('❌ Selecione uma filial antes de salvar.');
    return;
  }

  if (!produto.nome || !produto.precoUnitario || !produto.ean) {
    setMensagem('❌ Preencha todos os campos obrigatórios.');
    return;
  }

  const produtoParaEnviar = {
    ...produto,
    dataVencimento: formatForJava(new Date(produto.dataVencimento || new Date())),
    imagem: produto.imagem || null
  };

  try {
    // 1. Envia o produto para a API (banco de dados)
    await postProduto(produtoParaEnviar).unwrap();
    alert('✅ Produto cadastrado com sucesso!');

    // 2. Cria e envia o XML
    const xml = `
      <produtos>
        <produto>
          <codigo>${produto.ean}</codigo>
          <nome>${produto.nome}</nome>
          <preco>${produto.precoUnitario}</preco>
        </produto>
      </produtos>
    `.trim();

    const blob = new Blob([xml], { type: 'application/xml' });
    const file = new File([blob], 'produto.xml', { type: 'application/xml' });

    await importarXml({ file, filialId }).unwrap();
    setMensagem('✅ Produto cadastrado e XML enviado com sucesso!');

    // Reset do formulário
    setProduto({
      nome: '',
      descricao: '',
      precoUnitario: 0,
      ncm: '',
      ean: 0,
      dataVencimento: formatForJava(new Date()),
      ativo: true,
      quantidade: 0,
      observacao: '',
      imagem: null
    });
    setMostrarFormulario(false);

  } catch (error) {
    console.error('Erro no cadastro:', error);
    setMensagem('❌ Erro ao cadastrar produto. Verifique o console.');
  }
};

  const adicionarProduto = (produto: ProdutoProps, quantidade: number) => {
    if (!produtosSelecionados.find((p) => p.id === produto.id)) {
      setProdutosSelecionados((prev) => [
        ...prev,
        {
          ...produto,
          quantidade
        }
      ])
      setSearchTerm('')
    }
  }

  const handleDeletarProdutoSelecionado = (id: number) => {
    setProdutosSelecionados((prev) => prev.filter((p) => p.id !== id))
  }

  const handleAtualizarQuantidade = (id: number, novaQuantidade: number) => {
    setProdutosSelecionados((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantidade: novaQuantidade } : p))
    )
  }

  const parsePreco = (valor?: string | number | null): number => {
    if (typeof valor === 'number') return valor;
    if (typeof valor === 'string') {
      const normalizado = valor.replace(',', '.');
      const numero = parseFloat(normalizado);
      return isNaN(numero) ? 0 : numero;
    }
    return 0;
  };

  const totalGeral = produtosSelecionados.reduce((total, p) => {
    const preco = parsePreco(p.precoUnitario);
    const quantidade = p.quantidade ?? 0;
    return total + preco * quantidade;
  }, 0);

  const handleXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !filialId) {
        alert('Selecione uma filial antes de importar o XML.');
        return;
      }
  
      try {
        await importarXml({ file, filialId }).unwrap();
        alert('✅ XML importado com sucesso!');
      } catch (error: any) {
        console.error("Erro ao importar XML:", error);
        alert('❌ Erro ao importar XML.');
      }
    };
  
    // --- Leitura de código de barras por câmera ---
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
  
      // 🔍 Buscar produto pela API
      const response = await fetch(`/api/produtos/barcode/${codigo}`);
      if (!response.ok) {
        setProdutoNome('');
        setProdutoPreco('');
        setMensagem('❌ Produto não encontrado.');
        return;
      }
  
      const produto = await response.json();
      setProdutoNome(produto.nome || '');
      setProdutoPreco(produto.preco?.toString() || '');
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
  }
  

  return (
    <S.Container>
      <S.TopBar>
        <div>
          <S.Title>Buscar Produto</S.Title>
        </div>
        <div>
          {!mostrarFormulario && (
            <S.Button onClick={() => setMostrarFormulario(true)}>
              Cadastrar Produto
            </S.Button>
          )}
        </div>
      </S.TopBar>

      {/* Seção do Cliente (mantida igual) */}
      {cliente ? (
        <>
          {cliente.pessoaFisica ? (
            <span style={{ fontSize: '0.9rem', marginLeft: '12px', color: '#666' }}>
              Cliente PF: {cliente.pessoaFisica.nome}
            </span>
          ) : cliente.pessoaJuridica ? (
            <span style={{ fontSize: '0.9rem', marginLeft: '12px', color: '#666' }}>
              Cliente PJ: {cliente.pessoaJuridica.razaoSocial}
            </span>
          ) : (
            <span style={{ fontSize: '0.9rem', marginLeft: '12px', color: '#666' }}>
              Cliente: Tipo não identificado
            </span>
          )}
        </>
      ) : (
        <span style={{ fontSize: '0.9rem', marginLeft: '12px', color: '#666' }}>
          Cliente: Não encontrado
        </span>
      )}

      <S.GridContent>
        {/* Seção de Busca (mantida igual) */}
        <div>
          <Input
            type="text"
            placeholder="Digite o nome do produto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {produtosFiltrados && produtosFiltrados.length > 0 && (
            <S.SearchResults>
              {produtosFiltrados.map((produto) => (
                <div key={produto.id}>
                  {produto.nome} - R$ {parsePreco(produto.precoUnitario).toFixed(2)}
                  <Input
                    type="text"
                    min={1}
                    placeholder="Qtd"
                    value={quantidadesTemp[produto.id] || 1}
                    onChange={(e) =>
                      setQuantidadesTemp((prev) => ({
                        ...prev,
                        [produto.id]: Number(e.target.value)
                      }))
                    }
                    style={{ width: '60px', marginLeft: '10px' }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      adicionarProduto(
                        {
                          ...produto,
                          ncm: produto.ncm || '00000000'
                        },
                        quantidadesTemp[produto.id] || 1
                      )
                    }
                  >
                    <FaArrowRight />
                  </button>
                </div>
              ))}
            </S.SearchResults>
          )}
        </div>

        {mostrarFormulario && (
          <div>
            <S.Title>Cadastro de Produtos</S.Title>
            <S.TabContainer>
              <S.TabButton active={activeTab === 'manual'} onClick={() => setActiveTab('manual')}>
                Manual
              </S.TabButton>
              <S.TabButton active={activeTab === 'xml'} onClick={() => setActiveTab('xml')}>
                Importar XML
              </S.TabButton>
              <S.TabButton active={activeTab === 'codigo'} onClick={() => setActiveTab('codigo')}>
                Código de Barras
              </S.TabButton>
            </S.TabContainer>

            <S.Form onSubmit={handleSubmit}>
              {/* Seção de Filial (agora aparece em todas as abas) */}
              <S.Label htmlFor="filial-select">Selecione a Filial:</S.Label>
              {loadingFiliais ? (
                <p>Carregando filiais...</p>
              ) : errorFiliais ? (
                <p>Erro ao carregar filiais</p>
              ) : (
                <Input
                  as="select"
                  id="filial-select"
                  value={filialId ?? ''}
                  onChange={(e) => setFilialId(Number(e.target.value))}
                  required
                >
                  <option value="" disabled>Selecione uma filial</option>
                  {filiais?.map((f: any) => (
                    <option key={f.id} value={f.id}>{f.nome}</option>
                  ))}
                </Input>
              )}

              {/* Campos comuns a todas as abas */}
              <S.Label htmlFor="nome">Nome</S.Label>
              <Input
                type="text"
                name="nome"
                placeholder="Nome"
                value={produto.nome}
                onChange={handleChange}
                required
              />

              <S.Label htmlFor="precoUnitario">Preço Unitário</S.Label>
              <Input
                type="text"
                name="precoUnitario"
                placeholder="Preço Unitário"
                inputMode="decimal"
                value={produto.precoUnitario}
                onChange={(e) => {
                  const valorDigitado = e.target.value;
                  const valorFiltrado = valorDigitado
                    .replace(/[^0-9,]/g, '')
                    .replace(/(,.*),/g, '$1');
                  handleChange({
                    target: {
                      name: 'precoUnitario',
                      value: valorFiltrado,
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                required
              />

              <S.Label htmlFor="quantidade">Quantidade</S.Label>
              <Input
                type="number"
                name="quantidade"
                placeholder="Quantidade"
                value={produto.quantidade}
                onChange={handleChange}
                required
              />

              {/* Campos específicos por aba */}
              {activeTab === 'manual' && (
                <>
                  <S.Label htmlFor="descricao">Descrição</S.Label>
                  <S.TextArea
                    name="descricao"
                    placeholder="Descrição"
                    value={produto.descricao}
                    onChange={handleChange}
                  />

                  <S.Label htmlFor="dataVencimento">Data de Vencimento</S.Label>
                  <Input
                    type="text"
                    name="dataVencimento"
                    placeholder="Data de vencimento"
                    value={produto.dataVencimento}
                    onChange={handleChange}
                  />

                  <S.Label htmlFor="ncm">NCM</S.Label>
                  <Input
                    type="text"
                    name="ncm"
                    placeholder="NCM"
                    value={produto.ncm}
                    onChange={handleChange}
                  />

                  <S.Label htmlFor="ean">EAN</S.Label>
                  <Input
                    type="number"
                    name="ean"
                    placeholder="EAN"
                    value={produto.ean}
                    onChange={handleChange}
                  />

                  <S.Label htmlFor="observacao">Observação</S.Label>
                  <S.TextArea
                    name="observacao"
                    placeholder="Observação"
                    value={produto.observacao ?? ''}
                    onChange={handleChange}
                  />

                  <S.Label>
                    Ativo:
                    <Input
                      type="checkbox"
                      name="ativo"
                      checked={produto.ativo}
                      onChange={handleChange}
                    />
                  </S.Label>

                  <S.Label>
                    Imagem:
                    <Input type="file" accept="image/*" onChange={handleChange} />
                  </S.Label>
                  {produto.imagem && <ImagePreview base64={produto.imagem} />}
                </>
              )}

              {activeTab === 'xml' && (
                <>
                  <S.Label>Arquivo XML:</S.Label>
                  <Input
                    type="file"
                    accept=".xml"
                    onChange={handleXmlUpload}
                    disabled={loadingImport}
                  />
                  {loadingImport && <p>Enviando XML...</p>}
                </>
              )}

              {activeTab === 'codigo' && (
                <>
                  <S.Label htmlFor="ean">Código de Barras</S.Label>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <Input
                      type="text"
                      name="ean"
                      placeholder="Código de barras"
                      value={produto.ean}
                      onChange={handleChange}
                      required
                    />
                    {!scanning ? (
                      <S.Button type="button" onClick={iniciarLeituraCodigo}>
                        📷 Ler código
                      </S.Button>
                    ) : (
                      <S.Button type="button" onClick={pararLeituraCodigo}>
                        ✋ Parar
                      </S.Button>
                    )}
                  </div>
                  <video
                    ref={videoRef}
                    style={{ width: '100%', maxHeight: 200, marginTop: 10, display: scanning ? 'block' : 'none' }}
                  />
                </>
              )}

              <S.Button type="submit">
                {activeTab === 'manual' ? 'Cadastrar Produto' : 
                 activeTab === 'xml' ? 'Importar XML' : 'Salvar por Código'}
              </S.Button>
              {mensagem && <p>{mensagem}</p>}
            </S.Form>
          </div>
        )}
      </S.GridContent>

      {/* Tabela de Produtos Selecionados (mantida igual) */}
      <S.FullWidth>
        {produtosSelecionados.length > 0 ? (
          <S.Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosSelecionados.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>
                    <Input
                      type="number"
                      min={1}
                      value={produto.quantidade}
                      onChange={(e) =>
                        handleAtualizarQuantidade(produto.id, Number(e.target.value))
                      }
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>{produto.precoUnitario.toFixed(2)}</td>
                  <td>{(produto.quantidade * produto.precoUnitario).toFixed(2)}</td>
                  <td>
                    <S.IconButton title='remover' onClick={() => handleDeletarProdutoSelecionado(produto.id)}>
                      X
                    </S.IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
            <S.Total>Subtotal: R$ {totalGeral.toFixed(2)}</S.Total>
            <td colSpan={5}>
              <S.Button
                onClick={() => {
                  localStorage.setItem('clienteSelecionado', JSON.stringify(cliente));
                  localStorage.setItem('produtosSelecionados', JSON.stringify(produtosSelecionados));
                  navigate('/venda');
                }}
                style={{ marginTop: '1rem' }}
              >
                Finalizar Venda
              </S.Button>
            </td>
          </S.Table>
        ) : (
          <p>Nenhum produto selecionado.</p>
        )}
      </S.FullWidth>
    </S.Container>
  );
}

export default Produtos
