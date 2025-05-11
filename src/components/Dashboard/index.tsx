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
import { Briefcase } from 'lucide-react';
import { CodesandboxLogo } from 'phosphor-react'
import { UserPlus } from 'lucide-react'
import { PiMoneyBold } from "react-icons/pi"

import { Card, CardContent } from "../ui/card"
import { Container, DashboardContainer, ContainerDash, CardContainer } from "./styles"

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

const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const Dashboard = () => {
    return (
        <ContainerDash>
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
                        <p>{formatCurrency(100)}</p>
                        <div>
                            <span>
                                <PiMoneyBold style={{ fontSize: "40px", marginRight: "8px" }} />
                                <p>Total hoje</p>
                            </span>
                        </div>
                    </CardContainer>
                </DashboardContainer>
            </ContainerDash>
            <Container>
                <Card>
                    <CardContent>
                        <h3 className="text-lg font-semibold mb-4">Vendas Diárias</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="vendas" fill={COLORS[0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <h4 className="mt-2 text-sm font-medium">
                            Valor total de vendas diárias <span className="valor">{formatCurrency(getTotal(dailyData))}</span>
                        </h4>
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
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="vendas" fill={COLORS[1]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <h4 className="mt-2 text-sm font-medium">
                            Valor total de vendas semanais <span className="valor">{formatCurrency(getTotal(weeklyData))}</span>
                        </h4>
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
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="vendas" fill={COLORS[2]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <h4 className="mt-2 text-sm font-medium">
                            Valor total de vendas mensais <span className="valor">{formatCurrency(getTotal(monthlyData))}</span>
                        </h4>
                    </CardContent>
                </Card>
            </Container>
        </ContainerDash>
    )
}

export default Dashboard
