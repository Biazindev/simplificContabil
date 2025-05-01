import { useState } from 'react'
import { Container, Login, User } from "./styles"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import ImgLogo from '../../assets/image/img.jpg'

const Credentials = () => {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [mensagem, setMensagem] = useState("")
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            const response = await axios.post<string>("https://simplifica-contabil.onrender.com/auth/login", {
                email,
                senha
            })

            setMensagem(response.data)
            alert("Login bem-sucedido!")
            navigate("/dashboard")
        } catch (error: any) {
            if (error.response?.status === 401) {
                setMensagem("Credenciais inválidas.")
            } else {
                setMensagem("Usuário ou senha inválidos.")
            }
        }
    }

    return (
        <Container>
            <div>
                <img src={ImgLogo} alt="sistem" />
            </div>
            <Login>
                <div>
                    <h1>Simplifica Contábil</h1>
                    <User>
                        <input type="text" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </User>
                    <User>
                        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                    </User>
                    <button type="button" onClick={handleLogin}>Login</button>
                    {mensagem && <p>{mensagem}</p>}
                    <Link to="/recuperar-senha">Esqueceu a Senha</Link>
                </div>
                
            </Login>
        </Container>
    )
}

export default Credentials