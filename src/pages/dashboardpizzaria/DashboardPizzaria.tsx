import React, { useState } from "react";
import * as S from "./style";
import {
    FiBox,
    FiFileText,
    FiShoppingCart,
    FiUsers,
    FiTruck,
    FiX // 👈 Adiciona esse
} from "react-icons/fi";
import PedidosEntrega from "./PedidosEntrega";




const DashboardPizzaria: React.FC = () => {
    const mesas = [
        { nome: "Mesa 01", pedidos: [" pizza calabresa", " refrigerantes"], total: 65.50 },
        { nome: "Mesa 02", pedidos: ["lasanha", "suco natural"], total: 42.00 },
        { nome: "Mesa 03", pedidos: [" hambúrgueres", " cervejas"], total: 80.00 },
        { nome: "Mesa 04", pedidos: [" macarrão alho e óleo"], total: 25.00 },
        { nome: "Mesa 05", pedidos: [], total: 0.00 }
    ];

    const pedidos = [
        {
            cliente: "Fulano tal",
            itens: ["1 cachorro quente", "1 coca 2 litros e etc"]
        },
        {
            cliente: "Fulano tal",
            itens: ["2 hambúrgueres", "1 suco de laranja"]
        }
    ];

    const [modalMesa, setModalMesa] = useState<null | typeof mesas[0]>(null);
    const [novoItem, setNovoItem] = useState("");
    const [quantidade, setQuantidade] = useState(1);


    return (
        <>
            <S.Wrapper>
                <S.Sidebar>
                    <h1>🌭 Fome Zero </h1>
                    <nav>
                        <a href="#">🧃 Estoque</a>
                        <a href="#">📝 Nota Fiscal</a>
                        <a href="#">🏷️ Pedidos</a>
                        <a href="#">🍽️ Mesas</a>
                        <a href="#">🛵 Entregas</a>
                        <a href='#'>🧾 Recibo</a>
                    </nav>
                </S.Sidebar>

                <S.Main>
                    <S.Header>
                        <span>BIAZIN SISTEMAS — {new Date().toLocaleTimeString()}</span>
                    </S.Header>

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
                        <S.ModalClose onClick={() => setModalMesa(null)}><FiX size={20} /></S.ModalClose>
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
                                    const nome = item; // você pode adaptar isso se for um objeto mais estruturado depois
                                    const valor = 20; // valor mock, substituir pelo real se tiver
                                    const quantidade = 1;
                                    const total = valor * quantidade;

                                    return (
                                        <tr key={i}>
                                            <td style={{ padding: "0.5rem" }}>{i + 1}</td>
                                            <td style={{ padding: "0.5rem" }}>{nome}</td>
                                            <td style={{ padding: "0.5rem", textAlign: "right" }}>R$ {valor.toFixed(2)}</td>
                                            <td style={{ padding: "0.5rem", textAlign: "center" }}>{quantidade}</td>
                                            <td style={{ padding: "0.5rem", textAlign: "right" }}>R$ {total.toFixed(2)}</td>
                                        </tr>
                                    );
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
                                if (!novoItem || quantidade < 1) return;
                                modalMesa.pedidos.push(novoItem); // 👉 depois podemos trocar para objeto completo
                                setNovoItem("");
                                setQuantidade(1);
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
        </>
    );
};

export default DashboardPizzaria;
