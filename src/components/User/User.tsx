import { useState } from 'react'
import { useCriarUsuarioMutation } from '../../services/api'
import { Button, ErrorMessage, FormContainer, Input, Select, SuccessMessage, Title } from './styles';

export type Perfil = 'ADMIN' | 'COMUM'

export interface Usuario {
  id?: number;
  username: string;
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
}

const User = () => {
  const [formData, setFormData] = useState<Usuario>({
    username: '',
    nome: '',
    email: '',
    senha: '',
    perfil: 'COMUM',
  });

  const [criarUsuario, { isLoading, isSuccess, error }] = useCriarUsuarioMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await criarUsuario(formData).unwrap();
      alert('Usuário criado com sucesso!');
      setFormData({
        username: '',
        nome: '',
        email: '',
        senha: '',
        perfil: 'COMUM',
      });
    } catch (err: any) {
      alert('Erro ao criar usuário: ' + (err?.data || err?.message || 'Desconhecido'));
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Title>Cadastro de Usuário</Title>

      <Input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <Input
        type="text"
        name="nome"
        placeholder="Nome"
        value={formData.nome}
        onChange={handleChange}
        required
      />
      <Input
        type="email"
        name="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        type="password"
        name="senha"
        placeholder="Senha"
        value={formData.senha}
        onChange={handleChange}
        required
      />
      <Select name="perfil" value={formData.perfil} onChange={handleChange}>
        <option value="COMUM">COMUM</option>
        <option value="ADMIN">ADMIN</option>
      </Select>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Cadastrando...' : 'Cadastrar Usuário'}
      </Button>

      {isSuccess && <SuccessMessage>Usuário cadastrado com sucesso!</SuccessMessage>}
      {error instanceof Error && <ErrorMessage>Erro: {error.message}</ErrorMessage>}
    </FormContainer>
  );
};

export default User;
