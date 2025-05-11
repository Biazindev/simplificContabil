import React, { useState } from 'react';
import {
  CredentialsContainer,
  CredentialsForm,
  CredentialsImage,
  InputField,
  ForgotButton
} from './styles'
import { useNavigate } from 'react-router-dom';
import ImgLogo from '../../assets/image/img.jpg';
import {
  useLoginMutation,
  useForgotPasswordMutation
} from '../../services/api';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/reducers/authSlice';

const Credentials = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [forgotPassword, { isLoading: isSendingReset }] = useForgotPasswordMutation();

  const handleLogin = async () => {
    setMensagem(null);
    try {
      const response = await login({ username, password }).unwrap();
      localStorage.setItem('ACCESS_TOKEN', response.accessToken);
      dispatch(loginSuccess(response.accessToken));
      alert('Login bem-sucedido!');
      navigate('/dashboard');
    } catch (err: any) {
      if (err?.status === 401) {
        setMensagem('Credenciais inválidas.');
      } else {
        setMensagem('Erro ao tentar logar. Tente novamente.');
      }
    }
  };

  const handleForgot = async () => {
    if (!username) {
      setForgotMessage('Digite seu usuário ou e-mail acima para receber o link.');
      return;
    }
    setForgotMessage(null);
    try {
      const { message } = await forgotPassword({ email: username }).unwrap();
      setForgotMessage(message);
    } catch {
      setForgotMessage('Falha ao enviar e-mail de recuperação.');
    }
  };

  return (
    <CredentialsContainer>
      <CredentialsImage>
        <img src={ImgLogo} alt="Simplifica Contábil" />
      </CredentialsImage>

      <CredentialsForm>
        <h1>Simplifica Contábil</h1>

        <InputField>
          <input
            type="text"
            placeholder="Usuário ou e-mail"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </InputField>

        <InputField>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </InputField>

        <ForgotButton
          type="button"
          onClick={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Entrando…' : 'Login'}
        </ForgotButton>

        {mensagem && <p>{mensagem}</p>}

        <ForgotButton
          type="button"
          onClick={handleForgot}
          disabled={isSendingReset}
          style={{
            marginTop: '0.5rem',
            background: 'none',
            border: 'none',
            color: '#06c',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isSendingReset ? 'Enviando link…' : 'Esqueci a Senha'}
        </ForgotButton>

        {forgotMessage && <p>{forgotMessage}</p>}
      </CredentialsForm>
    </CredentialsContainer>
  );
};

export default Credentials;
