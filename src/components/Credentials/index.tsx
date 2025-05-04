import React, { useState } from 'react'
import { Container, Login, User } from "./styles"
import { useNavigate } from "react-router-dom"
import ImgLogo from '../../assets/image/img.jpg'
import {
    useLoginMutation,
    useForgotPasswordMutation
} from '../../services/api'

const Credentials = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [mensagem, setMensagem] = useState<string | null>(null)
    const [forgotMessage, setForgotMessage] = useState<string | null>(null)
    const navigate = useNavigate()

    const [login, { isLoading: isLoggingIn, error: loginError }] = useLoginMutation()
    const [forgotPassword, { isLoading: isSendingReset }] = useForgotPasswordMutation()

    const handleLogin = async () => {
        setMensagem(null)
        try {
            const response = await login({ username, password }).unwrap()
            console.log('Resposta da API de login:', response)
            localStorage.setItem('token', response.accessToken)
            alert('Login bem-sucedido!')
            navigate('/dashboard')
        } catch (err: any) {
            if (err?.status === 401) {
                setMensagem('Credenciais inválidas.')
            } else {
                setMensagem('Erro ao tentar logar. Tente novamente.')
            }
        }
    }
    
    

    const handleForgot = async () => {
        if (!username) {
            setForgotMessage('Digite seu usuário ou e-mail acima para receber o link.')
            return
        }
        setForgotMessage(null)
        try {
            const { message } = await forgotPassword({ email: username }).unwrap()
            setForgotMessage(message)
        } catch {
            setForgotMessage('Falha ao enviar e-mail de recuperação.')
        }
    }

    return (
        <Container>
            <div>
                <img src={ImgLogo} alt="Simplifica Contábil" />
            </div>

            <Login>
                <div>
                    <h1>Simplifica Contábil</h1>

                    <User>
                        <input
                            type="text"
                            placeholder="Usuário ou e-mail"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </User>

                    <User>
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </User>

                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? 'Entrando…' : 'Login'}
                    </button>

                    {mensagem && <p>{mensagem}</p>}

                    <button
                        type="button"
                        onClick={handleForgot}
                        disabled={isSendingReset}
                        style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#06c', cursor: 'pointer' }}
                    >
                        {isSendingReset ? 'Enviando link…' : 'Esqueci a Senha'}
                    </button>
                    {forgotMessage && <p>{forgotMessage}</p>}

                </div>
            </Login>
        </Container>
    )
}

export default Credentials
