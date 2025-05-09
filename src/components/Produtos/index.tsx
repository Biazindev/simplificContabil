import { useState, useEffect } from 'react'
import {
  useAddProdutoMutation,
  useDeleteProdutoMutation,
  useGetProdutosQuery,
  useSearchProdutosQuery
} from '../../services/api'

import * as S from './styles'

const parseCurrency = (value: string): number => {
  return Number(value.replace(/\./g, '').replace(',', '.')) || 0
}

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: produtos, isLoading, error } = useSearchProdutosQuery(searchTerm)
  const [postProduto] = useAddProdutoMutation()
  const [deleteProduto] = useDeleteProdutoMutation()

  type ProdutoProps = any

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduto((prev) => ({
          ...prev,
          imagem: reader.result as string
        }))
      }
      reader.readAsDataURL(file);
    }
  }
  const [produto, setProduto] = useState<Omit<ProdutoProps, 'id' | 'dataDeVencimento'>>({
    nome: '',
    descricao: '',
    precoUnitario: 0,
    ncm: '',
    ativo: true,
    quantidade: 0,
    observacao: '',
    imagem: null
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      setProduto((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else if (name === 'precoUnitario') {
      const parsed = parseCurrency(value)
      setProduto((prev) => ({ ...prev, precoUnitario: parsed }))
    } else {
      setProduto((prev) => ({
        ...prev,
        [name]:
          name === 'quantidade'
            ? Number(value)
            : value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const novoProduto = {
      ...produto,
      dataVencimento: new Date().toISOString().split('.')[0],
      observacao: produto.observacao || null
    }

    try {
      await postProduto(novoProduto).unwrap()
      alert('Produto cadastrado com sucesso!')
      setProduto({
        nome: '',
        descricao: '',
        precoUnitario: 0,
        ncm: '',
        ativo: true,
        quantidade: 0,
        observacao: '',
        imagem: null
      })
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error)
      alert('Erro ao cadastrar produto.')
    }
  }

  const handleDeletar = async (id: number) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o produto ID ${id}?`)
    if (!confirmar) return

    try {
      await deleteProduto(id).unwrap()
      alert('Produto excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      alert('Erro ao excluir produto.')
    }
  }

  return (
    <S.Container>
      <S.Title>Buscar Produto</S.Title>
      <S.Input
        type="text"
        placeholder="Buscar produto"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <S.Title>Cadastrar Produto</S.Title>
      {produtos?.length === 0 ? (
        <S.Form onSubmit={handleSubmit}>
          <S.Label htmlFor="nome">Nome</S.Label>
          <S.Input
            type="text"
            name="nome"
            placeholder="Nome"
            value={produto.nome}
            onChange={handleChange}
            required
          />
          <S.Label htmlFor="descricao">Descrição</S.Label>
          <S.TextArea
            name="descricao"
            placeholder="Descrição"
            value={produto.descricao}
            onChange={handleChange}
            required
          />
          <S.Label htmlFor="precoUnitario">Preço Unitário</S.Label>
          <S.Input
            type="number"
            name="precoUnitario"
            placeholder="Preço Unitário"
            value={produto.precoUnitario}
            onChange={handleChange}
            required
          />
          <S.Label htmlFor="ncm">NCM (8 dígitos)</S.Label>
          <S.Input
            type="text"
            name="ncm"
            placeholder="NCM (8 dígitos)"
            value={produto.ncm}
            onChange={handleChange}
            required
          />
          <S.Label htmlFor="quantidade">Quantidade</S.Label>
          <S.Input
            type="number"
            name="quantidade"
            placeholder="Quantidade"
            value={produto.quantidade}
            onChange={handleChange}
            required
          />
          <S.Label htmlFor="observacao">Observação</S.Label>
          <S.TextArea
            name="observacao"
            placeholder="Observação"
            value={produto.observacao ?? ''}
            onChange={handleChange}
          />
          <S.Label>
            <div>
              Ativo:
              <S.Input
                type="checkbox"
                name="ativo"
                checked={produto.ativo}
                onChange={handleChange}
              />
            </div>
          </S.Label>

          <S.Label>
            Imagem:
            <S.Input type="file" accept="image/*" onChange={handleImageChange} />
          </S.Label>
          {produto.imagem && <S.ImgPreview src={produto.imagem} alt="Preview" />}

          <S.Button type="submit">Cadastrar</S.Button>
        </S.Form>
      ) : (
        <S.Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th>Ativo</th>
              <th>Preço (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          {produtos && produtos.length > 0 ? (
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.id}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.descricao}</td>
                  <td>{produto.quantidade}</td>
                  <td>{produto.ativo ? 'Sim' : 'Não'}</td>
                  <td>{produto.precoUnitario?.toFixed(2) ?? '0,00'}</td>
                  <td>
                    <button onClick={() => handleDeletar(produto.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
              <td>
                <p>Nenhum produto encontrado.</p>
              </td>
            </tr>
            </tbody>
          )}
        </S.Table>
      )}
    </S.Container>
  )
}

export default Produtos
