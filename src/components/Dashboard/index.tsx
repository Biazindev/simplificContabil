import { Briefcase, UserPlus } from "lucide-react"
import { CodesandboxLogo } from "phosphor-react"
import { PiMoneyBold } from "react-icons/pi"

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
} from "recharts"


import { Card, CardContent } from "../ui/card"

import {
  useGetTotalDiaQuery,
  useGetTotalSemanaQuery,
  useGetTotalMesQuery,
  useGetTotalDiaSingQuery,
  useGetTotalSemanasQuery,
} from "../../services/api"

import {
  Container,
  DashboardContainer,
  ContainerDash,
  CardContainer,
} from "./styles"

const COLORS = ["#FACC15", "#FB7185", "#60A5FA", "#22D3EE", "#34D399", "#EF4444", "#8B5CF6"]

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const Dashboard = () => {
  const { data: dailySingData, isLoading: loadingDiaSing, error: errorDiaSing } = useGetTotalDiaSingQuery()
  const { data: dailyData, isLoading: loadingDia, error: errorDia } = useGetTotalDiaQuery()
  const { data: weeklyData, isLoading: loadingSemana, error: errorSemana } = useGetTotalSemanaQuery()
  const { data: weeklySingData, isLoading: loadingSemanas, error: errorSemanas } = useGetTotalSemanasQuery()
  const { data: monthlyData, isLoading: loadingMes, error: errorMes } = useGetTotalMesQuery()
  const { data: monthlySingData, isLoading: loadingMeses, error: errorMeses } = useGetTotalMesQuery()

  const vendasHoje = dailySingData ?? 0;
  const vendasSemana = weeklySingData ?? 0;
  const vendasSemanas = weeklyData ?? 0;
  const vendasMes = monthlySingData ?? 0;

  const formatChartDataFromObject = (
    dataObj: Record<string, number> | number | undefined,
    fallbackLabel: string
  ) => {
    if (typeof dataObj === "number") {
      return [{ name: fallbackLabel, vendas: dataObj }]
    }

    if (!dataObj) return [{ name: fallbackLabel, vendas: 0 }]

    return Object.entries(dataObj).map(([label, valor]) => ({
      name: label,
      vendas: valor,
    }))
  }

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
                  <ComposedChart data={formatChartDataFromObject(dailyData, "Hoje")}>
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
                  <span className="valor">
                    {formatCurrency(
                      Object.values(dailyData ?? {}).reduce((acc, val) => acc + val, 0)
                    )}
                  </span>
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
                  <ComposedChart data={formatChartDataFromObject(weeklySingData, "Semana")} >
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
                  <span className="valor">{formatCurrency(vendasSemanas)}</span>
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
                  <ComposedChart data={formatChartDataFromObject(monthlySingData, "Mês")}>
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
  )
}

export default Dashboard
