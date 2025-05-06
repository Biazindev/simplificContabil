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
  useAddClientePfMutation, 
  useAddClientePjMutation,
  PessoaJuridica,
} from '../../services/api'

export type Cliente = {
  id: number;
  pessoaFisica?: PessoaFisica;
  pessoaJuridica?: PessoaJuridica;
}

export interface ResponseData {
  status: number;
  data: {
    cliente: {
      pessoaFisica: any
      pessoaJuridica: any
    }
  }
}

export type CreateClienteRequest = {
  pessoaFisica?: {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    endereco: any;
  };
  pessoaJuridica?: {
    cnpj: string;
    dataAbertura: string;
    situacao: string;
    tipo: string;
    nomeFantasia: string;
    porte: string;
    razaoSocial: string;
    inscricaoEstadual: string;
    naturezaJuridica: string;
    atividadesPrincipais: string[];
    atividadesSecundarias: string[];
    socios: any[];
    capitalSocial: number;
    simples: any;
    endereco: any;
    telefone: string;
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
  email: string
  telefone: string
  dataNascimento: string
  endereco: Endereco
}

interface ClienteForm {
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
  const [addPessoaFisica] = useAddClientePfMutation();
  const [addPessoaJuridica] = useAddClientePjMutation();



  const { data: cliente } = useGetClienteByCpfQuery(cpfBusca, {
    skip: !cpfBusca || buscaPorId,
  })

  const { data: clientePorId } = useGetClienteByIdQuery(clienteId!, {
    skip: !buscaPorId || !clienteId,
  })

  const [addCliente] = useAddClienteMutation()
  const [updateCliente] = useUpdateClienteMutation()

  useEffect(() => {
    if (cliente) {
      const endereco =
        typeof cliente.pessoaFisica?.endereco === 'string'
          ? parseEndereco(cliente.pessoaFisica.endereco)
          : cliente.pessoaFisica?.endereco ?? {
              logradouro: '',
              numero: '',
              bairro: '',
              municipio: '',
              uf: '',
              cep: '',
            };
  
      let dataInputValue = '';
      if (cliente.pessoaFisica?.dataNascimento) {
        const parts = cliente.pessoaFisica.dataNascimento.split('/');
        if (parts.length === 3) {
          const [d, m, y] = parts;
          dataInputValue = `${y.padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }
      }
  
      setForm({
        pessoaFisica: {
          nome: cliente.pessoaFisica?.nome ?? '',
          cpf: cliente.pessoaFisica?.cpf ?? '',
          email: cliente.pessoaFisica?.email ?? '',
          telefone: cliente.pessoaFisica?.telefone ?? '',
          dataNascimento: dataInputValue,
          endereco,
          id: cliente.pessoaFisica?.id ?? 0,
        },
        pessoaJuridica: cliente.pessoaJuridica ?? null,
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
      clientePorId();
      if (cliente) {
        if (cliente.id) {
          setClienteId(String(cliente.id));
          setMostrarConfirmacao(true);
  
          if (cpfJaCadastrado) {
            await atualizarCliente(cliente.id, form);
          } else {
            await criarCliente(form);
          }
        } else {
          throw new Error('Cliente não encontrado');
        }
      }
    } catch (error: any) {
      const mensagemBackend =
        (error?.data && error.data.message) || 'Cliente não encontrado. Preencha os dados.';
  
      setErroBusca(mensagemBackend);
      setForm({
        pessoaFisica: {
          id: 0,
          nome: '',
          cpf: cpfBusca,
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
  
  const atualizarCliente = async (id: number, formData: any) => {
    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar cliente');
      }
      console.log('Cliente atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  }
  
  const criarCliente = async (formData: any) => {
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Erro ao criar cliente');
      }
      console.log('Cliente criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
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
  
    if (!form) {
      console.error("Formulário vazio");
      return;
    }
  
    // Verifique se pessoaFisica ou pessoaJuridica estão preenchidos
    const documento = form.pessoaFisica?.cpf || form.pessoaJuridica?.cnpj;
    if (!documento) {
      console.error("CPF ou CNPJ não fornecido");
      return;
    }
  
    const isCPF = documento.replace(/\D/g, '').length === 11;
    const isCNPJ = documento.replace(/\D/g, '').length === 14;
  
    if (!isCPF && !isCNPJ) {
      console.error("Documento inválido");
      return;
    }
  
    try {
      const clientePayload: any = {
        pessoaFisica: null,
        pessoaJuridica: null,
      };
  
      // Validação para Pessoa Física
      if (isCPF && form.pessoaFisica) {
        const { nome, cpf, email, telefone, dataNascimento, endereco } = form.pessoaFisica;
  
        if (!nome || !cpf || !email) {
          console.error("Campos obrigatórios da Pessoa Física não preenchidos");
          return;
        }
  
        const [year, month, day] = dataNascimento?.split('-') || [];
        const dataFormatada = day && month && year
          ? `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
          : undefined;
  
        const pessoaFisicaPayload = {
          nome,
          cpf,
          email,
          telefone,
          dataNascimento: dataFormatada,
          endereco,
        };
  
        clientePayload.pessoaFisica = pessoaFisicaPayload;
  
        if (!cpfJaCadastrado) {
          await addPessoaFisica(pessoaFisicaPayload).unwrap();
        }
      }
  
      // Validação para Pessoa Jurídica
      if (isCNPJ && form.pessoaJuridica) {
        const {
          nomeFantasia, cnpj, email, telefone, endereco, id,
          dataAbertura, situacao, tipo, porte, razaoSocial,
          inscricaoEstadual, naturezaJuridica, atividadesPrincipais,
          atividadesSecundarias, socios, capitalSocial, simples,
        } = form.pessoaJuridica;
  
        if (!nomeFantasia || !cnpj || !email) {
          console.error("Campos obrigatórios da Pessoa Jurídica não preenchidos");
          return;
        }
  
        const pessoaJuridicaPayload = {
          cnpj,
          dataAbertura,
          situacao,
          tipo,
          nomeFantasia,
          porte,
          razaoSocial,
          inscricaoEstadual,
          naturezaJuridica,
          atividadesPrincipais,
          atividadesSecundarias,
          socios,
          capitalSocial,
          simples,
          endereco,
          telefone,
        };
  
        clientePayload.pessoaJuridica = {
          nome: nomeFantasia,
          cnpj,
          email,
          telefone,
          endereco,
        };
  
        // Só adiciona nova pessoa jurídica se for cadastro novo
        if (!form.pessoaJuridica?.id) {
          await addPessoaJuridica(pessoaJuridicaPayload).unwrap();
        }
      }
  
      let result;
  
      // Se CPF já cadastrado e atualizado
      if (isCPF && cpfJaCadastrado && form.pessoaFisica?.id) {
        result = await updateCliente({
          id: form.pessoaFisica.id,
          ...clientePayload,
        }).unwrap();
      } else if (isCNPJ && form.pessoaJuridica?.id) {
        result = await updateCliente({
          id: form.pessoaJuridica.id,
          ...clientePayload,
        }).unwrap();
      } else {
        result = await addCliente(clientePayload).unwrap();
      }
  
      console.log('Cliente salvo com sucesso:', result);
  
      setCpfBusca('');
      setCpfJaCadastrado(false);
      setErroBusca(null);
  
      dispatch(setClienteSelecionado(result));
      localStorage.setItem('clienteSelecionado', JSON.stringify(result));
      navigate('/produtos');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };
  
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
                setCpfBusca(valor)
                if (valor.length === 11) {
                  setForm((prevForm) => {
                    if (!prevForm) return prevForm;
                    return {
                      ...prevForm,
                      pessoaJuridica: null,
                      pessoaFisica: prevForm.pessoaFisica || {
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
                        },
                      },
                    }
                  })                  
                } else if (valor.length === 14) {
                  setForm((prevForm) => {
                    if (!prevForm) return prevForm;
                    return {
                      ...prevForm,
                      pessoaFisica: null,
                      pessoaJuridica: prevForm.pessoaJuridica || {
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
                        capitalSocial: '',
                        simples: {
                          simples: false,
                          mei: false,
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
  
        {form && (<S.Form onSubmit={handleSubmit}>
  <h3>Cadastro Pessoa Física</h3>
  <S.Input
    type="text"
    name="nome"
    placeholder="Nome"
    value={form?.pessoaFisica?.nome || ''}
    onChange={(e) => handleChange(e, 'nome', 'cliente')}
    disabled={cpfJaCadastrado}
  />
  <S.Input
    type="text"
    name="cpf"
    placeholder="CPF"
    value={form?.pessoaFisica?.cpf || ''}
    onChange={(e) => handleChange(e, 'cpf', 'cliente')}
    disabled={cpfJaCadastrado}
  />
  <S.Input
    type="email"
    name="email"
    placeholder="Email"
    value={form?.pessoaFisica?.email || ''}
    onChange={(e) => handleChange(e, 'email', 'cliente')}
  />
  <S.Input
    type="text"
    name="telefone"
    placeholder="Telefone"
    value={form?.pessoaFisica?.telefone || ''}
    onChange={(e) => handleChange(e, 'telefone', 'cliente')}
  />
  <S.Input
    type="date"
    name="dataNascimento"
    value={form?.pessoaFisica?.dataNascimento || ''}
    onChange={(e) => handleChange(e, 'dataNascimento', 'cliente')}
    disabled={cpfJaCadastrado}
  />
  <S.Subtitle>Endereço</S.Subtitle>
  <S.Input
    type="text"
    name="logradouro"
    placeholder="Logradouro"
    value={form?.pessoaFisica?.endereco?.logradouro || ''}
    onChange={(e) => handleChange(e, 'logradouro', 'endereco')}
  />
  <S.Input
    type="text"
    name="numero"
    placeholder="Número"
    value={form?.pessoaFisica?.endereco?.numero || ''}
    onChange={(e) => handleChange(e, 'numero', 'endereco')}
  />
  <S.Input
    type="text"
    name="bairro"
    placeholder="Bairro"
    value={form?.pessoaFisica?.endereco?.bairro || ''}
    onChange={(e) => handleChange(e, 'bairro', 'endereco')}
  />
  <S.Input
    type="text"
    name="municipio"
    placeholder="Município"
    value={form?.pessoaFisica?.endereco?.municipio || ''}
    onChange={(e) => handleChange(e, 'municipio', 'endereco')}
  />
  <S.Input
    type="text"
    name="uf"
    placeholder="UF"
    value={form?.pessoaFisica?.endereco?.uf || ''}
    onChange={(e) => handleChange(e, 'uf', 'endereco')}
  />
  <S.Input
    type="text"
    name="cep"
    placeholder="CEP"
    value={form?.pessoaFisica?.endereco?.cep || ''}
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
