import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import {
  useLoginMutation,
  useForgotPasswordMutation,
  LoginResponse,
} from '../../services/api';
import { api } from '../../services/api';
import { loginSuccess } from '../../store/reducers/authSlice';

import logo from '../../assets/image/logo.png';

import {
  CredentialsContainer,
  CredentialsForm,
  InputField,
  ForgotButton,
  ContainerForm,
} from './styles';
import Loader from '../Loader';

const Credentials = () => {
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false); // novo estado

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [forgotPassword, { isLoading: isSendingReset }] = useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Usuário ou e-mail é obrigatório'),
      password: Yup.string().required('Senha é obrigatória'),
    }),
    onSubmit: async (values) => {
      setMensagem(null);
      try {
        const response: LoginResponse = await login({
          username: values.username,
          password: values.password,
          accessToken: '',
        }).unwrap();

        if (response.accessToken && response.id) {
          localStorage.setItem('ACCESS_TOKEN', response.accessToken);
          localStorage.setItem('USER_ID', String(response.id));

          dispatch(loginSuccess(response.accessToken));
          dispatch(api.util.resetApiState());
          navigate('/dashboard');
        } else {
          setMensagem('Dados de login inválidos.');
        }
      } catch (err: any) {
        if (err?.status === 401) {
          setMensagem('Credenciais inválidas.');
        } else {
          setMensagem('Erro ao tentar logar. Tente novamente mais tarde!');
        }
      }
    },
  });

  const handleForgot = async () => {
    const emailOrUser = formik.values.username;
    if (!emailOrUser) {
      setForgotMessage('Digite seu usuário ou e-mail acima para receber o link.');
      return;
    }

    setForgotMessage(null);
    try {
      const { message } = await forgotPassword({ email: emailOrUser }).unwrap();
      setForgotMessage(message);
    } catch {
      setForgotMessage('Falha ao enviar e-mail de recuperação.');
    }
  };

  return (
    <CredentialsContainer>
      <CredentialsForm onSubmit={formik.handleSubmit}>
        <img src={logo} alt="logo" />

        <InputField>
          <input
            type="text"
            name="username"
            placeholder="Usuário ou e-mail"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username && (
            <p style={{ color: 'red' }}>{formik.errors.username}</p>
          )}
        </InputField>

        <InputField>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Senha"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p style={{ color: 'red' }}>{formik.errors.password}</p>
          )}
        </InputField>
        <ForgotButton
          type="submit"
          disabled={isLoggingIn}
          style={{ whiteSpace: 'nowrap' }}
        >
          {isLoggingIn ? <Loader /> : 'Login'}
        </ForgotButton>

        {mensagem && <p style={{ color: '#fff' }}>{mensagem}</p>}
        <ContainerForm>
          <ForgotButton
            type="button"
            onClick={handleForgot}
            disabled={isSendingReset}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#06c',
              cursor: 'pointer',
              fontSize: '14px',
              padding: 0,
              minWidth: 'unset',
              minHeight: 'unset',
              width: 'auto',
              height: 'auto',
            }}
          >
            {isSendingReset ? <Loader /> : 'Esqueci a Senha'}
          </ForgotButton>

          <label style={{ color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
           <span>Mostrar senha</span>
          </label>
        </ContainerForm>
      </CredentialsForm>
      {forgotMessage && <p style={{ color: '#555' }}>{forgotMessage}</p>}
    </CredentialsContainer>
  );
};

export default Credentials;