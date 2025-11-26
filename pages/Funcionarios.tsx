
import React, { useState } from 'react';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Popover, PopoverContent, PopoverTrigger } from '../components/ui';
import { Plus, Search, Users, User, Phone, Mail, X, Save, Upload, Trash2, AlertTriangle } from 'lucide-react';

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
function FuncionarioForm({ funcionario, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(funcionario || {
    nome_completo: '',
    cpf: '',
    cargo: 'porteiro',
    telefone: '',
    email: '',
    turno: 'diurno',
    horario_entrada: '',
    horario_saida: '',
    status: 'ativo',
    data_admissao: '',
    observacoes: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, foto_url: file_url });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{funcionario ? 'Editar Funcionário' : 'Novo Funcionário'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label>Foto do Funcionário</Label>
              <div className="mt-2 flex items-center gap-4">
                {formData.foto_url && (
                  <img 
                    src={formData.foto_url} 
                    alt="Preview"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                )}
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
                    <Upload className="h-5 w-5 text-slate-600" />
                    <span className="text-sm text-slate-600">
                      {uploading ? 'Enviando...' : 'Escolher foto'}
                    </span>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome_completo}
                onChange={(e: any) => setFormData({ ...formData, nome_completo: e.target.value })}
                placeholder="Nome completo"
                required
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
              <Label htmlFor="cargo">Cargo *</Label>
              <Select 
                value={formData.cargo} 
                onValueChange={(value: string) => setFormData({ ...formData, cargo: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="porteiro">Porteiro</SelectItem>
                  <SelectItem value="zelador">Zelador</SelectItem>
                  <SelectItem value="sindico">Síndico</SelectItem>
                  <SelectItem value="auxiliar">Auxiliar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="turno">Turno *</Label>
              <Select 
                value={formData.turno} 
                onValueChange={(value: string) => setFormData({ ...formData, turno: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diurno">Diurno</SelectItem>
                  <SelectItem value="noturno">Noturno</SelectItem>
                  <SelectItem value="integral">Integral</SelectItem>
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
                  <SelectItem value="ferias">Férias</SelectItem>
                  <SelectItem value="afastado">Afastado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="horario_entrada">Horário Entrada</Label>
              <Input
                id="horario_entrada"
                type="time"
                value={formData.horario_entrada}
                onChange={(e: any) => setFormData({ ...formData, horario_entrada: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="horario_saida">Horário Saída</Label>
              <Input
                id="horario_saida"
                type="time"
                value={formData.horario_saida}
                onChange={(e: any) => setFormData({ ...formData, horario_saida: e.target.value })}
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

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="data_admissao">Data de Admissão</Label>
              <Input
                id="data_admissao"
                type="date"
                value={formData.data_admissao}
                onChange={(e: any) => setFormData({ ...formData, data_admissao: e.target.value })}
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
            <Button type="submit" className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
              <Save className="h-4 w-4 mr-2" />
              {funcionario ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Page ---
export default function Funcionarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: funcionarios = [], isLoading } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => base44.entities.Funcionario.list(),
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => base44.entities.Funcionario.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      setShowForm(false);
      setEditingFuncionario(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => base44.entities.Funcionario.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      setShowForm(false);
      setEditingFuncionario(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => base44.entities.Funcionario.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
    },
  });

  const filteredFuncionarios = funcionarios.filter((f: any) => {
    const matchSearch = f.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       f.cpf?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'todos' || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs: any = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      ferias: 'bg-blue-100 text-blue-800',
      afastado: 'bg-yellow-100 text-yellow-800'
    };
    return configs[status] || 'bg-gray-100 text-gray-800';
  };

  const getTurnoColor = (turno: string) => {
    const configs: any = {
      diurno: 'bg-sky-100 text-sky-800',
      noturno: 'bg-indigo-100 text-indigo-800',
      integral: 'bg-purple-100 text-purple-800'
    };
    return configs[turno] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Funcionários</h1>
          <p className="text-slate-600 mt-1">Cadastro e gestão de funcionários</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingFuncionario(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" size={20} style={{ opacity: 1 }} />
              <Input
                placeholder="Buscar por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="bg-slate-100">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="ativo">Ativos</TabsTrigger>
                <TabsTrigger value="ferias">Férias</TabsTrigger>
                <TabsTrigger value="inativo">Inativos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <FuncionarioForm
          funcionario={editingFuncionario}
          onSubmit={(data: any) => {
            if (editingFuncionario) {
              updateMutation.mutate({ id: editingFuncionario.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingFuncionario(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <Card className="p-8 text-center md:col-span-2 lg:col-span-3">
            <p className="text-slate-500">Carregando...</p>
          </Card>
        ) : filteredFuncionarios.length === 0 ? (
          <Card className="p-8 text-center border-0 shadow-lg md:col-span-2 lg:col-span-3">
            <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Nenhum funcionário encontrado</p>
          </Card>
        ) : (
          filteredFuncionarios.map((funcionario: any) => (
            <Card 
              key={funcionario.id} 
              className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {funcionario.foto_url ? (
                      <img 
                        src={funcionario.foto_url} 
                        alt={funcionario.nome_completo}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-200 to-cyan-300 flex items-center justify-center">
                        <User className="h-8 w-8 text-teal-700" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 truncate">{funcionario.nome_completo}</h3>
                      <Badge className={getStatusBadge(funcionario.status)}>
                        {funcionario.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-medium">Cargo:</span>
                        <span className="capitalize">{funcionario.cargo}</span>
                      </div>

                      <Badge className={getTurnoColor(funcionario.turno)}>
                        Turno: {funcionario.turno?.toUpperCase()}
                      </Badge>

                      {funcionario.horario_entrada && funcionario.horario_saida && (
                        <div className="text-slate-600">
                          {funcionario.horario_entrada} - {funcionario.horario_saida}
                        </div>
                      )}

                      {funcionario.telefone && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="h-3 w-3" />
                          <span>{funcionario.telefone}</span>
                        </div>
                      )}

                      {funcionario.email && (
                        <div className="flex items-center gap-2 text-slate-600 truncate">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{funcionario.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingFuncionario(funcionario);
                          setShowForm(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Editar
                      </Button>
                      <DeleteAction onConfirm={() => deleteMutation.mutate(funcionario.id)} />
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
