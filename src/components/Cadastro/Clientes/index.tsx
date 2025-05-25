import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setClienteSelecionado } from '../../../store/reducers/ClienteSlice';
import { setCliente } from '../../../store/reducers/vendaSlice';
import { 
  useAddClienteMutation,
  useUpdateClienteMutation,
  useLazyGetClienteByDocumentoQuery
} from '../../../services/api';
import { Input } from '../../../styles';

interface Endereco {
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  complemento: string;
}

interface PessoaFisica {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: Endereco;
}

interface PessoaJuridica {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  inscricaoEstadual: string;
  endereco: Endereco;
}

const formatarCPF = (cpf: string) => {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const formatarCNPJ = (cnpj: string) => {
  return cnpj
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const formatarCEP = (cep: string) => {
  return cep
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

const formatarTelefone = (telefone: string) => {
  return telefone
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2');
};

const buscarEnderecoPorCEP = async (cep: string) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      municipio: data.localidade || '',
      uf: data.uf || '',
      complemento: data.complemento || ''
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};

const CadastroCliente = () => {
  const [tipoPessoa, setTipoPessoa] = useState<'FISICA' | 'JURIDICA'>('FISICA');
  const [documento, setDocumento] = useState('');
  const [form, setForm] = useState<PessoaFisica | PessoaJuridica | null>(null);
  const [camposAutoPreenchidos, setCamposAutoPreenchidos] = useState<string[]>([]);
  const [clienteExistente, setClienteExistente] = useState(false);
  const [mensagem, setMensagem] = useState('');
  
  const [addCliente] = useAddClienteMutation();
  const [updateCliente] = useUpdateClienteMutation();
  const [getClienteByDocumento] = useLazyGetClienteByDocumentoQuery();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const documentoLimpo = documento.replace(/\D/g, '');
    
    if (documentoLimpo.length === 11 || documentoLimpo.length === 14) {
      const timer = setTimeout(() => {
        buscarCliente(documentoLimpo);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [documento]);

  useEffect(() => {
    if (form?.endereco?.cep && form.endereco.cep.replace(/\D/g, '').length === 8) {
      handleBuscarCEP();
    }
  }, [form?.endereco?.cep]);

  const buscarCliente = async (documento: string) => {
  try {
    const response = await getClienteByDocumento(documento).unwrap();

    if (response) {
      setClienteExistente(true);
      setMensagem('Cliente já cadastrado. Você pode editar os dados abaixo.');

      if (response.pessoaFisica) {
        setTipoPessoa('FISICA');
        setForm({
          id: response.id,
          nome: response.pessoaFisica.nome,
          cpf: response.pessoaFisica.cpf,
          email: response.pessoaFisica.email,
          telefone: response.pessoaFisica.telefone,
          dataNascimento: response.pessoaFisica.dataNascimento,
          endereco: response.endereco || {
            logradouro: '',
            numero: '',
            bairro: '',
            municipio: '',
            uf: '',
            cep: '',
          }
        });
      } else if (response.pessoaJuridica) {
        setTipoPessoa('JURIDICA');
        setForm({
          razaoSocial: response.pessoaJuridica.razaoSocial,
          nomeFantasia: response.pessoaJuridica.nomeFantasia,
          cnpj: response.pessoaJuridica.cnpj,
          email: response.pessoaJuridica.email,
          telefone: response.pessoaJuridica.telefone,
          inscricaoEstadual: response.pessoaJuridica.inscricaoEstadual,
          endereco: response.endereco || {
            logradouro: '',
            numero: '',
            bairro: '',
            municipio: '',
            uf: '',
            cep: '',
            complemento: ''
          }
        });
      }
    }
  } catch (error: any) {
    // Cliente não encontrado → montar formulário em branco com o documento já preenchido
    setClienteExistente(false);
    setCamposAutoPreenchidos([]);

    const isCPF = documento.length === 11;
    setTipoPessoa(isCPF ? 'FISICA' : 'JURIDICA');

    if (isCPF) {
      setForm({
        nome: '',
        cpf: documento,
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
          complemento: ''
        }
      });
    } else {
      setForm({
        razaoSocial: '',
        nomeFantasia: '',
        cnpj: documento,
        email: '',
        telefone: '',
        inscricaoEstadual: '',
        endereco: {
          logradouro: '',
          numero: '',
          bairro: '',
          municipio: '',
          uf: '',
          cep: '',
          complemento: ''
        }
      });
    }

    // Mensagem clara para o usuário
    setMensagem('Cliente não encontrado. Preencha os dados abaixo para cadastrar.');
  }
};


  const handleChangeDocumento = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    
    if (value.length <= 11) {
      formattedValue = formatarCPF(value);
    } else {
      formattedValue = formatarCNPJ(value);
    }
    
    setDocumento(formattedValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    
    const { name, value } = e.target;
    
    if (name === 'cep') {
      setForm({
        ...form,
        endereco: {
          ...form.endereco,
          cep: formatarCEP(value)
        }
      });
    } else if (name === 'telefone') {
      setForm({
        ...form,
        telefone: formatarTelefone(value)
      });
    } else if (name in form) {
      setForm({
        ...form,
        [name]: value
      });
    } else if (name.startsWith('endereco.')) {
      const field = name.split('.')[1];
      setForm({
        ...form,
        endereco: {
          ...form.endereco,
          [field]: value
        }
      });
    }
  };

  const handleBuscarCEP = async () => {
    if (!form) return;
    
    const cepLimpo = form.endereco.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    const endereco = await buscarEnderecoPorCEP(cepLimpo);
    if (endereco) {
      const novosCamposDesabilitados: string[] = [];
      
      if (endereco.logradouro) novosCamposDesabilitados.push('logradouro');
      if (endereco.bairro) novosCamposDesabilitados.push('bairro');
      if (endereco.municipio) novosCamposDesabilitados.push('municipio');
      if (endereco.uf) novosCamposDesabilitados.push('uf');

      setCamposAutoPreenchidos(novosCamposDesabilitados);

      setForm({
        ...form,
        endereco: {
          ...form.endereco,
          ...endereco
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    
    try {
      let payload;
      let response;
      
      if (tipoPessoa === 'FISICA') {
        const pf = form as PessoaFisica;
        payload = {
          pessoaFisica: {
            nome: pf.nome,
            cpf: pf.cpf.replace(/\D/g, ''),
            email: pf.email,
            telefone: pf.telefone.replace(/\D/g, ''),
            dataNascimento: pf.dataNascimento,
            endereco: {
              ...pf.endereco,
              cep: pf.endereco.cep.replace(/\D/g, '')
            }
          }
        };
      } else {
        const pj = form as PessoaJuridica;
        payload = {
          pessoaJuridica: {
            razaoSocial: pj.razaoSocial,
            nomeFantasia: pj.nomeFantasia,
            cnpj: pj.cnpj.replace(/\D/g, ''),
            email: pj.email,
            telefone: pj.telefone.replace(/\D/g, ''),
            inscricaoEstadual: pj.inscricaoEstadual,
            endereco: {
              ...pj.endereco,
              cep: pj.endereco.cep.replace(/\D/g, '')
            }
          }
        };
      }

      if (clienteExistente) {
        response = await updateCliente(payload).unwrap();
      } else {
        response = await addCliente(payload).unwrap();
      }
      
      const clienteFormatado = {
        tipoPessoa,
        ...payload
      };

      dispatch(setClienteSelecionado(clienteFormatado));
      localStorage.setItem('clienteSelecionado', JSON.stringify(clienteFormatado));
      dispatch(setCliente(clienteFormatado));

      navigate('/produtos');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setMensagem('Erro ao salvar cliente. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Cadastro de Cliente</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <Input
          type="text"
          placeholder="Digite CPF ou CNPJ"
          value={documento}
          onChange={handleChangeDocumento}
          style={{ width: '100%' }}
        />
      </div>
      
      {mensagem && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: clienteExistente ? '#e6f7ff' : '#fff2f0',
          border: `1px solid ${clienteExistente ? '#91d5ff' : '#ffccc7'}`,
          borderRadius: '4px'
        }}>
          {mensagem}
        </div>
      )}

      {form && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
          {tipoPessoa === 'FISICA' ? (
            <>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome Completo</label>
                <Input
                  name="nome"
                  placeholder="Nome completo"
                  value={(form as PessoaFisica).nome}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CPF</label>
                <Input
                  name="cpf"
                  placeholder="CPF"
                  value={(form as PessoaFisica).cpf}
                  onChange={handleChange}
                  disabled
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data de Nascimento</label>
                <Input
                  name="dataNascimento"
                  type="date"
                  placeholder="Data de Nascimento"
                  value={(form as PessoaFisica).dataNascimento}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Razão Social</label>
                <Input
                  name="razaoSocial"
                  placeholder="Razão Social"
                  value={(form as PessoaJuridica).razaoSocial}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome Fantasia</label>
                <Input
                  name="nomeFantasia"
                  placeholder="Nome Fantasia"
                  value={(form as PessoaJuridica).nomeFantasia}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CNPJ</label>
                <Input
                  name="cnpj"
                  placeholder="CNPJ"
                  value={(form as PessoaJuridica).cnpj}
                  onChange={handleChange}
                  disabled
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Inscrição Estadual</label>
                <Input
                  name="inscricaoEstadual"
                  placeholder="Inscrição Estadual"
                  value={(form as PessoaJuridica).inscricaoEstadual}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Telefone</label>
            <Input
              name="telefone"
              placeholder="Telefone"
              value={form.telefone}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          </div>

          <h3 style={{ margin: '20px 0 15px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Endereço</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CEP</label>
              <Input
                name="cep"
                placeholder="CEP"
                value={form.endereco.cep}
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </div>
            <button 
              type="button" 
              onClick={handleBuscarCEP}
              style={{ 
                alignSelf: 'flex-end',
                padding: '0 15px',
                height: '40px',
                backgroundColor: '#1890ff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Buscar
            </button>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Logradouro</label>
            <Input
              name="endereco.logradouro"
              placeholder="Logradouro"
              value={form.endereco.logradouro}
              onChange={handleChange}
              disabled={camposAutoPreenchidos.includes('logradouro')}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ width: '100px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Número</label>
              <Input
                name="endereco.numero"
                placeholder="Número"
                value={form.endereco.numero}
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Complemento</label>
              <Input
                name="endereco.complemento"
                placeholder="Complemento"
                value={form.endereco.complemento}
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bairro</label>
            <Input
              name="endereco.bairro"
              placeholder="Bairro"
              value={form.endereco.bairro}
              onChange={handleChange}
              disabled={camposAutoPreenchidos.includes('bairro')}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div style={{ flex: 3 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Município</label>
              <Input
                name="endereco.municipio"
                placeholder="Município"
                value={form.endereco.municipio}
                onChange={handleChange}
                disabled={camposAutoPreenchidos.includes('municipio')}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ width: '60px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>UF</label>
              <Input
                name="endereco.uf"
                placeholder="UF"
                value={form.endereco.uf}
                onChange={handleChange}
                disabled={camposAutoPreenchidos.includes('uf')}
                style={{ width: '100%' }}
                maxLength={2}
              />
            </div>
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '4px'
            }}
          >
            {clienteExistente ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
          </button>

          <Link to={'/pdv-mesa'}>
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Voltar para vendas
          </button>
          </Link>
        </form>
      )}
    </div>
  );
};

export default CadastroCliente;