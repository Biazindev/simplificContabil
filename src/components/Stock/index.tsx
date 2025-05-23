import React, { useState, useRef, useEffect } from 'react';
import * as S from './styles';
import {
  useListarFiliaisQuery,
  useImportarProdutosXmlMutation,
} from '../../services/api';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Input } from './styles';

const Stock = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'xml' | 'codigo'>('manual');
  const [filialId, setFilialId] = useState<number | null>(null);
  const [codigoBarras, setCodigoBarras] = useState('');
  const [produtoNome, setProdutoNome] = useState('');
  const [produtoPreco, setProdutoPreco] = useState('');
  const [mensagem, setMensagem] = useState('');

  const { data: filiais, isLoading: loadingFiliais, error: errorFiliais } = useListarFiliaisQuery();

  const [importarXml, { isLoading: loadingImport }] = useImportarProdutosXmlMutation();

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
};

  // --- Fim leitura de código ---

  // --- Salvar produto como XML ---
  const handleSalvarProduto = async () => {
    if (!filialId) {
      setMensagem('❌ Selecione uma filial antes de salvar.');
      return;
    }
    if (!codigoBarras || !produtoNome || !produtoPreco) {
      setMensagem('❌ Preencha todos os campos para salvar.');
      return;
    }

    try {
      const xml = `
        <produtos>
          <produto>
            <codigo>${codigoBarras}</codigo>
            <nome>${produtoNome}</nome>
            <preco>${produtoPreco}</preco>
          </produto>
        </produtos>
      `.trim();

      const blob = new Blob([xml], { type: 'application/xml' });
      const file = new File([blob], 'produto.xml', { type: 'application/xml' });

      await importarXml({ file, filialId }).unwrap();
      setMensagem('✅ Produto enviado com sucesso!');
      setCodigoBarras('');
      setProdutoNome('');
      setProdutoPreco('');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setMensagem('❌ Erro ao salvar produto.');
    }
  };

  return (
    <S.Container>
      <div>
        <S.Title>Cadastro de Produtos</S.Title>
        <S.TabContainer>
          <S.TabButton active={activeTab === 'manual'} onClick={() => setActiveTab('manual')}>Manual</S.TabButton>
          <S.TabButton active={activeTab === 'xml'} onClick={() => setActiveTab('xml')}>Importar XML</S.TabButton>
          <S.TabButton active={activeTab === 'codigo'} onClick={() => setActiveTab('codigo')}>Código de Barras</S.TabButton>
        </S.TabContainer>

        {activeTab === 'manual' && (
          <S.Form onSubmit={(e) => e.preventDefault()}>
            <Input type="text" placeholder="Nome do produto" required />
            <Input type="text" placeholder="Código" required />
            <Input type="text" placeholder="Preço" required />
            <Input type="text" placeholder="Quantidade" required />
            <S.Img>
              <h4>Adicione Imagem</h4>
              <S.Input type="file" accept="image/*" />
            </S.Img>
            <S.Button type="submit">Salvar</S.Button>
          </S.Form>
        )}

        {activeTab === 'xml' && (
          <div>
            <label htmlFor="filial-select">Selecione a Filial:</label>
            {loadingFiliais ? (
              <p>Carregando filiais...</p>
            ) : errorFiliais ? (
              <p>Erro ao carregar filiais</p>
            ) : (
              <S.Input
                as="select"
                id="filial-select"
                value={filialId ?? ''}
                onChange={(e) => setFilialId(Number(e.target.value))}
              >
                <option value="" disabled>Selecione uma filial</option>
                {filiais?.map((f: any) => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </S.Input>
            )}

            <Input
              type="file"
              accept=".xml"
              onChange={handleXmlUpload}
              disabled={loadingImport}
            />

            {loadingImport && <p>Enviando XML...</p>}
          </div>
        )}

        {activeTab === 'codigo' && (
          <S.Form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="filial-select-codigo">Selecione a Filial:</label>
            {loadingFiliais ? (
              <p>Carregando filiais...</p>
            ) : errorFiliais ? (
              <p>Erro ao carregar filiais</p>
            ) : (
              <Input
                as="select"
                id="filial-select-codigo"
                value={filialId ?? ''}
                onChange={(e) => setFilialId(Number(e.target.value))}
              >
                <option value="" disabled>Selecione uma filial</option>
                {filiais?.map((f: any) => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </Input>
            )}

            <Input
              type="text"
              placeholder="Código de barras"
              value={codigoBarras}
              onChange={(e) => setCodigoBarras(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Nome do produto"
              value={produtoNome}
              onChange={(e) => setProdutoNome(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Preço"
              value={produtoPreco}
              onChange={(e) => setProdutoPreco(e.target.value)}
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
              style={{ width: '100%', maxHeight: 200, marginTop: 10, display: scanning ? 'block' : 'none' }}
            />

            <S.Button type="button" onClick={handleSalvarProduto}>💾 Salvar</S.Button>
            {mensagem && <p>{mensagem}</p>}
          </S.Form>
        )}
      </div>
    </S.Container>
  );
};

export default Stock;
