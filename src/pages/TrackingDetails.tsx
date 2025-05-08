
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, RefreshCw, CalendarClock, ExternalLink } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

import TrackingTimeline from '@/components/TrackingTimeline';
import { getTrackingDetails, updateTrackingStep } from '@/utils/trackingService';
import { TrackingDetail, TrackingStatus } from '@/types/tracking';

const TrackingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [statusUpdate, setStatusUpdate] = useState<{
    stepId: TrackingStatus;
    stepName: string;
  } | null>(null);

  // Fetch tracking details
  const { data: tracking, isLoading, isError } = useQuery({
    queryKey: ['tracking', id],
    queryFn: () => getTrackingDetails(id || ''),
    enabled: !!id,
  });

  // Update tracking step mutation
  const { mutate: updateStep, isPending } = useMutation({
    mutationFn: ({ stepId, isActive }: { stepId: TrackingStatus; isActive: boolean }) => 
      updateTrackingStep(
        id || '', 
        stepId,
        true, // completed
        isActive, // active
        `Status atualizado manualmente por ${localStorage.getItem('userName') || 'usuário'}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracking', id] });
      toast({
        title: "Status atualizado",
        description: "A timeline foi atualizada com sucesso.",
      });
      setStatusUpdate(null);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleGoBack = () => {
    navigate('/dashboard/tracking');
  };

  const calculateProgress = (tracking: TrackingDetail) => {
    const completedSteps = tracking.steps.filter(step => step.completed).length;
    return (completedSteps / tracking.steps.length) * 100;
  };

  const getProgressLabel = (tracking: TrackingDetail) => {
    const completedSteps = tracking.steps.filter(step => step.completed).length;
    return `${completedSteps}/${tracking.steps.length} etapas concluídas`;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Em trânsito':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'Entregue':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'Aguardando coleta':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'Problema na entrega':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const handleUpdateStep = (stepId: TrackingStatus, stepName: string) => {
    setStatusUpdate({ stepId, stepName });
  };

  const confirmUpdateStep = (isActive: boolean) => {
    if (statusUpdate) {
      updateStep({ stepId: statusUpdate.stepId, isActive });
    }
  };

  // Handle loading and error states
  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (isError || !tracking) return (
    <div className="text-center py-10">
      <h2 className="text-xl font-semibold mb-2">Dados não encontrados</h2>
      <p className="text-muted-foreground">Não foi possível carregar os detalhes do rastreamento.</p>
      <Button variant="outline" onClick={handleGoBack} className="mt-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
      </Button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto space-y-6 pb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" onClick={handleGoBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">{tracking.cteNumber}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-xl">Status do Rastreamento</CardTitle>
                <Badge className={getStatusBadgeVariant(tracking.status)}>
                  {tracking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{getProgressLabel(tracking)}</span>
                </div>
                <Progress value={calculateProgress(tracking)} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Criado em</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {format(new Date(tracking.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Última atualização</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {format(new Date(tracking.lastUpdated), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(tracking.trackingLink, '_blank')}
                className="text-xs"
              >
                Link Público <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm" className="text-xs">
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Atualizar Status
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Atualizar Status</SheetTitle>
                    <SheetDescription>
                      Selecione qual etapa deseja marcar como atual no rastreamento.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-4">
                    {tracking.steps.map((step) => (
                      <div key={step.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{step.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {step.completed ? 'Concluído' : 'Pendente'}
                          </p>
                        </div>
                        <Button
                          variant={step.active ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpdateStep(step.id as TrackingStatus, step.name)}
                          disabled={isPending || (step.completed && !step.active)}
                        >
                          {step.active ? 'Atual' : 'Marcar como atual'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </CardFooter>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Linha do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackingTimeline steps={tracking.steps} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">CT-e</p>
                <p className="text-sm text-muted-foreground">{tracking.cteNumber}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium">Acessos</p>
                <p className="text-sm text-muted-foreground">
                  {tracking.accessCount} visualizações
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Relacionadas</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="info">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="info">Detalhes</TabsTrigger>
                  <TabsTrigger value="occurrences">Ocorrências</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Sem informações adicionais disponíveis.
                  </p>
                </TabsContent>
                <TabsContent value="occurrences" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Nenhuma ocorrência registrada.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Update Status Modal */}
      {statusUpdate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirmar atualização</h2>
            <p className="mb-6">
              Deseja marcar "{statusUpdate.stepName}" como etapa atual do rastreamento?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStatusUpdate(null)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => confirmUpdateStep(true)}
                disabled={isPending}
              >
                {isPending ? 'Atualizando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TrackingDetails;
