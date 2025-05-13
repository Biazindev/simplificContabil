import {
  ComposedChart,
  Bar,
  Line,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Briefcase, UserPlus } from "lucide-react";
import { CodesandboxLogo } from "phosphor-react";
import { PiMoneyBold } from "react-icons/pi";

import { Card, CardContent } from "../ui/card";
import {
  Container,
  DashboardContainer,
  ContainerDash,
  CardContainer,
} from "./styles";

import {
  useGetVendasQuery,
  useGetTotalDiaQuery,
  useGetTotalSemanaQuery,
  useGetTotalMesQuery,
} from "../../services/api";

const COLORS = ["#FACC15", "#FB7185", "#60A5FA", "#22D3EE", "#34D399", "#EF4444", "#8B5CF6"];

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Dashboard = () => {
  const { data: dailyData, isLoading: loadingDia, error: errorDia } = useGetTotalDiaQuery();
  const { data: weeklyData, isLoading: loadingSemana, error: errorSemana } = useGetTotalSemanaQuery();
  const { data: monthlyData, isLoading: loadingMes, error: errorMes } = useGetTotalMesQuery();

  const vendasHoje = dailyData ?? 0;
  const vendasSemana = weeklyData ?? 0;
  const vendasMes = monthlyData ?? 0;

  const createChartData = (label: string, valor: number) => [
    { name: label, vendas: valor },
  ];

  return (
    <ContainerDash>
      <DashboardContainer>
        <CardContainer>
          <p>22</p>
          <div>
            <span>
              <Briefcase style={{ fontSize: "40px", marginRight: "8px" }} />
              <p>Novas Vendas</p>
            </span>
          </div>
        </CardContainer>
        <CardContainer>
          <p>1890</p>
          <div>
            <span>
              <CodesandboxLogo style={{ fontSize: "40px", marginRight: "8px" }} />
              <p>Produtos em estoque</p>
            </span>
          </div>
        </CardContainer>
        <CardContainer>
          <p>38</p>
          <div>
            <span>
              <UserPlus style={{ fontSize: "40px", marginRight: "8px" }} />
              <p>Novos Clientes</p>
            </span>
          </div>
        </CardContainer>
        <CardContainer>
          <p>{formatCurrency(vendasHoje)}</p>
          <div>
            <span>
              <PiMoneyBold style={{ fontSize: "40px", marginRight: "8px" }} />
              <p>Total hoje</p>
            </span>
          </div>
        </CardContainer>
      </DashboardContainer>

      <Container>
        {/* Gráfico Diário */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Vendas Diárias</h3>
            {loadingDia ? (
              <p>Carregando...</p>
            ) : errorDia ? (
              <p>Erro ao carregar dados diários.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={createChartData("Hoje", vendasHoje)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Area dataKey="vendas" fill={COLORS[0]} stroke={COLORS[0]} />
                    <Bar dataKey="vendas" fill={COLORS[1]} />
                    <Line type="monotone" dataKey="vendas" stroke={COLORS[2]} />
                  </ComposedChart>
                </ResponsiveContainer>
                <h4 className="mt-2 text-sm font-medium">
                  Valor total de vendas diárias:{" "}
                  <span className="valor">{formatCurrency(vendasHoje)}</span>
                </h4>
              </>
            )}
          </CardContent>
        </Card>

        {/* Gráfico Semanal */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Vendas Semanais</h3>
            {loadingSemana ? (
              <p>Carregando...</p>
            ) : errorSemana ? (
              <p>Erro ao carregar dados semanais.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={createChartData("Semana", vendasSemana)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Area dataKey="vendas" fill={COLORS[3]} stroke={COLORS[3]} />
                    <Bar dataKey="vendas" fill={COLORS[4]} />
                    <Line type="monotone" dataKey="vendas" stroke={COLORS[5]} />
                  </ComposedChart>
                </ResponsiveContainer>
                <h4 className="mt-2 text-sm font-medium">
                  Valor total de vendas semanais:{" "}
                  <span className="valor">{formatCurrency(vendasSemana)}</span>
                </h4>
              </>
            )}
          </CardContent>
        </Card>

        {/* Gráfico Mensal */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Vendas Mensais</h3>
            {loadingMes ? (
              <p>Carregando...</p>
            ) : errorMes ? (
              <p>Erro ao carregar dados mensais.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={createChartData("Mês", vendasMes)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Area dataKey="vendas" fill={COLORS[6]} stroke={COLORS[6]} />
                    <Bar dataKey="vendas" fill={COLORS[0]} />
                    <Line type="monotone" dataKey="vendas" stroke={COLORS[1]} />
                  </ComposedChart>
                </ResponsiveContainer>
                <h4 className="mt-2 text-sm font-medium">
                  Valor total de vendas mensais:{" "}
                  <span className="valor">{formatCurrency(vendasMes)}</span>
                </h4>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </ContainerDash>
  );
};

export default Dashboard;
