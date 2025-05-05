import React, { useEffect, useState } from 'react'
import * as S from '../Clientes/styles'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setClienteSelecionado } from '../../store/reducers/ClienteSlice'

import {
  useGetClienteByCpfQuery,
  useGetClienteByIdQuery,
  useAddClienteMutation,
  useUpdateClienteMutation,
  ClienteProps,
  PessoaJuridica,
} from '../../services/api'


export interface ResponseData {
  status: number;
  data: {
    cliente: {
      pessoaFisica: any
      pessoaJuridica: any
    }
  }
}

export interface Endereco {
  cep: string
  bairro: string
  municipio: string
  logradouro: string
  numero: string
  uf: string
  complemento?: string
}

interface PessoaFisica {
  id?: number
  nome: string
  cpf: string
  tipoPessoa: string
  email: string
  telefone: string
  dataNascimento: string
  endereco: Endereco
}

interface ClienteForm {
  tipoPessoa: string | number | readonly string[] | undefined
  pessoaFisica: PessoaFisica | null
  pessoaJuridica: PessoaJuridica | null
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
  const [cpfBusca, setCpfBusca] = useState('')
  const [form, setForm] = useState<ClienteForm | null>(null)
  const [cpfJaCadastrado, setCpfJaCadastrado] = useState(false)
  const [erroBusca, setErroBusca] = useState<string | null>(null)
  const [clienteId, setClienteId] = useState<string | null>(null)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [buscaPorId, setBuscaPorId] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()



  const { data: cliente, error, isLoading } = useGetClienteByCpfQuery(cpfBusca, {
    skip: !cpfBusca || buscaPorId,
  })

  const { data: clientePorId } = useGetClienteByIdQuery(clienteId!, {
    skip: !buscaPorId || !clienteId,
  })

  const [addCliente] = useAddClienteMutation()
  const [updateCliente] = useUpdateClienteMutation()

  useEffect(() => {
    if (cliente) {
      // 1) monta o endereço como antes
      const endereco =
        typeof cliente.endereco === 'string'
          ? parseEndereco(cliente.endereco)
          : cliente.endereco ?? {
            logradouro: '',
            numero: '',
            bairro: '',
            municipio: '',
            uf: '',
            cep: '',
          };

      // 2) converte data de "dd/MM/yyyy" para "yyyy-MM-dd" para o <input type="date">
      let dataInputValue = '';
      if (cliente.dataNascimento) {
        const parts = cliente.dataNascimento.split('/');
        // espera ["dd","MM","yyyy"]
        if (parts.length === 3) {
          const [d, m, y] = parts;
          dataInputValue = `${y.padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }
      }

      // 3) monta o form exatamente como antes, mas usando dataInputValue
      setForm({
        tipoPessoa: cliente.tipoPessoa ?? 'FISICA',
        pessoaFisica: {
          nome: cliente.nome ?? '',
          cpf: cliente.cpf ?? '',
          tipoPessoa: cliente.tipoPessoa ?? 'FISICA',
          email: cliente.email ?? '',
          telefone: cliente.telefone ?? '',
          dataNascimento: dataInputValue,
          endereco,
          id: cliente.id ?? 0,
        },
        pessoaJuridica: null,
      });

      setCpfJaCadastrado(true);
      setErroBusca(null);
      setBuscaPorId(false);
    }
  }, [cliente]);


  const handleBuscaCpf = async () => {
    if (!cpfBusca.trim()) {
      setErroBusca('Digite um CPF');
      return;
    }

    try {
      clientePorId()
      if (cliente) {
        if (cliente.id) {
          setClienteId(String(cliente.id));
          setMostrarConfirmacao(true);
        } else {
          throw new Error('Cliente não encontrado');
        }
      }
    } catch (error: any) {
      const mensagemBackend =
        (error?.data && error.data.message) || 'Cliente não encontrado. Preencha os dados.';

      setErroBusca(mensagemBackend);
      setForm({
        tipoPessoa: 'FISICA',
        pessoaFisica: {
          id: 0,
          nome: '',
          cpf: cpfBusca,
          tipoPessoa: '',
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
      setCpfJaCadastrado(false);
    }
  }


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    campo: string,
    tipo: 'cliente' | 'endereco'
  ) => {
    if (!form) return
    const { value } = e.target

    if (tipo === 'cliente' && form.pessoaFisica) {
      setForm({
        ...form,
        pessoaFisica: {
          ...form.pessoaFisica,
          [campo]: value,
        },
      })
    } else if (tipo === 'endereco' && form.pessoaFisica) {
      setForm({
        ...form,
        pessoaFisica: {
          ...form.pessoaFisica,
          endereco: {
            ...form.pessoaFisica.endereco,
            [campo]: value,
          },
        },
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) return;

    const isPessoaFisica = !!form.pessoaFisica;
    const isPessoaJuridica = !!form.pessoaJuridica;

    if (!isPessoaFisica && !isPessoaJuridica) return;

    try {
      const payload: any = {
        nome: isPessoaFisica ? form.pessoaFisica!.nome : form.pessoaJuridica!.nome,
        tipoPessoa: isPessoaFisica ? 'FISICA' : 'JURIDICA',
        pessoaFisica: null,
        pessoaJuridica: null,
      };

      if (isPessoaFisica) {
        const { nome, cpf, email, telefone, dataNascimento, endereco, id } = form.pessoaFisica!;

        // NOVA LÓGICA: só formata se houver valor válido no campo
        let dataNascimentoFormatada: string | undefined;
        if (dataNascimento) {
          // o input type="date" retorna "yyyy-MM-dd"
          const [year, month, day] = dataNascimento.split('-');
          if (year && month && day) {
            // aqui monta no formato "dd/MM/yyyy"
            dataNascimentoFormatada = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
          }
        }

        const pessoaFisicaPayload: any = {
          id: cpfJaCadastrado ? id : undefined,
          nome,
          cpf,
          email,
          telefone,
          // só inclui se realmente formatou
          ...(dataNascimentoFormatada && { dataNascimento: dataNascimentoFormatada }),
          endereco,
        };

        // mantém seu loop de limpeza de undefined
        for (const key in pessoaFisicaPayload) {
          if (pessoaFisicaPayload[key as keyof typeof pessoaFisicaPayload] === undefined) {
            delete pessoaFisicaPayload[key as keyof typeof pessoaFisicaPayload];
          }
        }

        payload.pessoaFisica = pessoaFisicaPayload;
      }

      if (isPessoaJuridica) {
        const { nome, cnpj, email, telefone, endereco, id } = form.pessoaJuridica!;

        const pessoaJuridicaPayload = {
          id: id ?? undefined,
          nome,
          cnpj,
          email,
          telefone,
          endereco,
        };

        for (const key in pessoaJuridicaPayload) {
          if (pessoaJuridicaPayload[key as keyof typeof pessoaJuridicaPayload] === undefined) {
            delete pessoaJuridicaPayload[key as keyof typeof pessoaJuridicaPayload];
          }
        }

        payload.pessoaJuridica = pessoaJuridicaPayload;
      }

      if (!cpfJaCadastrado || form.pessoaFisica?.id == null) {
        delete payload.id;
      } else {
        payload.id = form.pessoaFisica?.id;
      }

      let result;
      if (cpfJaCadastrado && form.pessoaFisica?.id != null) {
        result = await updateCliente(payload).unwrap();
      } else {
        result = await addCliente(payload).unwrap();
      }

      if (typeof result === 'string' && result === 'Cliente criado com sucesso!') {
        console.log('Cliente criado com sucesso');

        const clienteSalvo = {
          nome: payload.nome,
          pessoaFisica: isPessoaFisica
            ? {
              ...form.pessoaFisica,
              dataNascimento: payload.pessoaFisica?.dataNascimento,
            }
            : null,
          pessoaJuridica: form.pessoaJuridica || null,
        };
        setForm({
          tipoPessoa: clienteSalvo.pessoaFisica ? 'FISICA' : 'JURIDICA',
          pessoaFisica: clienteSalvo.pessoaFisica
            ? {
              id: clienteSalvo.pessoaFisica.id ?? 0,
              nome: clienteSalvo.pessoaFisica.nome ?? '',
              cpf: clienteSalvo.pessoaFisica.cpf ?? '',
              tipoPessoa: clienteSalvo.pessoaFisica.tipoPessoa ?? 'FISICA',
              email: clienteSalvo.pessoaFisica.email ?? '',
              telefone: clienteSalvo.pessoaFisica.telefone ?? '',
              dataNascimento: clienteSalvo.pessoaFisica.dataNascimento ?? '',
              endereco: clienteSalvo.pessoaFisica.endereco ?? {
                logradouro: '',
                numero: '',
                bairro: '',
                municipio: '',
                uf: '',
                cep: '',
                complemento: '',
              },
            }
            : null,
          pessoaJuridica: clienteSalvo.pessoaJuridica ?? null,
        });

        setCpfBusca('');
        setCpfJaCadastrado(false);
        setErroBusca(null);

        dispatch(setClienteSelecionado(clienteSalvo));
        localStorage.setItem('clienteSelecionado', JSON.stringify(clienteSalvo));
        console.log('Navegando para produtos...');
        navigate('/produtos');
        return;
      }
      if (
        result &&
        typeof result === 'object' &&
        'data' in result &&
        result.data &&
        typeof result.data === 'object'
      ) {
        const cliente = result.data as ClienteProps;
        setForm({
          tipoPessoa: cliente.pessoaFisica ? 'FISICA' : 'JURIDICA',
          pessoaFisica: cliente.pessoaFisica
            ? { ...cliente.pessoaFisica, tipoPessoa: 'FISICA' }
            : null,

          pessoaJuridica: cliente.pessoaJuridica
            ? {
              nome: cliente.pessoaJuridica.nome ?? '',
              email: cliente.pessoaJuridica.email ?? '',
              cnpj: cliente.pessoaJuridica.cnpj ?? '',
              telefone: cliente.pessoaJuridica.telefone ?? '',
              endereco: cliente.pessoaJuridica.endereco ?? undefined,
            }
            : null,
        });
        setCpfBusca('');
        setCpfJaCadastrado(false);
        setErroBusca(null);
        dispatch(setClienteSelecionado(cliente));
        localStorage.setItem('clienteSelecionado', JSON.stringify(cliente));
        console.log('Navegando para produtos...');
        navigate('/produtos');
      }
      console.error('Erro: Cliente não foi salvo corretamente ou resposta inválida');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
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
              value={cpfBusca}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, '')
                setCpfBusca(valor);
                if (valor.length === 11) {
                  setForm((prevForm) => {
                    if (!prevForm) {
                      return {
                        tipoPessoa: 'FISICA',
                        pessoaJuridica: null,
                        pessoaFisica: {
                          cpf: valor,
                          nome: '',
                          email: '',
                          telefone: '',
                          dataNascimento: '',
                          tipoPessoa: 'FISICA',
                          endereco: {
                            logradouro: '',
                            numero: '',
                            bairro: '',
                            municipio: '',
                            uf: '',
                            cep: '',
                          },
                        },
                      };
                    }
                    return {
                      ...prevForm,
                      tipoPessoa: 'FISICA',
                      pessoaJuridica: null,
                      pessoaFisica: prevForm.pessoaFisica || {
                        cpf: valor,
                        nome: '',
                        email: '',
                        telefone: '',
                        dataNascimento: '',
                        tipoPessoa: 'FISICA',
                        endereco: {
                          logradouro: '',
                          numero: '',
                          bairro: '',
                          municipio: '',
                          uf: '',
                          cep: '',
                        },
                      },
                    };
                  });
                }
                else if (valor.length === 14) {
                  setForm((prevForm) => {
                    if (!prevForm) {
                      return {
                        tipoPessoa: 'JURIDICA',
                        pessoaFisica: null,
                        pessoaJuridica: {
                          cnpj: valor,
                          razaoSocial: '',
                          nomeFantasia: '',
                          email: '',
                          telefone: '',
                          endereco: {
                            logradouro: '',
                            numero: '',
                            bairro: '',
                            municipio: '',
                            uf: '',
                            cep: '',
                          },
                        },
                      };
                    }
                    return {
                      ...prevForm,
                      tipoPessoa: 'JURIDICA',
                      pessoaFisica: null,
                      pessoaJuridica: prevForm.pessoaJuridica || {
                        cnpj: valor,
                        razaoSocial: '',
                        nomeFantasia: '',
                        email: '',
                        telefone: '',
                        endereco: {
                          logradouro: '',
                          numero: '',
                          bairro: '',
                          municipio: '',
                          uf: '',
                          cep: '',
                        },
                      },
                    };
                  });

                }
              }}
            />
            <S.Button type="button" onClick={handleBuscaCpf}>
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
            <h3>Cadastro Pessoa Física</h3>
            <S.Input
              type="text"
              name="nome"
              placeholder="Nome"
              value={form.pessoaFisica?.nome || ''}
              onChange={(e) => handleChange(e, 'nome', 'cliente')}
              disabled={cpfJaCadastrado}
            />
            <S.Input
              type="text"
              name="tipoPessoa"
              placeholder="Tipo de Pessoa"
              value={form ? form.tipoPessoa : 'FISICA'}
              onChange={(e) => setForm((prevForm) => prevForm ? { ...prevForm, tipoPessoa: e.target.value } : null)}
              disabled
            />
            <S.Input
              type="text"
              name="cpf"
              placeholder="CPF"
              value={form.pessoaFisica?.cpf || ''}
              onChange={(e) => handleChange(e, 'cpf', 'cliente')}
              disabled={cpfJaCadastrado}
            />
            <S.Input
              type="email"
              name="email"
              placeholder="Email"
              value={form.pessoaFisica?.email || ''}
              onChange={(e) => handleChange(e, 'email', 'cliente')}
            />
            <S.Input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={form.pessoaFisica?.telefone || ''}
              onChange={(e) => handleChange(e, 'telefone', 'cliente')}
            />
            <S.Input
              type="date"
              name="dataNascimento"
              value={form.pessoaFisica?.dataNascimento || ''}
              onChange={(e) => handleChange(e, 'dataNascimento', 'cliente')}
              disabled={cpfJaCadastrado}
            />
            <S.Subtitle>Endereço</S.Subtitle>
            <S.Input
              type="text"
              name="logradouro"
              placeholder="Logradouro"
              value={form.pessoaFisica?.endereco?.logradouro || ''}
              onChange={(e) => handleChange(e, 'logradouro', 'endereco')}
            />
            <S.Input
              type="text"
              name="numero"
              placeholder="Número"
              value={form.pessoaFisica?.endereco?.numero || ''}
              onChange={(e) => handleChange(e, 'numero', 'endereco')}
            />
            <S.Input
              type="text"
              name="bairro"
              placeholder="Bairro"
              value={form.pessoaFisica?.endereco?.bairro || ''}
              onChange={(e) => handleChange(e, 'bairro', 'endereco')}
            />
            <S.Input
              type="text"
              name="municipio"
              placeholder="Município"
              value={form.pessoaFisica?.endereco?.municipio || ''}
              onChange={(e) => handleChange(e, 'municipio', 'endereco')}
            />
            <S.Input
              type="text"
              name="uf"
              placeholder="UF"
              value={form.pessoaFisica?.endereco?.uf || ''}
              onChange={(e) => handleChange(e, 'uf', 'endereco')}
            />
            <S.Input
              type="text"
              name="cep"
              placeholder="CEP"
              value={form.pessoaFisica?.endereco?.cep || ''}
              onChange={(e) => handleChange(e, 'cep', 'endereco')}
            />

            <S.Button type="submit">
              {cpfJaCadastrado ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
            </S.Button>
          </S.Form>
        )}
      </div>
    </S.Container>
  )
}

export default Cliente
