
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOccurrences } from '@/hooks/useOccurrences';
import { OccurrenceType } from '@/types/occurrence';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import PhotoUpload from '@/components/PhotoUpload';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';

const occurrenceFormSchema = z.object({
  cteNumber: z.string().min(1, 'Número do CT-e é obrigatório'),
  type: z.enum(['damage', 'loss', 'refused', 'other'], {
    required_error: 'Selecione o tipo de ocorrência',
  }),
  comment: z.string().optional(),
});

type OccurrenceFormValues = z.infer<typeof occurrenceFormSchema>;

const CreateOccurrence = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<File[]>([]);
  const [validatingCte, setValidatingCte] = useState(false);
  const [cteValid, setCteValid] = useState<boolean | null>(null);
  const { createOccurrence, isCreatingOccurrence, isUploading, validateCte } = useOccurrences();

  const form = useForm<OccurrenceFormValues>({
    resolver: zodResolver(occurrenceFormSchema),
    defaultValues: {
      cteNumber: '',
      type: 'damage',
      comment: '',
    },
  });

  const onPhotosSelected = (selectedPhotos: File[]) => {
    setPhotos(selectedPhotos);
  };

  const handleCteChange = async (value: string) => {
    if (value.length >= 44) {
      setValidatingCte(true);
      setCteValid(null);
      
      try {
        const isValid = await validateCte(value);
        setCteValid(isValid);
      } catch (error) {
        setCteValid(false);
      } finally {
        setValidatingCte(false);
      }
    } else {
      setCteValid(null);
    }
  };

  const onSubmit = async (data: OccurrenceFormValues) => {
    if (photos.length === 0) {
      form.setError('root', { 
        type: 'manual',
        message: 'Por favor, adicione pelo menos uma foto' 
      });
      return;
    }

    createOccurrence({
      cteNumber: data.cteNumber,
      type: data.type as OccurrenceType,
      comment: data.comment || '',
      photos
    }, {
      onSuccess: () => {
        navigate('/dashboard/occurrences');
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/dashboard/occurrences')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">Nova Ocorrência</h1>
        <p className="text-muted-foreground">
          Registre uma nova ocorrência com fotos
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="cteNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do CT-e</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Digite ou escaneie o CT-e"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleCteChange(e.target.value);
                      }}
                      className={cteValid === false ? "border-red-500 pr-10" : ""}
                    />
                    {validatingCte && (
                      <div className="absolute right-3 top-2.5">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    )}
                    {cteValid === true && (
                      <div className="absolute right-3 top-2.5 text-green-500">✓</div>
                    )}
                    {cteValid === false && (
                      <div className="absolute right-3 top-2.5 text-red-500">✗</div>
                    )}
                  </div>
                </FormControl>
                {cteValid === false && (
                  <p className="text-sm text-red-500">
                    CT-e não encontrado no sistema
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Tipo de Ocorrência</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4"
                  >
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="damage" id="damage" />
                          <label
                            htmlFor="damage"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Avaria
                          </label>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="loss" id="loss" />
                          <label
                            htmlFor="loss"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Extravio
                          </label>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="refused" id="refused" />
                          <label
                            htmlFor="refused"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Recusa
                          </label>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <label
                            htmlFor="other"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Outro
                          </label>
                        </div>
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentário (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva detalhes da ocorrência"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Forneça detalhes que possam ajudar na resolução
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormLabel>Fotos</FormLabel>
            <PhotoUpload onPhotosSelected={onPhotosSelected} maxPhotos={4} />
            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isCreatingOccurrence || isUploading}
          >
            {(isCreatingOccurrence || isUploading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading ? "Enviando fotos..." : "Registrando ocorrência..."}
              </>
            ) : (
              "Registrar Ocorrência"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateOccurrence;
