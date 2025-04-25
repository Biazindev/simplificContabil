import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import * as S from "./style";

const CadastroCliente: React.FC = () => {
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");

    const handleSalvar = () => {
        if (!nome || !telefone || !endereco) {
            alert("Preencha todos os campos.");
            return;
        }
        console.log("Cliente salvo:", { nome, telefone, endereco });
        setNome("");
        setTelefone("");
        setEndereco("");
        alert("Cliente cadastrado com sucesso!");
    };

    return (
        <div>
            <h2>Cadastrar Cliente</h2>
            <S.ModalInputWrapper>
                <input
                    type="text"
                    placeholder="Nome do cliente"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Endereço"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                />
                <button className="add" onClick={handleSalvar}>
                    Salvar Cliente
                </button>
            </S.ModalInputWrapper>
        </div>
    );
};

export default CadastroCliente;
