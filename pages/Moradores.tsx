
import React, { useState } from 'react';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Popover, PopoverContent, PopoverTrigger } from '../components/ui';
import { Plus, Search, Users, User, Phone, Mail, Home, X, Save, Trash2, AlertTriangle } from 'lucide-react';

// --- Delete Action Component ---
function DeleteAction({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bottom-full mb-2" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" /> Confirmar Exclusão
            </h4>
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <Button 
            type="button" 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
              setOpen(false);
            }}
          >
            Confirmar Exclusão
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// --- Form ---
function MoradorForm({ morador, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(morador || {
    nome_completo: '',
    unidade: '',
    bloco: '',
    telefone: '',
    email: '',
    cpf: '',
    status: 'ativo',
    tipo: 'proprietario',
    observacoes: ''
  });

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{morador ? 'Editar Morador' : 'Novo Morador'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome_completo}
                onChange={(e: any) => setFormData({ ...formData, nome_completo: e.target.value })}
                placeholder="Nome completo do morador"
                required
              />
            </div>

            <div>
              <Label htmlFor="unidade">Unidade *</Label>
              <Input
                id="unidade"
                value={formData.unidade}
                onChange={(e: any) => setFormData({ ...formData, unidade: e.target.value })}
                placeholder="Ex: 101"
                required
              />
            </div>

            <div>
              <Label htmlFor="bloco">Bloco</Label>
              <Input
                id="bloco"
                value={formData.bloco}
                onChange={(e: any) => setFormData({ ...formData, bloco: e.target.value })}
                placeholder="Ex: A"
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo *</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value: string) => setFormData({ ...formData, tipo: value })}
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

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: string) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e: any) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e: any) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e: any) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações adicionais..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Save className="h-4 w-4 mr-2" />
              {morador ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Page ---
export default function Moradores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingMorador, setEditingMorador] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: moradores = [], isLoading } = useQuery({
    queryKey: ['moradores'],
    queryFn: () => base44.entities.Morador.list(),
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => base44.entities.Morador.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moradores'] });
      setShowForm(false);
      setEditingMorador(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => base44.entities.Morador.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moradores'] });
      setShowForm(false);
      setEditingMorador(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => base44.entities.Morador.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moradores'] });
    },
  });

  const filteredMoradores = moradores.filter((m: any) => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = m.nome_completo?.toLowerCase().includes(searchLower) ||
                       m.unidade?.toLowerCase().includes(searchLower) ||
                       m.bloco?.toLowerCase().includes(searchLower) ||
                       m.cpf?.includes(searchTerm); // CPF search
    const matchStatus = statusFilter === 'todos' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs: any = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800'
    };
    return configs[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Moradores</h1>
          <p className="text-slate-600 mt-1">Cadastro de moradores e unidades</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingMorador(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Morador
        </Button>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" size={20} style={{ opacity: 1 }} />
              <Input
                placeholder="Buscar por nome, unidade, bloco ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="bg-slate-100">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="ativo">Ativos</TabsTrigger>
                <TabsTrigger value="inativo">Inativos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <MoradorForm
          morador={editingMorador}
          onSubmit={(data: any) => {
            if (editingMorador) {
              updateMutation.mutate({ id: editingMorador.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingMorador(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <Card className="p-8 text-center md:col-span-2 lg:col-span-3">
            <p className="text-slate-500">Carregando...</p>
          </Card>
        ) : filteredMoradores.length === 0 ? (
          <Card className="p-8 text-center border-0 shadow-lg md:col-span-2 lg:col-span-3">
            <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Nenhum morador encontrado</p>
          </Card>
        ) : (
          filteredMoradores.map((morador: any) => (
            <Card 
              key={morador.id} 
              className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-700" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 truncate">{morador.nome_completo}</h3>
                      <Badge className={getStatusBadge(morador.status)}>
                        {morador.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-900 font-medium">
                        <Home className="h-4 w-4 text-blue-600" />
                        <span>Unidade {morador.unidade}{morador.bloco ? ` - Bloco ${morador.bloco}` : ''}</span>
                      </div>

                      {morador.tipo && (
                        <Badge variant="outline" className="text-xs">
                          {morador.tipo === 'proprietario' ? 'Proprietário' : 'Inquilino'}
                        </Badge>
                      )}

                      {morador.telefone && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="h-3 w-3" />
                          <span>{morador.telefone}</span>
                        </div>
                      )}

                      {morador.email && (
                        <div className="flex items-center gap-2 text-slate-600 truncate">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{morador.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingMorador(morador);
                          setShowForm(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Editar
                      </Button>
                      <DeleteAction onConfirm={() => deleteMutation.mutate(morador.id)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
