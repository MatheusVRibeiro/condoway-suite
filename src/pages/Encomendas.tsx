import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Package, PackagePlus, CheckCircle, Clock, Truck, Search } from 'lucide-react';

// Mock data
const mockEncomendas = [
  {
    id: '1',
    morador: 'Ana Silva Santos',
    apartamento: 'Bloco A - Apt 101',
    loja: 'Magazine Luiza',
    codigoRastreio: 'ML123456789BR',
    descricao: 'Televisão Samsung 50"',
    dataChegada: '2024-01-22T14:30:00',
    status: 'aguardando',
    observacoes: 'Produto frágil - cuidado no manuseio'
  },
  {
    id: '2',
    morador: 'Carlos Roberto Lima',
    apartamento: 'Bloco B - Apt 205',
    loja: 'Mercado Livre',
    codigoRastreio: 'ML987654321BR',
    descricao: 'Notebook Dell Inspiron',
    dataChegada: '2024-01-22T16:45:00',
    status: 'aguardando',
    observacoes: ''
  },
  {
    id: '3',
    morador: 'Maria Oliveira Costa',
    apartamento: 'Bloco A - Apt 304',
    loja: 'Amazon',
    codigoRastreio: 'AMZ789123456BR',
    descricao: 'Kit de panelas antiaderente',
    dataChegada: '2024-01-21T10:15:00',
    status: 'entregue',
    dataEntrega: '2024-01-21T18:30:00',
    observacoes: ''
  },
  {
    id: '4',
    morador: 'João Pedro Santos',
    apartamento: 'Bloco C - Apt 501',
    loja: 'Shopee',
    codigoRastreio: 'SHP456789123BR',
    descricao: 'Roupas e acessórios',
    dataChegada: '2024-01-20T09:20:00',
    status: 'entregue',
    dataEntrega: '2024-01-20T19:45:00',
    observacoes: 'Entregue em mãos ao próprio morador'
  }
];

export const Encomendas: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    morador: '',
    loja: '',
    codigoRastreio: '',
    descricao: '',
    observacoes: ''
  });

  const aguardandoEncomendas = mockEncomendas.filter(e => e.status === 'aguardando');
  const entreguesEncomendas = mockEncomendas.filter(e => e.status === 'entregue');

  const filteredAguardando = aguardandoEncomendas.filter(encomenda =>
    encomenda.morador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    encomenda.apartamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    encomenda.loja.toLowerCase().includes(searchTerm.toLowerCase()) ||
    encomenda.codigoRastreio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEntregues = entreguesEncomendas.filter(encomenda =>
    encomenda.morador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    encomenda.apartamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    encomenda.loja.toLowerCase().includes(searchTerm.toLowerCase()) ||
    encomenda.codigoRastreio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Encomenda registrada!",
      description: `Encomenda da ${formData.loja} foi registrada. O morador será notificado automaticamente.`
    });
    
    setIsDialogOpen(false);
    setFormData({
      morador: '',
      loja: '',
      codigoRastreio: '',
      descricao: '',
      observacoes: ''
    });
  };

  const handleMarcarEntregue = (encomendaId: string) => {
    toast({
      title: "Encomenda entregue!",
      description: "A entrega foi registrada com sucesso."
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Gestão de Encomendas"
        description="Registre chegadas de encomendas e controle as entregas aos moradores."
        badge={{ 
          label: `${aguardandoEncomendas.length} aguardando retirada`, 
          variant: aguardandoEncomendas.length > 0 ? 'destructive' : 'secondary'
        }}
        actions={[{
          label: 'Registrar Encomenda',
          icon: PackagePlus,
          onClick: () => setIsDialogOpen(true)
        }]}
      />

      {/* Search */}
      <Card className="shadow-condoway-md">
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar encomendas por morador, loja ou código de rastreio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="aguardando" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="aguardando" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Aguardando Retirada ({filteredAguardando.length})
          </TabsTrigger>
          <TabsTrigger value="entregues" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Histórico ({filteredEntregues.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="aguardando" className="space-y-4">
          {filteredAguardando.length === 0 ? (
            <Card className="shadow-condoway-md">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">
                    {searchTerm ? 'Nenhuma encomenda encontrada' : 'Nenhuma encomenda aguardando retirada'}
                  </p>
                  {!searchTerm && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Registre uma nova encomenda quando ela chegar
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAguardando.map((encomenda) => (
                <Card key={encomenda.id} className="shadow-condoway-md hover:shadow-condoway-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          {encomenda.morador}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{encomenda.apartamento}</p>
                      </div>
                      <Badge variant="secondary" className="bg-condoway-warning text-white self-start">
                        Aguardando Retirada
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-condoway-text-secondary">Loja</p>
                        <p className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          {encomenda.loja}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-condoway-text-secondary">Código de Rastreio</p>
                        <p className="font-mono text-sm">{encomenda.codigoRastreio}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-condoway-text-secondary">Descrição</p>
                        <p>{encomenda.descricao}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-condoway-text-secondary">Chegada</p>
                        <p>{formatDateTime(encomenda.dataChegada)}</p>
                      </div>
                    </div>
                    
                    {encomenda.observacoes && (
                      <div className="mb-4 p-3 bg-condoway-warning-light rounded-lg">
                        <p className="text-sm font-medium text-condoway-text-secondary">Observações:</p>
                        <p className="text-sm">{encomenda.observacoes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleMarcarEntregue(encomenda.id)}
                        className="bg-condoway-success hover:bg-condoway-success/90"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como Entregue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="entregues" className="space-y-4">
          <div className="grid gap-4">
            {filteredEntregues.map((encomenda) => (
              <Card key={encomenda.id} className="shadow-condoway-md">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-condoway-success" />
                        {encomenda.morador}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{encomenda.apartamento}</p>
                    </div>
                    <Badge variant="default" className="bg-condoway-success text-white self-start">
                      Entregue
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-condoway-text-secondary">Loja:</p>
                      <p>{encomenda.loja}</p>
                    </div>
                    <div>
                      <p className="font-medium text-condoway-text-secondary">Descrição:</p>
                      <p>{encomenda.descricao}</p>
                    </div>
                    <div>
                      <p className="font-medium text-condoway-text-secondary">Entrega:</p>
                      <p>{encomenda.dataEntrega ? formatDateTime(encomenda.dataEntrega) : '-'}</p>
                    </div>
                  </div>
                  {encomenda.observacoes && (
                    <div className="mt-3 p-2 bg-muted rounded text-sm">
                      <strong>Obs:</strong> {encomenda.observacoes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Register Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar Nova Encomenda</DialogTitle>
            <DialogDescription>
              Preencha as informações da encomenda que acabou de chegar. O morador será notificado automaticamente.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="morador">Destinatário *</Label>
              <Select value={formData.morador} onValueChange={(value) => setFormData({...formData, morador: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o morador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ana-silva">Ana Silva Santos - Bloco A, Apt 101</SelectItem>
                  <SelectItem value="carlos-lima">Carlos Roberto Lima - Bloco B, Apt 205</SelectItem>
                  <SelectItem value="maria-oliveira">Maria Oliveira Costa - Bloco A, Apt 304</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loja">Loja/Transportadora *</Label>
                <Input
                  id="loja"
                  value={formData.loja}
                  onChange={(e) => setFormData({...formData, loja: e.target.value})}
                  placeholder="Ex: Magazine Luiza"
                  required
                />
              </div>
              <div>
                <Label htmlFor="codigo">Código de Rastreio</Label>
                <Input
                  id="codigo"
                  value={formData.codigoRastreio}
                  onChange={(e) => setFormData({...formData, codigoRastreio: e.target.value})}
                  placeholder="Ex: ML123456789BR"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="descricao">Descrição do Item *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Ex: Televisão Samsung 50 polegadas"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Informações adicionais sobre a encomenda..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Registrar Encomenda
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};