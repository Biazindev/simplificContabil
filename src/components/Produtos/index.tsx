import { useState } from 'react'
import {
  useAddProdutoMutation,
  useDeleteProdutoMutation,
  useGetProdutosByNameQuery
} from '../../services/api'

import * as S from './styles'

const parseCurrency = (value: string): number => {
  return Number(value.replace(/\./g, '').replace(',', '.')) || 0
}

type ProdutoProps = {
  id: number
  nome: string
  descricao: string
  precoUnitario: number
  ncm: string
  ativo: boolean
  quantidade: number
  observacao?: string
  imagem?: string | null
}

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: produtosFiltrados } = useGetProdutosByNameQuery(searchTerm, {
    skip: searchTerm.length === 0
  })

  const [postProduto] = useAddProdutoMutation()
  const [deleteProduto] = useDeleteProdutoMutation()
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoProps[]>([])

  const [produto, setProduto] = useState<Omit<ProdutoProps, 'id'>>({
    nome: '',
    descricao: '',
    precoUnitario: 0,
    ncm: '',
    ativo: true,
    quantidade: 0,
    observacao: '',
    imagem: null
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProduto((prev) => ({
          ...prev,
          imagem: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

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
        [name]: name === 'quantidade' ? Number(value) : value
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

  const adicionarProduto = (produto: ProdutoProps) => {
    if (!produtosSelecionados.find((p) => p.id === produto.id)) {
      setProdutosSelecionados((prev) => [...prev, produto])
      setSearchTerm('')
    }
  }

  const handleDeletarProdutoSelecionado = (id: number) => {
    setProdutosSelecionados((prev) => prev.filter((p) => p.id !== id))
  }

  const totalGeral = produtosSelecionados.reduce(
    (total, p) => total + p.precoUnitario * p.quantidade,
    0
  )

  return (
    <S.Container>
      <S.Title>Buscar Produto</S.Title>
      <S.Input
        type="text"
        placeholder="Digite o nome do produto"
        value={searchTerm}
        onChange={(e) => {
          console.log('Digitando:', e.target.value)
          setSearchTerm(e.target.value)
        }}
      />
      {produtosFiltrados && produtosFiltrados.length > 0 && (
        <S.SearchResults>
          {produtosFiltrados.map((produto) => (
            <div key={produto.id}>
              {produto.nome} - R$ {produto.precoUnitario.toFixed(2)}
              <S.Button type="button" onClick={() => adicionarProduto(produto)}>
                Adicionar
              </S.Button>
            </div>
          ))}
        </S.SearchResults>
      )}

      <S.Title>Produtos Selecionados</S.Title>
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
                <td>{produto.quantidade}</td>
                <td>{produto.precoUnitario.toFixed(2)}</td>
                <td>{(produto.quantidade * produto.precoUnitario).toFixed(2)}</td>
                <td>
                  <S.Button onClick={() => handleDeletarProdutoSelecionado(produto.id)}>
                    Remover
                  </S.Button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3}><strong>Total Geral</strong></td>
              <td colSpan={2}><strong>R$ {totalGeral.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </S.Table>
      ) : (
        <p>Nenhum produto selecionado ainda.</p>
      )}

      <S.Title>Cadastrar Novo Produto</S.Title>
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
        <S.Label htmlFor="ncm">NCM</S.Label>
        <S.Input
          type="text"
          name="ncm"
          placeholder="NCM"
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
          Ativo:
          <S.Input
            type="checkbox"
            name="ativo"
            checked={produto.ativo}
            onChange={handleChange}
          />
        </S.Label>
        <S.Label>
          Imagem:
          <S.Input type="file" accept="image/*" onChange={handleImageChange} />
        </S.Label>
        {produto.imagem && <S.ImgPreview src={produto.imagem} alt="Preview" />}

        <S.Button type="submit">Cadastrar</S.Button>
      </S.Form>
    </S.Container>
  )
}

export default Produtos
