import {  ReactNode } from "react"
import { Container } from "./styles"

type Props = {
    children: ReactNode
    title: string
}

const Card = ({children, title}: Props) => (
    <Container>
        <h2>{title}</h2>
        {children}
    </Container>
)

export default Card