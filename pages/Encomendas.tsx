
import React, { useState } from 'react';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Popover, PopoverContent, PopoverTrigger, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../components/ui';
import { 
  Plus, 
  Search, 
  Package,
  CheckCircle2,
  Clock,
  Mail,
  X,
  Save,
  Check,
  ChevronsUpDown,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Truck,
  Barcode,
  User,
  Layers,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

// --- Retirada Action Component (Single) ---
function RetiradaAction({ encomanda, onConfirm }: { encomanda: any, onConfirm: (id: string, nome: string) => void }) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (nome.trim()) {
      onConfirm(encomanda.id, nome);
      setOpen(false);
      setNome('');
    } else {
      alert("Por favor, informe quem retirou.");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Registrar Retirada
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bottom-full mb-2" align="end" onClick={(e) => e.stopPropagation()}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Confirmar Retirada</h4>
            <p className="text-sm text-muted-foreground">
              Informe quem está retirando a encomenda.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="quem_recebeu">Nome</Label>
              <Input
                id="quem_recebeu"
                value={nome}
                onChange={(e: any) => setNome(e.target.value)}
                className="col-span-2 h-8 !text-black"
                style={{ backgroundColor: 'white', color: 'black' }}
                autoFocus
                onClick={(e: any) => e.stopPropagation()}
              />
            </div>
            <Button 
              type="button" 
              onClick={handleConfirm} 
              size="sm" 
              className="w-full mt-2"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// --- Retirada Em Massa Action Component ---
function RetiradaEmMassaAction({ items, onConfirm }: { items: any[], onConfirm: (ids: string[], nome: string) => void }) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (nome.trim()) {
      const ids = items.map(i => i.id);
      onConfirm(ids, nome);
      setOpen(false);
      setNome('');
    } else {
      alert("Por favor, informe quem retirou.");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Layers className="h-4 w-4" />
          Retirar Todas ({items.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 top-full mt-2" align="start" onClick={(e) => e.stopPropagation()}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-blue-700">Retirada em Massa</h4>
            <p className="text-sm text-muted-foreground">
              Registrar saída para <strong>{items.length} itens</strong> desta unidade.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label htmlFor="quem_recebeu_massa">Nome de quem retirou</Label>
              <Input
                id="quem_recebeu_massa"
                value={nome}
                onChange={(e: any) => setNome(e.target.value)}
                className="h-9 !text-black"
                style={{ backgroundColor: 'white', color: 'black' }}
                autoFocus
                placeholder="Ex: Próprio morador"
                onClick={(e: any) => e.stopPropagation()}
              />
            </div>
            <Button 
              type="button" 
              onClick={handleConfirm} 
              size="sm" 
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
            >
              Confirmar Baixa em Tudo
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
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bottom-full mb-2" align="end" onClick={(e) => e.stopPropagation()}>
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

// --- Encomenda Form ---
function EncomendaForm({ encomenda, moradores, empresas, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(encomenda || {
    morador_id: '',
    unidade: '',
    bloco: '',
    tipo: 'encomenda',
    remetente: '', // Usado apenas para parente/amigo na opção manual agora, ou geral
    empresa_id: '',
    empresa_nome: '',
    descricao: '',
    codigo_rastreio: '',
    observacoes: '',
    turno: 'diurno',
    status: 'aguardando_retirada',
    destinatario_alternativo: '' // Novo campo: Nome do parente/amigo
  });
  const [usarMoradorCadastrado, setUsarMoradorCadastrado] = useState(false);
  const [openMorador, setOpenMorador] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isParenteAmigo, setIsParenteAmigo] = useState(false); // Estado local para checkbox

  const handleMoradorChange = (moradorId: any) => {
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

  const filteredMoradores = moradores?.filter((m: any) => {
    const searchLower = (searchQuery || "").toLowerCase();
    const nome = (m.nome_completo || "").toLowerCase();
    const unidade = (m.unidade || "").toString().toLowerCase();
    const bloco = (m.bloco || "").toLowerCase();
    return nome.includes(searchLower) || unidade.includes(searchLower) || bloco.includes(searchLower);
  });

  const handleSubmit = (notificar: boolean) => {
    if (!formData.unidade) {
      alert("A unidade é obrigatória.");
      return;
    }
    onSubmit(formData, notificar);
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{encomenda ? 'Editar Encomenda' : 'Nova Encomenda'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData, false); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={usarMoradorCadastrado}
                    onChange={() => setUsarMoradorCadastrado(true)}
                    className="w-4 h-4 accent-purple-600"
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
                    className="w-4 h-4 accent-purple-600"
                  />
                  <span className="text-sm font-medium text-slate-700">Digitar manualmente</span>
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

            {!usarMoradorCadastrado && (
              <div className="md:col-span-2 space-y-3 border p-4 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2">
                   <input 
                      type="checkbox" 
                      id="isParente"
                      checked={isParenteAmigo}
                      onChange={(e) => {
                        setIsParenteAmigo(e.target.checked);
                        if(!e.target.checked) setFormData({...formData, destinatario_alternativo: ''});
                      }}
                      className="w-4 h-4 accent-purple-600"
                   />
                   <Label htmlFor="isParente" className="cursor-pointer font-medium">Encomenda para Parente/Amigo?</Label>
                </div>
                
                {isParenteAmigo && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                     <Label htmlFor="destinatario_alternativo">Nome do Parente/Amigo *</Label>
                     <Input
                        id="destinatario_alternativo"
                        value={formData.destinatario_alternativo}
                        onChange={(e: any) => setFormData({ ...formData, destinatario_alternativo: e.target.value })}
                        placeholder="Ex: João Silva (Primo)"
                        className="mt-1"
                     />
                  </div>
                )}
              </div>
            )}

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
                  <SelectItem value="encomenda">Encomenda</SelectItem>
                  <SelectItem value="correspondencia">Correspondência</SelectItem>
                  <SelectItem value="documento">Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Select 
                value={formData.empresa_id} 
                onValueChange={(value: string) => {
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

            {!usarMoradorCadastrado && !isParenteAmigo && (
              <div>
                <Label htmlFor="remetente">Remetente</Label>
                <Input
                  id="remetente"
                  value={formData.remetente}
                  onChange={(e: any) => setFormData({ ...formData, remetente: e.target.value })}
                  placeholder="Nome do remetente"
                />
              </div>
            )}

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
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="codigo_rastreio">Código de Rastreio</Label>
              <Input
                id="codigo_rastreio"
                value={formData.codigo_rastreio}
                onChange={(e: any) => setFormData({ ...formData, codigo_rastreio: e.target.value })}
                placeholder="Código de rastreio (se houver)"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e: any) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva a encomenda..."
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e: any) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações adicionais..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={() => handleSubmit(false)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {encomenda ? 'Salvar' : 'Cadastrar'}
            </Button>
            {!encomenda && (
              <Button 
                type="button"
                onClick={() => handleSubmit(true)}
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

// --- Main Encomendas Component ---
export default function Encomendas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('aguardando_retirada'); // Default to pending
  const [showForm, setShowForm] = useState(false);
  const [editingEncomenda, setEditingEncomenda] = useState<any>(null);
  const [selectedUnitGroup, setSelectedUnitGroup] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: encomendas = [], isLoading } = useQuery({
    queryKey: ['encomendas'],
    queryFn: () => base44.entities.Encomenda.list('-created_date', 100),
    staleTime: 30000,
  });

  const { data: moradores = [] } = useQuery({
    queryKey: ['moradores'],
    queryFn: () => base44.entities.Morador.list(),
    staleTime: 30000,
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas'],
    queryFn: () => base44.entities.Empresa.list(),
    staleTime: 30000,
  });

  // Counters
  const totalEncomendas = encomendas.length;
  const encomendasPendentes = encomendas.filter((e: any) => e.status === 'aguardando_retirada').length;
  const encomendasRetiradas = encomendas.filter((e: any) => e.status === 'retirada').length;

  const enviarWhatsApp = (encomenda: any, morador: any) => {
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    let destinatarios = [];
    if (morador) {
      destinatarios = [morador];
    } else {
      destinatarios = moradores.filter((m: any) => 
        m.unidade === encomenda.unidade && 
        m.bloco === encomenda.bloco &&
        m.telefone &&
        m.status === 'ativo'
      );
    }

    if (destinatarios.length === 0) {
      alert('Nenhum morador ativo com telefone encontrado para notificação.');
      return;
    }
    
    destinatarios.forEach((m: any) => {
      if (!m.telefone) return;
      const mensagem = `🏢 *NOTIFICAÇÃO DA PORTARIA*

Olá, ${m.nome_completo}! 👋

📦 Você tem uma *${encomenda.tipo}* aguardando retirada na portaria.

*INFORMAÇÕES:*
🏠 *Unidade:* ${encomenda.unidade}${encomenda.bloco ? ` - Bloco ${encomenda.bloco}` : ''}
${encomenda.empresa_nome ? `🏢 *Empresa:* ${encomenda.empresa_nome}` : ''}
${encomenda.remetente ? `👤 *Remetente:* ${encomenda.remetente}` : ''}
${encomenda.destinatario_alternativo ? `👤 *A/C:* ${encomenda.destinatario_alternativo}` : ''}
${encomenda.descricao ? `📝 *Descrição:* ${encomenda.descricao}` : ''}
${encomenda.codigo_rastreio ? `🔢 *Código de Rastreio:* ${encomenda.codigo_rastreio}` : ''}
${encomenda.codigo_retirada ? `🎫 *Código de Retirada:* ${encomenda.codigo_retirada}` : ''}
⏰ *Recebido às:* ${hora}

📍 Por favor, compareça à portaria para realizar a retirada.

_Atenciosamente,_
_Equipe da Portaria_`;

      const url = `https://wa.me/${m.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');
    });
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      const codigoRetirada = Math.random().toString(36).substring(2, 8).toUpperCase();
      return base44.entities.Encomenda.create({
        ...data,
        codigo_retirada: codigoRetirada,
        data_hora_recebimento: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encomendas'] });
      setShowForm(false);
      setEditingEncomenda(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => base44.entities.Encomenda.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encomendas'] });
      setShowForm(false);
      setEditingEncomenda(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => base44.entities.Encomenda.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encomendas'] });
    },
  });

  const registrarRetirada = async (id: string, quemRecebeu: string) => {
    const encomenda = encomendas.find((e: any) => e.id === id);
    if (!encomenda) return;

    await updateMutation.mutateAsync({
      id: id,
      data: {
        ...encomenda,
        status: 'retirada',
        data_hora_retirada: new Date().toISOString(),
        quem_recebeu: quemRecebeu
      }
    });
  };

  // Bulk Withdrawal Function
  const registrarRetiradaEmMassa = async (ids: string[], quemRecebeu: string) => {
    for (const id of ids) {
      await registrarRetirada(id, quemRecebeu);
    }
    alert('Retiradas registradas com sucesso!');
  };

  const getMoradorNome = (encomenda: any) => {
    if (encomenda.morador_id) {
      const morador = moradores.find((m: any) => m.id === encomenda.morador_id);
      return morador?.nome_completo || null;
    }
    return null;
  };

  const filteredEncomendas = encomendas.filter((e: any) => {
    const moradorNome = getMoradorNome(e)?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    let dateMatch = true;
    if (dateFilter) {
      const itemDate = e.data_hora_recebimento || e.created_date;
      if (itemDate) {
        const formattedItemDate = format(new Date(itemDate), 'yyyy-MM-dd');
        dateMatch = formattedItemDate === dateFilter;
      } else {
        dateMatch = false;
      }
    }

    const matchSearch = e.unidade?.toLowerCase().includes(searchLower) ||
                       e.remetente?.toLowerCase().includes(searchLower) ||
                       e.codigo_retirada?.toLowerCase().includes(searchLower) ||
                       e.bloco?.toLowerCase().includes(searchLower) ||
                       moradorNome.includes(searchLower);
                       
    const matchStatus = statusFilter === 'todos' || e.status === statusFilter;
    return matchSearch && matchStatus && dateMatch;
  });

  const getGroupKey = (e: any) => {
    const bloco = e.bloco ? ` - Bloco ${e.bloco}` : '';
    return `Unidade ${e.unidade}${bloco}`;
  };

  const pendingGroups = React.useMemo(() => {
    if (statusFilter !== 'aguardando_retirada') return {};
    
    return filteredEncomendas.reduce((acc: any, curr: any) => {
      const key = getGroupKey(curr);
      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    }, {});
  }, [filteredEncomendas, statusFilter]);

  const getStatusBadge = (status: string) => {
    const configs: any = {
      aguardando_retirada: { 
        icon: Clock, 
        label: 'Aguardando Retirada', 
        className: 'bg-orange-100 text-orange-800 border-orange-200' 
      },
      retirada: { 
        icon: CheckCircle2, 
        label: 'Retirada', 
        className: 'bg-green-100 text-green-800 border-green-200' 
      },
      devolvida: { 
        icon: Package, 
        label: 'Devolvida', 
        className: 'bg-red-100 text-red-800 border-red-200' 
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
    if (tipo === 'correspondencia' || tipo === 'documento') {
      return <Mail className="h-5 w-5 text-blue-600" />;
    }
    return <Package className="h-5 w-5 text-purple-600" />;
  };

  const itemsToRender = (statusFilter === 'aguardando_retirada' && selectedUnitGroup)
    ? filteredEncomendas.filter((e: any) => getGroupKey(e) === selectedUnitGroup)
    : filteredEncomendas;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Encomendas</h1>
          <p className="text-slate-600 mt-1">Gestão de encomendas e correspondências</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingEncomenda(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Encomenda
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          {/* Full Width Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" size={20} style={{ opacity: 1 }} />
            <Input
              placeholder="Buscar por nome, unidade, bloco, remetente..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 w-full !text-black"
              style={{ backgroundColor: 'white', color: 'black', height: '48px', opacity: 1 }}
            />
          </div>
          
          {/* Secondary Filters Row */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <Tabs value={statusFilter} onValueChange={(val) => {
              setStatusFilter(val);
              setSelectedUnitGroup(null); // Reset group selection on tab change
            }} className="w-full lg:w-auto">
              <TabsList className="bg-slate-100 w-full lg:w-auto">
                <TabsTrigger value="todos" className="gap-2 flex-1 lg:flex-none">
                  Todos
                  <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                    {totalEncomendas}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="aguardando_retirada" className="gap-2 flex-1 lg:flex-none">
                  Pendentes
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">
                    {encomendasPendentes}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="retirada" className="gap-2 flex-1 lg:flex-none">
                  Retiradas
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                    {encomendasRetiradas}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e: any) => setDateFilter(e.target.value)}
                className="w-full lg:w-auto h-10 !text-black"
                style={{ backgroundColor: 'white', color: 'black', height: '40px', opacity: 1 }}
              />
              {dateFilter && (
                <Button type="button" variant="ghost" size="icon" onClick={() => setDateFilter('')} title="Limpar data">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      {showForm && (
        <EncomendaForm
          encomenda={editingEncomenda}
          moradores={moradores}
          empresas={empresas}
          onSubmit={(data: any, notificar: boolean) => {
            if (editingEncomenda) {
              updateMutation.mutate({ id: editingEncomenda.id, data });
            } else {
              createMutation.mutate(data, {
                onSuccess: (novaEncomenda: any) => {
                  if (notificar) {
                    const morador = moradores.find((m: any) => m.id === data.morador_id);
                    enviarWhatsApp(novaEncomenda || data, morador);
                  }
                }
              });
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingEncomenda(null);
          }}
        />
      )}

      {/* Lista de Encomendas */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">Carregando...</p>
          </Card>
        ) : (
          <>
            {/* View for Pending Tab with Groups */}
            {statusFilter === 'aguardando_retirada' && !selectedUnitGroup ? (
              Object.keys(pendingGroups).length === 0 ? (
                <Card className="p-8 text-center border-0 shadow-lg">
                  <Package className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">Nenhuma encomenda pendente encontrada {dateFilter ? 'nesta data' : ''}</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(pendingGroups).map(([key, groupItems]: [string, any]) => (
                    <Card 
                      key={key} 
                      className="border-0 shadow-md hover:shadow-xl transition-all cursor-pointer bg-white/90 backdrop-blur-sm border-l-4 border-l-orange-400 group"
                      onClick={() => setSelectedUnitGroup(key)}
                    >
                      <CardContent className="p-6 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                            {key}
                          </h3>
                          <p className="text-slate-500 mt-1">
                            {groupItems.length} {groupItems.length === 1 ? 'encomenda pendente' : 'encomendas pendentes'}
                          </p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-full group-hover:bg-purple-50 transition-colors">
                          <ChevronRight className="h-6 w-6 text-orange-400 group-hover:text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              /* View for Details List (Pending Selected or All/Retiradas) */
              <>
                {statusFilter === 'aguardando_retirada' && selectedUnitGroup && (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Button 
                        type="button"
                        variant="ghost" 
                        onClick={() => setSelectedUnitGroup(null)}
                        className="text-slate-600 hover:text-slate-900 gap-2 pl-0"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para lista
                      </Button>
                      <h2 className="text-lg font-semibold text-slate-800 ml-2 border-l pl-4 border-slate-300">
                        {selectedUnitGroup}
                      </h2>
                    </div>
                    {itemsToRender.length > 1 && (
                      <RetiradaEmMassaAction 
                        items={itemsToRender}
                        onConfirm={registrarRetiradaEmMassa}
                      />
                    )}
                  </div>
                )}

                {itemsToRender.length === 0 ? (
                  <Card className="p-8 text-center border-0 shadow-lg">
                    <Package className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">Nenhuma encomenda encontrada</p>
                  </Card>
                ) : (
                  itemsToRender.map((encomenda: any) => (
                    <Card key={encomenda.id} className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Ícone/Foto */}
                          <div className="flex-shrink-0">
                            <div className={`h-24 w-24 rounded-xl flex items-center justify-center ${
                              encomenda.tipo === 'correspondencia' || encomenda.tipo === 'documento' 
                                ? 'bg-blue-100' 
                                : 'bg-purple-100'
                            }`}>
                              {getTipoIcon(encomenda.tipo)}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                  Unidade {encomenda.unidade}{encomenda.bloco ? ` - Bloco ${encomenda.bloco}` : ''}
                                </h3>
                                {/* DETALHE 1: DESTINATÁRIO */}
                                <div className="flex items-center gap-2 mt-1 text-slate-700">
                                  <User className="h-4 w-4 text-purple-500" />
                                  <span className="font-medium">
                                    Destinatário: {getMoradorNome(encomenda) || 'Morador não identificado'}
                                  </span>
                                </div>
                                {/* DETALHE NOVO: A/C Parente/Amigo */}
                                {encomenda.destinatario_alternativo && (
                                  <div className="flex items-center gap-2 mt-1 text-sm text-orange-700 bg-orange-50 w-fit px-2 py-0.5 rounded">
                                    <Users className="h-3 w-3" />
                                    <span>Aos cuidados de: <strong>{encomenda.destinatario_alternativo}</strong></span>
                                  </div>
                                )}
                              </div>
                              {getStatusBadge(encomenda.status)}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <div>
                                <span className="text-xs text-slate-500 uppercase font-semibold">Tipo</span>
                                <p className="font-medium text-slate-900 capitalize">{encomenda.tipo}</p>
                              </div>
                              
                              {/* DETALHE 2: EMPRESA/REMETENTE */}
                              <div>
                                <span className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1">
                                  <Truck className="h-3 w-3" /> Remetente
                                </span>
                                <p className="font-medium text-slate-900">
                                  {encomenda.empresa_nome || encomenda.remetente || '-'}
                                </p>
                              </div>

                              {/* DETALHE 3: CÓDIGO DE RASTREIO */}
                              <div>
                                <span className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1">
                                  <Barcode className="h-3 w-3" /> Rastreio
                                </span>
                                <p className="font-medium text-slate-900 font-mono text-xs">
                                  {encomenda.codigo_rastreio || '-'}
                                </p>
                              </div>

                              <div>
                                <span className="text-xs text-slate-500 uppercase font-semibold">Cód. Retirada</span>
                                <p className="font-mono font-bold text-blue-600">
                                  {encomenda.codigo_retirada}
                                </p>
                              </div>

                              <div>
                                <span className="text-xs text-slate-500 uppercase font-semibold">Recebido em</span>
                                <p className="font-medium text-slate-900">
                                  {format(new Date(encomenda.data_hora_recebimento), 'dd/MM/yy HH:mm')}
                                </p>
                              </div>

                              {encomenda.data_hora_retirada && (
                                <div>
                                  <span className="text-xs text-slate-500 uppercase font-semibold">Retirado em</span>
                                  <p className="font-medium text-slate-900">
                                    {format(new Date(encomenda.data_hora_retirada), 'dd/MM/yy HH:mm')}
                                  </p>
                                </div>
                              )}
                            </div>

                            {encomenda.descricao && (
                              <p className="text-sm text-slate-600 italic mt-2">
                                "{encomenda.descricao}"
                              </p>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t mt-2">
                              {encomenda.status === 'aguardando_retirada' && (
                                <RetiradaAction 
                                  encomanda={encomenda} 
                                  onConfirm={registrarRetirada} 
                                />
                              )}
                              <DeleteAction onConfirm={() => deleteMutation.mutate(encomenda.id)} />
                            </div>

                            {encomenda.quem_recebeu && (
                              <p className="text-sm text-green-700 font-medium bg-green-50 p-2 rounded border border-green-100 mt-2">
                                <Check className="h-3 w-3 inline mr-1" />
                                Retirado por: {encomenda.quem_recebeu}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
