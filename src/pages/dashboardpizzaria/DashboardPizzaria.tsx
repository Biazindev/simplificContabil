import React, { useState, useEffect } from "react"
import { FiX } from 'react-icons/fi'

import PedidosEntrega from "./PedidosEntrega"
import CriarPedido from "./pedido/novo/CriarPedido"

import * as S from "./style"
import Cliente from "../../components/Clientes/Cliente"

const DashboardPizzaria: React.FC = () => {
    const mesas = [
        { nome: "Mesa 01", pedidos: [" pizza calabresa", " refrigerantes"], total: 65.50 },
        { nome: "Mesa 02", pedidos: ["lasanha", "suco natural"], total: 42.00 },
        { nome: "Mesa 03", pedidos: [" hambúrgueres", " cervejas"], total: 80.00 },
        { nome: "Mesa 04", pedidos: [" macarrão alho e óleo"], total: 25.00 },
        { nome: "Mesa 05", pedidos: [], total: 0.00 }
    ]

    const [modalMesa, setModalMesa] = useState<null | typeof mesas[0]>(null)
    const [modalCriarPedidoAberto, setModalCriarPedidoAberto] = useState(false)
    const [novoItem, setNovoItem] = useState("")
    const [quantidade, setQuantidade] = useState(1)
    const [modalCadastroClienteAberto, setModalCadastroClienteAberto] = useState(false)

    return (
        <>
            <S.Wrapper>
                <S.Main>
                    <S.Section>
                        <S.Titulo>Mesas Que Estão Abertas</S.Titulo>
                        <S.MesasGrid>
                            {mesas.map((mesa, i) => (
                                <button key={i} onClick={() => setModalMesa(mesa)}>{mesa.nome}</button>
                            ))}
                        </S.MesasGrid>
                    </S.Section>

                    <S.Section>
                        <PedidosEntrega />
                    </S.Section>
                </S.Main>
            </S.Wrapper>

            {modalMesa && (
                <S.ModalOverlay onClick={() => setModalMesa(null)}>
                    <S.ModalContent onClick={e => e.stopPropagation()}>
                        <S.ModalClose onClick={() => setModalMesa(null)}>{FiX({ size: 20 })}</S.ModalClose>
                        <h2>{modalMesa.nome}</h2>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f1f5f9" }}>
                                    <th style={{ padding: "0.5rem", textAlign: "left" }}>ID</th>
                                    <th style={{ padding: "0.5rem", textAlign: "left" }}>Produto</th>
                                    <th style={{ padding: "0.5rem", textAlign: "right" }}>Valor</th>
                                    <th style={{ padding: "0.5rem", textAlign: "center" }}>Quantidade</th>
                                    <th style={{ padding: "0.5rem", textAlign: "right" }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modalMesa.pedidos.map((item, i) => {
                                    const nome = item
                                    const valor = 20
                                    const quantidade = 1
                                    const total = valor * quantidade
                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{nome}</td>
                                            <td style={{ textAlign: "right" }}>R$ {valor.toFixed(2)}</td>
                                            <td style={{ textAlign: "center" }}>{quantidade}</td>
                                            <td style={{ textAlign: "right" }}>R$ {total.toFixed(2)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <p style={{ fontWeight: "bold", fontSize: "1.1rem", textAlign: "right" }}>
                            Total da Mesa: R$ {modalMesa.total.toFixed(2)}
                        </p>
                        <S.ModalInputWrapper>
                            <input
                                type="text"
                                placeholder="Adicionar item..."
                                value={novoItem}
                                onChange={(e) => setNovoItem(e.target.value)}
                            />
                            <input
                                type="number"
                                min={0.1}
                                step={0.1}
                                value={quantidade}
                                onChange={(e) => setQuantidade(Number(e.target.value))}
                            />
                            <button className="add" onClick={() => {
                                if (!novoItem || quantidade < 1) return
                                modalMesa.pedidos.push(novoItem)
                                setNovoItem("")
                                setQuantidade(1)
                            }}>
                                Adicionar Item
                            </button>
                        </S.ModalInputWrapper>
                        <S.ModalActions>
                            <button className="finalizar">Finalizar Mesa</button>
                        </S.ModalActions>
                    </S.ModalContent>
                </S.ModalOverlay>
            )}

            {modalCadastroClienteAberto && (
                <S.ModalOverlay onClick={() => setModalCadastroClienteAberto(false)}>
                    <S.ModalContent onClick={(e) => e.stopPropagation()}>
                        <S.ModalClose onClick={() => setModalCadastroClienteAberto(false)}>
                            {FiX({ size: 20 })}
                        </S.ModalClose>
                        <Cliente />
                    </S.ModalContent>
                </S.ModalOverlay>
            )}

            {modalCriarPedidoAberto && (
                <S.ModalOverlay onClick={() => setModalCriarPedidoAberto(false)}>
                    <S.ModalContent onClick={(e) => e.stopPropagation()}>
                        <S.ModalClose onClick={() => setModalMesa(null)}>{FiX({ size: 20 })}</S.ModalClose>
                        <CriarPedido />
                    </S.ModalContent>
                </S.ModalOverlay>
            )}
        </>
    )
}

export default DashboardPizzaria
