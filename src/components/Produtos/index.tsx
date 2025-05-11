import { useState, useEffect } from 'react'
import {
  useAddProdutoMutation,
  useDeleteProdutoMutation,
  useGetProdutosByNameQuery
} from '../../services/api'

import { FaArrowRight } from "react-icons/fa"
import * as S from './styles'
import { useNavigate } from 'react-router-dom'

const parseCurrency = (value: string): number => {
  return Number(value.replace(/\./g, '').replace(',', '.')) || 0
}

type ProdutoProps = {
  id: number
  nome: string
  descricao: string
  precoUnitario: number
  ncm: string
  dataVencimento: string
  ativo: boolean
  quantidade: number
  observacao?: string | null
  imagem?: string | null
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

  const [produto, setProduto] = useState<Omit<ProdutoProps, 'id'>>({
    nome: '',
    descricao: '',
    precoUnitario: 0,
    ncm: '',
    dataVencimento: '',
    ativo: true,
    quantidade: 0,
    observacao: '',
    imagem: null
  })

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
        [name]: name === 'quantidade' ? Number(value) : value,
        dataVencimento: formatForJava(new Date())
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
        dataVencimento: '',
        quantidade: 0,
        observacao: '',
        imagem: null
      })
      setMostrarFormulario(false)
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error)
      alert('Erro ao cadastrar produto.')
    }
  }

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

  const totalGeral = produtosSelecionados.reduce(
    (total, p) => total + p.precoUnitario * p.quantidade,
    0
  )
  console.log('Produtos selecionados:', produtosSelecionados)
  return (
    <S.Container>
      <S.TopBar>
        <div>
          <S.Title>
            Buscar Produto
            {cliente && cliente.pessoaFisica ? (
              <span style={{ fontSize: '0.9rem', marginLeft: '12px', color: '#666' }}>
                Cliente: {cliente.pessoaFisica.nome}
              </span>
            ) : (
              <span style={{ fontSize: '0.9rem', marginLeft: '12px', color: '#666' }}>
                Cliente: Não encontrado
              </span>
            )}
          </S.Title>
        </div>
        <div>
          {!mostrarFormulario && (
            <S.Button onClick={() => setMostrarFormulario(true)}>
              Cadastrar Produto
            </S.Button>
          )}
        </div>
      </S.TopBar>

      <S.GridContent>
        <div>
          <S.Input
            type="text"
            placeholder="Digite o nome do produto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {produtosFiltrados && produtosFiltrados.length > 0 && (
            <S.SearchResults>
              {produtosFiltrados.map((produto) => (
                <div key={produto.id}>
                  {produto.nome} - R$ {produto.precoUnitario.toFixed(2)}
                  <S.Input
                    type="number"
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
                    onClick={() => adicionarProduto(produto, quantidadesTemp[produto.id] || 1)}
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
              <S.Label htmlFor="precoUnitario">Data de Vencimento </S.Label>
              <S.Input
                type="text"
                name="dataVencimento"
                placeholder="Data de vencimento"
                value={produto.dataVencimento}
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
          </div>
        )}
      </S.GridContent>

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
                    <S.Input
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
                  localStorage.setItem('clienteSelecionado', JSON.stringify(cliente))
                  localStorage.setItem('produtosSelecionados', JSON.stringify(produtosSelecionados))
                  navigate('/venda')
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
  )
}

export default Produtos
