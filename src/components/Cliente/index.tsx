import React, { useState } from "react";
import { useGetClienteByCpfPfQuery, useUpdateClienteMutation } from "../../services/api";
import { Cliente } from "../Venda/types";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../PDV/styles";

const ClienteBusca = () => {
  const [cpf, setCpf] = useState("");
  const [editing, setEditing] = useState(false);
  const [clienteEditado, setClienteEditado] = useState<Cliente | null>(null);
  const navigate = useNavigate();

  const { data: cliente, isLoading, isError } = useGetClienteByCpfPfQuery(cpf, {
    skip: !cpf || cpf.length < 11,
  });

  const [updateCliente] = useUpdateClienteMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(e.target.value);
  };

  const handleEditar = () => {
    if (cliente) {
      setClienteEditado(cliente);
      setEditing(true);
    }
  };

  const handleSalvar = async () => {
    if (clienteEditado) {
      await updateCliente(clienteEditado);
      setEditing(false);
    }
  };

  const handleCadastrarNovo = () => {
    navigate("/clientes/novo");
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Buscar Cliente</h2>
      <div className="flex items-center gap-2">
        <Input placeholder="Digite o CPF" value={cpf} onChange={handleChange} maxLength={11} />
        <Button onClick={() => {}}>Buscar</Button>
        <Button variant="secondary" onClick={handleCadastrarNovo}>
          + Novo
        </Button>
      </div>

      {isLoading && <p>Carregando...</p>}
      {isError && <p className="text-red-500">Erro ao buscar cliente.</p>}

      {cliente && !editing && (
        <div className="border p-4 rounded shadow">
          <p><strong>Nome:</strong> {cliente.nome}</p>
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Telefone:</strong> {cliente.telefone}</p>
          <Button className="mt-2" onClick={handleEditar}>
            Editar
          </Button>
        </div>
      )}

      {editing && clienteEditado && (
        <div className="border p-4 rounded shadow space-y-2">
          <Input
            value={clienteEditado.nome}
            onChange={(e) =>
              setClienteEditado({ ...clienteEditado, nome: e.target.value })
            }
            placeholder="Nome"
          />
          <Input
            value={clienteEditado.email}
            onChange={(e) =>
              setClienteEditado({ ...clienteEditado, email: e.target.value })
            }
            placeholder="Email"
          />
          <Input
            value={clienteEditado.telefone}
            onChange={(e) =>
              setClienteEditado({ ...clienteEditado, telefone: e.target.value })
            }
            placeholder="Telefone"
          />
          <Button onClick={handleSalvar}>Salvar</Button>
        </div>
      )}
    </div>
  );
};

export default ClienteBusca;
