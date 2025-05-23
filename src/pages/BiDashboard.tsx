import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  BarChart,
  LineChart,
  PieChart,
  Pie,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { biData } from '@/utils/mockData';
import { Truck, TrendingUp, Users, Fuel, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const BiDashboard = () => {
  const [timeFrame, setTimeFrame] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();
  
  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Cores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="w-full py-6 space-y-8 overflow-x-hidden">
      <div className="flex flex-col space-y-2 px-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Intelligence WA</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Análise detalhada das operações e desempenho da WA Transportes.
        </p>
      </div>
      
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className={`${isMobile ? 'w-full grid-cols-2' : 'w-[500px] grid-cols-4'} grid`}>
              <TabsTrigger value="overview" className="text-sm">Visão Geral</TabsTrigger>
              <TabsTrigger value="revenue" className="text-sm">Faturamento</TabsTrigger>
              <TabsTrigger value="trips" className="text-sm">Viagens</TabsTrigger>
              <TabsTrigger value="resources" className="text-sm">Recursos</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Cards de resumo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Faturamento Total</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold">{formatCurrency(4340000)}</div>
                  <p className="text-blue-100 mt-1 text-sm">+12% vs. ano anterior</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>Total de Viagens</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold">2005</div>
                  <p className="text-green-100 mt-1 text-sm">+8% vs. ano anterior</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>Motoristas Ativos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold">{biData.drivers.active}</div>
                  <p className="text-amber-100 mt-1 text-sm">+3 vs. mês anterior</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    <span>Veículos na Frota</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold">{biData.vehicles.active + biData.vehicles.maintenance + biData.vehicles.idle}</div>
                  <p className="text-purple-100 mt-1 text-sm">+2 vs. mês anterior</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Gráficos principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg">Faturamento por {timeFrame === 'monthly' ? 'Mês' : timeFrame === 'quarterly' ? 'Trimestre' : 'Ano'}</CardTitle>
                  <CardDescription>Evolução do faturamento ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={biData.revenue[timeFrame]}
                        margin={{ 
                          top: 5, 
                          right: isMobile ? 10 : 30, 
                          left: isMobile ? 0 : 20, 
                          bottom: 5 
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey={
                            timeFrame === 'monthly' ? 'month' : 
                            timeFrame === 'quarterly' ? 'quarter' : 'year'
                          }
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${value/1000}k`}
                          width={isMobile ? 30 : 40}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <Tooltip 
                          formatter={(value) => formatCurrency(Number(value))}
                          contentStyle={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                        <Bar 
                          dataKey="value" 
                          name="Faturamento" 
                          fill="#3b82f6" 
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg">Viagens por {timeFrame === 'monthly' ? 'Mês' : timeFrame === 'quarterly' ? 'Trimestre' : 'Ano'}</CardTitle>
                  <CardDescription>Quantidade de viagens realizadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={biData.trips[timeFrame]}
                        margin={{ 
                          top: 5, 
                          right: isMobile ? 10 : 30, 
                          left: isMobile ? 0 : 20, 
                          bottom: 5 
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey={
                            timeFrame === 'monthly' ? 'month' : 
                            timeFrame === 'quarterly' ? 'quarter' : 'year'
                          }
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <YAxis 
                          width={isMobile ? 30 : 40} 
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <Tooltip contentStyle={{ fontSize: isMobile ? 10 : 12 }} />
                        <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          name="Viagens" 
                          stroke="#10b981" 
                          strokeWidth={2} 
                          activeDot={{ r: 6 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Gráficos adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg">Status dos Motoristas</CardTitle>
                  <CardDescription>Distribuição atual dos motoristas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Em Viagem', value: biData.drivers.onTrip },
                            { name: 'Disponíveis', value: biData.drivers.available },
                            { name: 'Inativos', value: biData.drivers.inactive }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => 
                            isMobile ? 
                              `${Math.round(percent * 100)}%` : 
                              `${name}: ${Math.round(percent * 100)}%`
                          }
                          outerRadius={isMobile ? 80 : 100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Em Viagem', value: biData.drivers.onTrip },
                            { name: 'Disponíveis', value: biData.drivers.available },
                            { name: 'Inativos', value: biData.drivers.inactive }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} motoristas`, 'Quantidade']} 
                          contentStyle={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg">Distribuição de Despesas</CardTitle>
                  <CardDescription>Percentual por categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Combustível', value: biData.expenses.fuel },
                            { name: 'Manutenção', value: biData.expenses.maintenance },
                            { name: 'Pedágios', value: biData.expenses.tolls },
                            { name: 'Outros', value: biData.expenses.other }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => 
                            isMobile ? 
                              `${Math.round(percent * 100)}%` : 
                              `${name}: ${Math.round(percent * 100)}%`
                          }
                          outerRadius={isMobile ? 80 : 100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Combustível', value: biData.expenses.fuel },
                            { name: 'Manutenção', value: biData.expenses.maintenance },
                            { name: 'Pedágios', value: biData.expenses.tolls },
                            { name: 'Outros', value: biData.expenses.other }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Percentual']} 
                          contentStyle={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Faturamento Detalhado</CardTitle>
                <CardDescription>Análise completa do faturamento da empresa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={biData.revenue[timeFrame]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey={
                          timeFrame === 'monthly' ? 'month' : 
                          timeFrame === 'quarterly' ? 'quarter' : 'year'
                        } 
                      />
                      <YAxis tickFormatter={(value) => `R$ ${value/1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name="Faturamento" 
                        fill="#3b82f6" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Viagens</CardTitle>
                <CardDescription>Visão detalhada das viagens realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={biData.trips[timeFrame]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey={
                          timeFrame === 'monthly' ? 'month' : 
                          timeFrame === 'quarterly' ? 'quarter' : 'year'
                        } 
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        name="Viagens" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho dos Motoristas</CardTitle>
                  <CardDescription>Top 5 motoristas por número de viagens</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={biData.drivers.performance}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="trips" name="Viagens" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Utilização dos Veículos</CardTitle>
                  <CardDescription>Percentual de uso ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={biData.vehicles.utilization}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[50, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Utilização']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="percentage" 
                          name="Taxa de Utilização" 
                          stroke="#8b5cf6" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status dos Motoristas</CardTitle>
                  <CardDescription>Distribuição atual dos motoristas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Em Viagem', value: biData.drivers.onTrip },
                            { name: 'Disponíveis', value: biData.drivers.available },
                            { name: 'Inativos', value: biData.drivers.inactive }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => 
                            isMobile ? 
                              `${Math.round(percent * 100)}%` : 
                              `${name}: ${Math.round(percent * 100)}%`
                          }
                          outerRadius={isMobile ? 80 : 100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Em Viagem', value: biData.drivers.onTrip },
                            { name: 'Disponíveis', value: biData.drivers.available },
                            { name: 'Inativos', value: biData.drivers.inactive }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} motoristas`, 'Quantidade']} 
                          contentStyle={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Status dos Veículos</CardTitle>
                  <CardDescription>Distribuição atual da frota</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Ativos', value: biData.vehicles.active },
                            { name: 'Em Manutenção', value: biData.vehicles.maintenance },
                            { name: 'Parados', value: biData.vehicles.idle }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => 
                            isMobile ? 
                              `${Math.round(percent * 100)}%` : 
                              `${name}: ${Math.round(percent * 100)}%`
                          }
                          outerRadius={isMobile ? 80 : 100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Ativos', value: biData.vehicles.active },
                            { name: 'Em Manutenção', value: biData.vehicles.maintenance },
                            { name: 'Parados', value: biData.vehicles.idle }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} veículos`, 'Quantidade']} 
                          contentStyle={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Despesas</CardTitle>
                <CardDescription>Percentual por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Combustível', value: biData.expenses.fuel },
                          { name: 'Manutenção', value: biData.expenses.maintenance },
                          { name: 'Pedágios', value: biData.expenses.tolls },
                          { name: 'Outros', value: biData.expenses.other }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => 
                          isMobile ? 
                            `${Math.round(percent * 100)}%` : 
                            `${name}: ${Math.round(percent * 100)}%`
                        }
                        outerRadius={isMobile ? 80 : 100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Combustível', value: biData.expenses.fuel },
                          { name: 'Manutenção', value: biData.expenses.maintenance },
                          { name: 'Pedágios', value: biData.expenses.tolls },
                          { name: 'Outros', value: biData.expenses.other }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentual']} 
                        contentStyle={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-sm font-medium">Período:</span>
          <Select 
            value={timeFrame} 
            onValueChange={(value) => setTimeFrame(value as 'monthly' | 'quarterly' | 'yearly')}
          >
            <SelectTrigger className="w-[140px] md:w-[180px]">
              <SelectValue placeholder="Selecione um período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BiDashboard;
