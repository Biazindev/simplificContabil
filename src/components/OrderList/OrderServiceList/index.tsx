import React, { useState } from 'react';
import { useListarOrdensServicoQuery, useDeletarOrdemServicoMutation } from '../../../services/api';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useLazyGerarComprovanteQuery } from '../../../services/api';
import {
    PageContainer,
    ContentContainer,
    PageHeader,
    PageTitle,
    PrimaryButton,
    DangerButton,
    FiltersContainer,
    ActionSpace,
    StatusTag,
    TableContainer,
    Table,
    TableHeader,
    TableHeaderCell,
    TableRow,
    TableCell,
    ActionButton,
    Select,
    DateInput,
    CenteredSpin,
    PopconfirmContainer,
    PopconfirmContent,
    PopconfirmButtons,
    PopconfirmButton
} from './styles';
import { StatusOrdemServico } from '..';
import Loader from '../../Loader/index';

// Estendendo Day.js com plugins necessários
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface OrdemServico {
    id: number;
    nomeCliente: string;
    descricao: string;
    dataAbertura: string | Date;
    dataConclusao?: string | Date | null;
    status: StatusOrdemServico;
    valor: number;
}

interface Filtros {
    status?: StatusOrdemServico;
    dataInicio: dayjs.Dayjs | null;
    dataFim: dayjs.Dayjs | null;
}

const OrdemServicoList: React.FC = () => {
    const [filtros, setFiltros] = useState<Filtros>({
        status: undefined,
        dataInicio: null,
        dataFim: null
    });

    const [showPopconfirm, setShowPopconfirm] = useState<number | null>(null);
    const { data: ordens, isLoading, refetch } = useListarOrdensServicoQuery({});
    const [deletarOrdem] = useDeletarOrdemServicoMutation();
    const [gerarComprovante] = useLazyGerarComprovanteQuery();

    const handleDelete = async (id: number) => {
        try {
            await deletarOrdem(id).unwrap();
            alert('Ordem de serviço deletada com sucesso');
            refetch();
            setShowPopconfirm(null);
        } catch (err) {
            alert('Erro ao deletar ordem de serviço');
        }
    };

    const handleGerarComprovante = async (id: number) => {
        try {
            const { data: pdfBlob } = await gerarComprovante(id);
            if (!pdfBlob) {
                throw new Error('Nenhum dado retornado');
            }
            
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `comprovante-os-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            
            // Remoção segura do link
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
            
            // Liberar objeto URL
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (err) {
            alert('Erro ao gerar comprovante');
        }
    };

    const ordensFiltradas = ordens?.filter((ordem: OrdemServico) => {
        const matchesStatus = !filtros.status || ordem.status === filtros.status;
        
        const dataAbertura = dayjs(ordem.dataAbertura);
        const matchesDataInicio = !filtros.dataInicio || dataAbertura.isSameOrAfter(filtros.dataInicio, 'day');
        const matchesDataFim = !filtros.dataFim || dataAbertura.isSameOrBefore(filtros.dataFim, 'day');
        
        return matchesStatus && matchesDataInicio && matchesDataFim;
    });

    if (isLoading) {
        return <CenteredSpin><Loader /></CenteredSpin>;
    }

    const handleDataInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiltros({
            ...filtros,
            dataInicio: e.target.value ? dayjs(e.target.value) : null
        });
    };

    const handleDataFimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiltros({
            ...filtros,
            dataFim: e.target.value ? dayjs(e.target.value) : null
        });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFiltros({
            ...filtros,
            status: e.target.value as StatusOrdemServico || undefined
        });
    };

    return (
        <PageContainer>
            <ContentContainer>
                <PageHeader>
                    <PageTitle>Ordens de Serviço</PageTitle>
                    <Link to="/vendas-loja">
                        <PrimaryButton>
                            <span>+</span> Nova Ordem
                        </PrimaryButton>
                    </Link>
                </PageHeader>

                <FiltersContainer>
                    <ActionSpace>
                        <Select
                            value={filtros.status || ''}
                            onChange={handleStatusChange}
                        >
                            <option value="">Todos status</option>
                            <option value={StatusOrdemServico.ABERTA}>Aberta</option>
                            <option value={StatusOrdemServico.EM_ANDAMENTO}>Em andamento</option>
                            <option value={StatusOrdemServico.CONCLUIDA}>Concluída</option>
                            <option value={StatusOrdemServico.CANCELADA}>Cancelada</option>
                        </Select>

                        <DateInput
                            type="date"
                            onChange={handleDataInicioChange}
                            placeholder="Data início"
                        />

                        <DateInput
                            type="date"
                            onChange={handleDataFimChange}
                            placeholder="Data fim"
                        />

                        <PrimaryButton onClick={() => refetch()}>
                            <span>↻</span> Atualizar
                        </PrimaryButton>
                    </ActionSpace>
                </FiltersContainer>

                <TableContainer>
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell>Cliente</TableHeaderCell>
                                <TableHeaderCell>Descrição</TableHeaderCell>
                                <TableHeaderCell>Data Abertura</TableHeaderCell>
                                <TableHeaderCell>Data Conclusão</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                                <TableHeaderCell>Valor</TableHeaderCell>
                                <TableHeaderCell>Ações</TableHeaderCell>
                            </tr>
                        </TableHeader>
                        <tbody>
                            {ordensFiltradas?.map((ordem: OrdemServico) => (
                                <TableRow key={ordem.id}>
                                    <TableCell>{ordem.id}</TableCell>
                                    <TableCell>{ordem.nomeCliente}</TableCell>
                                    <TableCell>{ordem.descricao}</TableCell>
                                    <TableCell>{dayjs(ordem.dataAbertura).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell>
                                        {ordem.dataConclusao ? dayjs(ordem.dataConclusao).format('DD/MM/YYYY') : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <StatusTag status={ordem.status}>
                                            {ordem.status.replace('_', ' ')}
                                        </StatusTag>
                                    </TableCell>
                                    <TableCell>R$ {ordem.valor.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <ActionSpace>
                                            <Link to={`/ordens-servico/editar/${ordem.id}`}>
                                                <ActionButton title="Editar">
                                                    <span>✏️</span>
                                                </ActionButton>
                                            </Link>

                                            <ActionButton
                                                title="Gerar PDF"
                                                onClick={() => handleGerarComprovante(ordem.id)}
                                            >
                                                <span>📄</span>
                                            </ActionButton>

                                            <PopconfirmContainer>
                                                <DangerButton
                                                    title="Deletar"
                                                    onClick={() => setShowPopconfirm(ordem.id)}
                                                >
                                                    <span>🗑️</span>
                                                </DangerButton>

                                                {showPopconfirm === ordem.id && (
                                                    <PopconfirmContent>
                                                        <p>Tem certeza que deseja deletar?</p>
                                                        <PopconfirmButtons>
                                                            <PopconfirmButton onClick={() => setShowPopconfirm(null)}>
                                                                Não
                                                            </PopconfirmButton>
                                                            <PopconfirmButton
                                                                onClick={() => handleDelete(ordem.id)}
                                                                style={{ background: '#ff4d4f', color: 'white' }}
                                                            >
                                                                Sim
                                                            </PopconfirmButton>
                                                        </PopconfirmButtons>
                                                    </PopconfirmContent>
                                                )}
                                            </PopconfirmContainer>
                                        </ActionSpace>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                </TableContainer>
            </ContentContainer>
        </PageContainer>
    );
};

export default OrdemServicoList;