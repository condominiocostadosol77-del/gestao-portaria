
import React, { useState } from 'react';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Label, Popover, PopoverContent, PopoverTrigger } from '../components/ui';
import { Plus, Search, FileText, Clock, ArrowRightLeft, X, Save, Trash2, AlertTriangle, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
function OcorrenciaForm({ ocorrencia, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(ocorrencia || {
    funcionario_saindo_id: '',
    funcionario_saindo_nome: '',
    funcionario_entrando_id: '',
    funcionario_entrando_nome: '',
    relato: ''
  });

  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => base44.entities.Funcionario.list(),
  });

  const handleFuncionarioSaindoChange = (funcId: string) => {
    const func = funcionarios.find((f: any) => f.id === funcId);
    setFormData({
      ...formData,
      funcionario_saindo_id: funcId,
      funcionario_saindo_nome: func?.nome_completo || ''
    });
  };

  const handleFuncionarioEntrandoChange = (funcId: string) => {
    const func = funcionarios.find((f: any) => f.id === funcId);
    setFormData({
      ...formData,
      funcionario_entrando_id: funcId,
      funcionario_entrando_nome: func?.nome_completo || ''
    });
  };

  const handleSubmit = () => {
    if (!formData.relato) {
      alert("O campo relato é obrigatório.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{ocorrencia ? 'Editar Registro' : 'Nova Ocorrência / Passagem de Turno'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="funcionario_saindo">Funcionário Saindo</Label>
              <Select 
                value={formData.funcionario_saindo_id} 
                onValueChange={handleFuncionarioSaindoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione">
                    {formData.funcionario_saindo_nome || "Selecione"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((f: any) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome_completo} - {f.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="funcionario_entrando">Funcionário Entrando</Label>
              <Select 
                value={formData.funcionario_entrando_id} 
                onValueChange={handleFuncionarioEntrandoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione">
                    {formData.funcionario_entrando_nome || "Selecione"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((f: any) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome_completo} - {f.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="relato">Relato / Ocorrências *</Label>
              <Textarea
                id="relato"
                value={formData.relato}
                onChange={(e: any) => setFormData({ ...formData, relato: e.target.value })}
                placeholder="Descreva as ocorrências..."
                rows={8}
                required
                className="resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {ocorrencia ? 'Salvar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Page ---
export default function Ocorrencias() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingOcorrencia, setEditingOcorrencia] = useState<any>(null);
  const [viewingOcorrencia, setViewingOcorrencia] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: ocorrencias = [], isLoading } = useQuery({
    queryKey: ['ocorrencias'],
    queryFn: () => base44.entities.Ocorrencia.list('-created_date', 100),
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => base44.entities.Ocorrencia.create({
      ...data,
      data_registro: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocorrencias'] });
      setShowForm(false);
      setEditingOcorrencia(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => base44.entities.Ocorrencia.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocorrencias'] });
      setShowForm(false);
      setEditingOcorrencia(null);
      setViewingOcorrencia(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => base44.entities.Ocorrencia.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocorrencias'] });
    },
  });

  // Função para abrir o bloco de notas GLOBAL via evento customizado
  const openGlobalNotepad = () => {
    window.dispatchEvent(new CustomEvent('open-global-notepad'));
  };

  const filteredOcorrencias = ocorrencias.filter((o: any) => {
    const matchSearch = o.relato?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       o.funcionario_saindo_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       o.funcionario_entrando_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ocorrências e Passagem de Turno</h1>
          <p className="text-slate-600 mt-1">Registro de ocorrências e troca de turno</p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={openGlobalNotepad}
            className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
          >
            <PenLine className="h-5 w-5 mr-2" />
            Bloco de Notas
          </Button>
          <Button
            type="button"
            onClick={() => {
              setEditingOcorrencia(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Ocorrência
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" size={20} style={{ opacity: 1 }} />
            <Input
              placeholder="Buscar por funcionário ou texto do relato..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              className="pl-10 !text-black"
              style={{ backgroundColor: 'white', color: 'black', height: '40px', opacity: 1 }}
            />
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <OcorrenciaForm
          ocorrencia={editingOcorrencia}
          onSubmit={(data: any) => {
            if (editingOcorrencia) {
              updateMutation.mutate({ id: editingOcorrencia.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingOcorrencia(null);
          }}
        />
      )}

      {viewingOcorrencia && (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-slate-900">Detalhes da Ocorrência</h2>
              <Button variant="ghost" size="icon" onClick={() => setViewingOcorrencia(null)} type="button">
                <Search className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {viewingOcorrencia.funcionario_saindo_nome && (
                  <div>
                    <span className="text-sm text-slate-500">Funcionário Saindo:</span>
                    <p className="font-medium text-slate-900">{viewingOcorrencia.funcionario_saindo_nome}</p>
                  </div>
                )}
                {viewingOcorrencia.funcionario_entrando_nome && (
                  <div>
                    <span className="text-sm text-slate-500">Funcionário Entrando:</span>
                    <p className="font-medium text-slate-900">{viewingOcorrencia.funcionario_entrando_nome}</p>
                  </div>
                )}
                {viewingOcorrencia.data_registro && (
                  <div>
                    <span className="text-sm text-slate-500">Data:</span>
                    <p className="font-medium text-slate-900">
                      {format(new Date(viewingOcorrencia.data_registro), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <span className="text-sm text-slate-500">Relato:</span>
                <div className="mt-2 p-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-700 whitespace-pre-wrap">{viewingOcorrencia.relato}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {/* Botão Editar removido conforme padrão */}
                <DeleteAction onConfirm={() => {
                  deleteMutation.mutate(viewingOcorrencia.id);
                  setViewingOcorrencia(null);
                }} />
                <Button
                  type="button"
                  onClick={() => setViewingOcorrencia(null)}
                  variant="ghost"
                  className="ml-auto"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">Carregando...</p>
          </Card>
        ) : filteredOcorrencias.length === 0 ? (
          <Card className="p-8 text-center border-0 shadow-lg">
            <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Nenhuma ocorrência registrada</p>
          </Card>
        ) : (
          filteredOcorrencias.map((ocorrencia: any) => (
            <Card key={ocorrencia.id} className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-xl bg-orange-100 flex items-center justify-center">
                      <ArrowRightLeft className="h-10 w-10 text-orange-600" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {ocorrencia.data_registro && (
                            <span className="text-sm text-slate-600 font-medium">
                              {format(new Date(ocorrencia.data_registro), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          )}
                        </div>

                        {(ocorrencia.funcionario_saindo_nome || ocorrencia.funcionario_entrando_nome) && (
                          <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                            {ocorrencia.funcionario_saindo_nome && (
                              <span className="font-medium">{ocorrencia.funcionario_saindo_nome}</span>
                            )}
                            {ocorrencia.funcionario_saindo_nome && ocorrencia.funcionario_entrando_nome && (
                              <ArrowRightLeft className="h-4 w-4 text-slate-400" />
                            )}
                            {ocorrencia.funcionario_entrando_nome && (
                              <span className="font-medium">{ocorrencia.funcionario_entrando_nome}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-700 line-clamp-3 whitespace-pre-wrap">
                        {ocorrencia.relato}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      <Button
                        type="button"
                        onClick={() => setViewingOcorrencia(ocorrencia)}
                        size="sm"
                        variant="outline"
                      >
                        Ver Detalhes
                      </Button>
                      <DeleteAction onConfirm={() => deleteMutation.mutate(ocorrencia.id)} />
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
