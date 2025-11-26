
import React, { useState } from 'react';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Popover, PopoverContent, PopoverTrigger, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../components/ui';
import { Plus, Search, TruckIcon, Package, Calendar, X, Save, Check, ChevronsUpDown, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
function VisitaEntregadorForm({ visita, entregadores, empresas, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(visita || {
    entregador_id: '',
    entregador_nome: '',
    empresa_id: '',
    empresa_nome: '',
    quantidade_encomendas: 1,
    turno: 'diurno',
    observacoes: ''
  });
  const [openEntregador, setOpenEntregador] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEntregadorChange = (entregadorId: string) => {
    const entregador = entregadores.find((e: any) => e.id === entregadorId);
    if (entregador) {
      setFormData({
        ...formData,
        entregador_id: entregadorId,
        entregador_nome: entregador.nome_completo,
        // Se o entregador já tem empresa vinculada, sugerimos preencher
        empresa_id: !formData.empresa_id && entregador.empresa ? empresas.find((emp: any) => emp.nome === entregador.empresa)?.id || '' : formData.empresa_id
      });
    }
  };

  const filteredEntregadores = entregadores?.filter((e: any) => {
    if (e.status !== 'ativo') return false;
    const searchLower = searchQuery.toLowerCase();
    const nomeMatch = e.nome_completo.toLowerCase().includes(searchLower);
    const cpfMatch = e.cpf && e.cpf.includes(searchLower);
    const rgMatch = e.rg && e.rg.includes(searchLower);
    
    return nomeMatch || cpfMatch || rgMatch;
  });

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{visita ? 'Editar Visita' : 'Registrar Visita de Entregador'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entregador */}
            <div className="md:col-span-2">
              <Label htmlFor="entregador">Entregador *</Label>
              <Popover open={openEntregador} onOpenChange={setOpenEntregador}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openEntregador}
                    className="w-full justify-between"
                  >
                    {formData.entregador_id
                      ? entregadores?.find((e: any) => e.id === formData.entregador_id)?.nome_completo
                      : "Buscar entregador..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Digite o nome, CPF ou RG..." 
                      value={searchQuery}
                      onChange={(e: any) => setSearchQuery(e.target.value)}
                      onKeyDown={(e: any) => { if (e.key === 'Enter') e.preventDefault(); }} 
                    />
                    <CommandList>
                      {filteredEntregadores?.length === 0 && (
                        <CommandEmpty>Nenhum entregador encontrado.</CommandEmpty>
                      )}
                      <CommandGroup>
                        {filteredEntregadores?.map((e: any) => (
                          <CommandItem
                            key={e.id}
                            value={`${e.nome_completo} ${e.cpf || ''} ${e.rg || ''} ${e.empresa}`}
                            onSelect={() => {
                              handleEntregadorChange(e.id);
                              setOpenEntregador(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.entregador_id === e.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div>
                              <div>{e.nome_completo} - {e.empresa}</div>
                              {(e.cpf || e.rg) && (
                                <div className="text-xs text-slate-500">
                                  {e.cpf && `CPF: ${e.cpf}`}
                                  {e.cpf && e.rg && ' | '}
                                  {e.rg && `RG: ${e.rg}`}
                                </div>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Empresa */}
            <div className="md:col-span-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Select 
                value={formData.empresa_id} 
                onValueChange={(value) => {
                  const empresa = empresas?.find((e: any) => e.id === value);
                  setFormData({ 
                    ...formData, 
                    empresa_id: value,
                    empresa_nome: empresa?.nome || ''
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione (opcional)">
                    {formData.empresa_nome || formData.empresa_id ? empresas?.find((e: any) => e.id === formData.empresa_id)?.nome || formData.empresa_nome : "Selecione (opcional)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {empresas?.filter((e: any) => e.status === 'ativa').map((e: any) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantidade de Encomendas */}
            <div>
              <Label htmlFor="quantidade">Quantidade de Encomendas *</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={formData.quantidade_encomendas}
                onChange={(e) => setFormData({ ...formData, quantidade_encomendas: parseInt(e.target.value) })}
                required
              />
            </div>

            {/* Turno */}
            <div>
              <Label htmlFor="turno">Turno</Label>
              <Select 
                value={formData.turno} 
                onValueChange={(value) => setFormData({ ...formData, turno: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diurno">Diurno</SelectItem>
                  <SelectItem value="noturno">Noturno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Observações */}
            <div className="md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações adicionais sobre a visita..."
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
              {visita ? 'Salvar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Page ---
export default function VisitasEntregadores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingVisita, setEditingVisita] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: visitas = [], isLoading } = useQuery({
    queryKey: ['visitas-entregadores'],
    queryFn: () => base44.entities.VisitaEntregador.list('-created_date', 100),
    staleTime: 30000,
  });

  const { data: entregadores = [] } = useQuery({
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
    mutationFn: (data: any) => base44.entities.VisitaEntregador.create({
      ...data,
      data_hora: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitas-entregadores'] });
      setShowForm(false);
      setEditingVisita(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => base44.entities.VisitaEntregador.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitas-entregadores'] });
      setShowForm(false);
      setEditingVisita(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => base44.entities.VisitaEntregador.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitas-entregadores'] });
    },
  });

  const filteredVisitas = visitas.filter((v: any) => {
    const entregador = entregadores.find((e: any) => e.id === v.entregador_id);
    const matchSearch = v.entregador_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       v.empresa_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       entregador?.cpf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       entregador?.rg?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const getTurnoColor = (turno: string) => {
    const cores: any = {
      diurno: 'bg-sky-100 text-sky-800',
      noturno: 'bg-indigo-100 text-indigo-800'
    };
    return cores[turno] || 'bg-gray-100 text-gray-800';
  };

  const handleDelete = (visita: any) => {
    if (window.confirm('Tem certeza que deseja excluir esta visita?')) {
      deleteMutation.mutate(visita.id);
    }
  };

  const totalEncomendas = filteredVisitas.reduce((acc: any, v: any) => acc + (v.quantidade_encomendas || 0), 0);
  const visitasHoje = filteredVisitas.filter((v: any) => {
    const hoje = new Date().toDateString();
    const dataVisita = new Date(v.created_date || v.data_hora).toDateString();
    return hoje === dataVisita;
  }).length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Visitas de Entregadores</h1>
          <p className="text-slate-600 mt-1">Registro de visitas e entregas</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingVisita(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Registrar Visita
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Visitas Hoje</p>
                <p className="text-2xl font-bold text-slate-900">{visitasHoje}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total de Encomendas</p>
                <p className="text-2xl font-bold text-slate-900">{totalEncomendas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" size={20} style={{ opacity: 1 }} />
            <Input
              placeholder="Buscar por entregador, empresa ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <VisitaEntregadorForm
          visita={editingVisita}
          entregadores={entregadores}
          empresas={empresas}
          onSubmit={(data: any) => {
            if (editingVisita) {
              updateMutation.mutate({ id: editingVisita.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingVisita(null);
          }}
        />
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">Carregando...</p>
          </Card>
        ) : filteredVisitas.length === 0 ? (
          <Card className="p-8 text-center border-0 shadow-lg">
            <TruckIcon className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Nenhuma visita registrada</p>
          </Card>
        ) : (
          filteredVisitas.map((visita: any) => (
            <Card 
              key={visita.id} 
              className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-xl bg-blue-100 flex items-center justify-center">
                      <TruckIcon className="h-10 w-10 text-blue-600" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{visita.entregador_nome}</h3>
                        {visita.empresa_nome && (
                          <p className="text-slate-600">{visita.empresa_nome}</p>
                        )}
                        <p className="text-sm text-slate-500">
                          {visita.created_date && format(new Date(visita.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {visita.turno && (
                          <Badge className={getTurnoColor(visita.turno)}>
                            {visita.turno?.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-emerald-50 p-3 rounded-lg">
                      <Package className="h-5 w-5 text-emerald-600" />
                      <span className="text-lg font-bold text-emerald-900">
                        {visita.quantidade_encomendas} {visita.quantidade_encomendas === 1 ? 'encomenda' : 'encomendas'}
                      </span>
                    </div>

                    {visita.observacoes && (
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        {visita.observacoes}
                      </p>
                    )}

                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingVisita(visita);
                          setShowForm(true);
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Editar
                      </Button>
                      <DeleteAction onConfirm={() => deleteMutation.mutate(visita.id)} />
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
