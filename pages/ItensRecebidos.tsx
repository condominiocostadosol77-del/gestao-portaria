
import React, { useState } from 'react';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Popover, PopoverContent, PopoverTrigger, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../components/ui';
import { Plus, Search, Package, CheckCircle2, Clock, ArrowRight, ArrowLeft, X, Save, Check, ChevronsUpDown, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

// --- Retirada Action Component ---
function RetiradaAction({ item, onConfirm }: { item: any, onConfirm: (id: string, nome: string, documento: string) => void }) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');

  const handleConfirm = () => {
    if (nome.trim()) {
      onConfirm(item.id, nome, documento);
      setOpen(false);
      setNome('');
      setDocumento('');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Registrar Retirada
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bottom-full mb-2" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Confirmar Retirada</h4>
            <p className="text-sm text-muted-foreground">
              Informe os dados de quem está retirando.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="quem_recebeu">Nome *</Label>
              <Input
                id="quem_recebeu"
                value={nome}
                onChange={(e: any) => setNome(e.target.value)}
                className="h-8"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="documento_retirada">Documento (RG/CPF)</Label>
              <Input
                id="documento_retirada"
                value={documento}
                onChange={(e: any) => setDocumento(e.target.value)}
                className="h-8"
                placeholder="Opcional"
              />
            </div>
            <Button onClick={handleConfirm} size="sm" className="w-full mt-2">
              Confirmar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

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
function ItemRecebidoForm({ item, moradores, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(item || {
    tipo_operacao: 'externo_para_morador',
    morador_id: '',
    unidade: '',
    bloco: '',
    nome_pessoa_externa: '',
    telefone_pessoa_externa: '',
    descricao_item: '',
    quantidade: 1,
    turno: 'diurno',
    observacoes: '',
    status: 'aguardando_retirada'
  });
  const [usarMoradorCadastrado, setUsarMoradorCadastrado] = useState(false);
  const [openMorador, setOpenMorador] = useState(false);

  const handleMoradorChange = (moradorId: string) => {
    const morador = moradores.find((m: any) => m.id === moradorId);
    if (morador) {
      setFormData({
        ...formData,
        morador_id: moradorId,
        unidade: morador.unidade,
        bloco: morador.bloco || ''
      });
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{item ? 'Editar Item' : 'Novo Item Recebido'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="tipo_operacao">Tipo de Operação *</Label>
              <Select 
                value={formData.tipo_operacao} 
                onValueChange={(value) => setFormData({ ...formData, tipo_operacao: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="externo_para_morador">Externo deixando para Morador</SelectItem>
                  <SelectItem value="morador_para_externo">Morador deixando para Externo</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 mt-1">
                {formData.tipo_operacao === 'externo_para_morador' 
                  ? 'Pessoa de fora deixou item para um morador retirar' 
                  : 'Morador deixou item para uma pessoa de fora retirar'}
              </p>
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
            </div>

            <div>
              <Label htmlFor="unidade">Unidade *</Label>
              <Input
                id="unidade"
                value={formData.unidade}
                onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, bloco: e.target.value })}
                placeholder="Ex: A"
                disabled={usarMoradorCadastrado}
              />
            </div>

            <div>
              <Label htmlFor="nome_pessoa_externa">
                {formData.tipo_operacao === 'morador_para_externo' ? 'Nome de quem vai retirar *' : 'Nome de quem deixou *'}
              </Label>
              <Input
                id="nome_pessoa_externa"
                value={formData.nome_pessoa_externa}
                onChange={(e) => setFormData({ ...formData, nome_pessoa_externa: e.target.value })}
                placeholder="Nome da pessoa"
                required
              />
            </div>

            <div>
              <Label htmlFor="telefone_pessoa_externa">Telefone</Label>
              <Input
                id="telefone_pessoa_externa"
                value={formData.telefone_pessoa_externa}
                onChange={(e) => setFormData({ ...formData, telefone_pessoa_externa: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="descricao_item">Descrição do Item *</Label>
              <Input
                id="descricao_item"
                value={formData.descricao_item}
                onChange={(e) => setFormData({ ...formData, descricao_item: e.target.value })}
                placeholder="Ex: Sacola com roupas, Alicate, Perfume, etc"
                required
              />
            </div>

            <div>
              <Label htmlFor="turno">Turno *</Label>
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

            <div className="md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
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
              type="button"
              onClick={() => onSubmit(formData, false)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {item ? 'Salvar' : 'Cadastrar'}
            </Button>
            {!item && (
              <Button 
                type="button"
                onClick={() => onSubmit(formData, true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Cadastrar e Notificar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Page ---
export default function ItensRecebidos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: itens = [], isLoading } = useQuery({
    queryKey: ['itens-recebidos'],
    queryFn: () => base44.entities.ItemRecebido.list('-created_date', 100),
    staleTime: 30000,
  });

  const { data: moradores = [] } = useQuery({
    queryKey: ['moradores'],
    queryFn: () => base44.entities.Morador.list(),
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => base44.entities.ItemRecebido.create({
      ...data,
      data_hora_recebimento: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itens-recebidos'] });
      setShowForm(false);
      setEditingItem(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => base44.entities.ItemRecebido.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itens-recebidos'] });
      setShowForm(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => base44.entities.ItemRecebido.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itens-recebidos'] });
    },
  });

  const registrarRetirada = async (id: string, nome: string, documento: string) => {
    const item = itens.find((i: any) => i.id === id);
    if (!item) return;

    await updateMutation.mutateAsync({
      id: id,
      data: {
        ...item,
        status: 'retirado',
        data_hora_retirada: new Date().toISOString(),
        quem_recebeu: nome,
        documento_retirada: documento || ''
      }
    });
  };

  const handleDelete = (item: any) => {
    deleteMutation.mutate(item.id);
  };

  const enviarWhatsApp = (item: any, morador: any) => {
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Buscar todos os moradores da mesma unidade e bloco
    const moradoresDaUnidade = moradores.filter((m: any) => 
      m.unidade === item.unidade && 
      m.bloco === item.bloco &&
      m.telefone &&
      m.status === 'ativo'
    );

    if (moradoresDaUnidade.length === 0) {
      alert('Nenhum morador ativo com telefone cadastrado encontrado para esta unidade/bloco.');
      return;
    }

    moradoresDaUnidade.forEach((m: any) => {
      const tipoMensagem = item.tipo_operacao === 'externo_para_morador' 
        ? `*${item.nome_pessoa_externa || 'Uma pessoa'}* deixou um item para você` 
        : 'seu item está sendo guardado para retirada';
      
      const mensagem = `🏢 *NOTIFICAÇÃO DA PORTARIA*

Olá, ${m.nome_completo}! 👋

📦 ${tipoMensagem} na portaria.

*INFORMAÇÕES:*
🏠 *Unidade:* ${item.unidade}${item.bloco ? ` - Bloco ${item.bloco}` : ''}
📦 *Item:* ${item.descricao_item}
${item.telefone_pessoa_externa ? `📞 *Contato:* ${item.telefone_pessoa_externa}` : ''}
${item.observacoes ? `📝 *Observações:* ${item.observacoes}` : ''}
⏰ *Registrado às:* ${hora}

📍 Por favor, compareça à portaria ${item.tipo_operacao === 'externo_para_morador' ? 'para retirar' : 'para mais informações'}.

_Atenciosamente,_
_Equipe da Portaria_`;

      const url = `https://wa.me/${m.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');
    });
  };

  const getMoradorNome = (item: any) => {
    if (item.morador_id) {
      const morador = moradores.find((m: any) => m.id === item.morador_id);
      return morador?.nome_completo || 'Morador não encontrado';
    }
    return null;
  };

  const filteredItens = itens.filter((i: any) => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = i.descricao_item?.toLowerCase().includes(searchLower) ||
                       i.nome_pessoa_externa?.toLowerCase().includes(searchLower) ||
                       i.unidade?.toLowerCase().includes(searchLower) ||
                       i.bloco?.toLowerCase().includes(searchLower); // Block search
    const matchStatus = statusFilter === 'todos' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs: any = {
      aguardando_retirada: { 
        icon: Clock, 
        label: 'Aguardando Retirada', 
        className: 'bg-orange-100 text-orange-800 border-orange-200' 
      },
      retirado: { 
        icon: CheckCircle2, 
        label: 'Retirado', 
        className: 'bg-green-100 text-green-800 border-green-200' 
      }
    };
    const config = configs[status] || configs.aguardando_retirada;
    const Icon = config.icon;
    return (
      <Badge className={`${config.className} border flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTipoIcon = (tipo: string) => {
    if (tipo === 'morador_para_externo') {
      return <ArrowRight className="h-5 w-5 text-blue-600" />;
    }
    return <ArrowLeft className="h-5 w-5 text-green-600" />;
  };

  const getTipoLabel = (tipo: string) => {
    return tipo === 'morador_para_externo' ? 'Morador → Externo' : 'Externo → Morador';
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Itens Recebidos</h1>
          <p className="text-slate-600 mt-1">Gestão de itens deixados e recebidos</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Item
        </Button>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" size={20} style={{ opacity: 1 }} />
              <Input
                placeholder="Buscar por item, pessoa, unidade ou bloco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="bg-slate-100">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="aguardando_retirada">Pendentes</TabsTrigger>
                <TabsTrigger value="retirado">Retirados</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <ItemRecebidoForm
          item={editingItem}
          moradores={moradores}
          onSubmit={(data: any, notificar: boolean) => {
            if (editingItem) {
              updateMutation.mutate({ id: editingItem.id, data });
            } else {
              createMutation.mutate(data, {
                onSuccess: (novoItem: any) => {
                  if (notificar) {
                    const morador = moradores.find((m: any) => m.id === data.morador_id);
                    enviarWhatsApp(novoItem || data, morador);
                  }
                }
              });
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">Carregando...</p>
          </Card>
        ) : filteredItens.length === 0 ? (
          <Card className="p-8 text-center border-0 shadow-lg">
            <Package className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Nenhum item encontrado</p>
          </Card>
        ) : (
          filteredItens.map((item: any) => (
            <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className={`h-24 w-24 rounded-xl flex items-center justify-center ${
                      item.tipo_operacao === 'morador_para_externo' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {getTipoIcon(item.tipo_operacao)}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{item.descricao_item}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          <Badge variant="outline" className="mr-2">
                            {getTipoLabel(item.tipo_operacao)}
                          </Badge>
                        </p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      {item.tipo_operacao === 'morador_para_externo' && (
                        <>
                          <div>
                            <span className="text-slate-500">De (Morador):</span>
                            <p className="font-medium text-slate-900">
                              {getMoradorNome(item) || `Unidade ${item.unidade}`}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500">Para (Externo):</span>
                            <p className="font-medium text-slate-900">{item.nome_pessoa_externa}</p>
                          </div>
                        </>
                      )}
                      
                      {item.tipo_operacao === 'externo_para_morador' && (
                        <>
                          <div>
                            <span className="text-slate-500">De (Externo):</span>
                            <p className="font-medium text-slate-900">{item.nome_pessoa_externa}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Para (Morador):</span>
                            <p className="font-medium text-slate-900">
                              {getMoradorNome(item) || `Unidade ${item.unidade}`}
                            </p>
                          </div>
                        </>
                      )}

                      {item.telefone_pessoa_externa && (
                        <div>
                          <span className="text-slate-500">Telefone:</span>
                          <p className="font-medium text-slate-900">{item.telefone_pessoa_externa}</p>
                        </div>
                      )}

                      {item.data_hora_recebimento && (
                        <div>
                          <span className="text-slate-500">Recebido em:</span>
                          <p className="font-medium text-slate-900">
                            {format(new Date(item.data_hora_recebimento), 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                      )}

                      {item.data_hora_retirada && (
                        <div>
                          <span className="text-slate-500">Retirado em:</span>
                          <p className="font-medium text-slate-900">
                            {format(new Date(item.data_hora_retirada), 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                      )}

                      {item.turno && (
                        <div>
                          <span className="text-slate-500">Turno:</span>
                          <p className="font-medium text-slate-900 capitalize">{item.turno}</p>
                        </div>
                      )}
                    </div>

                    {item.observacoes && (
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        {item.observacoes}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.status === 'aguardando_retirada' && (
                        <RetiradaAction 
                          item={item} 
                          onConfirm={registrarRetirada} 
                        />
                      )}
                      <DeleteAction onConfirm={() => handleDelete(item)} />
                    </div>

                    {item.quem_recebeu && (
                      <div className="text-sm text-slate-600 pt-2 border-t">
                        Retirado por: <span className="font-medium">{item.quem_recebeu}</span>
                        {item.documento_retirada && ` - Doc: ${item.documento_retirada}`}
                      </div>
                    )}
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
