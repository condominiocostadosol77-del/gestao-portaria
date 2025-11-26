
import React, { useState } from 'react';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Popover, PopoverContent, PopoverTrigger } from '../components/ui';
import { Plus, Search, Truck, User, Phone, FileText, X, Save, Trash2, AlertTriangle } from 'lucide-react';

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
function EntregadorForm({ entregador, empresas, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(entregador || {
    nome_completo: '',
    empresa: '',
    telefone: '',
    cpf: '',
    status: 'ativo',
    observacoes: ''
  });

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{entregador ? 'Editar Entregador' : 'Novo Entregador'}</CardTitle>
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
                placeholder="Nome do entregador"
                required
              />
            </div>

            <div>
              <Label htmlFor="empresa">Empresa *</Label>
              <Select 
                value={formData.empresa} 
                onValueChange={(value: string) => setFormData({ ...formData, empresa: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas?.filter((e: any) => e.status === 'ativa').map((e: any) => (
                    <SelectItem key={e.id} value={e.nome}>
                      {e.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e: any) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
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
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={formData.rg}
                onChange={(e: any) => setFormData({ ...formData, rg: e.target.value })}
                placeholder="00.000.000-0"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
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
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e: any) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações adicionais sobre o entregador..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Save className="h-4 w-4 mr-2" />
              {entregador ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Page ---
export default function Entregadores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingEntregador, setEditingEntregador] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: entregadores = [], isLoading } = useQuery({
    queryKey: ['entregadores'],
    queryFn: () => base44.entities.Entregador.list(),
    staleTime: 30000,
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas'],
    queryFn: () => base44.entities.Empresa.list(),
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => base44.entities.Entregador.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entregadores'] });
      setShowForm(false);
      setEditingEntregador(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => base44.entities.Entregador.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entregadores'] });
      setShowForm(false);
      setEditingEntregador(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => base44.entities.Entregador.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entregadores'] });
    },
  });

  const filteredEntregadores = entregadores.filter((e: any) => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = e.nome_completo?.toLowerCase().includes(searchLower) ||
                       e.empresa?.toLowerCase().includes(searchLower) ||
                       e.cpf?.toLowerCase().includes(searchLower) ||
                       e.rg?.toLowerCase().includes(searchLower); // RG search
    const matchStatus = statusFilter === 'todos' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs: any = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      bloqueado: 'bg-red-100 text-red-800'
    };
    return configs[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Entregadores</h1>
          <p className="text-slate-600 mt-1">Cadastro de entregadores</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingEntregador(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Entregador
        </Button>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" size={20} style={{ opacity: 1 }} />
              <Input
                placeholder="Buscar por nome, empresa, CPF ou RG..."
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
                <TabsTrigger value="bloqueado">Bloqueados</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <EntregadorForm
          entregador={editingEntregador}
          empresas={empresas}
          onSubmit={(data: any) => {
            if (editingEntregador) {
              updateMutation.mutate({ id: editingEntregador.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingEntregador(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <Card className="p-8 text-center md:col-span-2 lg:col-span-3">
            <p className="text-slate-500">Carregando...</p>
          </Card>
        ) : filteredEntregadores.length === 0 ? (
          <Card className="p-8 text-center border-0 shadow-lg md:col-span-2 lg:col-span-3">
            <Truck className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Nenhum entregador encontrado</p>
          </Card>
        ) : (
          filteredEntregadores.map((entregador: any) => (
            <Card 
              key={entregador.id} 
              className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center">
                      <User className="h-8 w-8 text-emerald-700" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 truncate">{entregador.nome_completo}</h3>
                      <Badge className={getStatusBadge(entregador.status)}>
                        {entregador.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-medium">Empresa:</span>
                        <span>{entregador.empresa}</span>
                      </div>

                      {entregador.telefone && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="h-3 w-3" />
                          <span>{entregador.telefone}</span>
                        </div>
                      )}

                      {entregador.cpf && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <FileText className="h-3 w-3" />
                          <span>{entregador.cpf}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingEntregador(entregador);
                          setShowForm(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Editar
                      </Button>
                      <DeleteAction onConfirm={() => deleteMutation.mutate(entregador.id)} />
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
