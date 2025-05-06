import React, { useEffect, useState } from 'react'
import * as S from '../Clientes/styles'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setClienteSelecionado } from '../../store/reducers/ClienteSlice'
import {
  useGetClienteByDocumentoQuery,
  useGetClienteByIdQuery,
  useAddClienteMutation,
  useUpdateClienteMutation,
  useAddClientePfMutation,
  useAddClientePjMutation,
  PessoaJuridica,
  CreateClienteRequest,
  PessoaFisica,
  Endereco,
  Atividade,
  Socio,
  SimplesNacional
} from '../../services/api'

// Atualize a interface ClienteForm
interface ClienteForm {
  pessoaFisica: (PessoaFisica & { endereco: Endereco }) | null
  pessoaJuridica: (PessoaJuridica & { endereco: Endereco; email?: string }) | null
}

function formatDateToBr(dateString: string): string {
  if (!dateString.includes('-')) return dateString;
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

function parseEndereco(enderecoStr: string): Endereco {
  try {
    const [logradouroNumero, bairro, municipioUf] = enderecoStr.split(' - ')
    const [logradouro, numero] = logradouroNumero.split(', ')
    const [municipio, uf] = municipioUf.split('/')

    return {
      logradouro: logradouro?.trim() || '',
      numero: numero?.trim() || '',
      bairro: bairro?.trim() || '',
      complemento: '',
      municipio: municipio?.trim() || '',
      uf: uf?.trim() || '',
      cep: '',
    }
  } catch (e) {
    console.error('Erro ao fazer parse do endereço:', e)
    return {
      logradouro: '',
      numero: '',
      bairro: '',
      municipio: '',
      complemento: '',
      uf: '',
      cep: '',
    }
  }
}

const Cliente = () => {
  const [documentoBusca, setDocumentoBusca] = useState('')
  const [form, setForm] = useState<ClienteForm | null>(null)
  const [documentoJaCadastrado, setDocumentoJaCadastrado] = useState(false)
  const [erroBusca, setErroBusca] = useState<string | null>(null)
  const [clienteId, setClienteId] = useState<string | null>(null)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [buscaPorId, setBuscaPorId] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [addPessoaFisica] = useAddClientePfMutation()
  const [addPessoaJuridica] = useAddClientePjMutation()

  const { data: cliente } = useGetClienteByDocumentoQuery(documentoBusca, {
    skip: !documentoBusca || buscaPorId,
  })

  const { data: clientePorId } = useGetClienteByIdQuery(clienteId!, {
    skip: !buscaPorId || !clienteId,
  })

  const [addCliente] = useAddClienteMutation()
  const [updateCliente] = useUpdateClienteMutation()

  // Atualize o useEffect que lida com os dados do cliente
  useEffect(() => {
    if (cliente) {
      console.log('Dados recebidos da API:', cliente);
      if (cliente.pessoaFisica) {
        const dataNascimento = cliente.pessoaFisica.dataNascimento.includes('/')
          ? cliente.pessoaFisica.dataNascimento.split('/').reverse().join('-')
          : cliente.pessoaFisica.dataNascimento;
  
        setForm({
          pessoaFisica: {
            ...cliente.pessoaFisica,
            dataNascimento,
            endereco: cliente.pessoaFisica.endereco || {
              logradouro: '', numero: '', bairro: '', municipio: '', uf: '', cep: '', complemento: ''
            }
          },
          pessoaJuridica: null
        });
      } else if (cliente.pessoaJuridica) {
        setForm({
          pessoaFisica: null,
          pessoaJuridica: {
            ...cliente.pessoaJuridica,
            endereco: cliente.pessoaJuridica.endereco || {
              logradouro: '', numero: '', bairro: '', municipio: '', uf: '', cep: '', complemento: ''
            },
            simples: cliente.pessoaJuridica.simples || {
              optante: false,
              dataOpcao: '',
              dataExclusao: null,
              ultimaAtualizacao: null
            }
          }
        });
      }
  
      setDocumentoJaCadastrado(true);
      setErroBusca(null);
    }
  }, [cliente]);
  

  useEffect(() => {
    if (form) {
      console.log("🔥 Form realmente atualizado:", form)
    }
  }, [form])

  const handleBuscaDocumento = async () => {
    if (!documentoBusca.trim()) {
      setErroBusca('Digite um CPF/CNPJ');
      return;
    }

    try {
      if (cliente && cliente.id) {
        setDocumentoJaCadastrado(true);
        setMostrarConfirmacao(false);
        setErroBusca(null);
        // AQUI você NÃO precisa chamar setClienteId nem setBuscaPorId
        // O useEffect com [cliente] vai preencher tudo automaticamente
      } else {
        throw new Error('Cliente não encontrado');
      }
    } catch (error: any) {
      const mensagemBackend = error?.data?.message || 'Cliente não encontrado. Preencha os dados.';
      setErroBusca(mensagemBackend);

      const isCPF = documentoBusca.replace(/\D/g, '').length === 11;
      setForm({
        pessoaFisica: isCPF ? {
          nome: '',
          cpf: documentoBusca,
          email: '',
          telefone: '',
          dataNascimento: '',
          endereco: {
            logradouro: '',
            numero: '',
            bairro: '',
            municipio: '',
            uf: '',
            cep: '',
            complemento: '',
          },
        } : null,
        pessoaJuridica: !isCPF ? {
          cnpj: documentoBusca,
          razaoSocial: '',
          nomeFantasia: '',
          situacao: '',
          tipo: '',
          naturezaJuridica: '',
          porte: '',
          dataAbertura: '',
          ultimaAtualizacao: null,
          atividadesPrincipais: [],
          atividadesSecundarias: [],
          socios: [],
          capitalSocial: 0,
          simples: {
            optante: false,
            dataOpcao: '',
            dataExclusao: null,
            ultimaAtualizacao: null
          },
          endereco: {
            logradouro: '',
            numero: '',
            bairro: '',
            municipio: '',
            uf: '',
            cep: '',
            complemento: '',
          },
          telefone: '',
          inscricaoEstadual: '',
          email: ''
        } : null
      });
      setDocumentoJaCadastrado(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    campo: string,
    tipo: 'cliente' | 'endereco'
  ) => {
    if (!form) return
    const { value } = e.target

    if (tipo === 'cliente') {
      if (form.pessoaFisica) {
        setForm({
          ...form,
          pessoaFisica: {
            ...form.pessoaFisica,
            [campo]: value
          }
        })
      } else if (form.pessoaJuridica) {
        setForm({
          ...form,
          pessoaJuridica: {
            ...form.pessoaJuridica,
            [campo]: value
          }
        })
      }
    } else if (tipo === 'endereco') {
      const currentEndereco = form.pessoaFisica?.endereco || form.pessoaJuridica?.endereco || {
        logradouro: '',
        numero: '',
        bairro: '',
        municipio: '',
        uf: '',
        cep: '',
        complemento: '',
      }

      if (form.pessoaFisica) {
        setForm({
          ...form,
          pessoaFisica: {
            ...form.pessoaFisica,
            endereco: {
              ...currentEndereco,
              [campo]: value
            }
          }
        })
      } else if (form.pessoaJuridica) {
        setForm({
          ...form,
          pessoaJuridica: {
            ...form.pessoaJuridica,
            endereco: {
              ...currentEndereco,
              [campo]: value
            }
          }
        })
      }
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form) {
      console.error("Formulário vazio")
      return
    }

    const isCPF = form.pessoaFisica?.cpf ? true : false
    const isCNPJ = form.pessoaJuridica?.cnpj ? true : false

    if (!isCPF && !isCNPJ) {
      console.error("Documento inválido")
      return
    }

    try {
      const clientePayload: CreateClienteRequest = {
        tipoPessoa: isCPF ? 'FISICA' : 'JURIDICA',
        pessoaFisica: isCPF && form.pessoaFisica ? {
          nome: form.pessoaFisica.nome,
          cpf: form.pessoaFisica.cpf,
          email: form.pessoaFisica.email,
          telefone: form.pessoaFisica.telefone,
          dataNascimento: formatDateToBr(form.pessoaFisica.dataNascimento),
          endereco: form.pessoaFisica.endereco
        } : null,
        pessoaJuridica: isCNPJ && form.pessoaJuridica ? {
          cnpj: form.pessoaJuridica.cnpj,
          razaoSocial: form.pessoaJuridica.razaoSocial,
          nomeFantasia: form.pessoaJuridica.nomeFantasia,
          situacao: form.pessoaJuridica.situacao,
          tipo: form.pessoaJuridica.tipo,
          naturezaJuridica: form.pessoaJuridica.naturezaJuridica,
          porte: form.pessoaJuridica.porte,
          dataAbertura: form.pessoaJuridica.dataAbertura,
          ultimaAtualizacao: form.pessoaJuridica.ultimaAtualizacao || null,
          atividadesPrincipais: form.pessoaJuridica.atividadesPrincipais,
          atividadesSecundarias: form.pessoaJuridica.atividadesSecundarias,
          socios: form.pessoaJuridica.socios,
          capitalSocial: form.pessoaJuridica.capitalSocial,
          simples: form.pessoaJuridica.simples,
          endereco: form.pessoaJuridica.endereco,
          telefone: form.pessoaJuridica.telefone,
          inscricaoEstadual: form.pessoaJuridica.inscricaoEstadual,
          email: form.pessoaJuridica.email || ''
        } : null
      }

      let result
      if (documentoJaCadastrado && cliente?.id) {
        result = await updateCliente({
          id: cliente.id,
          ...clientePayload
        }).unwrap()
      } else {
        if (isCPF) {
          result = await addPessoaFisica(clientePayload).unwrap()
        } else {
          result = await addPessoaJuridica(clientePayload).unwrap()
        }
      }

      console.log('Cliente salvo com sucesso:', result)
      setDocumentoBusca('')
      setDocumentoJaCadastrado(false)
      setErroBusca(null)

      dispatch(setClienteSelecionado(result))
      localStorage.setItem('clienteSelecionado', JSON.stringify(result))
      navigate('/produtos')
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
    }
  }

  return (
    <S.Container>
      <div>
        <S.Section>
          <div>
            <S.Title>Digite numero do documento para cadastrar um novo cliente ou buscar um cliente já cadastrado</S.Title>
          </div>
          <div>
            <S.Input
              type="text"
              placeholder="CPF/CNPJ"
              value={documentoBusca}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, '')
                if (!documentoJaCadastrado) {
                setDocumentoBusca(valor)
                if (valor.length === 11) {
                  setForm({
                    pessoaJuridica: null,
                    pessoaFisica: {
                      cpf: valor,
                      nome: '',
                      email: '',
                      telefone: '',
                      dataNascimento: '',
                      endereco: {
                        logradouro: '',
                        numero: '',
                        bairro: '',
                        municipio: '',
                        uf: '',
                        cep: '',
                        complemento: '',
                      },
                    }
                  })
                } else if (valor.length === 14) {
                  setForm({
                    pessoaFisica: null,
                    pessoaJuridica: {
                      cnpj: valor,
                      razaoSocial: '',
                      nomeFantasia: '',
                      dataAbertura: '',
                      situacao: '',
                      tipo: '',
                      porte: '',
                      inscricaoEstadual: '',
                      naturezaJuridica: '',
                      atividadesPrincipais: [],
                      atividadesSecundarias: [],
                      socios: [],
                      capitalSocial: 0,
                      simples: {
                        optante: false,
                        dataOpcao: '',
                        dataExclusao: null,
                        ultimaAtualizacao: null
                      },
                      endereco: {
                        logradouro: '',
                        numero: '',
                        bairro: '',
                        municipio: '',
                        uf: '',
                        cep: '',
                        complemento: '',
                      },
                      telefone: '',
                      email: '',
                      ultimaAtualizacao: null
                    }
                  })
                }
              }
              }}
            />
            <S.Button type="button" onClick={handleBuscaDocumento}>
              Consultar
            </S.Button>
            {erroBusca && <S.Error>{erroBusca}</S.Error>}
          </div>
        </S.Section>

        {mostrarConfirmacao && (
          <div>
            <p>Cliente já cadastrado, deseja prosseguir com os dados já cadastrados?</p>
            <S.Button
              type="button"
              onClick={() => {
                setBuscaPorId(true)
                setMostrarConfirmacao(false)
              }}
            >
              Sim
            </S.Button>
            <S.Button
              type="button"
              onClick={() => {
                setMostrarConfirmacao(false)
              }}
            >
              Cancelar
            </S.Button>
          </div>
        )}

        {form && (
          <S.Form onSubmit={handleSubmit}>
            {form.pessoaFisica ? (
              <>
                <h3>Cadastro Pessoa Física</h3>
                <S.Input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  value={form.pessoaFisica.nome}
                  onChange={(e) => handleChange(e, 'nome', 'cliente')}
                  disabled={documentoJaCadastrado}
                />
                <S.Input
                  type="text"
                  name="cpf"
                  placeholder="CPF"
                  value={form.pessoaFisica.cpf}
                  onChange={(e) => handleChange(e, 'cpf', 'cliente')}
                  disabled={documentoJaCadastrado}
                />
                <S.Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.pessoaFisica.email}
                  onChange={(e) => handleChange(e, 'email', 'cliente')}
                />
                <S.Input
                  type="text"
                  name="telefone"
                  placeholder="Telefone"
                  value={form.pessoaFisica.telefone}
                  onChange={(e) => handleChange(e, 'telefone', 'cliente')}
                />
                <S.Input
                  type="date"
                  name="dataNascimento"
                  value={form.pessoaFisica.dataNascimento}
                  onChange={(e) => handleChange(e, 'dataNascimento', 'cliente')}
                  disabled={documentoJaCadastrado}
                />
                <S.Subtitle>Endereço</S.Subtitle>
                <S.Input
                  type="text"
                  name="logradouro"
                  placeholder="Logradouro"
                  value={form.pessoaFisica.endereco.logradouro}
                  onChange={(e) => handleChange(e, 'logradouro', 'endereco')}
                />
                <S.Input
                  type="text"
                  name="numero"
                  placeholder="Número"
                  value={form.pessoaFisica.endereco.numero}
                  onChange={(e) => handleChange(e, 'numero', 'endereco')}
                />
                <S.Input
                  type="text"
                  name="bairro"
                  placeholder="Bairro"
                  value={form.pessoaFisica.endereco.bairro}
                  onChange={(e) => handleChange(e, 'bairro', 'endereco')}
                />
                <S.Input
                  type="text"
                  name="municipio"
                  placeholder="Município"
                  value={form.pessoaFisica.endereco.municipio}
                  onChange={(e) => handleChange(e, 'municipio', 'endereco')}
                />
                <S.Input
                  type="text"
                  name="uf"
                  placeholder="UF"
                  value={form.pessoaFisica.endereco.uf}
                  onChange={(e) => handleChange(e, 'uf', 'endereco')}
                />
                <S.Input
                  type="text"
                  name="cep"
                  placeholder="CEP"
                  value={form.pessoaFisica.endereco.cep}
                  onChange={(e) => handleChange(e, 'cep', 'endereco')}
                />
              </>
            ) : form.pessoaJuridica && (
              <>
                <h3>Cadastro Pessoa Jurídica</h3>
                <S.Input
                  type="text"
                  name="razaoSocial"
                  placeholder="Razão Social"
                  value={form.pessoaJuridica.razaoSocial || ''}
                  onChange={(e) => handleChange(e, 'razaoSocial', 'cliente')}
                  disabled={documentoJaCadastrado}
                />
                <S.Input
                  type="text"
                  name="nomeFantasia"
                  placeholder="Nome Fantasia"
                  value={form.pessoaJuridica.nomeFantasia || ''}
                  onChange={(e) => handleChange(e, 'nomeFantasia', 'cliente')}
                />
                <S.Input
                  type="text"
                  name="cnpj"
                  placeholder="CNPJ"
                  value={form.pessoaJuridica.cnpj || ''}
                  onChange={(e) => handleChange(e, 'cnpj', 'cliente')}
                  disabled={documentoJaCadastrado}
                />
                <S.Input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={form.pessoaJuridica.email || ''}
                  onChange={(e) => handleChange(e, 'email', 'cliente')}
                />
                <S.Input
                  type="text"
                  name="telefone"
                  placeholder="Telefone"
                  value={form.pessoaJuridica.telefone || ''}
                  onChange={(e) => handleChange(e, 'telefone', 'cliente')}
                />
                <S.Input
                  type="text"
                  name="inscricaoEstadual"
                  placeholder="Inscrição Estadual"
                  value={form.pessoaJuridica.inscricaoEstadual || ''}
                  onChange={(e) => handleChange(e, 'inscricaoEstadual', 'cliente')}
                />
                <S.Input
                  type="text"
                  name="naturezaJuridica"
                  placeholder="Natureza Jurídica"
                  value={form.pessoaJuridica.naturezaJuridica || ''}
                  onChange={(e) => handleChange(e, 'naturezaJuridica', 'cliente')}
                />
                <S.Input
                  type="date"
                  name="dataAbertura"
                  value={form.pessoaJuridica.dataAbertura || ''}
                  onChange={(e) => handleChange(e, 'dataAbertura', 'cliente')}
                  disabled={documentoJaCadastrado}
                />
                <S.Subtitle>Endereço</S.Subtitle>
                <S.Input
                  type="text"
                  name="logradouro"
                  placeholder="Logradouro"
                  value={form.pessoaJuridica.endereco?.logradouro || ''}
                  onChange={(e) => handleChange(e, 'logradouro', 'endereco')}
                />
                <S.Input
                  type="text"
                  name="numero"
                  placeholder="Número"
                  value={form.pessoaJuridica.endereco?.numero || ''}
                  onChange={(e) => handleChange(e, 'numero', 'endereco')}
                />
                <S.Input
                  type="text"
                  name="bairro"
                  placeholder="Bairro"
                  value={form.pessoaJuridica.endereco?.bairro || ''}
                  onChange={(e) => handleChange(e, 'bairro', 'endereco')}
                />
                <S.Input
                  type="text"
                  name="municipio"
                  placeholder="Município"
                  value={form.pessoaJuridica.endereco?.municipio || ''}
                  onChange={(e) => handleChange(e, 'municipio', 'endereco')}
                />
                <S.Input
                  type="text"
                  name="uf"
                  placeholder="UF"
                  value={form.pessoaJuridica.endereco?.uf || ''}
                  onChange={(e) => handleChange(e, 'uf', 'endereco')}
                />
                <S.Input
                  type="text"
                  name="cep"
                  placeholder="CEP"
                  value={form.pessoaJuridica.endereco?.cep || ''}
                  onChange={(e) => handleChange(e, 'cep', 'endereco')}
                />
              </>
            )}
            <S.Button type="submit">
              {documentoJaCadastrado ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
            </S.Button>
          </S.Form>
        )}
      </div>
    </S.Container>
  )
}

export default Cliente