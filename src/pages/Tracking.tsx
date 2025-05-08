import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Route, MapPin, Link, Search, Link2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ptBR } from 'date-fns/locale';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data to simulate tracking records
const trackingData = [
  {
    id: '1',
    cteNumber: 'CT-e 35230987654321098765',
    trackingLink: 'https://wat.app/track/35230987654321098765',
    status: 'Em trânsito',
    createdAt: new Date('2023-05-10T14:30:00'),
    accessCount: 12,
  },
  {
    id: '2',
    cteNumber: 'CT-e 35230987654321098766',
    trackingLink: 'https://wat.app/track/35230987654321098766',
    status: 'Entregue',
    createdAt: new Date('2023-05-08T09:15:00'),
    accessCount: 8,
  },
  {
    id: '3',
    cteNumber: 'CT-e 35230987654321098767',
    trackingLink: 'https://wat.app/track/35230987654321098767',
    status: 'Aguardando coleta',
    createdAt: new Date('2023-05-11T11:45:00'),
    accessCount: 3,
  },
  {
    id: '4',
    cteNumber: 'CT-e 35230987654321098768',
    trackingLink: 'https://wat.app/track/35230987654321098768',
    status: 'Em trânsito',
    createdAt: new Date('2023-05-09T16:20:00'),
    accessCount: 15,
  },
  {
    id: '5',
    cteNumber: 'CT-e 35230987654321098769',
    trackingLink: 'https://wat.app/track/35230987654321098769',
    status: 'Entregue',
    createdAt: new Date('2023-05-07T13:10:00'),
    accessCount: 6,
  },
  {
    id: '6',
    cteNumber: 'CT-e 35230987654321098770',
    trackingLink: 'https://wat.app/track/35230987654321098770',
    status: 'Problema na entrega',
    createdAt: new Date('2023-05-06T10:30:00'),
    accessCount: 21,
  },
];

// Analytics data
const analyticsData = {
  totalTrackings: 142,
  totalAccesses: 986,
  activeTrackings: 57,
  deliveredTrackings: 85,
};

const Tracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Simulate data fetching with React Query
  const { data: trackings } = useQuery({
    queryKey: ['trackings'],
    queryFn: () => Promise.resolve(trackingData),
    initialData: trackingData,
  });
  
  // Filter trackings based on search term
  const filteredTrackings = trackings.filter(tracking => 
    tracking.cteNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tracking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Function to get badge color based on status
  const getStatusBadgeVariant = (status) => {
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

  const handleOpenTracking = (link) => {
    window.open(link, '_blank');
  };

  const handleGenerateNewTracking = () => {
    alert('Funcionalidade em desenvolvimento: Gerar novo link de tracking');
  };

  const handleViewDetails = (id) => {
    navigate(`/dashboard/tracking/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto space-y-6"
    >
      <h1 className="text-2xl font-bold">Rastreamento</h1>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de rastreamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalTrackings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de acessos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalAccesses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rastreamentos ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.activeTrackings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entregas concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.deliveredTrackings}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por CT-e ou status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button 
          onClick={handleGenerateNewTracking}
          className="w-full sm:w-auto"
        >
          <Link2 className="mr-2 h-4 w-4" />
          Gerar novo link
        </Button>
      </div>
      
      {/* Trackings Table */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CT-e</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Data de criação</TableHead>
              <TableHead className="hidden md:table-cell">Acessos</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrackings.length > 0 ? (
              filteredTrackings.map((tracking) => (
                <TableRow key={tracking.id}>
                  <TableCell className="font-medium">{tracking.cteNumber}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(tracking.status)}>
                      {tracking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {format(tracking.createdAt, "dd 'de' MMM, yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{tracking.accessCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenTracking(tracking.trackingLink)}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Link</span>
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleViewDetails(tracking.id)}
                        className="flex items-center gap-1"
                      >
                        <Search className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Detalhes</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default Tracking;
