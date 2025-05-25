import { Briefcase, UserPlus } from "lucide-react";
import { CodesandboxLogo } from "phosphor-react";
import { PiMoneyBold } from "react-icons/pi";

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
  Cell,
} from "recharts";



import { Card, CardContent } from "../ui/card";

import {
  useGetTotalDiaQuery,
  useGetTotalSemanaQuery,
  useGetTotalMesQuery,
  useGetTotalDiaSingQuery,
  useGetTotalSemanasQuery,
  useGetTotalMesesQuery,
  useGetTotalDiaSingleQuery,
  useGetTotalAnoQuery,
} from "../../services/api";

import {
  Container,
  DashboardContainer,
  ContainerDash,
  CardContainer,
} from "./styles";
import { data } from "react-router-dom";

const COLORS = [
  "#EF4444", // Vermelho forte
  "#3B82F6", // Azul vivo
  "#F59E0B", // Amarelo brilhante
  "#10B981", // Verde vibrante
  "#8B5CF6", // Roxo intenso
  "#EC4899", // Rosa forte
  "#F97316", // Laranja vibrante
];

interface DailyData {
  label: string;
  totais: {
    PIX?: number;
    // Outros métodos de pagamento podem ser adicionados aqui
  };
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Dashboard = () => {
  const { data: dailySingData } = useGetTotalDiaSingQuery();
  const { data: dailySingleData, isLoading, error } = useGetTotalDiaSingleQuery();
  const { data: weeklySingData } = useGetTotalSemanasQuery();
  const { data: weeklyData } = useGetTotalSemanaQuery();
  const { data: monthlySingData } = useGetTotalMesesQuery();
  const { data: monthlyData } = useGetTotalMesQuery();
  const { data: yearData } = useGetTotalAnoQuery();

  const vendasHoje = typeof dailySingData === "number" ? dailySingData : 0;
  const vendasSemana = typeof weeklySingData === "number" ? weeklySingData : 0;
  const vendasSemanas = typeof weeklyData === "number" ? weeklyData : 0;
  const vendasMeses = typeof monthlySingData === "number" ? monthlySingData : 0;
  const vendasMes = typeof monthlyData === "number" ? monthlyData : 0;
  const vendasAno = typeof yearData === "number" ? yearData : 0;

  if (isLoading) return <p>Carregando...</p>;
  if (error || !dailySingleData) return <p>Erro ao carregar.</p>;

  const formatChartDataFromObject = (
    dataObj: Record<string, number> | number | undefined,
    fallbackLabel: string
  ) => {
    if (typeof dataObj === "number") {
      return [{ name: fallbackLabel, vendas: dataObj }];
    }

    if (!dataObj || typeof dataObj !== "object") return [];

    return Object.entries(dataObj).map(([label, valor]) => ({
      name: label,
      vendas: valor,
    }));
  };

  type DataItem = {
    label: string;
    totais?: { [key: string]: number };
  };

  type ChartData = {
    name: string;
    vendas: number;
  };

  const formatArrayData = (data: DataItem[] | undefined): ChartData[] => {
    if (!data) return [];

    return data.map((item) => {
      const totais = item.totais ?? {};
      const valores = Object.values(totais) as number[];
      const vendas = valores.reduce((sum, val) => sum + val, 0);
      return {
        name: item.label,
        vendas,
      };
    });
  }

  const valorPix = dailySingleData?.[0]?.totais?.PIX ?? 0;

  console.log('Valor PIX extraído:', valorPix);
  console.log('Valor PIX extraído:', valorPix);
  if (isLoading) return <p>Carregando...</p>;
  if (error || !dailySingleData) return <p>Erro ao carregar.</p>;

  return (
    <ContainerDash>
      <DashboardContainer>
        <CardContainer>
          <p>22</p>
          <div>
            <span>
              <Briefcase size={40} />
              <p>Novas Vendas</p>
            </span>
          </div>
        </CardContainer>
        <CardContainer>
          <p>1890</p>
          <div>
            <span>
              <CodesandboxLogo size={40} />
              <p>Produtos em estoque</p>
            </span>
          </div>
        </CardContainer>
        <CardContainer>
          <p>38</p>
          <div>
            <span>
              <UserPlus size={40} />
              <p>Novos Clientes</p>
            </span>
          </div>
        </CardContainer>
        <CardContainer>
          <p>{formatCurrency(valorPix)}</p>
          <div>
            <span>
              <PiMoneyBold size={40} />
              <p>Total hoje</p>
            </span>
          </div>
        </CardContainer>
      </DashboardContainer>

      <Container>
        {/* Vendas Diárias */}
        <Card>
          <CardContent>
            <h3>Vendas Diárias</h3>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={formatChartDataFromObject(dailySingData, "Hoje")}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area dataKey="vendas" fill={COLORS[2]} stroke={COLORS[2]} />
                <Bar dataKey="vendas">
                  {formatChartDataFromObject(dailySingData, "Hoje").map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="vendas" stroke={COLORS[1]} />
              </ComposedChart>
            </ResponsiveContainer>
            <h4>
              Valor total de vendas diárias{" "}
              <span>
                <p>{formatCurrency(valorPix)}</p>
              </span>
            </h4>
          </CardContent>
        </Card>

        {/* Vendas Semanais */}
        <Card>
          <CardContent>
            <h3>Vendas Semanais</h3>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={formatChartDataFromObject(weeklySingData, "Semana")}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area dataKey="vendas" fill={COLORS[5]} stroke={COLORS[5]} />
                <Bar dataKey="vendas">
                  {formatChartDataFromObject(weeklySingData, "Semana").map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="vendas" stroke={COLORS[4]} />
              </ComposedChart>
            </ResponsiveContainer>
            <h4>
              Valor total de vendas semanais<span>{formatCurrency(vendasSemanas)}</span>
            </h4>
          </CardContent>
        </Card>

        {/* Vendas Mensais */}
        <Card>
          <CardContent>
            <h3>Vendas Mensais</h3>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={formatChartDataFromObject(monthlySingData, "Mês")}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area dataKey="vendas" fill={COLORS[6]} stroke={COLORS[6]} />
                <Bar dataKey="vendas">
                  {formatChartDataFromObject(monthlySingData, "Mês").map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="vendas" stroke={COLORS[1]} />
              </ComposedChart>
            </ResponsiveContainer>
            <h4>
              Valor total de vendas mensais<span>{formatCurrency(vendasMes)}</span>
            </h4>
          </CardContent>
        </Card>

        {/* Vendas Anuais */}
        <Card>
          <CardContent>
            <h3>Vendas Anuais</h3>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={formatArrayData(yearData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area dataKey="vendas" fill={COLORS[6]} stroke={COLORS[6]} />
                <Bar dataKey="vendas">
                  {formatArrayData(yearData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="vendas" stroke={COLORS[1]} />
              </ComposedChart>
            </ResponsiveContainer>
            <h4>
              Valor total de vendas anuais<span>{formatCurrency(vendasAno)}</span>
            </h4>
          </CardContent>
        </Card>
      </Container>
    </ContainerDash>
  );
};

export default Dashboard;
