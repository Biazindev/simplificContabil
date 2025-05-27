import React, { useState, useEffect } from 'react';
import { useCriarOrdemServicoMutation, useBuscarOrdemServicoQuery, useAtualizarOrdemServicoMutation } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import styled from 'styled-components';

export enum StatusOrdemServico {
    ABERTA = 'ABERTA',
    EM_ANDAMENTO = 'EM_ANDAMENTO',
    CONCLUIDA = 'CONCLUIDA',
    CANCELADA = 'CANCELADA'
}

export interface OrdemServicoDTO {
    id?: number;
    clienteId: number;
    nomeCliente: string;
    descricao: string;
    dataAbertura: string;
    dataConclusao?: string;
    status: StatusOrdemServico;
    valor: string; // Alterado para string
}

// Componentes estilizados
const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #1890ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #40a9ff;
  }

  &:disabled {
    background-color: #d9d9d9;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
`;

type OrdemServicoFormProps = {
    isEdit?: boolean;
};

const OrdemServicoForm: React.FC<OrdemServicoFormProps> = ({ isEdit = false }) => {
    const [formData, setFormData] = useState<Partial<OrdemServicoDTO>>({
        status: StatusOrdemServico.ABERTA,
        valor: '' // Inicializado como string vazia
    });
    const [showModal, setShowModal] = useState(false);
    const [tempFormData, setTempFormData] = useState<Partial<OrdemServicoDTO>>({});

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [criarOrdem, { isLoading: isCreating }] = useCriarOrdemServicoMutation();
    const [atualizarOrdem] = useAtualizarOrdemServicoMutation();
    const { data: ordem, isLoading: isLoadingOrder } = useBuscarOrdemServicoQuery(Number(id), {
        skip: !isEdit || !id,
    });

    // Carrega dados iniciais
    useEffect(() => {
        const clienteStorage = localStorage.getItem('clienteSelecionado');
        if (clienteStorage) {
            try {
                const cliente = JSON.parse(clienteStorage);
                setFormData(prev => ({
                    ...prev,
                    clienteId: cliente.id,
                    nomeCliente: cliente.pessoaFisica?.nome || cliente.pessoaJuridica?.nomeFantasia || cliente.pessoaJuridica?.razaoSocial || 'Cliente não identificado'
                }));
            } catch (error) {
                console.error('Erro ao ler cliente do localStorage:', error);
            }
        }

        if (ordem && isEdit) {
            setFormData({
                ...ordem,
                dataAbertura: ordem.dataAbertura,
                dataConclusao: ordem.dataConclusao,
                valor: ordem.valor // Já é string
            });
            setTempFormData({
                ...ordem,
                dataAbertura: ordem.dataAbertura,
                dataConclusao: ordem.dataConclusao,
                valor: ordem.valor // Já é string
            });
        }
    }, [ordem, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTempFormData(prev => ({ ...prev, [name]: value }));
    };

    // Função para formatar o valor monetário
    const formatCurrency = (value: string) => {
        // Remove tudo que não é dígito ou vírgula/ponto
        let cleanedValue = value.replace(/[^\d,.]/g, '');

        // Substitui vírgula por ponto para decimal
        cleanedValue = cleanedValue.replace(',', '.');

        // Verifica se tem mais de um ponto decimal
        const decimalParts = cleanedValue.split('.');
        if (decimalParts.length > 2) {
            cleanedValue = `${decimalParts[0]}.${decimalParts.slice(1).join('')}`;
        }

        return cleanedValue;
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const formattedValue = formatCurrency(value);
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleModalValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const formattedValue = formatCurrency(value);
        setTempFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const openEditModal = () => {
        setTempFormData({ ...formData });
        setShowModal(true);
    };

    const closeEditModal = () => {
        setShowModal(false);
    };

    const saveEditModal = () => {
        setFormData({ ...tempFormData });
        setShowModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload: OrdemServicoDTO = {
                ...formData,
                clienteId: Number(formData.clienteId),
                valor: formData.valor || '0', // Garante que é string
                dataAbertura: formData.dataAbertura || dayjs().format('YYYY-MM-DD'),
                status: formData.status || StatusOrdemServico.ABERTA,
            } as OrdemServicoDTO;

            if (isEdit && id) {
                await atualizarOrdem({ id: Number(id), ...payload }).unwrap();
                alert('Ordem de serviço atualizada com sucesso');
            } else {
                await criarOrdem(payload).unwrap();
                alert('Ordem de serviço criada com sucesso');
            }
            navigate('/ordem-list');
        } catch (err) {
            console.error('Erro ao salvar ordem de serviço:', err);
            alert('Erro ao salvar ordem de serviço');
        }
    };

    if (isEdit && isLoadingOrder) {
        return <LoadingSpinner>Carregando...</LoadingSpinner>;
    }

    return (
        <>
            <FormContainer>
                <h2>{isEdit ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}</h2>

                <StyledForm onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="clienteId">Cliente ID</Label>
                        <Input
                            type="number"
                            id="clienteId"
                            name="clienteId"
                            value={formData.clienteId || ''}
                            readOnly
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="nomeCliente">Nome do Cliente</Label>
                        <Input
                            type="text"
                            id="nomeCliente"
                            name="nomeCliente"
                            value={formData.nomeCliente || ''}
                            readOnly
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="descricao">Descrição</Label>
                        <TextArea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao || ''}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="dataAbertura">Data de Abertura</Label>
                        <Input
                            type="date"
                            id="dataAbertura"
                            name="dataAbertura"
                            value={formData.dataAbertura || dayjs().format('YYYY-MM-DD')}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="dataConclusao">Data de Conclusão</Label>
                        <Input
                            type="date"
                            id="dataConclusao"
                            name="dataConclusao"
                            value={formData.dataConclusao || ''}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            id="status"
                            name="status"
                            value={formData.status || StatusOrdemServico.ABERTA}
                            onChange={handleChange}
                            required
                        >
                            {Object.values(StatusOrdemServico).map(status => (
                                <option key={status} value={status}>
                                    {status.replace('_', ' ')}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="valor">Valor (R$)</Label>
                        <Input
                            type="text"
                            id="valor"
                            name="valor"
                            value={formData.valor || ''}
                            onChange={handleValueChange}
                            placeholder="0,00"
                        />
                    </FormGroup>

                    {isEdit && (
                        <Button type="button" onClick={openEditModal}>
                            Editar Informações
                        </Button>
                    )}

                    <Button type="submit" disabled={isCreating}>
                        {isCreating ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
                    </Button>
                </StyledForm>
            </FormContainer>

            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>Editar Ordem de Serviço</ModalTitle>
                            <CloseButton onClick={closeEditModal}>&times;</CloseButton>
                        </ModalHeader>

                        <StyledForm>
                            <FormGroup>
                                <Label htmlFor="modal-descricao">Descrição</Label>
                                <TextArea
                                    id="modal-descricao"
                                    name="descricao"
                                    value={tempFormData.descricao || ''}
                                    onChange={handleModalChange}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="modal-dataAbertura">Data de Abertura</Label>
                                <Input
                                    type="date"
                                    id="modal-dataAbertura"
                                    name="dataAbertura"
                                    value={tempFormData.dataAbertura || dayjs().format('YYYY-MM-DD')}
                                    onChange={handleModalChange}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="modal-dataConclusao">Data de Conclusão</Label>
                                <Input
                                    type="date"
                                    id="modal-dataConclusao"
                                    name="dataConclusao"
                                    value={tempFormData.dataConclusao || ''}
                                    onChange={handleModalChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="modal-status">Status</Label>
                                <Select
                                    id="modal-status"
                                    name="status"
                                    value={tempFormData.status || StatusOrdemServico.ABERTA}
                                    onChange={handleModalChange}
                                    required
                                >
                                    {Object.values(StatusOrdemServico).map(status => (
                                        <option key={status} value={status}>
                                            {status.replace('_', ' ')}
                                        </option>
                                    ))}
                                </Select>
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="modal-valor">Valor (R$)</Label>
                                <Input
                                    type="text"
                                    id="valor"
                                    name="valor"
                                    value={formData.valor || ''}
                                    onChange={handleValueChange}
                                    placeholder="0,00"
                                />
                            </FormGroup>

                            <ButtonGroup>
                                <SecondaryButton type="button" onClick={closeEditModal}>
                                    Cancelar
                                </SecondaryButton>
                                <Button type="button" onClick={saveEditModal}>
                                    Salvar Alterações
                                </Button>
                            </ButtonGroup>
                        </StyledForm>
                    </ModalContent>
                </ModalOverlay>
            )}
        </>
    );
};

export default OrdemServicoForm;