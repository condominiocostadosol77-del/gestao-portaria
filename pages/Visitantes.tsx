
import React, { useState } from 'react';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Popover, PopoverContent, PopoverTrigger, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../components/ui';
import { Plus, Search, UserCheck, LogOut, Clock, X, Save, Check, ChevronsUpDown, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

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
function VisitanteForm({ visitante, moradores, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(visitante || {
    nome: '',
    documento: '',
    telefone: '',
    morador_id: '',
    morador_nome: '',
    unidade: '',
    bloco: '',
    observacoes: '',
    status: 'no_condominio'
  });
  const [openMorador, setOpenMorador] = useState(false);
  const [usarMoradorCadastrado, setUsarMoradorCadastrado] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMoradorChange = (moradorId: string) => {
    const morador = moradores.find((m: any) => m.id === moradorId);
    if (morador) {
      setFormData({
        ...formData,
        morador_id: moradorId,
        morador_nome: morador.nome_completo,
        unidade: morador.unidade,
        bloco: morador.bloco || ''
      });
    }
  };

  // Lógica de filtro robusta para a busca (Nome, Unidade, Bloco)
  const filteredMoradores = moradores?.filter((m: any) => {
    // Proteção contra valores nulos/undefined
    const searchLower = (searchQuery || "").toLowerCase();
    const nome = (m.nome_completo || "").toLowerCase();
    const unidade = (m.unidade || "").toString().toLowerCase();
    const bloco = (m.bloco || "").toLowerCase();
    
    return nome.includes(searchLower) || unidade.includes(searchLower) || bloco.includes(searchLower);
  });

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{visitante ? 'Editar Visitante' : 'Novo Visitante'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome do Visitante *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e: any) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo"
                required
              />
            </div>

            <div>
              <Label htmlFor="documento">Documento (RG/CPF)</Label>
              <Input
                id="documento"
                value={formData.documento}
                onChange={(e: any) => setFormData({ ...formData, documento: e.target.value })}
                placeholder="Opcional"
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
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={usarMoradorCadastrado}
                    onChange={() => setUsarMoradorCadastrado(true)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-slate-700">Selecionar morador cadastrado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!usarMoradorCadastrado}
                    onChange={() => {
                      setUsarMoradorCadastrado(false);
                      setFormData({ ...formData, morador_id: '' });
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-slate-700">Digitar unidade manualmente</span>
                </label>
              </div>

              {usarMoradorCadastrado && (
                <div>
                  <Label>Morador Visitado</Label>
                  <Popover open={openMorador} onOpenChange={setOpenMorador}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={openMorador}
                        className="w-full justify-between"
                      >
                        {formData.morador_id
                          ? moradores?.find((m: any) => m.id === formData.morador_id)?.nome_completo
                          : "Buscar morador..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput 
                          autoFocus
                          placeholder="Digite nome, unidade ou bloco..." 
                          value={searchQuery}
                          onChange={(e: any) => setSearchQuery(e.target.value)}
                          onKeyDown={(e: any) => { if (e.key === 'Enter') e.preventDefault(); }} 
                        />
                        <CommandList>
                          {filteredMoradores?.length === 0 && (
                            <CommandEmpty>Nenhum morador encontrado.</CommandEmpty>
                          )}
                          <CommandGroup>
                            {filteredMoradores?.map((m: any) => (
                              <CommandItem
                                key={m.id}
                                value={`${m.nome_completo} ${m.unidade} ${m.bloco || ''}`}
                                onSelect={() => {
                                  handleMoradorChange(m.id);
                                  setOpenMorador(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.morador_id === m.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {m.nome_completo} - Unidade {m.unidade}{m.bloco ? ` Bloco ${m.bloco}` : ''}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="unidade">Unidade *</Label>
              <Input
                id="unidade"
                value={formData.unidade}
                onChange={(e: any) => setFormData({ ...formData, unidade: e.target.value })}
                placeholder="Ex: 101"
                required
                disabled={usarMoradorCadastrado}
              />
            </div>

            <div>
              <Label htmlFor="bloco">Bloco</Label>
              <Input
                id="bloco"
                value={formData.bloco}
                onChange={(e: any) => setFormData({ ...formData, bloco: e.target.value })}
                placeholder="Ex: A"
                disabled={usarMoradorCadastrado}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e: any) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações adicionais sobre a visita..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {visitante ? 'Salvar' : 'Registrar Entrada'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Page ---
export default function Visitantes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingVisitante, setEditingVisitante] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: visitantes = [], isLoading } = useQuery({
    queryKey: ['visitantes'],
    queryFn: () => base44.entities.Visitante.list('-created_date', 100),
    staleTime: 30000,
  });

  const { data: moradores = [] } = useQuery({
    queryKey: ['moradores'],
    queryFn: () => base44.entities.Morador.list(),
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => base44.entities.Visitante.create({
      ...data,
      data_hora_entrada: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitantes'] });
      setShowForm(false);
      setEditingVisitante(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => base44.entities.Visitante.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitantes'] });
      setShowForm(false);
      setEditingVisitante(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => base44.entities.Visitante.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitantes'] });
    },
  });

  const registrarSaida = async (visitante: any) => {
    await updateMutation.mutateAsync({
      id: visitante.id,
      data: {
        ...visitante,
        status: 'saiu',
        data_hora_saida: new Date().toISOString()
      }
    });
  };

  const handleDelete = (visitante: any) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      deleteMutation.mutate(visitante.id);
    }
  };

  const filteredVisitantes = visitantes.filter((v: any) => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = v.nome?.toLowerCase().includes(searchLower) ||
                       v.unidade?.toLowerCase().includes(searchLower) ||
                       v.morador_nome?.toLowerCase().includes(searchLower) ||
                       v.documento?.toLowerCase().includes(searchLower) ||
                       v.bloco?.toLowerCase().includes(searchLower); // Block search
    const matchStatus = statusFilter === 'todos' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs: any = {
      no_condominio: { 
        icon: Clock, 
        label: 'No Condomínio', 
        className: 'bg-blue-100 text-blue-800 border-blue-200' 
      },
      saiu: { 
        icon: LogOut, 
        label: 'Saiu', 
        className: 'bg-slate-100 text-slate-800 border-slate-200' 
      }
    };
    const config = configs[status] || configs.no_condominio;
    const Icon = config.icon;
    return (
      <Badge className={`${config.className} border flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Visitantes</h1>
          <p className="text-slate-600 mt-1">Controle de entrada e saída de visitantes</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingVisitante(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Registrar Visitante
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" size={20} style={{ opacity: 1 }} />
              <Input
                placeholder="Buscar por nome, documento, unidade ou morador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="bg-slate-100">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="no_condominio">No Condomínio</TabsTrigger>
                <TabsTrigger value="saiu">Saíram</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      {showForm && (
        <VisitanteForm
          visitante={editingVisitante}
          moradores={moradores}
          onSubmit={(data: any) => {
            if (editingVisitante) {
              updateMutation.mutate({ id: editingVisitante.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingVisitante(null);
          }}
        />
      )}

      {/* Lista de Visitantes */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">Carregando...</p>
          </Card>
        ) : filteredVisitantes.length === 0 ? (
          <Card className="p-8 text-center border-0 shadow-lg">
            <UserCheck className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Nenhum visitante encontrado</p>
          </Card>
        ) : (
          filteredVisitantes.map((visitante: any) => (
            <Card key={visitante.id} className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-xl bg-teal-100 flex items-center justify-center">
                      <UserCheck className="h-10 w-10 text-teal-600" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{visitante.nome}</h3>
                        {visitante.morador_nome && (
                          <p className="text-slate-600">Visitando: {visitante.morador_nome}</p>
                        )}
                      </div>
                      {getStatusBadge(visitante.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-slate-500">Unidade:</span>
                        <p className="font-medium text-slate-900">
                          {visitante.unidade}{visitante.bloco ? ` - Bloco ${visitante.bloco}` : ''}
                        </p>
                      </div>
                      {visitante.documento && (
                        <div>
                          <span className="text-slate-500">Documento:</span>
                          <p className="font-medium text-slate-900">{visitante.documento}</p>
                        </div>
                      )}
                      {visitante.telefone && (
                        <div>
                          <span className="text-slate-500">Telefone:</span>
                          <p className="font-medium text-slate-900">{visitante.telefone}</p>
                        </div>
                      )}
                      {visitante.data_hora_entrada && (
                        <div>
                          <span className="text-slate-500">Entrada:</span>
                          <p className="font-medium text-slate-900">
                            {format(new Date(visitante.data_hora_entrada), 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                      )}
                      {visitante.data_hora_saida && (
                        <div>
                          <span className="text-slate-500">Saída:</span>
                          <p className="font-medium text-slate-900">
                            {format(new Date(visitante.data_hora_saida), 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                      )}
                    </div>

                    {visitante.observacoes && (
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        {visitante.observacoes}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {visitante.status === 'no_condominio' && (
                        <Button
                          type="button"
                          onClick={() => registrarSaida(visitante)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          Registrar Saída
                        </Button>
                      )}
                      <DeleteAction onConfirm={() => handleDelete(visitante)} />
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
