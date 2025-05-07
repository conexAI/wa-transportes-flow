
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getOccurrences, 
  getOccurrenceById, 
  createOccurrence as createOccurrenceApi,
  resolveOccurrence as resolveOccurrenceApi,
  validateCteNumber
} from '@/utils/occurrenceService';
import { Occurrence, OccurrenceType } from '@/types/occurrence';
import { toast } from 'sonner';

export const useOccurrences = () => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { 
    data: occurrences = [],
    isLoading: isLoadingOccurrences,
    error: occurrencesError,
    refetch: refetchOccurrences
  } = useQuery({
    queryKey: ['occurrences'],
    queryFn: getOccurrences
  });

  const getOccurrence = (id: string) => {
    return useQuery({
      queryKey: ['occurrences', id],
      queryFn: () => getOccurrenceById(id),
      enabled: !!id
    });
  };

  const validateCte = async (cteNumber: string): Promise<boolean> => {
    try {
      return await validateCteNumber(cteNumber);
    } catch (error) {
      console.error('Error validating CTE:', error);
      return false;
    }
  };

  const createOccurrenceMutation = useMutation({
    mutationFn: ({ 
      cteNumber, 
      type, 
      comment, 
      photos 
    }: { 
      cteNumber: string; 
      type: OccurrenceType; 
      comment: string; 
      photos: File[] 
    }) => {
      setIsUploading(true);
      return createOccurrenceApi(cteNumber, type, comment, photos);
    },
    onSuccess: () => {
      setIsUploading(false);
      queryClient.invalidateQueries({ queryKey: ['occurrences'] });
      toast.success('Ocorrência registrada com sucesso!');
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error('Erro ao registrar ocorrência', {
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde',
      });
    }
  });

  const resolveOccurrenceMutation = useMutation({
    mutationFn: resolveOccurrenceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occurrences'] });
      toast.success('Ocorrência resolvida com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao resolver ocorrência', {
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde',
      });
    }
  });

  return {
    occurrences,
    isLoadingOccurrences,
    occurrencesError,
    refetchOccurrences,
    getOccurrence,
    validateCte,
    createOccurrence: createOccurrenceMutation.mutate,
    isCreatingOccurrence: createOccurrenceMutation.isPending,
    isUploading,
    resolveOccurrence: resolveOccurrenceMutation.mutate,
    isResolvingOccurrence: resolveOccurrenceMutation.isPending
  };
};
