import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  UserPlus,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Mock data for demonstration
const mockData = {
  encomendas: {
    pendentes: 12,
    entregues: 45,
    hoje: 8
  },
  visitantes: {
    ativos: 3,
    hoje: 15
  },
  financeiro: {
    saldo: 'R$ 45.320,00',
    receitas: 'R$ 52.000,00',
    despesas: 'R$ 6.680,00'
  },
  estatisticas: {
    totalMoradores: 240,
    unidades: 120,
    ocupacao: 85
  }
};

const DashboardPorteiro: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-condoway-md hover:shadow-condoway-lg transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Registrar Encomenda</CardTitle>
                <CardDescription>
                  Nova entrega para morador
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-condoway-md hover:shadow-condoway-lg transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-condoway-success/10 rounded-lg group-hover:bg-condoway-success/20 transition-colors">
                <UserPlus className="w-6 h-6 text-condoway-success" />
              </div>
              <div>
                <CardTitle className="text-lg">Registrar Visitante</CardTitle>
                <CardDescription>
                  Novo visitante no condomínio
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Operation Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Encomendas Pendentes */}
        <Card className="shadow-condoway-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Encomendas Aguardando
              </CardTitle>
              <Badge variant="destructive">
                {mockData.encomendas.pendentes}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { morador: 'Ana Silva', apt: 'Bloco A - Apt 101', loja: 'Magazine Luiza' },
                { morador: 'Carlos Santos', apt: 'Bloco B - Apt 205', loja: 'Mercado Livre' },
                { morador: 'Maria Oliveira', apt: 'Bloco A - Apt 304', loja: 'Amazon' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.morador}</p>
                    <p className="text-xs text-muted-foreground">{item.apt}</p>
                    <p className="text-xs text-condoway-text-secondary">{item.loja}</p>
                  </div>
                  <Button size="sm" variant="default">
                    Entregar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visitantes Ativos */}
        <Card className="shadow-condoway-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Visitantes Presentes
              </CardTitle>
              <Badge variant="secondary">
                {mockData.visitantes.ativos}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { nome: 'João Pedro', documento: '123.456.789-00', destino: 'Bloco A - Apt 101', entrada: '14:30' },
                { nome: 'Fernanda Costa', documento: '987.654.321-00', destino: 'Bloco B - Apt 205', entrada: '15:45' },
                { nome: 'Roberto Lima', documento: '456.789.123-00', destino: 'Bloco C - Apt 301', entrada: '16:20' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.nome}</p>
                    <p className="text-xs text-muted-foreground">{item.documento}</p>
                    <p className="text-xs text-condoway-text-secondary">{item.destino} • Entrada: {item.entrada}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Saída
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="shadow-condoway-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Reservas de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { ambiente: 'Salão de Festas', morador: 'Ana Silva', horario: '19:00 - 23:00', status: 'confirmada' },
              { ambiente: 'Churrasqueira 1', morador: 'Carlos Santos', horario: '15:00 - 18:00', status: 'confirmada' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div>
                  <p className="font-medium text-sm">{item.ambiente}</p>
                  <p className="text-xs text-muted-foreground">{item.morador} • {item.horario}</p>
                </div>
                <Badge variant={item.status === 'confirmada' ? 'default' : 'secondary'}>
                  {item.status === 'confirmada' ? 'Confirmada' : 'Pendente'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardSindico: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-condoway-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Moradores
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockData.estatisticas.totalMoradores}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockData.estatisticas.ocupacao}% de ocupação
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-condoway-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo do Mês
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-condoway-success">
              {mockData.financeiro.saldo}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-condoway-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Encomendas Pendentes
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-condoway-warning">
              {mockData.encomendas.pendentes}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockData.encomendas.hoje} chegaram hoje
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-condoway-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Atividade Hoje
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-condoway-info">
              {mockData.visitantes.hoje}
            </div>
            <p className="text-xs text-muted-foreground">
              visitantes registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Overview */}
        <Card className="lg:col-span-2 shadow-condoway-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-condoway-success-light rounded-lg">
                  <p className="text-sm text-condoway-text-secondary">Receitas</p>
                  <p className="text-xl font-bold text-condoway-success">
                    {mockData.financeiro.receitas}
                  </p>
                </div>
                <div className="p-4 bg-condoway-error-light rounded-lg">
                  <p className="text-sm text-condoway-text-secondary">Despesas</p>
                  <p className="text-xl font-bold text-condoway-error">
                    {mockData.financeiro.despesas}
                  </p>
                </div>
              </div>
              
              {/* Placeholder for chart */}
              <div className="h-32 bg-accent rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  Gráfico de receitas vs. despesas (últimos 6 meses)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-condoway-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Últimas Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { 
                  action: 'Nova reserva criada', 
                  user: 'Ana Silva', 
                  time: '10 min atrás',
                  icon: Calendar,
                  color: 'text-condoway-info'
                },
                { 
                  action: 'Morador cadastrado', 
                  user: 'Carlos Santos', 
                  time: '25 min atrás',
                  icon: UserPlus,
                  color: 'text-condoway-success'
                },
                { 
                  action: 'Encomenda entregue', 
                  user: 'Maria Oliveira', 
                  time: '1h atrás',
                  icon: CheckCircle,
                  color: 'text-condoway-success'
                },
                { 
                  action: 'Pagamento atrasado', 
                  user: 'João Pedro', 
                  time: '2h atrás',
                  icon: AlertTriangle,
                  color: 'text-condoway-warning'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-2">
                  <item.icon className={`w-4 h-4 mt-0.5 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.user}</p>
                    <p className="text-xs text-condoway-text-muted">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bem-vindo, {user.nome.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {user.tipo === 'sindico' 
              ? 'Visão geral do condomínio e indicadores financeiros'
              : 'Painel operacional para gerenciar o dia a dia'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {user.tipo === 'sindico' ? 'Síndico' : 'Porteiro'}
          </Badge>
        </div>
      </div>

      {user.tipo === 'sindico' ? <DashboardSindico /> : <DashboardPorteiro />}
    </div>
  );
};