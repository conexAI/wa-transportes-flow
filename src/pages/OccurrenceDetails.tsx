
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOccurrences } from '@/hooks/useOccurrences';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Calendar, 
  Check, 
  Image as ImageIcon, 
  Loader2, 
  User, 
  X
} from 'lucide-react';
import OccurrenceTypeBadge from '@/components/OccurrenceTypeBadge';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const OccurrenceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  const { getOccurrence, resolveOccurrence, isResolvingOccurrence } = useOccurrences();
  const { data: occurrence, isLoading } = getOccurrence(id || '');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!occurrence) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/occurrences')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold">Ocorrência não encontrada</h2>
          <p className="mt-2 text-muted-foreground">
            A ocorrência que você está procurando não foi encontrada
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  };

  const handleResolve = () => {
    if (window.confirm('Deseja realmente marcar esta ocorrência como resolvida?')) {
      resolveOccurrence(occurrence.id, {
        onSuccess: () => {
          // The mutation will invalidate the queries and refresh the data
        }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/dashboard/occurrences')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <div className="bg-white rounded-lg border shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Detalhes da Ocorrência</h1>
            <div className="text-sm text-muted-foreground">
              CT-e: {occurrence.cteNumber}
            </div>
          </div>
          {occurrence.status === 'pending' && (
            <Button
              onClick={handleResolve}
              disabled={isResolvingOccurrence}
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              {isResolvingOccurrence ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Marcar como Resolvido
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Tipo de Ocorrência
              </h3>
              <OccurrenceTypeBadge type={occurrence.type} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </h3>
              {occurrence.status === 'pending' ? (
                <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                  Pendente
                </span>
              ) : occurrence.status === 'resolved' ? (
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Resolvido
                </span>
              ) : (
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                  Cancelado
                </span>
              )}
            </div>

            {occurrence.comment && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Comentário
                </h3>
                <p className="text-sm">{occurrence.comment}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                Registrado em {formatDate(occurrence.createdAt)}
              </span>
            </div>

            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Por {occurrence.createdBy}</span>
            </div>

            <div className="flex items-center">
              <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                {occurrence.photos.length} foto{occurrence.photos.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Fotos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {occurrence.photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative aspect-square cursor-pointer rounded-md overflow-hidden border border-gray-200"
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={photo.url}
                  alt={`Foto ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
      >
        <DialogContent className="max-w-4xl p-0 bg-black/90 border-none">
          <div className="relative">
            <DialogClose className="absolute right-2 top-2 rounded-full bg-black/20 p-2 text-white hover:bg-black/40">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
          <div className="h-[80vh] flex items-center justify-center p-4">
            {selectedImageIndex !== null && occurrence.photos[selectedImageIndex] && (
              <img
                src={occurrence.photos[selectedImageIndex].url}
                alt={`Foto ${selectedImageIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OccurrenceDetails;
