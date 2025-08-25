import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Users, UserPlus, Clock, LogOut, Search, Filter } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Visitante {
  id: string;
  nome: string;
  documento: string;
  apartamento_id: string;
  data_entrada: string;
  data_saida?: string;
  status: 'ativo' | 'saiu';
  observacoes?: string;
  apartamento?: {
    numero: string;
    bloco: {
      nome: string;
    };
  };
}

interface Apartamento {
  id: string;
  numero: string;
  bloco: {
    nome: string;
  };
}

export const Visitantes: React.FC = () => {
  const { user } = useAuth();
  const [visitantes, setVisitantes] = useState<Visitante[]>([]);
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    documento: '',
    apartamento_id: '',
    observacoes: ''
  });

  useEffect(() => {
    if (user) {
      fetchVisitantes();
      fetchApartamentos();
    }
  }, [user]);

  const fetchVisitantes = async () => {
    try {
      const { data, error } = await supabase
        .from('visitantes')
        .select(`
          *,
          apartamento:apartamentos(
            numero,
            bloco:blocos(nome)
          )
        `)
        .order('data_entrada', { ascending: false });

      if (error) throw error;
      setVisitantes(data || []);
    } catch (error) {
      console.error('Erro ao buscar visitantes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os visitantes.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApartamentos = async () => {
    try {
      const { data, error } = await supabase
        .from('apartamentos')
        .select(`
          id,
          numero,
          bloco:blocos(nome)
        `)
        .order('numero');

      if (error) throw error;
      setApartamentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar apartamentos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('visitantes')
        .insert({
          nome: formData.nome,
          documento: formData.documento,
          apartamento_id: formData.apartamento_id,
          observacoes: formData.observacoes,
          registrado_por: user.id
        });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Visitante registrado com sucesso!'
      });

      setFormData({ nome: '', documento: '', apartamento_id: '', observacoes: '' });
      setIsDialogOpen(false);
      fetchVisitantes();
    } catch (error) {
      console.error('Erro ao registrar visitante:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar o visitante.',
        variant: 'destructive'
      });
    }
  };

  const handleRegistrarSaida = async (visitanteId: string) => {
    try {
      const { error } = await supabase
        .from('visitantes')
        .update({
          data_saida: new Date().toISOString(),
          status: 'saiu'
        })
        .eq('id', visitanteId);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Saída registrada com sucesso!'
      });

      fetchVisitantes();
    } catch (error) {
      console.error('Erro ao registrar saída:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar a saída.',
        variant: 'destructive'
      });
    }
  };

  const visitantesAtivos = visitantes.filter(v => v.status === 'ativo');
  const visitantesHistorico = visitantes.filter(v => v.status === 'saiu');

  const filteredVisitantesAtivos = visitantesAtivos.filter(visitante =>
    visitante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitante.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (visitante.apartamento && `${visitante.apartamento.bloco.nome} ${visitante.apartamento.numero}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredVisitantesHistorico = visitantesHistorico.filter(visitante =>
    visitante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitante.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (visitante.apartamento && `${visitante.apartamento.bloco.nome} ${visitante.apartamento.numero}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Controle de Visitantes"
        description="Gerencie o acesso de visitantes ao condomínio"
        badge={{ label: `${visitantesAtivos.length} ativos`, variant: 'secondary' }}
        actions={[
          {
            label: 'Registrar Visitante',
            onClick: () => setIsDialogOpen(true),
            icon: UserPlus
          }
        ]}
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar visitante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="ativos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ativos" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Visitantes Atuais ({visitantesAtivos.length})
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativos" className="space-y-4">
          {filteredVisitantesAtivos.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum visitante no condomínio no momento.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredVisitantesAtivos.map((visitante) => (
                <Card key={visitante.id} className="hover-scale">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{visitante.nome}</h3>
                          <Badge variant="secondary">Documento: {visitante.documento}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            Destino: {visitante.apartamento?.bloco?.nome} - Apt {visitante.apartamento?.numero}
                          </span>
                          <span>
                            Entrada: {format(new Date(visitante.data_entrada), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                        {visitante.observacoes && (
                          <p className="text-sm text-muted-foreground">{visitante.observacoes}</p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleRegistrarSaida(visitante.id)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Registrar Saída
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Visitantes</CardTitle>
              <CardDescription>
                Registro completo de todos os visitantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Apartamento</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Saída</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitantesHistorico.map((visitante) => (
                    <TableRow key={visitante.id}>
                      <TableCell className="font-medium">{visitante.nome}</TableCell>
                      <TableCell>{visitante.documento}</TableCell>
                      <TableCell>
                        {visitante.apartamento?.bloco?.nome} - {visitante.apartamento?.numero}
                      </TableCell>
                      <TableCell>
                        {format(new Date(visitante.data_entrada), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {visitante.data_saida ? 
                          format(new Date(visitante.data_saida), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 
                          '-'
                        }
                      </TableCell>
                      <TableCell>{visitante.observacoes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Novo Visitante</DialogTitle>
            <DialogDescription>
              Preencha os dados do visitante para liberação de acesso.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Visitante</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documento">RG/CPF</Label>
                <Input
                  id="documento"
                  value={formData.documento}
                  onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  placeholder="Digite o documento"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apartamento">Apartamento de Destino</Label>
                <Select
                  value={formData.apartamento_id}
                  onValueChange={(value) => setFormData({ ...formData, apartamento_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o apartamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartamentos.map((apt) => (
                      <SelectItem key={apt.id} value={apt.id}>
                        {apt.bloco.nome} - Apt {apt.numero}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                Registrar Visitante
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};