
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOccurrences } from '@/hooks/useOccurrences';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertCircle, 
  Image, 
  Loader2, 
  Plus, 
  Search 
} from 'lucide-react';
import OccurrenceTypeBadge from '@/components/OccurrenceTypeBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

const Occurrences = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const { occurrences, isLoadingOccurrences } = useOccurrences();

  const filteredOccurrences = searchTerm 
    ? occurrences.filter(o => 
        o.cteNumber.includes(searchTerm) || 
        o.type.includes(searchTerm) ||
        (o.comment && o.comment.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : occurrences;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yy 'às' HH:mm", { locale: ptBR });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">Pendente</span>;
      case 'resolved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Resolvido</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Cancelado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ocorrências</h1>
          <p className="text-muted-foreground">
            Gerencie ocorrências relacionadas às entregas
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/occurrences/new')}>
          <Plus className="mr-2 h-4 w-4" /> Nova Ocorrência
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por CT-e ou tipo..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoadingOccurrences ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredOccurrences.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhuma ocorrência encontrada</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? "Tente outro termo de busca" : "Registre uma nova ocorrência"}
          </p>
          {!searchTerm && (
            <Button onClick={() => navigate('/dashboard/occurrences/new')} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Nova Ocorrência
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CT-e</TableHead>
                <TableHead>Tipo</TableHead>
                {!isMobile && <TableHead>Criado em</TableHead>}
                <TableHead>Status</TableHead>
                {!isMobile && <TableHead>Fotos</TableHead>}
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOccurrences.map((occurrence) => (
                <TableRow key={occurrence.id}>
                  <TableCell className="font-medium">
                    {isMobile 
                      ? `...${occurrence.cteNumber.slice(-8)}` 
                      : occurrence.cteNumber}
                  </TableCell>
                  <TableCell>
                    <OccurrenceTypeBadge type={occurrence.type} />
                  </TableCell>
                  {!isMobile && (
                    <TableCell>{formatDate(occurrence.createdAt)}</TableCell>
                  )}
                  <TableCell>{getStatusBadge(occurrence.status)}</TableCell>
                  {!isMobile && (
                    <TableCell>
                      <div className="flex items-center">
                        <Image size={16} className="mr-1" />
                        {occurrence.photos.length}
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/dashboard/occurrences/${occurrence.id}`)}
                    >
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Occurrences;
