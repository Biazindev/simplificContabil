import {
    BarChart,
    Bar,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Legend
  } from "recharts"
  import { Card, CardContent } from "../ui/card"
  import { Container } from "./styles"
  
  const dailyData = [
    { name: "Seg", vendas: 30 },
    { name: "Ter", vendas: 50 },
    { name: "Qua", vendas: 45 },
    { name: "Qui", vendas: 70 },
    { name: "Sex", vendas: 100 },
    { name: "Sáb", vendas: 90 },
    { name: "Dom", vendas: 40 }
  ]
  
  const weeklyData = [
    { name: "Semana 1", vendas: 300 },
    { name: "Semana 2", vendas: 450 },
    { name: "Semana 3", vendas: 380 },
    { name: "Semana 4", vendas: 520 }
  ]
  
  const monthlyData = [
    { name: "Jan", vendas: 1200 },
    { name: "Fev", vendas: 980 },
    { name: "Mar", vendas: 1500 },
    { name: "Abr", vendas: 1340 }
  ]
  
  const COLORS = [
    "#FACC15",
    "#FB7185",
    "#60A5FA",
    "#22D3EE",
    "#34D399",
    "#EF4444",
    "#8B5CF6"
  ]
  
  const getTotal = (data: any[]) => data.reduce((acc, item) => acc + item.vendas, 0)
  
  const Dashboard = () => {
    return (
      <Container>
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Vendas Diárias</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendas" fill={COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-sm font-medium">Total: {getTotal(dailyData)}</p>
          </CardContent>
        </Card>
  
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Vendas Semanais</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendas" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-sm font-medium">Total: {getTotal(weeklyData)}</p>
          </CardContent>
        </Card>
  
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Vendas Mensais</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendas" fill={COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-sm font-medium">Total: {getTotal(monthlyData)}</p>
          </CardContent>
        </Card>
      </Container>
    )
  }
  
  export default Dashboard
  