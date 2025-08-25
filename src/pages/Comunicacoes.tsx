import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, MessageCircle, Megaphone, Send, Users, Building, Home } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Comunicacao {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: string;
  remetente_id: string;
  destinatario_id?: string;
  apartamento_id?: string;
  bloco_id?: string;
  is_lida: boolean;
  created_at: string;
  remetente: {
    nome: string;
  };
  destinatario?: {
    nome: string;
  };
  apartamento?: {
    numero: string;
    bloco: {
      nome: string;
    };
  };
  bloco?: {
    nome: string;
  };
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface Apartamento {
  id: string;
  numero: string;
  bloco: {
    id: string;
    nome: string;
  };
}

interface Bloco {
  id: string;
  nome: string;
}

export const Comunicacoes: React.FC = () => {
  const { user } = useAuth();
  const [comunicacoes, setComunicacoes] = useState<Comunicacao[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tipoDialog, setTipoDialog] = useState<'mensagem' | 'notificacao' | 'comunicado'>('mensagem');

  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    destinatario_tipo: 'individual', // individual, apartamento, bloco, todos
    destinatario_id: '',
    apartamento_id: '',
    bloco_id: ''
  });

  useEffect(() => {
    if (user) {
      fetchComunicacoes();
      fetchUsuarios();
      fetchApartamentos();
      fetchBlocos();
    }
  }, [user]);

  const fetchComunicacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('comunicacoes')
        .select(`
          *,
          remetente:usuarios!comunicacoes_remetente_id_fkey(nome),
          destinatario:usuarios!comunicacoes_destinatario_id_fkey(nome),
          apartamento:apartamentos(
            numero,
            bloco:blocos(nome)
          ),
          bloco:blocos(nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComunicacoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar comunicações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as comunicações.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
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

  const fetchApartamentos = async () => {
    try {
      const { data, error } = await supabase
        .from('apartamentos')
        .select(`
          id,
          numero,
          bloco:blocos(id, nome)
        `)
        .order('numero');

      if (error) throw error;
      setApartamentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar apartamentos:', error);
    }
  };

  const fetchBlocos = async () => {
    try {
      const { data, error } = await supabase
        .from('blocos')
        .select('*')
        .order('nome');

      if (error) throw error;
      setBlocos(data || []);
    } catch (error) {
      console.error('Erro ao buscar blocos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const comunicacaoData = {
        titulo: formData.titulo,
        conteudo: formData.conteudo,
        tipo: tipoDialog,
        remetente_id: user.id,
        destinatario_id: formData.destinatario_tipo === 'individual' ? formData.destinatario_id : null,
        apartamento_id: formData.destinatario_tipo === 'apartamento' ? formData.apartamento_id : null,
        bloco_id: formData.destinatario_tipo === 'bloco' ? formData.bloco_id : null
      };

      const { error } = await supabase
        .from('comunicacoes')
        .insert(comunicacaoData);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `${tipoDialog === 'mensagem' ? 'Mensagem' : tipoDialog === 'notificacao' ? 'Notificação' : 'Comunicado'} enviado com sucesso!`
      });

      setFormData({
        titulo: '',
        conteudo: '',
        destinatario_tipo: 'individual',
        destinatario_id: '',
        apartamento_id: '',
        bloco_id: ''
      });
      setIsDialogOpen(false);
      fetchComunicacoes();
    } catch (error) {
      console.error('Erro ao enviar comunicação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a comunicação.',
        variant: 'destructive'
      });
    }
  };

  const abrirDialog = (tipo: 'mensagem' | 'notificacao' | 'comunicado') => {
    setTipoDialog(tipo);
    setFormData({
      titulo: '',
      conteudo: '',
      destinatario_tipo: tipo === 'comunicado' ? 'todos' : 'individual',
      destinatario_id: '',
      apartamento_id: '',
      bloco_id: ''
    });
    setIsDialogOpen(true);
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'mensagem':
        return <MessageCircle className="w-4 h-4" />;
      case 'notificacao':
        return <MessageSquare className="w-4 h-4" />;
      case 'comunicado':
        return <Megaphone className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getTipoBadge = (tipo: string) => {
    const config = {
      mensagem: { variant: 'default' as const, label: 'Mensagem' },
      notificacao: { variant: 'secondary' as const, label: 'Notificação' },
      comunicado: { variant: 'outline' as const, label: 'Comunicado' }
    };

    const tipConfig = config[tipo as keyof typeof config] || config.mensagem;

    return (
      <Badge variant={tipConfig.variant} className="flex items-center gap-1">
        {getTipoIcon(tipo)}
        {tipConfig.label}
      </Badge>
    );
  };

  const getDestinatarioText = (comunicacao: Comunicacao) => {
    if (comunicacao.destinatario) {
      return comunicacao.destinatario.nome;
    }
    if (comunicacao.apartamento) {
      return `${comunicacao.apartamento.bloco.nome} - Apt ${comunicacao.apartamento.numero}`;
    }
    if (comunicacao.bloco) {
      return `Bloco ${comunicacao.bloco.nome}`;
    }
    return 'Todos os moradores';
  };

  if (isLoading) {
    return <Loading />;
  }

  const mensagens = comunicacoes.filter(c => c.tipo === 'mensagem');
  const notificacoes = comunicacoes.filter(c => c.tipo === 'notificacao');
  const comunicados = comunicacoes.filter(c => c.tipo === 'comunicado');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Comunicações"
        description="Gerencie mensagens, notificações e comunicados"
        actions={[
          {
            label: 'Mensagem Direta',
            onClick: () => abrirDialog('mensagem'),
            variant: 'outline',
            icon: MessageCircle
          },
          {
            label: 'Notificação',
            onClick: () => abrirDialog('notificacao'),
            variant: 'outline',
            icon: MessageSquare
          },
          ...(user?.tipo === 'sindico' ? [{
            label: 'Comunicado',
            onClick: () => abrirDialog('comunicado'),
            icon: Megaphone
          }] : [])
        ]}
      />

      <Tabs defaultValue="todas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">
            Todas ({comunicacoes.length})
          </TabsTrigger>
          <TabsTrigger value="mensagens" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Mensagens ({mensagens.length})
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Notificações ({notificacoes.length})
          </TabsTrigger>
          <TabsTrigger value="comunicados" className="flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            Comunicados ({comunicados.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          <div className="space-y-4">
            {comunicacoes.map((comunicacao) => (
              <Card key={comunicacao.id} className="hover-scale">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{comunicacao.titulo}</CardTitle>
                      {getTipoBadge(comunicacao.tipo)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(comunicacao.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                  <CardDescription className="space-y-1">
                    <div>De: {comunicacao.remetente.nome}</div>
                    <div>Para: {getDestinatarioText(comunicacao)}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{comunicacao.conteudo}</p>
                </CardContent>
              </Card>
            ))}
            {comunicacoes.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma comunicação encontrada.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="mensagens" className="space-y-4">
          <div className="space-y-4">
            {mensagens.map((comunicacao) => (
              <Card key={comunicacao.id} className="hover-scale">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{comunicacao.titulo}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(comunicacao.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                  <CardDescription>
                    Para: {getDestinatarioText(comunicacao)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{comunicacao.conteudo}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-4">
          <div className="space-y-4">
            {notificacoes.map((comunicacao) => (
              <Card key={comunicacao.id} className="hover-scale">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{comunicacao.titulo}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(comunicacao.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                  <CardDescription>
                    Para: {getDestinatarioText(comunicacao)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{comunicacao.conteudo}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comunicados" className="space-y-4">
          <div className="space-y-4">
            {comunicados.map((comunicacao) => (
              <Card key={comunicacao.id} className="hover-scale">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{comunicacao.titulo}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(comunicacao.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                  <CardDescription>
                    Para: {getDestinatarioText(comunicacao)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{comunicacao.conteudo}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getTipoIcon(tipoDialog)}
              {tipoDialog === 'mensagem' ? 'Nova Mensagem' : 
               tipoDialog === 'notificacao' ? 'Nova Notificação' : 
               'Novo Comunicado'}
            </DialogTitle>
            <DialogDescription>
              {tipoDialog === 'mensagem' ? 'Envie uma mensagem direta para um morador' :
               tipoDialog === 'notificacao' ? 'Envie uma notificação importante' :
               'Crie um comunicado para todos os moradores'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Digite o título..."
                  required
                />
              </div>

              {tipoDialog !== 'comunicado' && (
                <div className="space-y-2">
                  <Label>Destinatário</Label>
                  <Select
                    value={formData.destinatario_tipo}
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      destinatario_tipo: value,
                      destinatario_id: '',
                      apartamento_id: '',
                      bloco_id: ''
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Morador específico
                        </div>
                      </SelectItem>
                      <SelectItem value="apartamento">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          Apartamento
                        </div>
                      </SelectItem>
                      {user?.tipo === 'sindico' && (
                        <>
                          <SelectItem value="bloco">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              Bloco
                            </div>
                          </SelectItem>
                          <SelectItem value="todos">
                            <div className="flex items-center gap-2">
                              <Megaphone className="w-4 h-4" />
                              Todos os moradores
                            </div>
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.destinatario_tipo === 'individual' && (
                <div className="space-y-2">
                  <Label htmlFor="destinatario">Morador</Label>
                  <Select
                    value={formData.destinatario_id}
                    onValueChange={(value) => setFormData({ ...formData, destinatario_id: value })}
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
              )}

              {formData.destinatario_tipo === 'apartamento' && (
                <div className="space-y-2">
                  <Label htmlFor="apartamento">Apartamento</Label>
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
              )}

              {formData.destinatario_tipo === 'bloco' && (
                <div className="space-y-2">
                  <Label htmlFor="bloco">Bloco</Label>
                  <Select
                    value={formData.bloco_id}
                    onValueChange={(value) => setFormData({ ...formData, bloco_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o bloco" />
                    </SelectTrigger>
                    <SelectContent>
                      {blocos.map((bloco) => (
                        <SelectItem key={bloco.id} value={bloco.id}>
                          {bloco.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="conteudo">Mensagem</Label>
                <Textarea
                  id="conteudo"
                  value={formData.conteudo}
                  onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                  placeholder="Digite sua mensagem..."
                  rows={4}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Enviar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};