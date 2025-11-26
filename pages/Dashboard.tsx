import React from 'react';
import { base44 } from '../api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '../components/ui';
import { 
  Package, 
  AlertCircle, 
  Users,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { data: encomendas = [], isLoading: loadingEncomendas } = useQuery({
    queryKey: ['encomendas'],
    queryFn: () => base44.entities.Encomenda.list('-created_date', 50),
  });

  const { data: ocorrencias = [], isLoading: loadingOcorrencias } = useQuery({
    queryKey: ['ocorrencias'],
    queryFn: () => base44.entities.Ocorrencia.list('-created_date', 50),
  });

  const { data: funcionarios = [], isLoading: loadingFuncionarios } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => base44.entities.Funcionario.list(),
  });

  const isLoading = loadingEncomendas || loadingOcorrencias || loadingFuncionarios;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const encomendasPendentes = encomendas.filter((e: any) => e.status === 'aguardando_retirada').length;
  const ocorrenciasRegistradas = ocorrencias.filter((o: any) => {
    const dataOcorrencia = new Date(o.created_date || o.data_registro);
    dataOcorrencia.setHours(0, 0, 0, 0);
    return dataOcorrencia >= hoje;
  }).length;
  const funcionariosAtivos = funcionarios.filter((f: any) => f.status === 'ativo').length;

  const statCards = [
    {
      title: 'Encomendas Pendentes',
      value: encomendasPendentes,
      icon: Package,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      trend: `${encomendas.length} total`
    },
    {
      title: 'Ocorrências Hoje',
      value: ocorrenciasRegistradas,
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      trend: `${ocorrencias.length} total`
    },
    {
      title: 'Funcionários Ativos',
      value: funcionariosAtivos,
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      trend: `${funcionarios.length} cadastrados`
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
          Painel de Portaria
        </h1>
        <p className="text-slate-600">
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full -translate-y-16 translate-x-16 opacity-30`} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}