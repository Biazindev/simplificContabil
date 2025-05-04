import React, { useState } from 'react'
import * as S from '../Clientes/styles'
import {
  useGetClienteByCpfQuery,
  useAddClienteMutation,
} from '../../services/api'

export interface Endereco {
  cep: string
  bairro: string
  municipio: string
  logradouro: string
  numero: string
  uf: string
  complemento?: string        // agora opcional
}

interface PessoaFisica {
  nome: string
  cpf: string
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
  pessoaFisica: PessoaFisica | null | undefined
  pessoaJuridica: PessoaJuridica | null | undefined
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
    };
  } catch (e) {
    console.error('Erro ao fazer parse do endereço:', e);
    return {
      logradouro: '',
      numero: '',
      bairro: '',
      municipio: '',
      complemento: '',
      uf: '',
      cep: '',
    };
  }
}

function stringifyEndereco(endereco: Endereco): string {
  return `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro} - ${endereco.municipio}/${endereco.uf}`;
}

const Cliente = () => {
  const [cpfBusca, setCpfBusca] = useState('')
  const [form, setForm] = useState<ClienteForm | null>(null)
  const [cpfJaCadastrado, setCpfJaCadastrado] = useState(false)
  const [erroBusca, setErroBusca] = useState<string | null>(null)

  const { data: cliente, error } = useGetClienteByCpfQuery(cpfBusca, {
    skip: !cpfBusca,
  });

  const [addCliente] = useAddClienteMutation();

  const handleBuscaCpf = async () => {
    if (!cpfBusca.trim()) {
      setErroBusca('Digite um CPF');
      return;
    }

    if (cliente) {
      if (!cliente.cpf) {
        setForm({
          pessoaFisica: {
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
        })
        setCpfJaCadastrado(false);
        setErroBusca('Cliente não encontrado. Preencha os dados.');
      } else {
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
            }

        setForm({
          pessoaFisica: {
            nome: cliente.nome ?? '',
            cpf: cliente.cpf ?? '',
            email: cliente.email ?? '',
            telefone: cliente.telefone ?? '',
            dataNascimento: cliente.dataNascimento ?? '',
            endereco,
          },
          pessoaJuridica: null,
        })
        setCpfJaCadastrado(true);
        setErroBusca(null);
      }
    } else {
      setForm({
        pessoaFisica: {
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
      })
      setCpfJaCadastrado(false);
      setErroBusca(null);
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
    e.preventDefault()

    if (!form || !form.pessoaFisica) return

    const payload = {
      nome: form.pessoaFisica.nome,
      cpf: form.pessoaFisica.cpf,
      telefone: form.pessoaFisica.telefone,
      endereco: stringifyEndereco(form.pessoaFisica.endereco),
      email: form.pessoaFisica.email,
      pessoaFisica: form.pessoaFisica,
      pessoaJuridica: undefined,
      dataNascimento: form.pessoaFisica.dataNascimento,
    }

    try {
      await addCliente(payload).unwrap();
      setForm(null)
      setCpfBusca('')
      setCpfJaCadastrado(false)
      setErroBusca(null)
    } catch (error) {
      console.error('Erro ao adicionar cliente', error)
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
              type="email"
              name="email"
              placeholder="Email"
              value={form.pessoaFisica?.email || ''}
              onChange={(e) => handleChange(e, 'email', 'cliente')}
              disabled={cpfJaCadastrado}
            />
            <S.Input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={form.pessoaFisica?.telefone || ''}
              onChange={(e) => handleChange(e, 'telefone', 'cliente')}
              disabled={cpfJaCadastrado}
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
              disabled={cpfJaCadastrado}
            />
            <S.Input
              type="text"
              name="numero"
              placeholder="Número"
              value={form.pessoaFisica?.endereco.numero || ''}
              onChange={(e) => handleChange(e, 'numero', 'endereco')}
              disabled={cpfJaCadastrado}
            />
            <S.Input
              type="text"
              name="bairro"
              placeholder="Bairro"
              value={form.pessoaFisica?.endereco.bairro || ''}
              onChange={(e) => handleChange(e, 'bairro', 'endereco')}
              disabled={cpfJaCadastrado}
            />
            <S.Input
              type="text"
              name="municipio"
              placeholder="Município"
              value={form.pessoaFisica?.endereco.municipio || ''}
              onChange={(e) => handleChange(e, 'municipio', 'endereco')}
              disabled={cpfJaCadastrado}
            />
            <S.Input
              type="text"
              name="uf"
              placeholder="UF"
              value={form.pessoaFisica?.endereco.uf || ''}
              onChange={(e) => handleChange(e, 'uf', 'endereco')}
              disabled={cpfJaCadastrado}
            />

            <S.ContainerButton>
              <S.Button type="submit" disabled={cpfJaCadastrado}>
                {cpfJaCadastrado ? 'Cliente já cadastrado' : 'Salvar'}
              </S.Button>
              <S.Button>Criar nova venda</S.Button>
            </S.ContainerButton>
          </S.Form>
        )}
      </div>
    </S.Container>
  )
}

export default Cliente
