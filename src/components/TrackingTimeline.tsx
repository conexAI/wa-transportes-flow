
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrackingStep } from '@/types/tracking';
import { cn } from '@/lib/utils';
import { FileText, Package, Truck, Check, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

interface TrackingTimelineProps {
  steps: TrackingStep[];
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ steps }) => {
  const isMobile = useIsMobile();
  
  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'nfe-received':
      case 'cte-issued':
        return <FileText className="h-5 w-5" />;
      case 'loaded':
        return <Package className="h-5 w-5" />;
      case 'in-transit':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <Check className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:left-4 before:ml-0.5 before:h-full before:w-0.5 before:bg-gray-200">
      {steps.map((step, index) => (
        <div key={step.id} className={cn("relative pl-10", index === 0 && "pt-2")}>
          <div 
            className={cn(
              "absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2",
              step.completed ? "bg-green-100 border-green-500 text-green-500" : 
              step.active ? "bg-blue-100 border-blue-500 text-blue-500" : 
              "bg-gray-100 border-gray-300 text-gray-400"
            )}
          >
            {getStepIcon(step.id)}
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <h4 className={cn(
                "text-sm font-medium",
                step.completed ? "text-green-700" : 
                step.active ? "text-blue-700" : 
                "text-gray-500"
              )}>
                {step.name}
              </h4>
              
              {step.timestamp && (
                <>
                  <Separator className="hidden md:block h-4 w-px bg-gray-200" orientation="vertical" />
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(step.timestamp), "dd 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </>
              )}
            </div>
            
            {step.comments && step.comments.length > 0 && (
              <div className="mt-1 space-y-1 text-xs">
                {step.comments.map((comment, i) => (
                  <p key={i} className="text-muted-foreground">{comment}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackingTimeline;
