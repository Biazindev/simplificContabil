import React from 'react';
import { useNavigate } from 'react-router-dom'

const SaleNavigationMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Cliente salvo com sucesso! Escolha o próximo passo:</h3>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={() => navigate('/service-order')}>Ordem de Serviço</button>
        <button onClick={() => navigate('/produtos')}>Produtos</button>
        <button onClick={() => navigate('/venda-pdv')}>PDV</button>
      </div>
    </div>
  );
};

export default SaleNavigationMenu;
