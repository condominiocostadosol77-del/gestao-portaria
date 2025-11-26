import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '../api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  AlertCircle, 
  Calendar,
  UserCheck,
  Menu,
  X,
  LogOut,
  Building2,
  User,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Popover, PopoverContent, PopoverTrigger } from './ui';

// --- Componente de Login/Início de Turno ---
function ShiftLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [selectedFuncionario, setSelectedFuncionario] = useState('');
  
  const { data: funcionarios = [], isLoading } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => base44.entities.Funcionario.list(),
  });

  const handleStartShift = async () => {
    if (!selectedFuncionario) return;
    
    const func = funcionarios.find((f: any) => f.id === selectedFuncionario);
    if (func) {
      await base44.auth.login(func.id, func.nome_completo);
      onLoginSuccess();
    }
  };

  const handleAdminAccess = async () => {
    await base44.auth.login('admin-temp', 'Administrador (Prov.)');
    onLoginSuccess();
  };

  const funcionariosAtivos = funcionarios.filter((f: any) => f.status === 'ativo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Portaria Inteligente</CardTitle>
          <p className="text-slate-500">Identifique-se para iniciar o turno</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {isLoading ? (
             <p className="text-center text-slate-500">Carregando funcionários...</p>
          ) : (
            <>
              {funcionariosAtivos.length > 0 ? (
                <>
                  <div className="space-y-2">
                    <Label>Quem está assumindo o posto?</Label>
                    <Select value={selectedFuncionario} onValueChange={setSelectedFuncionario}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione seu nome" />
                      </SelectTrigger>
                      <SelectContent>
                        {funcionariosAtivos.map((f: any) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.nome_completo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="button"
                    onClick={handleStartShift} 
                    className="w-full h-12 text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg"
                    disabled={!selectedFuncionario}
                  >
                    <KeyRound className="mr-2 h-5 w-5" />
                    Iniciar Plantão
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">Nenhum funcionário encontrado</p>
                      <p>Para começar, entre com acesso administrativo e cadastre os funcionários na aba "Funcionários".</p>
                    </div>
                  </div>
                  
                  <Button 
                    type="button"
                    onClick={handleAdminAccess} 
                    className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white shadow-lg"
                  >
                    Acesso Administrativo
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Componente de Logout Action ---
function LogoutAction({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="w-full justify-center gap-2 shadow-sm hover:bg-red-600"
        >
          <LogOut className="h-4 w-4" />
          Passar Plantão
        </Button>
      </PopoverTrigger>
      {/* Fix positioning: bottom-full pushes it up, mb-2 adds space */}
      <PopoverContent className="w-60 bottom-full mb-2 shadow-xl bg-white border-red-100" align="center">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center gap-2 text-red-600">
              <LogOut className="h-4 w-4" /> Confirmar Passagem
            </h4>
            <p className="text-sm text-muted-foreground">
              Deseja encerrar seu turno? O sistema retornará para a tela de login.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              type="button" 
              variant="destructive" 
              size="sm" 
              className="w-full"
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              Confirmar e Sair
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function Layout({ children, currentPageName }: any) {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = base44.auth.getSession();
        if (session) {
          setUser({ full_name: session.nome, email: 'Operador em Turno' });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoadingSession(false);
      }
    };
    checkSession();
  }, []);

  const handleLoginSuccess = () => {
    const session = base44.auth.getSession();
    if (session) {
      setUser({ full_name: session.nome, email: 'Operador em Turno' });
    }
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    setUser(null); // Force UI to update to ShiftLogin without reloading page
  };

  if (loadingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Carregando...</div>;
  }

  // Se não tiver usuário logado, mostra a tela de login
  if (!user) {
    return <ShiftLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Encomendas', icon: Package, path: '/encomendas' },
    { name: 'Itens Recebidos', icon: Package, path: '/itens-recebidos' },
    { name: 'Materiais', icon: Package, path: '/materiais' },
    { name: 'Visitantes', icon: Users, path: '/visitantes' },
    { name: 'Ocorrências', icon: AlertCircle, path: '/ocorrencias' },
    { name: 'Moradores', icon: Users, path: '/moradores' },
    { name: 'Funcionários', icon: UserCheck, path: '/funcionarios' },
    { name: 'Folha de Ponto', icon: Calendar, path: '/folha-ponto' },
    { name: 'Empresas', icon: Building2, path: '/empresas' },
    { name: 'Entregadores', icon: UserCheck, path: '/entregadores' },
    { name: 'Visitas Entregadores', icon: Package, path: '/visitas-entregadores' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 shadow-xl z-40">
        <div className="flex-1 flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-slate-200/50">
            <Building2 className="h-8 w-8 text-cyan-600" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-slate-800">Portaria</h1>
              <p className="text-xs text-slate-500">Sistema de Gestão</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-slate-200/50 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Operador</p>
                <p className="text-sm font-bold text-slate-900 truncate">{user.full_name}</p>
              </div>
            </div>
            <LogoutAction onConfirm={handleLogout} />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-cyan-600" />
          <h1 className="text-lg font-bold text-slate-800">Portaria</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-cyan-600" />
                  <h1 className="text-lg font-bold text-slate-800">Portaria</h1>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-medium uppercase">Operador</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.full_name}</p>
                  </div>
                </div>
                <LogoutAction onConfirm={handleLogout} />
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}