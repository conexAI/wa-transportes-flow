
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { useForm, Controller } from 'react-hook-form';
import { ReportOptions, generateTrackingReport, sendReportByEmail, downloadPdf } from '@/utils/pdfService';
import { TrackingDetail } from '@/types/tracking';

interface PDFReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackingData: TrackingDetail[];
}

const PDFReportDialog: React.FC<PDFReportDialogProps> = ({ 
  open, 
  onOpenChange,
  trackingData
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const form = useForm<{
    startDate: Date;
    endDate: Date;
    includeCompleted: boolean;
    includeInProgress: boolean;
    includePending: boolean;
    sendEmail: boolean;
    emailTo: string;
  }>({
    defaultValues: {
      startDate: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
      endDate: new Date(),
      includeCompleted: true,
      includeInProgress: true,
      includePending: true,
      sendEmail: false,
      emailTo: '',
    },
  });
  
  const handleSubmit = async (values: any) => {
    setIsGenerating(true);
    
    const options: ReportOptions = {
      startDate: values.startDate,
      endDate: values.endDate,
      includeCompleted: values.includeCompleted,
      includeInProgress: values.includeInProgress,
      includePending: values.includePending,
    };
    
    try {
      const pdfBlob = await generateTrackingReport(trackingData, options);
      
      // Download the PDF
      const formattedStartDate = format(options.startDate, 'dd-MM-yyyy', { locale: ptBR });
      const formattedEndDate = format(options.endDate, 'dd-MM-yyyy', { locale: ptBR });
      downloadPdf(pdfBlob, `relatorio-wa-transportes-${formattedStartDate}-a-${formattedEndDate}.pdf`);
      
      // Send email if requested
      if (values.sendEmail && values.emailTo) {
        setIsSending(true);
        const emails = values.emailTo.split(',').map(email => email.trim());
        
        const success = await sendReportByEmail(
          pdfBlob,
          emails,
          `Relatório de Rastreamento WA Transportes - ${formattedStartDate} a ${formattedEndDate}`
        );
        
        if (success) {
          toast({
            title: "E-mail enviado",
            description: `Relatório enviado para ${emails.join(', ')}`,
          });
        } else {
          toast({
            title: "Erro ao enviar e-mail",
            description: "Não foi possível enviar o relatório por e-mail. Tente novamente.",
            variant: "destructive",
          });
        }
        setIsSending(false);
      }
      
      toast({
        title: "Relatório gerado com sucesso",
        description: "O relatório foi gerado e baixado no seu dispositivo.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar Relatório PDF</DialogTitle>
          <DialogDescription>
            Configure as opções do relatório de rastreamento
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Date Range Selection */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data inicial</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarPicker
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date > new Date() || 
                            date > form.getValues("endDate")
                          }
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data final</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarPicker
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date > new Date() || 
                            date < form.getValues("startDate")
                          }
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Status Filters */}
            <div className="space-y-2">
              <FormLabel>Filtrar por status</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="includeCompleted"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Entregue
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="includeInProgress"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Em trânsito
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="includePending"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Pendente
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Email Options */}
            <FormField
              control={form.control}
              name="sendEmail"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormLabel>Enviar por e-mail</FormLabel>
                    <FormDescription>
                      Além de baixar, enviar o relatório por e-mail
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {form.watch("sendEmail") && (
              <FormField
                control={form.control}
                name="emailTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatários</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email@exemplo.com, outro@exemplo.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Separe múltiplos e-mails com vírgula
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                type="button"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isGenerating || isSending}
              >
                {isGenerating ? 'Gerando relatório...' : 
                 isSending ? 'Enviando e-mail...' : 'Gerar relatório'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PDFReportDialog;
