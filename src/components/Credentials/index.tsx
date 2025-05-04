import { useState } from 'react'
import { Container, Login, User } from "./styles"
import { Link, useNavigate } from "react-router-dom"
import ImgLogo from '../../assets/image/img.jpg'
import { useLoginMutation } from '../../services/api'

const Credentials = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [mensagem, setMensagem] = useState('')
    const navigate = useNavigate()

    // useLoginMutation retorna { accessToken, username, roles } mas o JWT já vem via cookie HttpOnly
    const [login, { isLoading, error }] = useLoginMutation()

    const handleLogin = async () => {
        try {
            // Desestruturamos accessToken apenas para efeito de leitura,
            // mas não precisamos salvar no localStorage pois usamos cookie HttpOnly
            const { accessToken } = await login({ username, password }).unwrap()

            setMensagem('')
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
                            placeholder="Usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </User>

                    <User>
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </User>

                    <button onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? 'Entrando...' : 'Login'}
                    </button>

                    {mensagem && <p>{mensagem}</p>}
                    {error && !mensagem && (
                        <p>Ocorreu um erro. Verifique sua conexão.</p>
                    )}

                    <Link to="/recuperar-senha">Esqueceu a Senha</Link>
                </div>
            </Login>
        </Container>
    )
}

export default Credentials
