import React, { useState } from 'react';
import * as S from './styles';
import {
  useListarFiliaisQuery,
  useImportarProdutosXmlMutation,
  useImportarProdutosXmlFilialMutation,
} from '../../services/api';

const Stock = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'xml' | 'codigo'>('manual');
  const [filialId, setFilialId] = useState<number | null>(null);
  const { data: filiais, isLoading: loadingFiliais, error: errorFiliais } = useListarFiliaisQuery(null);
  const [importarXml, { isLoading }] = useImportarProdutosXmlMutation();
  const [enviarFilialId] = useImportarProdutosXmlFilialMutation()


  const handleXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !filialId) {
      alert('Selecione uma filial antes de importar o XML.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('filialId', filialId.toString());

    try {
      await importarXml(formData).unwrap();
      alert('✅ XML importado com sucesso!');
    } catch (error: any) {
      console.error("Erro ao importar XML:", error);
      if (error?.status === 500) {
        alert('⚠️ Alguns produtos foram importados, mas ocorreu um erro durante o processo.');
      } else {
        alert('❌ Erro ao importar XML.');
      }
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
            <S.Input type="text" placeholder="Nome do produto" required />
            <S.Input type="text" placeholder="Código" required />
            <S.Input type="text" placeholder="Preço" required />
            <S.Input type="text" placeholder="Quantidade" required />
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
                onChange={(e) => {
                  const selectedFilialId = Number(e.target.value);
                  console.log("Filial selecionada:", selectedFilialId)
                  setFilialId(selectedFilialId);
                }}
              >
                <option value="" disabled>Selecione uma filial</option>
                {filiais?.map((f: any) => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </S.Input>
            )}

            <S.Input
              type="file"
              accept=".xml"
              onChange={handleXmlUpload}
              disabled={isLoading}
            />

            {isLoading && <p>Enviando XML...</p>}
          </div>
        )}

        {activeTab === 'codigo' && (
          <S.Form onSubmit={(e) => e.preventDefault()}>
            <S.Input type="text" placeholder="Código de barras" required />
            <S.Input type="text" placeholder="Nome do produto" />
            <S.Input type="number" placeholder="Preço" />
            <S.Button type="submit">Salvar</S.Button>
          </S.Form>
        )}
      </div>
    </S.Container>
  );
};

export default Stock;
