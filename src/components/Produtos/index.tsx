import { useGetFeatureProdutoQuery } from '../../services/api'

const Produtos = () => {
  const { data, isLoading, error } = useGetFeatureProdutoQuery()

  if (isLoading) return <p>Carregando produtos...</p>
  if (error) return <p>Erro ao carregar produtos.</p>

  return (
    <div>
      {Array.isArray(data) ? (
        data.map((produto) => {
          const dataFormatada = new Date(
            produto.dataCadastro[0],
            produto.dataCadastro[1] - 1,
            produto.dataCadastro[2],
            produto.dataCadastro[3],
            produto.dataCadastro[4],
            produto.dataCadastro[5]
          ).toLocaleString('pt-BR')

          return (
            <div
              key={produto.id}
              style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}
            >
              <h3>{produto.nome}</h3>

              {produto.imagem && (
                <img
                  src={`data:image/png;base64,${produto.imagem}`}
                  alt={produto.nome}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: 'cover',
                    marginBottom: '1rem'
                  }}
                />
              )}

              <p><strong>Descrição:</strong> {produto.descricao}</p>
              <p><strong>Preço:</strong> R$ {produto.precoUnitario.toFixed(2)}</p>
              <p><strong>NCM:</strong> {produto.ncm}</p>
              <p><strong>Ativo:</strong> {produto.ativo ? 'Sim' : 'Não'}</p>
              <p><strong>Quantidade:</strong> {produto.quantidade}</p>
              <p><strong>Observação:</strong> {produto.observacao || 'Nenhuma'}</p>
              <p><strong>Data de Cadastro:</strong> {dataFormatada}</p>
            </div>
          )
        })
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </div>
  )
}

export default Produtos
