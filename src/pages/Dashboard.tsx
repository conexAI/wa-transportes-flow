
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw, Send, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { dashboardStats, invoices } from '@/utils/mockData';
import { staggerContainer, fadeInUp } from '@/utils/animations';

const Dashboard = () => {
  const [cnpjFilter, setCnpjFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Filter invoices based on current filters
  const filteredInvoices = invoices.filter((invoice) => {
    // Apply CNPJ filter
    if (cnpjFilter && !invoice.issuer.toLowerCase().includes(cnpjFilter.toLowerCase())) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter && invoice.cteStatus !== statusFilter) {
      return false;
    }
    
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Emitido':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'Pendente':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'Rejeitado':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
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
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de transporte</p>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">CT-e Emitidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-800">{dashboardStats.cteEmitted}</div>
              <div className="ml-2 flex items-center text-green-500 text-sm">
                <CheckCircle2 className="h-4 w-4 mr-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">CT-e Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-800">{dashboardStats.ctePending}</div>
              <div className="ml-2 flex items-center text-amber-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">CT-e Rejeitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-800">{dashboardStats.cteRejected}</div>
              <div className="ml-2 flex items-center text-red-500 text-sm">
                <XCircle className="h-4 w-4 mr-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* NF-e Table */}
      <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">NF-e Processadas</h2>
          
          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Filtrar por CNPJ/Emitente"
                value={cnpjFilter}
                onChange={(e) => setCnpjFilter(e.target.value)}
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Emitido">Emitido</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chave</TableHead>
                <TableHead>Emitente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status NF-e</TableHead>
                <TableHead>Status CT-e</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-xs">
                    {invoice.key.substring(0, 15)}...
                  </TableCell>
                  <TableCell>{invoice.issuer}</TableCell>
                  <TableCell>{invoice.value}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.nfeStatus === 'Autorizada' ? 'bg-green-100 text-green-800' :
                      invoice.nfeStatus === 'Rejeitada' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.nfeStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(invoice.cteStatus)}
                      <span className="ml-2">{invoice.cteStatus}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" title="Visualizar XML">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Reprocessar">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Notificar responsável">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
