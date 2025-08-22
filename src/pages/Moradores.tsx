import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserPlus, Search, MoreHorizontal, Edit, Eye, Phone, Mail, MapPin } from 'lucide-react';

// Mock data
const mockMoradores = [
  {
    id: '1',
    nome: 'Ana Silva Santos',
    email: 'ana.silva@email.com',
    telefone: '(11) 99999-1234',
    bloco: 'A',
    apartamento: '101',
    status: 'ativo',
    dataIngresso: '2023-01-15',
    proprietario: true
  },
  {
    id: '2',
    nome: 'Carlos Roberto Lima',
    email: 'carlos.lima@email.com',
    telefone: '(11) 88888-5678',
    bloco: 'B',
    apartamento: '205',
    status: 'ativo',
    dataIngresso: '2023-03-22',
    proprietario: false
  },
  {
    id: '3',
    nome: 'Maria Oliveira Costa',
    email: 'maria.oliveira@email.com',
    telefone: '(11) 77777-9012',
    bloco: 'A',
    apartamento: '304',
    status: 'ativo',
    dataIngresso: '2022-11-08',
    proprietario: true
  },
  {
    id: '4',
    nome: 'João Pedro Santos',
    email: 'joao.pedro@email.com',
    telefone: '(11) 66666-3456',
    bloco: 'C',
    apartamento: '501',
    status: 'pendente',
    dataIngresso: '2024-01-10',
    proprietario: true
  }
];

export const Moradores: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    bloco: '',
    apartamento: '',
    proprietario: true
  });

  const filteredMoradores = mockMoradores.filter(morador =>
    morador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    morador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${morador.bloco}${morador.apartamento}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    toast({
      title: "Morador cadastrado com sucesso!",
      description: `${formData.nome} foi adicionado ao sistema.`
    });
    
    setIsDialogOpen(false);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      senha: '',
      bloco: '',
      apartamento: '',
      proprietario: true
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-condoway-success text-white">Ativo</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-condoway-warning text-white">Pendente</Badge>;
      case 'inativo':
        return <Badge variant="destructive">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) return null;

  const canAddMorador = user.tipo === 'sindico' || user.tipo === 'porteiro';

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Gestão de Moradores"
        description="Cadastre e gerencie os moradores do condomínio, controle acessos e mantenha os dados atualizados."
        badge={{ label: `${mockMoradores.length} moradores`, variant: 'secondary' }}
        actions={canAddMorador ? [{
          label: 'Novo Morador',
          icon: UserPlus,
          onClick: () => setIsDialogOpen(true)
        }] : []}
      />

      {/* Search and Filters */}
      <Card className="shadow-condoway-md">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome, email ou apartamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMoradores.map((morador) => (
                  <TableRow key={morador.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{morador.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          Desde {new Date(morador.dataIngresso).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3" />
                          {morador.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3" />
                          {morador.telefone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>Bloco {morador.bloco} - Apt {morador.apartamento}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={morador.proprietario ? 'default' : 'outline'}>
                        {morador.proprietario ? 'Proprietário' : 'Inquilino'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(morador.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          {canAddMorador && (
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Resident Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Morador</DialogTitle>
            <DialogDescription>
              Preencha as informações do morador. A senha será utilizada para acesso ao aplicativo.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Ana Silva Santos"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="ana@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="senha">Senha de Acesso *</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  placeholder="Senha para o aplicativo do morador"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bloco">Bloco *</Label>
                  <Select value={formData.bloco} onValueChange={(value) => setFormData({...formData, bloco: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o bloco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Bloco A</SelectItem>
                      <SelectItem value="B">Bloco B</SelectItem>
                      <SelectItem value="C">Bloco C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="apartamento">Apartamento *</Label>
                  <Input
                    id="apartamento"
                    value={formData.apartamento}
                    onChange={(e) => setFormData({...formData, apartamento: e.target.value})}
                    placeholder="Ex: 101"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="tipo">Tipo de Morador *</Label>
                <Select 
                  value={formData.proprietario ? "proprietario" : "inquilino"} 
                  onValueChange={(value) => setFormData({...formData, proprietario: value === "proprietario"})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proprietario">Proprietário</SelectItem>
                    <SelectItem value="inquilino">Inquilino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Cadastrar Morador
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};