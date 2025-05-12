import React, { useState } from 'react';
import * as S from './styles';
import { useImportarProdutosXmlMutation } from '../../services/api';

const Stock = () => {
    const [activeTab, setActiveTab] = useState<'manual' | 'xml' | 'codigo'>('manual');
    const [importarXml, { isLoading }] = useImportarProdutosXmlMutation();

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Produto cadastrado manualmente');
    };

    const handleXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const response = await importarXml(file).unwrap();
            alert('✅ XML importado com sucesso!');
            console.log(response);
        } catch (error) {
            console.error(error);
            alert('❌ Erro ao importar XML.');
        }
    };

    const handleBarcodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Produto cadastrado via código de barras');
    };

    return (
        <S.Container>
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

                {activeTab === 'manual' && (
                    <S.Form onSubmit={handleManualSubmit}>
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
                    <S.Form onSubmit={handleBarcodeSubmit}>
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
