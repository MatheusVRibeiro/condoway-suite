import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Calendar, CalendarPlus, MapPin, Users, Clock, CheckCircle, XCircle, Pause } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { format, addDays, startOfWeek, endOfWeek, eachHourOfInterval, isWithinInterval, isSameHour } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Reserva {
  id: string;
  ambiente_id: string;
  usuario_id: string;
  data_inicio: string;
  data_fim: string;
  status: 'pendente' | 'aprovada' | 'recusada' | 'cancelada';
  observacoes?: string;
  criado_por: string;
  aprovado_por?: string;
  usuario: {
    nome: string;
  };
  ambiente: {
    nome: string;
    capacidade?: number;
  };
  created_at: string;
}

interface Ambiente {
  id: string;
  nome: string;
  descricao?: string;
  capacidade?: number;
  ativo: boolean;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export const Reservas: React.FC = () => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    ambiente_id: '',
    usuario_id: '',
    data: '',
    hora_inicio: '',
    hora_fim: '',
    observacoes: ''
  });

  useEffect(() => {
    if (user) {
      fetchReservas();
      fetchAmbientes();
      fetchUsuarios();
    }
  }, [user]);

  const fetchReservas = async () => {
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          *,
          usuario:usuarios(nome),
          ambiente:ambientes(nome, capacidade)
        `)
        .order('data_inicio', { ascending: true });

      if (error) throw error;
      setReservas(data as Reserva[] || []);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as reservas.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAmbientes = async () => {
    try {
      const { data, error } = await supabase
        .from('ambientes')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setAmbientes(data || []);
    } catch (error) {
      console.error('Erro ao buscar ambientes:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome, email')
        .eq('user_tipo', 'morador')
        .eq('status', 'ativo')
        .order('nome');

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const dataInicio = new Date(`${formData.data}T${formData.hora_inicio}:00`);
      const dataFim = new Date(`${formData.data}T${formData.hora_fim}:00`);

      const { error } = await supabase
        .from('reservas')
        .insert({
          ambiente_id: formData.ambiente_id,
          usuario_id: formData.usuario_id,
          data_inicio: dataInicio.toISOString(),
          data_fim: dataFim.toISOString(),
          observacoes: formData.observacoes,
          criado_por: user.id,
          status: user.tipo === 'sindico' ? 'aprovada' : 'pendente',
          aprovado_por: user.tipo === 'sindico' ? user.id : null
        });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Reserva criada com sucesso!'
      });

      setFormData({ ambiente_id: '', usuario_id: '', data: '', hora_inicio: '', hora_fim: '', observacoes: '' });
      setIsDialogOpen(false);
      fetchReservas();
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a reserva.',
        variant: 'destructive'
      });
    }
  };

  const handleAprovarReserva = async (reservaId: string) => {
    if (!user || user.tipo !== 'sindico') return;

    try {
      const { error } = await supabase
        .from('reservas')
        .update({
          status: 'aprovada',
          aprovado_por: user.id
        })
        .eq('id', reservaId);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Reserva aprovada com sucesso!'
      });

      fetchReservas();
    } catch (error) {
      console.error('Erro ao aprovar reserva:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível aprovar a reserva.',
        variant: 'destructive'
      });
    }
  };

  const handleRecusarReserva = async (reservaId: string) => {
    if (!user || user.tipo !== 'sindico') return;

    try {
      const { error } = await supabase
        .from('reservas')
        .update({
          status: 'recusada',
          aprovado_por: user.id
        })
        .eq('id', reservaId);

      if (error) throw error;

      toast({
        title: 'Reserva recusada',
        description: 'A reserva foi recusada.'
      });

      fetchReservas();
    } catch (error) {
      console.error('Erro ao recusar reserva:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível recusar a reserva.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { variant: 'secondary' as const, icon: Pause, label: 'Pendente' },
      aprovada: { variant: 'default' as const, icon: CheckCircle, label: 'Aprovada' },
      recusada: { variant: 'destructive' as const, icon: XCircle, label: 'Recusada' },
      cancelada: { variant: 'outline' as const, icon: XCircle, label: 'Cancelada' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // Generate week view
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(startDate, i));
  }

  const hours = eachHourOfInterval({
    start: new Date().setHours(8, 0, 0, 0),
    end: new Date().setHours(22, 0, 0, 0)
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reservas de Ambientes"
        description="Gerencie as reservas dos ambientes do condomínio"
        actions={[
          {
            label: 'Nova Reserva',
            onClick: () => setIsDialogOpen(true),
            icon: CalendarPlus
          }
        ]}
      />

      <div className="grid gap-6">
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Agenda Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                >
                  ← Semana Anterior
                </Button>
                <h3 className="font-semibold">
                  {format(startDate, 'dd MMM', { locale: ptBR })} - {format(endDate, 'dd MMM yyyy', { locale: ptBR })}
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                >
                  Próxima Semana →
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 gap-2 min-w-[800px]">
                <div className="font-medium p-2">Horário</div>
                {weekDays.map((day) => (
                  <div key={day.toISOString()} className="font-medium p-2 text-center">
                    <div>{format(day, 'EEE', { locale: ptBR })}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(day, 'dd/MM', { locale: ptBR })}
                    </div>
                  </div>
                ))}

                {hours.map((hour) => (
                  <React.Fragment key={hour.getTime()}>
                    <div className="p-2 text-sm text-muted-foreground">
                      {format(hour, 'HH:mm')}
                    </div>
                    {weekDays.map((day) => {
                      const cellDateTime = new Date(day);
                      cellDateTime.setHours(hour.getHours());
                      
                      const reservasNoHorario = reservas.filter(reserva => {
                        const inicio = new Date(reserva.data_inicio);
                        const fim = new Date(reserva.data_fim);
                        return isWithinInterval(cellDateTime, { start: inicio, end: fim }) && 
                               reserva.status === 'aprovada';
                      });

                      return (
                        <div 
                          key={`${day.toISOString()}-${hour.getTime()}`}
                          className="p-1 min-h-[60px] border border-border/50 relative hover:bg-muted/30 cursor-pointer"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              data: format(day, 'yyyy-MM-dd'),
                              hora_inicio: format(hour, 'HH:mm')
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          {reservasNoHorario.map((reserva) => (
                            <div
                              key={reserva.id}
                              className="absolute inset-1 bg-primary/10 border border-primary/20 rounded p-1 text-xs"
                            >
                              <div className="font-medium truncate">{reserva.ambiente.nome}</div>
                              <div className="text-muted-foreground truncate">{reserva.usuario.nome}</div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reservas Pendentes (só para síndico) */}
        {user?.tipo === 'sindico' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Reservas Pendentes de Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservas
                  .filter(r => r.status === 'pendente')
                  .map((reserva) => (
                    <div key={reserva.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{reserva.ambiente.nome}</span>
                          <Badge variant="secondary">{reserva.usuario.nome}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(reserva.data_inicio), 'dd/MM/yyyy HH:mm', { locale: ptBR })} - {' '}
                          {format(new Date(reserva.data_fim), 'HH:mm', { locale: ptBR })}
                        </div>
                        {reserva.observacoes && (
                          <p className="text-sm text-muted-foreground">{reserva.observacoes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAprovarReserva(reserva.id)}
                        >
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRecusarReserva(reserva.id)}
                        >
                          Recusar
                        </Button>
                      </div>
                    </div>
                  ))}
                {reservas.filter(r => r.status === 'pendente').length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma reserva pendente de aprovação.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Todas as Reservas */}
        <Card>
          <CardHeader>
            <CardTitle>Todas as Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservas.map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between p-4 border rounded-lg hover-scale">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{reserva.ambiente.nome}</h4>
                      {getStatusBadge(reserva.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {reserva.usuario.nome}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(new Date(reserva.data_inicio), 'dd/MM/yyyy HH:mm', { locale: ptBR })} - {' '}
                        {format(new Date(reserva.data_fim), 'HH:mm', { locale: ptBR })}
                      </span>
                      {reserva.ambiente.capacidade && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Capacidade: {reserva.ambiente.capacidade}
                        </span>
                      )}
                    </div>
                    {reserva.observacoes && (
                      <p className="text-sm text-muted-foreground">{reserva.observacoes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Reserva</DialogTitle>
            <DialogDescription>
              Crie uma nova reserva de ambiente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ambiente">Ambiente</Label>
                <Select
                  value={formData.ambiente_id}
                  onValueChange={(value) => setFormData({ ...formData, ambiente_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ambiente" />
                  </SelectTrigger>
                  <SelectContent>
                    {ambientes.map((ambiente) => (
                      <SelectItem key={ambiente.id} value={ambiente.id}>
                        {ambiente.nome} {ambiente.capacidade && `(${ambiente.capacidade} pessoas)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usuario">Morador</Label>
                <Select
                  value={formData.usuario_id}
                  onValueChange={(value) => setFormData({ ...formData, usuario_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o morador" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        {usuario.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora_inicio">Hora Início</Label>
                  <Input
                    id="hora_inicio"
                    type="time"
                    value={formData.hora_inicio}
                    onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora_fim">Hora Fim</Label>
                  <Input
                    id="hora_fim"
                    type="time"
                    value={formData.hora_fim}
                    onChange={(e) => setFormData({ ...formData, hora_fim: e.target.value })}
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
                  placeholder="Observações sobre a reserva..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Criar Reserva
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};