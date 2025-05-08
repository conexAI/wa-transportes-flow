
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, RefreshCw, CalendarClock, ExternalLink, MessageSquare, FileText, Camera, Send } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import TrackingTimeline from '@/components/TrackingTimeline';
import PhotoUpload from '@/components/PhotoUpload';
import SignatureCapture from '@/components/SignatureCapture';
import { getTrackingDetails, updateTrackingStep, addComment, addDeliveryConfirmation } from '@/utils/trackingService';
import { TrackingDetail, TrackingStatus, Comment } from '@/types/tracking';

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
  const [newComment, setNewComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  // Fetch tracking details
  const { data: tracking, isLoading, isError } = useQuery({
    queryKey: ['tracking', id],
    queryFn: () => getTrackingDetails(id || ''),
    enabled: !!id,
  });

  // Update tracking step mutation
  const { mutate: updateStep, isPending: isUpdatingStep } = useMutation({
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

  // Add comment mutation
  const { mutate: postComment, isPending: isPostingComment } = useMutation({
    mutationFn: (text: string) => {
      const userName = localStorage.getItem('userName') || 'Usuário';
      return addComment(id || '', {
        id: Date.now().toString(),
        authorName: userName,
        text,
        timestamp: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracking', id] });
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi publicado com sucesso.",
      });
      setNewComment('');
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Add delivery confirmation mutation
  const { mutate: confirmDelivery, isPending: isConfirmingDelivery } = useMutation({
    mutationFn: () => {
      return addDeliveryConfirmation(id || '', {
        confirmedBy: localStorage.getItem('userName') || 'Motorista',
        confirmedAt: new Date().toISOString(),
      }, photos, signatureData || undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracking', id] });
      toast({
        title: "Entrega confirmada",
        description: "A confirmação de entrega foi registrada com sucesso.",
      });
      setPhotos([]);
      setSignatureData(null);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível confirmar a entrega. Tente novamente.",
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      postComment(newComment.trim());
    }
  };

  const handleDeliveryConfirmation = () => {
    if (photos.length === 0 || !signatureData) {
      toast({
        title: "Erro",
        description: "É necessário fornecer ao menos uma foto e uma assinatura.",
        variant: "destructive"
      });
      return;
    }
    confirmDelivery();
  };

  const handlePhotosSelected = (selectedPhotos: File[]) => {
    setPhotos(selectedPhotos);
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

  const isDelivered = tracking.steps.find(s => s.id === 'delivered')?.completed;

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
                          disabled={isUpdatingStep || (step.completed && !step.active)}
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

          {/* Delivery confirmation section - only show if delivered */}
          {isDelivered && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Confirmação de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                {tracking.deliveryConfirmation ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Confirmado por</h4>
                      <p className="text-sm text-muted-foreground">
                        {tracking.deliveryConfirmation.confirmedBy} em {' '}
                        {tracking.deliveryConfirmation.confirmedAt && 
                          format(new Date(tracking.deliveryConfirmation.confirmedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tracking.deliveryConfirmation.photoUrl && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Foto da entrega</h4>
                          <div className="border rounded-md overflow-hidden">
                            <img 
                              src={tracking.deliveryConfirmation.photoUrl} 
                              alt="Confirmação de entrega" 
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        </div>
                      )}
                      
                      {tracking.deliveryConfirmation.signatureUrl && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Assinatura do receptor</h4>
                          <div className="border rounded-md overflow-hidden bg-white p-2">
                            <img 
                              src={tracking.deliveryConfirmation.signatureUrl} 
                              alt="Assinatura" 
                              className="w-full h-auto"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      Registre a confirmação de entrega capturando uma foto e a assinatura do receptor.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Foto da entrega</h4>
                        <PhotoUpload 
                          onPhotosSelected={handlePhotosSelected} 
                          maxPhotos={1}
                        />
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Assinatura do receptor</h4>
                        <SignatureCapture 
                          onChange={setSignatureData}
                          value={signatureData}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleDeliveryConfirmation} 
                        disabled={isConfirmingDelivery || photos.length === 0 || !signatureData}
                      >
                        {isConfirmingDelivery ? 'Enviando...' : 'Confirmar entrega'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="info">Detalhes</TabsTrigger>
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                  <TabsTrigger value="occurrences">Ocorrências</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Sem informações adicionais disponíveis.
                  </p>
                </TabsContent>
                
                <TabsContent value="comments" className="mt-4">
                  <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-3">
                      {tracking.comments && tracking.comments.length > 0 ? (
                        tracking.comments.map((comment) => (
                          <div key={comment.id} className="bg-muted rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-sm">{comment.authorName}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(comment.timestamp), "dd/MM HH:mm", { locale: ptBR })}
                              </span>
                            </div>
                            <p className="text-sm">{comment.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          Nenhum comentário ainda.
                        </p>
                      )}
                    </div>
                    
                    <form onSubmit={handleCommentSubmit} className="flex items-end gap-2">
                      <div className="flex-1">
                        <Textarea
                          placeholder="Adicione um comentário..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="resize-none"
                          rows={2}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        size="sm"
                        disabled={!newComment.trim() || isPostingComment}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </TabsContent>
                
                <TabsContent value="occurrences" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Nenhuma ocorrência registrada.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Generate PDF Report */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Gerar Relatório PDF
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gerar Relatório PDF</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm mb-4">
                      Esta funcionalidade estará disponível em breve. Você poderá gerar relatórios em PDF e enviá-los por e-mail.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
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
                disabled={isUpdatingStep}
              >
                {isUpdatingStep ? 'Atualizando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TrackingDetails;
