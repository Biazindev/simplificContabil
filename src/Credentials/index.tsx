import { Container, Login, User } from "./styles"

const Credentials = () => {
    return (
            <Container>  
                <Login>
                    <h1>Simplifica Contabil</h1>
                        <User>
                            <input type="text" placeholder="E-mail" />
                        </User>
                        <User>
                            <input type="text" placeholder="Senha" />
                        </User>
                        <button type="submit">Login</button>
                </Login>
            </Container>
    )
}


export default Credentials