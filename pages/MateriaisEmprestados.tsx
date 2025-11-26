
import React, { useState } from 'react';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Popover, PopoverContent, PopoverTrigger, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../components/ui';
import { Plus, Search, Package, CheckCircle2, Clock, Wrench, X, Save, Check, ChevronsUpDown, Trash2, AlertTriangle } from 'lucide-react';
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
function MaterialEmprestadoForm({ material, moradores, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(material || {
    material: '',
    tipo_pessoa: 'morador',
    morador_id: '',
    morador_nome: '',
    unidade: '',
    bloco: '',
    nome_terceiro: '',
    documento_terceiro: '',
    telefone: '',
    observacoes: '',
    status: 'emprestado'
  });
  const [openMorador, setOpenMorador] = useState(false);

  const handleMoradorChange = (moradorId: string) => {
    const morador = moradores.find((m: any) => m.id === moradorId);
    if (morador) {
      setFormData({
        ...formData,
        morador_id: moradorId,
        morador_nome: morador.nome_completo,
        unidade: morador.unidade,
        bloco: morador.bloco || '',
        telefone: morador.telefone || ''
      });
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{material ? 'Editar Empréstimo' : 'Novo Empréstimo'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="material">Material *</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e: any) => setFormData({ ...formData, material: e.target.value })}
                placeholder="Ex: Enxada, Martelo, Furadeira"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="tipo_pessoa">Quem está retirando? *</Label>
              <Select 
                value={formData.tipo_pessoa} 
                onValueChange={(value: string) => setFormData({ ...formData, tipo_pessoa: value, morador_id: '', nome_terceiro: '', documento_terceiro: '' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morador">Morador</SelectItem>
                  <SelectItem value="terceiro">Terceiro (Pessoa de fora)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tipo_pessoa === 'morador' && (
              <div className="md:col-span-2">
                <Label>Morador</Label>
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
                      <CommandInput placeholder="Digite o nome do morador..." onKeyDown={(e: any) => { if (e.key === 'Enter') e.preventDefault(); }} />
                      <CommandList>
                        <CommandEmpty>Nenhum morador encontrado.</CommandEmpty>
                        <CommandGroup>
                          {moradores?.map((m: any) => (
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

            {formData.tipo_pessoa === 'terceiro' && (
              <>
                <div>
                  <Label htmlFor="nome_terceiro">Nome *</Label>
                  <Input
                    id="nome_terceiro"
                    value={formData.nome_terceiro}
                    onChange={(e: any) => setFormData({ ...formData, nome_terceiro: e.target.value })}
                    placeholder="Nome da pessoa"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="documento_terceiro">Documento</Label>
                  <Input
                    id="documento_terceiro"
                    value={formData.documento_terceiro}
                    onChange={(e: any) => setFormData({ ...formData, documento_terceiro: e.target.value })}
                    placeholder="RG ou CPF"
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
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e: any) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </>
            )}

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
            <Button 
              type="submit"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {material ? 'Salvar' : 'Registrar Empréstimo'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Page ---
export default function MateriaisEmprestados() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: materiais = [], isLoading } = useQuery({
    queryKey: ['materiais'],
    queryFn: () => base44.entities.MaterialEmprestado.list('-created_date', 100),
    staleTime: 30000,
  });

  const { data: moradores = [] } = useQuery({
    queryKey: ['moradores'],
    queryFn: () => base44.entities.Morador.list(),
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => base44.entities.MaterialEmprestado.create({
      ...data,
      data_hora_emprestimo: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiais'] });
      setShowForm(false);
      setEditingMaterial(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => base44.entities.MaterialEmprestado.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiais'] });
      setShowForm(false);
      setEditingMaterial(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => base44.entities.MaterialEmprestado.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiais'] });
    },
  });

  const registrarDevolucao = async (material: any) => {
    await updateMutation.mutateAsync({
      id: material.id,
      data: {
        ...material,
        status: 'devolvido',
        data_hora_devolucao: new Date().toISOString()
      }
    });
  };

  const filteredMateriais = materiais.filter((m: any) => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = m.material?.toLowerCase().includes(searchLower) ||
                       m.unidade?.toLowerCase().includes(searchLower) ||
                       m.morador_nome?.toLowerCase().includes(searchLower) ||
                       m.nome_terceiro?.toLowerCase().includes(searchLower) ||
                       m.bloco?.toLowerCase().includes(searchLower) || // Block
                       m.documento_terceiro?.toLowerCase().includes(searchLower); // Document (Third party)
    const matchStatus = statusFilter === 'todos' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs: any = {
      emprestado: { 
        icon: Clock, 
        label: 'Emprestado', 
        className: 'bg-orange-100 text-orange-800 border-orange-200' 
      },
      devolvido: { 
        icon: CheckCircle2, 
        label: 'Devolvido', 
        className: 'bg-green-100 text-green-800 border-green-200' 
      }
    };
    const config = configs[status] || configs.emprestado;
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Materiais Emprestados</h1>
          <p className="text-slate-600 mt-1">Controle de ferramentas e materiais do condomínio</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingMaterial(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Empréstimo
        </Button>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" size={20} style={{ opacity: 1 }} />
              <Input
                placeholder="Buscar por material, unidade, bloco, pessoa ou documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="bg-slate-100">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="emprestado">Emprestados</TabsTrigger>
                <TabsTrigger value="devolvido">Devolvidos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <MaterialEmprestadoForm
          material={editingMaterial}
          moradores={moradores}
          onSubmit={(data: any) => {
            if (editingMaterial) {
              updateMutation.mutate({ id: editingMaterial.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingMaterial(null);
          }}
        />
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">Carregando...</p>
          </Card>
        ) : filteredMateriais.length === 0 ? (
          <Card className="p-8 text-center border-0 shadow-lg">
            <Wrench className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Nenhum empréstimo encontrado</p>
          </Card>
        ) : (
          filteredMateriais.map((material: any) => (
            <Card key={material.id} className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Ícone */}
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Wrench className="h-10 w-10 text-orange-600" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{material.material}</h3>
                      </div>
                      {getStatusBadge(material.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-slate-500">Retirado por:</span>
                        <p className="font-medium text-slate-900">
                          {material.tipo_pessoa === 'morador' ? material.morador_nome : material.nome_terceiro}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Unidade:</span>
                        <p className="font-medium text-slate-900">
                          {material.unidade}{material.bloco ? ` - Bloco ${material.bloco}` : ''}
                        </p>
                      </div>
                      {material.telefone && (
                        <div>
                          <span className="text-slate-500">Telefone:</span>
                          <p className="font-medium text-slate-900">{material.telefone}</p>
                        </div>
                      )}
                      {material.data_hora_emprestimo && (
                        <div>
                          <span className="text-slate-500">Emprestado em:</span>
                          <p className="font-medium text-slate-900">
                            {format(new Date(material.data_hora_emprestimo), 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                      )}
                      {material.data_hora_devolucao && (
                        <div>
                          <span className="text-slate-500">Devolvido em:</span>
                          <p className="font-medium text-slate-900">
                            {format(new Date(material.data_hora_devolucao), 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                      )}
                    </div>

                    {material.observacoes && (
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        {material.observacoes}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {material.status === 'emprestado' && (
                        <Button
                          type="button"
                          onClick={() => registrarDevolucao(material)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Registrar Devolução
                        </Button>
                      )}
                      <DeleteAction onConfirm={() => deleteMutation.mutate(material.id)} />
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
