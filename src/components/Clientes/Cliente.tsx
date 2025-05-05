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

interface PessoaJuridica {
  nome: string
  cnpj: string
  email: string
  telefone: string
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

      setForm({
        pessoaFisica: {
          nome: cliente.nome ?? '',
          cpf: cliente.cpf ?? '',
          tipoPessoa: cliente.tipoPessoa ?? '',
          email: cliente.email ?? '',
          telefone: cliente.telefone ?? '',
          dataNascimento: cliente.dataNascimento ?? '',
          endereco,
          id: cliente.id ?? '',
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
  
    if (!form || !form.pessoaFisica) return;
  
    try {
      const { nome, cpf, email, telefone, dataNascimento, endereco, id } = form.pessoaFisica;
  
      const dataNascimentoFormatada =
        typeof dataNascimento === "string"
          ? dataNascimento
          : new Date(dataNascimento).toISOString().split("T")[0];
  
      const payload: any = {
        nome,
        telefone,
        pessoaFisica: {
          id: cpfJaCadastrado ? id : undefined,
          nome: nome !== cliente?.nome ? nome : undefined,
          cpf: cpf !== cliente?.cpf ? cpf : undefined,
          email: email !== cliente?.email ? email : undefined,
          telefone: telefone !== cliente?.telefone ? telefone : undefined,
          dataNascimento: dataNascimento !== cliente?.dataNascimento ? dataNascimentoFormatada : undefined,
          endereco: endereco !== cliente?.endereco ? endereco : undefined,
        },
        pessoaJuridica: form.pessoaJuridica || null,
      };
  
      for (const key in payload.pessoaFisica) {
        if (payload.pessoaFisica[key as keyof typeof payload.pessoaFisica] === undefined) {
          delete payload.pessoaFisica[key as keyof typeof payload.pessoaFisica];
        }
      }
  
      if (!cpfJaCadastrado || id === null || id === undefined) {
        delete payload.id;
      } else {
        payload.id = id;
      }
  
      let result;
  
      if (cpfJaCadastrado && id !== null && id !== undefined) {
        result = await updateCliente(payload).unwrap(); 
      } else {
        result = await addCliente(payload).unwrap(); 
      }
  
      if (typeof result === "string" && result === "Cliente criado com sucesso!") {
        console.log("Cliente criado com sucesso");
  
        const clienteSalvo = {
          nome: payload.nome,
          pessoaFisica: {
            ...form.pessoaFisica,
            dataNascimento: dataNascimentoFormatada,
          },
          pessoaJuridica: form.pessoaJuridica || null,
        };
  
        setForm({
          pessoaFisica: clienteSalvo.pessoaFisica,
          pessoaJuridica: clienteSalvo.pessoaJuridica,
        });
  
        setCpfBusca("");
        setCpfJaCadastrado(false);
        setErroBusca(null);
  
        dispatch(setClienteSelecionado(clienteSalvo));
        localStorage.setItem("clienteSelecionado", JSON.stringify(clienteSalvo));
  
        console.log("Navegando para produtos...");
        navigate("/produtos");
        return;
      }
  
      if (result && typeof result === "object" && "cliente" in result) {
        const cliente = result.cliente;
  
        setForm({
          pessoaFisica: cliente.pessoaFisica,
          pessoaJuridica: cliente.pessoaJuridica || null,
        });
  
        setCpfBusca("");
        setCpfJaCadastrado(false);
        setErroBusca(null);
  
        dispatch(setClienteSelecionado(cliente));
        localStorage.setItem("clienteSelecionado", JSON.stringify(cliente));
  
        console.log("Navegando para produtos...");
        navigate("/produtos");
        return;
      }
  
      console.error("Erro: Cliente não foi salvo corretamente ou resposta inválida");
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  }
  
  
  return (
    <S.Container>
      <div>
        <S.Section>
          <div>
            <S.Title>Digite CPF para cadastrar um novo cliente ou buscar um cliente já cadastrado</S.Title>
          </div>
          <div>
            <S.Input
              type="text"
              placeholder="Digite o CPF"
              value={cpfBusca}
              onChange={(e) => setCpfBusca(e.target.value)}
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
              name="cpf"
              placeholder="CPF"
              value={form.pessoaFisica?.cpf || ''}
              onChange={(e) => handleChange(e, 'cpf', 'cliente')}
              disabled={cpfJaCadastrado}
            />
            <S.Input
              type="text"
              name="tipo"
              placeholder="Tipo"
              value={form.pessoaFisica?.tipoPessoa || ''}
              onChange={(e) => handleChange(e, 'tipoPessoa', 'cliente')}
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
              value={form.pessoaFisica?.endereco.logradouro || ''}
              onChange={(e) => handleChange(e, 'logradouro', 'endereco')}
            />
            <S.Input
              type="text"
              name="numero"
              placeholder="Número"
              value={form.pessoaFisica?.endereco.numero || ''}
              onChange={(e) => handleChange(e, 'numero', 'endereco')}
            />
            <S.Input
              type="text"
              name="bairro"
              placeholder="Bairro"
              value={form.pessoaFisica?.endereco.bairro || ''}
              onChange={(e) => handleChange(e, 'bairro', 'endereco')}
            />
            <S.Input
              type="text"
              name="municipio"
              placeholder="Município"
              value={form.pessoaFisica?.endereco.municipio || ''}
              onChange={(e) => handleChange(e, 'municipio', 'endereco')}
            />
            <S.Input
              type="text"
              name="uf"
              placeholder="UF"
              value={form.pessoaFisica?.endereco.uf || ''}
              onChange={(e) => handleChange(e, 'uf', 'endereco')}
            />
            <S.Input
              type="text"
              name="cep"
              placeholder="CEP"
              value={form.pessoaFisica?.endereco.cep || ''}
              onChange={(e) => handleChange(e, 'cep', 'endereco')}
            />
            <S.Button type="submit">
              {cpfJaCadastrado ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
            </S.Button>
          </S.Form>
        )}
      </div>
    </S.Container>
  );
}

export default Cliente;
