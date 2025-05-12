import {
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Briefcase, UserPlus } from "lucide-react";
import { CodesandboxLogo } from "phosphor-react";
import { PiMoneyBold } from "react-icons/pi";

import { Card, CardContent } from "../ui/card";
import {
  Container,
  DashboardContainer,
  ContainerDash,
  CardContainer
} from "./styles";

import {
  useGetVendasQuery,
  useGetTotalDiaQuery,
  useGetTotalSemanaQuery,
  useGetTotalMesQuery
} from "../../services/api";

const COLORS = [
  "#FACC15",
  "#FB7185",
  "#60A5FA",
  "#22D3EE",
  "#34D399",
  "#EF4444",
  "#8B5CF6"
];

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Dashboard = () => {
  const {
    data: dailyData,
    isLoading: loadingDia,
    error: errorDia
  } = useGetTotalDiaQuery();

  const {
    data: weeklyData,
    isLoading: loadingSemana,
    error: errorSemana
  } = useGetTotalSemanaQuery();

  const {
    data: monthlyData,
    isLoading: loadingMes,
    error: errorMes
  } = useGetTotalMesQuery();

  const vendasHoje = dailyData ?? 0;
  const vendasSemana = weeklyData ?? 0;
  const vendasMes = monthlyData ?? 0;

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
                  <BarChart data={[{ name: "Hoje", vendas: vendasHoje }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="vendas" fill={COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
                <h4 className="mt-2 text-sm font-medium">
                  Valor total de vendas diárias:{" "}
                  <span className="valor">{formatCurrency(vendasHoje)}</span>
                </h4>
              </>
            )}
          </CardContent>
        </Card>

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
                  <BarChart data={[{ name: "Semana", vendas: vendasSemana }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="vendas" fill={COLORS[1]} />
                  </BarChart>
                </ResponsiveContainer>
                <h4 className="mt-2 text-sm font-medium">
                  Valor total de vendas semanais:{" "}
                  <span className="valor">{formatCurrency(vendasSemana)}</span>
                </h4>
              </>
            )}
          </CardContent>
        </Card>

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
                  <BarChart data={[{ name: "Mês", vendas: vendasMes }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="vendas" fill={COLORS[2]} />
                  </BarChart>
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
