import { useState, useEffect, useRef } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import {
  useAddProdutoMutation,
  useDeleteProdutoMutation,
  useGetProdutosByNameQuery,
  useImportarProdutosXmlMutation,
  useListarFiliaisQuery,
  useLazyGetProdutoPorGtinQuery,
  useImportarProdutosXmlFilialMutation
} from '../../../services/api'

import * as S from '../styles'
import { Input } from '../../../styles'
import { Link, useNavigate } from 'react-router-dom'

type Produto = {
  ncm?: {
    code?: number;
    description?: string;
    full_description?: string;
    ex?: string | null;
  };
  // outras propriedades...
};


const parseCurrency = (value: string): number => {
  return Number(value.replace(/\./g, '').replace(',', '.')) || 0
}

type ProdutoProps = {
  id: number
  nome: string
  descricao: string
  precoUnitario: string
  ean: string
  ncm: string
  dataVencimento: string
  ativo: boolean
  quantidade: string
  observacao?: string | null
  imagem: string | null;
}

const ProdutosCadastrar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { data: produtosFiltrados } = useGetProdutosByNameQuery(searchTerm, {
    skip: searchTerm.length === 0
  })

  const [postProduto] = useAddProdutoMutation()
  const [deleteProduto] = useDeleteProdutoMutation()
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoProps[]>([])
  const [quantidadesTemp, setQuantidadesTemp] = useState<Record<number, number>>({})
  const [mostrarFormulario, setMostrarFormulario] = useState(true)
  const [activeTab, setActiveTab] = useState<'manual' | 'xml' | 'codigo'>('manual')
  const [filialId, setFilialId] = useState<number | null>(null)
  const [codigoBarras, setCodigoBarras] = useState('')
  const [produtoNome, setProdutoNome] = useState('')
  const [produtoPreco, setProdutoPreco] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [etapa, setEtapa] = useState<'selecao' | 'cadastro'>('selecao')

  const { data: filiais, isLoading: loadingFiliais, error: errorFiliais } = useListarFiliaisQuery()
  const [buscarProdutoPorEan, { data: produtoPorEan, isUninitialized }] = useLazyGetProdutoPorGtinQuery()

  const [importarProdutos, { data: response }] = useImportarProdutosXmlFilialMutation();

  const [produto, setProduto] = useState<{
    nome: string;
    descricao: string;
    precoUnitario: string,
    ncm: string;
    ean: string;
    dataVencimento: string;
    ativo: boolean;
    quantidade: string;
    observacao: string;
    precoCusto: string,
    imagem: string | null;
  }>({
    nome: '',
    descricao: '',
    precoUnitario: '',
    ncm: '',
    ean: '',
    dataVencimento: '',
    ativo: true,
    quantidade: '',
    observacao: '',
    precoCusto: '',
    imagem: null,
  })

  useEffect(() => {
    if (!produtoPorEan) return;

    setProduto(prev => ({
      ...prev,
      nome: produtoPorEan.description || prev.nome,
      descricao: produtoPorEan.category?.description || prev.descricao,
      precoUnitario: produtoPorEan.max_price?.toString() || prev.precoUnitario,
      ncm:
        typeof produtoPorEan.ncm === 'object' &&
          produtoPorEan.ncm !== null &&
          'code' in produtoPorEan.ncm
          ? String((produtoPorEan.ncm as any).code)
          : produtoPorEan.ncm?.toString() || prev.ncm,
      dataVencimento: prev.dataVencimento,
      ativo: true,
      quantidade: prev.quantidade,
      observacao: produtoPorEan.brand?.name || prev.observacao,
      imagem: produtoPorEan.thumbnail || prev.imagem,
      ean: produtoPorEan.gtin?.toString() || prev.ean,
      precoCusto: prev.precoCusto
    }));

    setMensagem("✅ Produto encontrado via EAN!")
  }, [produtoPorEan])

  useEffect(() => {
  if (codigoBarras && codigoBarras.length >= 8) {
    buscarProdutoPorEan(codigoBarras)
      .unwrap()
      .then(() => {
        setMensagem('✅ Dados do produto carregados!');
        setActiveTab('manual');
        setEtapa('cadastro');
      })
      .catch(() => {
        setMensagem('ℹ️ Produto não encontrado. Preencha os dados manualmente.');
        setActiveTab('manual');
        setEtapa('cadastro');
      });
  }
}, [codigoBarras]);

  const formatForJava = (date: Date) =>
    date.toISOString().split('.')[0]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setProduto((prev: any) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }))
    }
    else if (type === 'file' && e.target instanceof HTMLInputElement && e.target.files?.length) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1]
          setProduto((prev: any) => ({
            ...prev,
            imagem: base64
          }))
        }
      }
      reader.readAsDataURL(file)
    }
    else if (name === 'precoUnitario' || name === 'precoCusto') {
      const valorFormatado = value
        .replace(/[^0-9.,]/g, '')
        .replace(/([,.])(?=.*\1)/g, '')

      setProduto((prev: any) => ({
        ...prev,
        [name]: valorFormatado
      }))
    }
    else {
      setProduto((prev: any) => ({
        ...prev,
        [name]: name === 'quantidade' ? Number(value) : value,
        dataVencimento: name === 'dataVencimento' ? value : formatForJava(new Date())
      }))

      if (name === 'ean' && value.length >= 8) {
        buscarProdutoPorEan(value)
      }
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!filialId) {
      setMensagem('❌ Selecione uma filial antes de continuar.')
      return
    }

    if (activeTab === 'manual') {
      if (etapa === 'selecao') {
        if (!produto.ean) {
          setMensagem('❌ Informe o EAN do produto.')
          return
        }
        setEtapa('cadastro')
        return
      }

      if (!produto.nome || !produto.precoUnitario) {
        setMensagem('❌ Preencha todos os campos obrigatórios.')
        return
      }

      const parseMonetaryValue = (value: any) => {
        const stringValue = typeof value === 'string' ? value : String(value || '')
        const cleanValue = stringValue
          .replace(/\./g, '')
          .replace(',', '.')
        return parseFloat(cleanValue) || 0
      }

      const produtoParaEnviar = {
        ...produto,
        precoUnitario: parseMonetaryValue(produto.precoUnitario),
        precoCusto: parseMonetaryValue(produto.precoCusto),
        quantidade: parseMonetaryValue(produto.quantidade),
        ean: parseInt(produto.ean) || 0,
        dataVencimento: formatForJava(new Date(produto.dataVencimento || new Date())),
        imagem: produto.imagem || null,
      }

      try {
        await postProduto(produtoParaEnviar).unwrap()
        alert('✅ Produto cadastrado com sucesso!')

        const xml = `
        <produtos>
          <produto>
            <codigo>${produto.ean}</codigo>
            <nome>${produto.nome}</nome>
            <preco>${produto.precoUnitario}</preco>
          </produto>
        </produtos>
        `.trim()

        const blob = new Blob([xml], { type: 'application/xml' })
        const file = new File([blob], 'produto.xml', { type: 'application/xml' })

        await importarProdutos({ file, filialId }).unwrap()
        setMensagem('✅ Produto cadastrado e XML enviado com sucesso!')

        setProduto({
          nome: '',
          descricao: '',
          precoUnitario: '',
          ncm: '',
          ean: '',
          dataVencimento: formatForJava(new Date()),
          ativo: true,
          quantidade: '',
          observacao: '',
          precoCusto: '',
          imagem: null
        })
        setEtapa('selecao')
      } catch (error) {
        console.error('Erro no cadastro:', error)
        setMensagem('❌ Erro ao cadastrar produto. Verifique o console.')
      }
    }
  }

  const handleXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert('Selecione um arquivo XML antes de importar.');
      return;
    }

    if (!filialId) {
      alert('Selecione uma filial antes de importar o XML.');
      return;
    }

    try {
      setMensagem('⏳ Importando XML...');

      // Criar FormData corretamente
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filialId', filialId.toString()); // Garantir que é string

      // Chamar a mutation com o payload correto
      const response = await importarProdutos({ file, filialId }).unwrap();

      if (response.success) {
        setMensagem('✅ XML importado com sucesso!');
        alert(`Foram importados ${response.importedCount} produtos.`);
      } else {
        setMensagem('⚠️ Importação parcial: ' + response.message);
        alert(`Importados ${response.importedCount} de ${response.totalCount} produtos.`);
      }
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      let errorMessage = '❌ Erro ao importar XML.';

      if (error.data) {
        errorMessage += ` Detalhes: ${JSON.stringify(error.data)}`;
      } else if (error.message) {
        errorMessage += ` ${error.message}`;
      }

      setMensagem(errorMessage);
      alert(errorMessage);
    }
  };


  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [scanning, setScanning] = useState(false)
  const codeReader = useRef<BrowserMultiFormatReader | null>(null)

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader()
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

    const iniciarLeituraCodigo = async () => {
  if (!videoRef.current || !codeReader.current) return;
  setScanning(true);
  setMensagem('🔍 Lendo código de barras...');

  try {
    const result = await codeReader.current.decodeOnceFromVideoDevice(undefined, videoRef.current);
    const codigo = result.getText();
    setCodigoBarras(codigo);

    // 1. Atualiza o estado do produto com o código lido
    setProduto(prev => ({
      ...prev,
      ean: codigo
    }));

    // 2. Busca automaticamente o produto pelo EAN
    const produtoEncontrado = await buscarProdutoPorEan(codigo).unwrap();

    if (produtoEncontrado) {
      setMensagem('✅ Produto encontrado via código de barras!');
      
      // 3. Preenche os campos do formulário com os dados encontrados
      setProduto(prev => ({
        ...prev,
        nome: produtoEncontrado.description || '',
        precoUnitario: produtoEncontrado.max_price?.toString() || '',
        ncm: (produtoEncontrado.ncm as any)?.code?.toString() || '',
        descricao: produtoEncontrado.category?.description || '',
        observacao: produtoEncontrado.brand?.name || '',
        imagem: produtoEncontrado.thumbnail || null
      }));

      // 4. Muda para a aba manual e etapa de cadastro
      setActiveTab('manual');
      setEtapa('cadastro');
    } else {
      setMensagem('ℹ️ Produto não encontrado. Preencha os dados manualmente.');
      setActiveTab('manual');
      setEtapa('cadastro');
    }

  } catch (error) {
    console.error('Erro ao ler código:', error);
    setMensagem('❌ Erro ao ler o código. Tente novamente.');
  } finally {
    setScanning(false);
    // Pare a câmera
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  }
};

  const pararLeituraCodigo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
    setScanning(false)
  }

  return (
    <S.Container>
      <S.GridContent>
        {mostrarFormulario && (
          <div>
            <S.Title>Cadastro de Produtos</S.Title>
            <S.TabContainer>
              <S.TabButton
                active={activeTab === 'manual'}
                onClick={() => {
                  setActiveTab('manual')
                  setEtapa('selecao')
                }}
              >
                Manual
              </S.TabButton>
              <S.TabButton
                active={activeTab === 'xml'}
                onClick={() => {
                  setActiveTab('xml')
                  setEtapa('selecao')
                }}
              >
                Importar XML
              </S.TabButton>
              <S.TabButton
                active={activeTab === 'codigo'}
                onClick={() => {
                  setActiveTab('codigo')
                  setEtapa('selecao')
                }}
              >
                Código de Barras
              </S.TabButton>
            </S.TabContainer>

            <S.Form onSubmit={handleSubmit}>
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

              {activeTab === 'manual' && (
                <>
                  {etapa === 'selecao' ? (
                    <>
                      <S.Label htmlFor="ean">EAN</S.Label>
                      <Input
                        type="text"
                        name="ean"
                        placeholder="EAN"
                        value={produto.ean}
                        onChange={handleChange}
                        onBlur={() => {
                          const ean = produto.ean?.toString()
                          if (ean && ean.length >= 8) {
                            buscarProdutoPorEan(ean)
                          }
                        }}
                        required
                      />
                      <S.Button type="submit">Continuar</S.Button>
                    </>
                  ) : (
                    <>
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
                        value={produto.precoUnitario}
                        onChange={(e) => {
                          const valor = e.target.value
                            .replace(/[^0-9.,]/g, '')
                            .replace(/(\..*)\./g, '$1')
                            .replace(/(,.*),/g, '$1')
                          setProduto(prev => ({
                            ...prev,
                            precoUnitario: valor
                          }))
                        }}
                        required
                      />

                      <S.Label htmlFor="quantidade">Preço de custo</S.Label>
                      <Input
                        type="text"
                        name="precoCusto"
                        placeholder="Preço de custo"
                        value={produto.precoCusto}
                        onChange={handleChange}
                        required
                      />

                      <S.Label htmlFor="quantidade">Quantidade</S.Label>
                      <Input
                        type="text"
                        name="quantidade"
                        placeholder="Quantidade"
                        value={produto.quantidade}
                        onChange={handleChange}
                        required
                      />

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
                      {produto.imagem && (
                        <img
                          src={produto.imagem.startsWith("data:") ? produto.imagem : produto.imagem}
                          alt="Produto"
                          style={{ width: "120px", height: "120px", objectFit: "contain" }}
                        />
                      )}

                      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <S.Button type="button" onClick={() => setEtapa('selecao')}>
                          Voltar
                        </S.Button>
                        <S.Button type="submit">Cadastrar Produto</S.Button>
                      </div>
                    </>
                  )}
                </>
              )}

              {activeTab === 'xml' && (
                <>
                  <S.Label>Arquivo XML:</S.Label>
                  <Input
                    type="file"
                    accept=".xml"
                    onChange={handleXmlUpload}
                    required
                  />
                </>
              )}

              {activeTab === 'codigo' && (
                <>
                  <S.Label htmlFor="ean">Código de Barras</S.Label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Input
                      type="text"
                      placeholder="Código de barras"
                      value={codigoBarras}
                      onChange={(e) => {
                        setCodigoBarras(e.target.value);
                        setProduto(prev => ({ ...prev, ean: e.target.value }));
                      }}
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
                    style={{
                      width: '100%',
                      maxHeight: 200,
                      marginTop: 10,
                      display: scanning ? 'block' : 'none',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />

                  {produto.ean && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <p><strong>Código:</strong> {produto.ean}</p>
                      {produto.nome && <p><strong>Nome:</strong> {produto.nome}</p>}
                      {produto.precoUnitario && <p><strong>Preço:</strong> R$ {produto.precoUnitario}</p>}
                    </div>
                  )}

                  {etapa === 'cadastro' && (
                    <S.Button
                      type="button"
                      onClick={() => setMostrarFormulario(true)}
                      style={{ marginTop: '20px' }}
                    >
                      Cadastrar Produto
                    </S.Button>
                  )}
                </>
              )}

              {mensagem && <p style={{ marginTop: '10px' }}>{mensagem}</p>}

              <Link to={'/pdv-mesa'} style={{ display: 'block', marginTop: '20px' }}>
                <S.Button type="button">Voltar para vendas</S.Button>
              </Link>
            </S.Form>
          </div>
        )}
      </S.GridContent>
    </S.Container>
  )
}

export default ProdutosCadastrar