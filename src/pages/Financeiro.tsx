import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { DollarSign, TrendingUp, TrendingDown, Plus, Filter, Calendar, PieChart, BarChart3 } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria?: string;
  data_transacao: string;
  observacoes?: string;
  criado_por: string;
  created_at: string;
  criador: {
    nome: string;
  };
}

const categorias = [
  'Manutenção',
  'Limpeza',
  'Segurança',
  'Água',
  'Energia',
  'Condomínio',
  'Taxa Administrativa',
  'Jardinagem',
  'Elevador',
  'Piscina',
  'Outros'
];

export const Financeiro: React.FC = () => {
  const { user } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtroMes, setFiltroMes] = useState(format(new Date(), 'yyyy-MM'));
  const [filtroTipo, setFiltroTipo] = useState<'todas' | 'receita' | 'despesa'>('todas');

  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'despesa' as 'receita' | 'despesa',
    categoria: '',
    data_transacao: format(new Date(), 'yyyy-MM-dd'),
    observacoes: ''
  });

  // Redirecionar se não for síndico
  useEffect(() => {
    if (user && user.tipo !== 'sindico') {
      toast({
        title: 'Acesso Negado',
        description: 'Apenas síndicos podem acessar o módulo financeiro.',
        variant: 'destructive'
      });
      window.history.back();
    }
  }, [user]);

  useEffect(() => {
    if (user && user.tipo === 'sindico') {
      fetchTransacoes();
    }
  }, [user, filtroMes, filtroTipo]);

  const fetchTransacoes = async () => {
    try {
      let query = supabase
        .from('financeiro')
        .select(`
          *,
          criador:usuarios(nome)
        `)
        .order('data_transacao', { ascending: false });

      // Filtro por mês
      if (filtroMes) {
        const [ano, mes] = filtroMes.split('-');
        const inicioMes = startOfMonth(new Date(parseInt(ano), parseInt(mes) - 1)).toISOString().split('T')[0];
        const fimMes = endOfMonth(new Date(parseInt(ano), parseInt(mes) - 1)).toISOString().split('T')[0];
        query = query.gte('data_transacao', inicioMes).lte('data_transacao', fimMes);
      }

      // Filtro por tipo
      if (filtroTipo !== 'todas') {
        query = query.eq('tipo', filtroTipo);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTransacoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as transações.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('financeiro')
        .insert({
          descricao: formData.descricao,
          valor: parseFloat(formData.valor),
          tipo: formData.tipo,
          categoria: formData.categoria,
          data_transacao: formData.data_transacao,
          observacoes: formData.observacoes,
          criado_por: user.id
        });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Transação registrada com sucesso!'
      });

      setFormData({
        descricao: '',
        valor: '',
        tipo: 'despesa',
        categoria: '',
        data_transacao: format(new Date(), 'yyyy-MM-dd'),
        observacoes: ''
      });
      setIsDialogOpen(false);
      fetchTransacoes();
    } catch (error) {
      console.error('Erro ao registrar transação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar a transação.',
        variant: 'destructive'
      });
    }
  };

  const calcularResumo = () => {
    const receitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + t.valor, 0);

    const despesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + t.valor, 0);

    const saldo = receitas - despesas;

    return { receitas, despesas, saldo };
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const { receitas, despesas, saldo } = calcularResumo();

  if (user?.tipo !== 'sindico') {
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Gestão Financeira"
        description="Controle de receitas e despesas do condomínio"
        badge={{ 
          label: saldo >= 0 ? 'Positivo' : 'Negativo', 
          variant: saldo >= 0 ? 'default' : 'destructive' 
        }}
        actions={[
          {
            label: 'Nova Transação',
            onClick: () => setIsDialogOpen(true),
            icon: Plus
          }
        ]}
      />

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatarMoeda(receitas)}</div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatarMoeda(despesas)}</div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className={`h-4 w-4 ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatarMoeda(saldo)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="filtro-mes">Mês</Label>
              <Input
                id="filtro-mes"
                type="month"
                value={filtroMes}
                onChange={(e) => setFiltroMes(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filtro-tipo">Tipo</Label>
              <Select value={filtroTipo} onValueChange={(value: any) => setFiltroTipo(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="receita">Receitas</SelectItem>
                  <SelectItem value="despesa">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>
            Histórico de {filtroTipo === 'todas' ? 'todas as transações' : filtroTipo === 'receita' ? 'receitas' : 'despesas'} 
            {filtroMes && ` de ${format(new Date(filtroMes + '-01'), 'MMMM yyyy', { locale: ptBR })}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>  
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Registrado por</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoes.map((transacao) => (
                <TableRow key={transacao.id}>
                  <TableCell>
                    {format(new Date(transacao.data_transacao), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transacao.descricao}</div>
                      {transacao.observacoes && (
                        <div className="text-sm text-muted-foreground">{transacao.observacoes}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transacao.categoria || 'Sem categoria'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transacao.tipo === 'receita' ? 'default' : 'secondary'}>
                      {transacao.tipo === 'receita' ? (
                        <><TrendingUp className="w-3 h-3 mr-1" />Receita</>
                      ) : (
                        <><TrendingDown className="w-3 h-3 mr-1" />Despesa</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={transacao.tipo === 'receita' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {transacao.tipo === 'receita' ? '+' : '-'}{formatarMoeda(Math.abs(transacao.valor))}
                    </span>
                  </TableCell>
                  <TableCell>{transacao.criador.nome}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {transacoes.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma transação encontrada para os filtros selecionados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
            <DialogDescription>
              Registre uma nova receita ou despesa
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: 'receita' | 'despesa') => setFormData({ ...formData, tipo: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          Receita
                        </div>
                      </SelectItem>
                      <SelectItem value="despesa">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-4 h-4 text-red-600" />
                          Despesa
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição da transação..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data_transacao}
                    onChange={(e) => setFormData({ ...formData, data_transacao: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações (opcional)</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Registrar Transação
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};