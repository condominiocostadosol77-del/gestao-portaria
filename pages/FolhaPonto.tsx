
import React, { useState } from 'react';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Popover, PopoverContent, PopoverTrigger } from '../components/ui';
import { Plus, Search, Calendar, Clock, CheckCircle2, Download, Filter, X, Save, Trash2, AlertTriangle } from 'lucide-react';
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
function RegistroPontoForm({ registro, funcionarios, onSubmit, onCancel }: any) {
  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState(() => {
    if (registro) return registro;
    return {
      funcionario_id: '',
      nome_funcionario: '',
      data: getLocalDate(),
      turno: 'diurno',
      hora_entrada: '',
      hora_saida: '',
      tipo: 'normal',
      observacoes: ''
    };
  });

  const handleFuncionarioChange = (funcionarioId: string) => {
    const funcionario = funcionarios.find((f: any) => f.id === funcionarioId);
    setFormData({
      ...formData,
      funcionario_id: funcionarioId,
      nome_funcionario: funcionario?.nome_completo || ''
    });
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{registro ? 'Editar Registro' : 'Novo Registro de Ponto'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="funcionario">Funcionário *</Label>
              <Select 
                value={formData.funcionario_id} 
                onValueChange={handleFuncionarioChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o funcionário">
                    {formData.nome_funcionario || "Selecione o funcionário"}
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
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e: any) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="turno">Turno *</Label>
              <Select 
                value={formData.turno} 
                onValueChange={(value: any) => setFormData({ ...formData, turno: value })}
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

            <div>
              <Label htmlFor="hora_entrada">Hora Entrada</Label>
              <Input
                id="hora_entrada"
                type="time"
                value={formData.hora_entrada}
                onChange={(e: any) => setFormData({ ...formData, hora_entrada: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="hora_saida">Hora Saída</Label>
              <Input
                id="hora_saida"
                type="time"
                value={formData.hora_saida}
                onChange={(e: any) => setFormData({ ...formData, hora_saida: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="hora_extra">Hora Extra</SelectItem>
                  <SelectItem value="falta">Falta</SelectItem>
                  <SelectItem value="atestado">Atestado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e: any) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações adicionais sobre o registro..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Save className="h-4 w-4 mr-2" />
              {registro ? 'Salvar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Page ---
export default function FolhaPonto() {
  const [searchTerm, setSearchTerm] = useState('');
  const [turnoFilter, setTurnoFilter] = useState('todos');
  const [funcionarioFilter, setFuncionarioFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: registros = [], isLoading } = useQuery({
    queryKey: ['registros-ponto'],
    queryFn: () => base44.entities.RegistroPonto.list('-data', 100),
    staleTime: 30000,
  });

  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => base44.entities.Funcionario.list(),
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => base44.entities.RegistroPonto.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros-ponto'] });
      setShowForm(false);
      setEditingRegistro(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => base44.entities.RegistroPonto.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros-ponto'] });
      setShowForm(false);
      setEditingRegistro(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => base44.entities.RegistroPonto.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros-ponto'] });
    },
  });

  const filteredRegistros = registros.filter((r: any) => {
    const matchSearch = r.nome_funcionario?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.observacoes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTurno = turnoFilter === 'todos' || r.turno === turnoFilter;
    const matchFuncionario = funcionarioFilter === 'todos' || r.funcionario_id === funcionarioFilter;
    return matchSearch && matchTurno && matchFuncionario;
  });

  const getTurnoColor = (turno: string) => {
    const configs: any = {
      diurno: 'bg-sky-100 text-sky-800',
      noturno: 'bg-indigo-100 text-indigo-800'
    };
    return configs[turno] || 'bg-gray-100 text-gray-800';
  };

  const getTipoColor = (tipo: string) => {
    const configs: any = {
      normal: 'bg-green-100 text-green-800',
      hora_extra: 'bg-blue-100 text-blue-800',
      falta: 'bg-red-100 text-red-800',
      atestado: 'bg-yellow-100 text-yellow-800'
    };
    return configs[tipo] || 'bg-gray-100 text-gray-800';
  };

  const handleExportPDF = () => {
    const funcionarioSelecionado = funcionarios.find((f: any) => f.id === funcionarioFilter);
    
    if (filteredRegistros.length === 0) {
      alert('Nenhum registro para exportar');
      return;
    }

    // Ordenar os registros por data (crescente) para o PDF
    const registrosOrdenados = [...filteredRegistros].sort((a: any, b: any) => {
        return new Date(a.data).getTime() - new Date(b.data).getTime();
    });

    let htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Folha de Ponto</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e293b; text-align: center; }
            h2 { color: #475569; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; }
            .total { font-weight: bold; background-color: #f8fafc; }
            .info { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Folha de Ponto</h1>
          <div class="info">
            ${funcionarioSelecionado ? `<p><strong>Funcionário:</strong> ${funcionarioSelecionado.nome_completo}</p>` : ''}
            <p><strong>Data de Geração:</strong> ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
            <p><strong>Total de Registros:</strong> ${registrosOrdenados.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Funcionário</th>
                <th>Turno</th>
                <th>Entrada</th>
                <th>Saída</th>
                <th>Horas</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
    `;

    let totalHoras = 0;
    let totalMinutos = 0;

    registrosOrdenados.forEach((r: any) => {
      const horas = r.hora_entrada && r.hora_saida ? (() => {
        const [h1, m1] = r.hora_entrada.split(':').map(Number);
        const [h2, m2] = r.hora_saida.split(':').map(Number);
        const totalMin = (h2 * 60 + m2) - (h1 * 60 + m1);
        totalHoras += Math.floor(totalMin / 60);
        totalMinutos += totalMin % 60;
        return `${Math.floor(totalMin / 60)}h ${totalMin % 60}min`;
      })() : '-';

      htmlContent += `
        <tr>
          <td>${r.data ? (() => {
            const [year, month, day] = r.data.split('-');
            return format(new Date(year, parseInt(month) - 1, parseInt(day)), 'dd/MM/yyyy');
          })() : '-'}</td>
          <td>${r.nome_funcionario || '-'}</td>
          <td>${r.turno?.toUpperCase() || '-'}</td>
          <td>${r.hora_entrada || '-'}</td>
          <td>${r.hora_saida || '-'}</td>
          <td>${horas}</td>
          <td>${r.tipo?.replace(/_/g, ' ').toUpperCase() || '-'}</td>
        </tr>
      `;
    });

    totalHoras += Math.floor(totalMinutos / 60);
    totalMinutos = totalMinutos % 60;

    htmlContent += `
              <tr class="total">
                <td colspan="5" style="text-align: right;"><strong>Total de Horas:</strong></td>
                <td colspan="2"><strong>${totalHoras}h ${totalMinutos}min</strong></td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
    }
  };

  const getFilterLabel = () => {
    if (funcionarioFilter === 'todos') return 'Todos os funcionários';
    const func = funcionarios.find((f: any) => f.id === funcionarioFilter);
    return func ? func.nome_completo : 'Funcionário desconhecido';
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Folha de Ponto</h1>
          <p className="text-slate-600 mt-1">Registro de ponto dos funcionários</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingRegistro(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Registro
        </Button>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" size={20} style={{ opacity: 1 }} />
                <Input
                  placeholder="Buscar por funcionário ou observação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={turnoFilter} onValueChange={setTurnoFilter}>
                <TabsList className="bg-slate-100">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="diurno">Diurno</TabsTrigger>
                  <TabsTrigger value="noturno">Noturno</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-slate-500" />
                <Select value={funcionarioFilter} onValueChange={setFuncionarioFilter}>
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue>
                        {getFilterLabel()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os funcionários</SelectItem>
                    {funcionarios.map((f: any) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nome_completo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                onClick={handleExportPDF}
                variant="outline"
                className="gap-2"
                disabled={filteredRegistros.length === 0}
              >
                <Download className="h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <RegistroPontoForm
          registro={editingRegistro}
          funcionarios={funcionarios}
          onSubmit={(data: any) => {
            if (editingRegistro) {
              updateMutation.mutate({ id: editingRegistro.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingRegistro(null);
          }}
        />
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">Carregando...</p>
          </Card>
        ) : filteredRegistros.length === 0 ? (
          <Card className="p-8 text-center border-0 shadow-lg">
            <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Nenhum registro encontrado</p>
          </Card>
        ) : (
          filteredRegistros.map((registro: any) => (
            <Card 
              key={registro.id} 
              className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Clock className="h-10 w-10 text-indigo-600" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{registro.nome_funcionario}</h3>
                        <p className="text-slate-600">
                          {registro.data && (() => {
                            const [year, month, day] = registro.data.split('-');
                            return format(new Date(year, parseInt(month) - 1, parseInt(day)), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
                          })()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getTurnoColor(registro.turno)}>
                          {registro.turno?.toUpperCase()}
                        </Badge>
                        <Badge className={getTipoColor(registro.tipo)}>
                          {registro.tipo?.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      {registro.hora_entrada && (
                        <div>
                          <span className="text-slate-500">Entrada:</span>
                          <p className="font-medium text-slate-900 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {registro.hora_entrada}
                          </p>
                        </div>
                      )}
                      {registro.hora_saida && (
                        <div>
                          <span className="text-slate-500">Saída:</span>
                          <p className="font-medium text-slate-900 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {registro.hora_saida}
                          </p>
                        </div>
                      )}
                      {registro.hora_entrada && registro.hora_saida && (
                        <div className="sm:col-span-2">
                          <span className="text-slate-500">Total:</span>
                          <p className="font-medium text-slate-900">
                            {(() => {
                              const [h1, m1] = registro.hora_entrada.split(':').map(Number);
                              const [h2, m2] = registro.hora_saida.split(':').map(Number);
                              const totalMinutos = (h2 * 60 + m2) - (h1 * 60 + m1);
                              const horas = Math.floor(totalMinutos / 60);
                              const minutos = totalMinutos % 60;
                              return `${horas}h ${minutos}min`;
                            })()}
                          </p>
                        </div>
                      )}
                    </div>

                    {registro.observacoes && (
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        {registro.observacoes}
                      </p>
                    )}

                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingRegistro(registro);
                          setShowForm(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Editar
                      </Button>
                      <DeleteAction onConfirm={() => deleteMutation.mutate(registro.id)} />
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
