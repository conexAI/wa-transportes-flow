
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Bell, AlertTriangle, FileWarning, TruckIcon } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts';
import { staggerContainer, fadeInUp } from '@/utils/animations';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Alerts = () => {
  const { alerts, resolveAlert, alertStats } = useAlerts();
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter alerts based on current filters
  const filteredAlerts = alerts.filter((alert) => {
    // Apply type filter
    if (typeFilter && typeFilter !== 'all' && alert.type !== typeFilter) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'all' && 
        ((statusFilter === 'pending' && alert.resolved) || 
         (statusFilter === 'resolved' && !alert.resolved))) {
      return false;
    }

    // Apply search query (search in any text field)
    if (searchQuery && !Object.values(alert).some(value => 
      typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'cte-delay':
        return <FileWarning className="h-5 w-5 text-amber-600" />;
      case 'shipment-delay':
        return <TruckIcon className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'cte-delay':
        return 'CT-e Atrasado';
      case 'shipment-delay':
        return 'Carga não saiu do pátio';
      default:
        return type;
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold text-gray-900">Alertas</h1>
        <p className="text-gray-600">Sistema de monitoramento de não conformidades</p>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Alertas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{alertStats.pending}</div>
              <div className="ml-2 flex items-center text-red-600 text-sm">
                <AlertTriangle className="h-5 w-5 mr-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Alertas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{alertStats.today}</div>
              <div className="ml-2 flex items-center text-amber-600 text-sm">
                <Bell className="h-5 w-5 mr-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Alertas Resolvidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{alertStats.resolved}</div>
              <div className="ml-2 flex items-center text-green-600 text-sm">
                <Check className="h-5 w-5 mr-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Alerts Rules Info */}
      <motion.div variants={fadeInUp}>
        <Alert>
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Regras de monitoramento ativas</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>NF-e recebida e CT-e não emitido em até 15 minutos</li>
              <li>CT-e emitido e carga não saiu do pátio em até 3h</li>
            </ul>
          </AlertDescription>
        </Alert>
      </motion.div>
      
      {/* Alerts Table */}
      <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Histórico de Alertas</h2>
          
          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Buscar alertas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="cte-delay">CT-e Atrasado</SelectItem>
                  <SelectItem value="shipment-delay">Carga não saiu do pátio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="resolved">Resolvidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                <TableHead className="font-semibold text-gray-700">Descrição</TableHead>
                <TableHead className="font-semibold text-gray-700">Data/Hora</TableHead>
                <TableHead className="font-semibold text-gray-700">Destinatários</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <TableRow key={alert.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getAlertIcon(alert.type)}
                        <span>{getAlertTypeLabel(alert.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate">
                        {alert.description}
                      </div>
                      {alert.referenceId && (
                        <div className="mt-1 text-xs text-gray-500">
                          Ref: {alert.referenceId}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(alert.timestamp).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        {alert.recipients.map((recipient, idx) => (
                          <span key={idx} className="text-sm">
                            {recipient}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={alert.resolved ? "default" : "destructive"}
                        className={alert.resolved 
                          ? "bg-green-100 text-green-800 hover:bg-green-200" 
                          : "bg-red-100 text-red-800 hover:bg-red-200"}
                      >
                        {alert.resolved ? "Resolvido" : "Pendente"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {!alert.resolved && (
                          <Button 
                            onClick={() => resolveAlert(alert.id)} 
                            variant="outline" 
                            size="sm"
                            className="border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Marcar como resolvido
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhum alerta encontrado com os filtros aplicados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Alerts;
