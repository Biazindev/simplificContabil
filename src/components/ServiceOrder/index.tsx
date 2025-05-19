import React, { useState } from "react";
import { useCreateServiceOrderMutation } from "../../services/api"
import { StatusOrdemServico } from "../../Enum/enum"
import { OrdemServicoDTO } from '../../Enum/enum'
import { Container, Title } from "./styles";

const ServiceOrder = () => {
  const [createServiceOrder, { isLoading, isSuccess, isError }] = useCreateServiceOrderMutation();

  const [formData, setFormData] = useState({
    clienteId: "",
    nomeCliente: "",
    descricao: "",
    dataAbertura: "",
    dataConclusao: "",
   status: StatusOrdemServico.ABERTA,
    valor: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createServiceOrder({
        ...formData,
        clienteId: Number(formData.clienteId),
        valor: Number(formData.valor),
      }).unwrap();
      alert("Ordem de serviço criada com sucesso!");
    } catch (err) {
      alert("Erro ao criar ordem de serviço");
      console.error(err);
    }
  };

  return (
    <Container>
      <Title>Criar Ordem de Serviço</Title>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">ID do Cliente</label>
          <input
            type="number"
            className="form-control"
            name="clienteId"
            value={formData.clienteId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nome do Cliente</label>
          <input
            type="text"
            className="form-control"
            name="nomeCliente"
            value={formData.nomeCliente}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea
            className="form-control"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Data de Abertura</label>
          <input
            type="date"
            className="form-control"
            name="dataAbertura"
            value={formData.dataAbertura}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Data de Conclusão</label>
          <input
            type="date"
            className="form-control"
            name="dataConclusao"
            value={formData.dataConclusao}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="ABERTA">Aberta</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDA">Concluída</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Criar Ordem de Serviço"}
        </button>
        {isSuccess && <p className="text-success mt-2">Criada com sucesso!</p>}
        {isError && <p className="text-danger mt-2">Erro ao criar ordem de serviço.</p>}
      </form>
    </Container>
  );
};

export default ServiceOrder;
