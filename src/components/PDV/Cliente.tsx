import React, { useEffect, useState } from 'react'
import * as S from './styles'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setClienteSelecionado } from '../../store/reducers/ClienteSlice'
import {
  useAddClienteMutation,
  useUpdateClienteMutation,
  PessoaJuridica,
  CreateClienteRequest,
  PessoaFisica,
  Endereco,
  useLazyGetClienteByDocumentoQuery,
} from '../../services/api'

import {
  PageContainer,
  Card,
  Title,
  Subtitle,
  FormGrid,
  Fieldset,
  Label,
  Input,
  Button,
  ButtonGroup,
  SectionHeader,
  ErrorText
} from './styles';

interface ClienteForm {
  pessoaFisica: (PessoaFisica & { endereco: Endereco }) | null
  pessoaJuridica: (PessoaJuridica & { endereco: Endereco; email?: string }) | null
}

function formatDateToBr(dateString: string): string {
  if (!dateString.includes('-')) return dateString;
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

const Cliente = () => {
  const [documentoBusca, setDocumentoBusca] = useState('');
  const [form, setForm] = useState<ClienteForm | null>(null);
  const [documentoJaCadastrado, setDocumentoJaCadastrado] = useState(false);
  const [erroBusca, setErroBusca] = useState<string | null>(null);
  const [clienteId] = useState<string | null>(null);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [buscaPorId, setBuscaPorId] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addCliente] = useAddClienteMutation();
  const [trigger, result] = useLazyGetClienteByDocumentoQuery();
  const [updateCliente] = useUpdateClienteMutation()

  const cliente = result.data;


  useEffect(() => {
    if (cliente) {
      if (cliente.pessoaFisica) {
        const dataNascimento = cliente.pessoaFisica.dataNascimento.includes('/')
          ? cliente.pessoaFisica.dataNascimento.split('/').reverse().join('-')
          : cliente.pessoaFisica.dataNascimento;

        setForm({
          pessoaFisica: {
            ...cliente.pessoaFisica,
            dataNascimento,
            endereco: cliente.pessoaFisica.endereco || 
            {
              logradouro: '', 
              numero: '', 
              bairro: '', 
              municipio: '', 
              uf: '', 
              cep: '', 
              complemento: ''
            }
          },
          pessoaJuridica: null
        });
      } else if (cliente.pessoaJuridica) {
        setForm({
          pessoaFisica: null,
          pessoaJuridica: {
            ...cliente.pessoaJuridica,
            endereco: cliente.pessoaJuridica.endereco || 
            {
              logradouro: '', 
              numero: '', 
              bairro: '', 
              unicipio: '', 
              uf: '', 
              cep: '', 
              complemento: ''
            },
            simples: cliente.pessoaJuridica.simples || {
              mei: false,
              optante: false,
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
    const cleaned = documentoBusca.replace(/\D/g, '');
    if (cleaned.length === 11 || cleaned.length === 14) {
      const delayDebounce = setTimeout(() => {
        handleBuscaDocumento();
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [documentoBusca]);

  const handleBuscaDocumento = async () => {
    if (!documentoBusca.trim()) {
      setErroBusca('Digite um CPF/CNPJ');
      return;
    }

    try {
      const response = await trigger(documentoBusca).unwrap();

      if (response?.id) {
        setDocumentoJaCadastrado(true);
        setMostrarConfirmacao(false);
        setErroBusca(null);

        if (response.pessoaFisica) {
          const {
            nome, cpf, email, telefone, dataNascimento, endereco
          } = response.pessoaFisica;

          setForm({
            pessoaFisica: {
              nome,
              cpf,
              email,
              telefone,
              dataNascimento: dataNascimento.includes('/')
                ? dataNascimento.split('/').reverse().join('-')
                : dataNascimento,
              endereco: endereco ?? {
                logradouro: '', numero: '', bairro: '', municipio: '', uf: '', cep: '', complemento: ''
              }
            },
            pessoaJuridica: null
          });
        } else if (response.pessoaJuridica) {
          const {
            cnpj, razaoSocial, nomeFantasia, situacao, tipo, naturezaJuridica,
            porte, dataAbertura, ultimaAtualizacao, atividadesPrincipais, atividadesSecundarias,
            socios, capitalSocial, simples, endereco, telefone, inscricaoEstadual, email
          } = response.pessoaJuridica;

          setForm({
            pessoaFisica: null,
            pessoaJuridica: {
              cnpj,
              razaoSocial,
              nomeFantasia,
              situacao,
              tipo,
              naturezaJuridica,
              porte,
              dataAbertura,
              ultimaAtualizacao,
              atividadesPrincipais,
              atividadesSecundarias,
              socios,
              capitalSocial,
              simples: simples ?? {
                optante: false,
                dataExclusao: null,
                ultimaAtualizacao: null,
              },
              endereco: endereco ?? {
                logradouro: '', numero: '', bairro: '', municipio: '', uf: '', cep: '', complemento: ''
              },
              telefone,
              inscricaoEstadual,
              email
            }
          });
        }
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
    e.preventDefault();

    if (!form) {
      console.error("Formulário vazio");
      return;
    }

    const isCPF = !!form.pessoaFisica?.cpf;
    const isCNPJ = !!form.pessoaJuridica?.cnpj;

    if (!isCPF && !isCNPJ) {
      console.error("Documento inválido");
      return;
    }

    try {
      let result;

      if (documentoJaCadastrado && cliente?.id) {
        const clientePayload: CreateClienteRequest = {
          pessoaFisica: isCPF && form.pessoaFisica ? {
            nome: form.pessoaFisica.nome,
            cpf: form.pessoaFisica.cpf,
            email: form.pessoaFisica.email,
            telefone: form.pessoaFisica.telefone,
            dataNascimento: form.pessoaFisica.dataNascimento || '',
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
            dataAbertura: formatDateToBr(form.pessoaJuridica.dataAbertura),
            ultimaAtualizacao: form.pessoaJuridica.ultimaAtualizacao
              ? formatDateToBr(form.pessoaJuridica.ultimaAtualizacao)
              : null,
            atividadesPrincipais: form.pessoaJuridica.atividadesPrincipais,
            atividadesSecundarias: form.pessoaJuridica.atividadesSecundarias,
            socios: form.pessoaJuridica.socios,
            endereco: form.pessoaJuridica.endereco,
            telefone: form.pessoaJuridica.telefone,
            email: form.pessoaJuridica.email,
            inscricaoEstadual: form.pessoaJuridica.inscricaoEstadual,
            capitalSocial: form.pessoaJuridica.capitalSocial,
            simples: {
              optante: form.pessoaJuridica.simples?.optante ?? false,
              dataExclusao: form.pessoaJuridica.simples?.dataExclusao
                ? formatDateToBr(form.pessoaJuridica.simples.dataExclusao)
                : null,
              ultimaAtualizacao: form.pessoaJuridica.simples?.ultimaAtualizacao
                ? formatDateToBr(form.pessoaJuridica.simples.ultimaAtualizacao)
                : null
            }
          } : null
        };

        result = await updateCliente({
          id: cliente.id,
          ...clientePayload
        }).unwrap();

      } else {
        if (isCPF && form.pessoaFisica) {
          const payload: CreateClienteRequest = {
            pessoaFisica: {
              nome: form.pessoaFisica.nome,
              cpf: form.pessoaFisica.cpf,
              email: form.pessoaFisica.email,
              telefone: form.pessoaFisica.telefone,
              dataNascimento: form.pessoaFisica.dataNascimento,
              endereco: form.pessoaFisica.endereco
            }
          };
          result = await addCliente(payload).unwrap();

        } else if (isCNPJ && form.pessoaJuridica) {
          const payload: CreateClienteRequest = {
            pessoaJuridica: {
              cnpj: form.pessoaJuridica.cnpj,
              razaoSocial: form.pessoaJuridica.razaoSocial,
              nomeFantasia: form.pessoaJuridica.nomeFantasia,
              situacao: form.pessoaJuridica.situacao,
              tipo: form.pessoaJuridica.tipo,
              naturezaJuridica: form.pessoaJuridica.naturezaJuridica,
              porte: form.pessoaJuridica.porte,
              dataAbertura: formatDateToBr(form.pessoaJuridica.dataAbertura),
              ultimaAtualizacao: form.pessoaJuridica.ultimaAtualizacao
                ? formatDateToBr(form.pessoaJuridica.ultimaAtualizacao)
                : null,
              atividadesPrincipais: form.pessoaJuridica.atividadesPrincipais,
              atividadesSecundarias: form.pessoaJuridica.atividadesSecundarias,
              socios: form.pessoaJuridica.socios,
              endereco: form.pessoaJuridica.endereco,
              telefone: form.pessoaJuridica.telefone,
              email: form.pessoaJuridica.email || '',
              inscricaoEstadual: form.pessoaJuridica.inscricaoEstadual,
              capitalSocial: form.pessoaJuridica.capitalSocial,
              simples: {
                optante: form.pessoaJuridica.simples?.optante ?? false,
                dataExclusao: form.pessoaJuridica.simples?.dataExclusao
                  ? formatDateToBr(form.pessoaJuridica.simples.dataExclusao)
                  : null,
                ultimaAtualizacao: form.pessoaJuridica.simples?.ultimaAtualizacao
                  ? formatDateToBr(form.pessoaJuridica.simples.ultimaAtualizacao)
                  : null
              }
            }
          };
          result = await addCliente(payload).unwrap();

          console.log('Cliente salvo com sucesso:', result);
          setDocumentoBusca('');
          setDocumentoJaCadastrado(false);
          setErroBusca(null);

          const clienteFormatado = {
            id: result.id,
            tipoPessoa: result.tipoPessoa,
            pessoaFisica: result.pessoaFisica ?? null,
            pessoaJuridica: result.pessoaJuridica ?? null
          };

          dispatch(setClienteSelecionado(clienteFormatado));
          localStorage.setItem('clienteSelecionado', JSON.stringify(clienteFormatado));

          navigate('/produtos');
          console.log('✅ Resposta do backend:', clienteFormatado);

        } else {
          console.error("Payload inválido");
          return;
        }
      }

      console.log('Cliente salvo com sucesso:', result);
      setDocumentoBusca('');
      setDocumentoJaCadastrado(false);
      setErroBusca(null);

      dispatch(setClienteSelecionado(result));
      localStorage.setItem('clienteSelecionado', JSON.stringify(result));
      navigate('/produtos');
      console.log('✅ Resposta do backend:', result);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      console.log('Cliente:', cliente)
    }
  }
  return (
    <PageContainer>
      <Card>
        <SectionHeader>
          <Subtitle>
            Consulte ou cadastre um novo cliente
          </Subtitle>
        </SectionHeader>
        <FormGrid as="div">
          <Fieldset>
            <Input
              type="text"
              placeholder="CPF ou CNPJ"
              value={documentoBusca}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, '');
                if (!documentoJaCadastrado) {
                  setDocumentoBusca(valor);
                  if (valor.length === 11) {
                    setForm({
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
                      },
                      pessoaJuridica: null,
                    });
                  } else if (valor.length === 14) {
                    setForm({
                      pessoaFisica: null,
                      pessoaJuridica: {
                        cnpj: valor,
                        razaoSocial: '',
                        nomeFantasia: '',
                        situacao: '',
                        tipo: '',
                        porte: '',
                        inscricaoEstadual: '',
                        naturezaJuridica: '',
                        atividadesPrincipais: [],
                        atividadesSecundarias: [],
                        socios: [],
                        capitalSocial: 0,
                        dataAbertura: '',
                        simples: {
                          optante: false,
                          dataExclusao: null,
                          ultimaAtualizacao: null,
                          mei: true,
                        },
                        ultimaAtualizacao: null,
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
                      }
                    });
                  }
                }
              }}
              disabled={documentoJaCadastrado}
            />
          </Fieldset>
          <Fieldset>
            <Label>&nbsp;</Label>
            <ButtonGroup>
              <Button onClick={handleBuscaDocumento}>Consultar</Button>
            </ButtonGroup>
            {erroBusca && <ErrorText>{erroBusca}</ErrorText>}
          </Fieldset>
        </FormGrid>
        {mostrarConfirmacao && (
          <FormGrid as="div">
            <Fieldset>
              <Label>&nbsp;</Label>
              <Subtitle>
                Cliente já cadastrado. Deseja usar os dados existentes?
              </Subtitle>
            </Fieldset>
            <Fieldset>
              <ButtonGroup>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setBuscaPorId(true);
                    setMostrarConfirmacao(false);
                  }}
                >
                  Sim
                </Button>
                <Button onClick={() => setMostrarConfirmacao(false)}>
                  Cancelar
                </Button>
              </ButtonGroup>
            </Fieldset>
          </FormGrid>
        )}
        {form && (
          <>
            <SectionHeader>
              <Title>
                {form.pessoaFisica
                  ? 'Cadastro Pessoa Física'
                  : 'Cadastro Pessoa Jurídica'}
              </Title>
            </SectionHeader>
            <FormGrid as="form" onSubmit={handleSubmit}>
              {form.pessoaFisica && (
                <>
                  <Fieldset>
                    <Label>Nome</Label>
                    <Input
                      name="nome"
                      value={form.pessoaFisica.nome}
                      onChange={(e) => handleChange(e, 'nome', 'cliente')}
                      disabled={documentoJaCadastrado}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>CPF</Label>
                    <Input
                      name="cpf"
                      value={form.pessoaFisica.cpf}
                      onChange={(e) => handleChange(e, 'cpf', 'cliente')}
                      disabled={documentoJaCadastrado}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={form.pessoaFisica.email}
                      onChange={(e) => handleChange(e, 'email', 'cliente')}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Telefone</Label>
                    <Input
                      name="telefone"
                      value={form.pessoaFisica.telefone}
                      onChange={(e) => handleChange(e, 'telefone', 'cliente')}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Data Nascimento</Label>
                    <Input
                      type="date"
                      name="dataNascimento"
                      value={form.pessoaFisica.dataNascimento}
                      onChange={(e) =>
                        handleChange(e, 'dataNascimento', 'cliente')
                      }
                      disabled={documentoJaCadastrado}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Logradouro</Label>
                    <Input
                      name="logradouro"
                      value={form.pessoaFisica.endereco.logradouro}
                      onChange={(e) =>
                        handleChange(e, 'logradouro', 'endereco')
                      }
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Número</Label>
                    <Input
                      name="numero"
                      value={form.pessoaFisica.endereco.numero}
                      onChange={(e) => handleChange(e, 'numero', 'endereco')}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Bairro</Label>
                    <Input
                      name="bairro"
                      value={form.pessoaFisica.endereco.bairro}
                      onChange={(e) => handleChange(e, 'bairro', 'endereco')}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Município</Label>
                    <Input
                      name="municipio"
                      value={form.pessoaFisica.endereco.municipio}
                      onChange={(e) =>
                        handleChange(e, 'municipio', 'endereco')
                      }
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>UF</Label>
                    <Input
                      name="uf"
                      value={form.pessoaFisica.endereco.uf}
                      onChange={(e) => handleChange(e, 'uf', 'endereco')}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>CEP</Label>
                    <Input
                      name="cep"
                      value={form.pessoaFisica.endereco.cep}
                      onChange={(e) => handleChange(e, 'cep', 'endereco')}
                    />
                  </Fieldset>
                </>
              )}

              {form.pessoaJuridica && (
                <>
                  <Fieldset>
                    <Label>Razão Social</Label>
                    <Input
                      name="razaoSocial"
                      value={form.pessoaJuridica.razaoSocial}
                      onChange={(e) =>
                        handleChange(e, 'razaoSocial', 'cliente')
                      }
                      disabled={documentoJaCadastrado}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Nome Fantasia</Label>
                    <Input
                      name="nomeFantasia"
                      value={form.pessoaJuridica.nomeFantasia}
                      onChange={(e) =>
                        handleChange(e, 'nomeFantasia', 'cliente')
                      }
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>CNPJ</Label>
                    <Input
                      name="cnpj"
                      value={form.pessoaJuridica.cnpj}
                      onChange={(e) => handleChange(e, 'cnpj', 'cliente')}
                      disabled={documentoJaCadastrado}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Email</Label>
                    <Input
                      name="email"
                      value={form.pessoaJuridica.email}
                      onChange={(e) => handleChange(e, 'email', 'cliente')}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Telefone</Label>
                    <Input
                      name="telefone"
                      value={form.pessoaJuridica.telefone}
                      onChange={(e) => handleChange(e, 'telefone', 'cliente')}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Inscrição Estadual</Label>
                    <Input
                      name="inscricaoEstadual"
                      value={form.pessoaJuridica.inscricaoEstadual}
                      onChange={(e) =>
                        handleChange(e, 'inscricaoEstadual', 'cliente')
                      }
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Natureza Jurídica</Label>
                    <Input
                      name="naturezaJuridica"
                      value={form.pessoaJuridica.naturezaJuridica}
                      onChange={(e) =>
                        handleChange(e, 'naturezaJuridica', 'cliente')
                      }
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Data Abertura</Label>
                    <Input
                      type="date"
                      name="dataAbertura"
                      value={form.pessoaJuridica.dataAbertura}
                      onChange={(e) =>
                        handleChange(e, 'dataAbertura', 'cliente')
                      }
                      disabled={documentoJaCadastrado}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Logradouro</Label>
                    <Input
                      name="logradouro"
                      value={form.pessoaJuridica.endereco.logradouro}
                      onChange={(e) =>
                        handleChange(e, 'logradouro', 'endereco')
                      }
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Número</Label>
                    <Input
                      name="numero"
                      value={form.pessoaJuridica.endereco.numero}
                      onChange={(e) => handleChange(e, 'numero', 'endereco')}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Bairro</Label>
                    <Input
                      name="bairro"
                      value={form.pessoaJuridica.endereco.bairro}
                      onChange={(e) => handleChange(e, 'bairro', 'endereco')}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>Município</Label>
                    <Input
                      name="municipio"
                      value={form.pessoaJuridica.endereco.municipio}
                      onChange={(e) =>
                        handleChange(e, 'municipio', 'endereco')
                      }
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>UF</Label>
                    <Input
                      name="uf"
                      value={form.pessoaJuridica.endereco.uf}
                      onChange={(e) => handleChange(e, 'uf', 'endereco')}
                    />
                  </Fieldset>
                  <Fieldset>
                    <Label>CEP</Label>
                    <Input
                      name="cep"
                      value={form.pessoaJuridica.endereco.cep}
                      onChange={(e) => handleChange(e, 'cep', 'endereco')}
                    />
                  </Fieldset>
                </>
              )}
              <ButtonGroup>
                <Button type="submit">
                  {documentoJaCadastrado
                    ? 'Atualizar Cliente'
                    : 'Cadastrar Cliente'}
                </Button>
              </ButtonGroup>
            </FormGrid>
          </>
        )}
      </Card>
    </PageContainer>
  );
}
export default Cliente