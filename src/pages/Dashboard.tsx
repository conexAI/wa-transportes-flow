
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
    if (statusFilter && statusFilter !== 'todos' && invoice.cteStatus !== statusFilter) {
      return false;
    }

    // Apply date filter (assuming there would be a date property in each invoice)
    if (dateFilter && invoice.date) {
      const invoiceDate = new Date(invoice.date).toLocaleDateString();
      const filterDate = new Date(dateFilter).toLocaleDateString();
      
      if (invoiceDate !== filterDate) {
        return false;
      }
    }
    
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Emitido':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'Pendente':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'Rejeitado':
        return <XCircle className="h-5 w-5 text-red-600" />;
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de transporte</p>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">CT-e Emitidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{dashboardStats.cteEmitted}</div>
              <div className="ml-2 flex items-center text-green-600 text-sm">
                <CheckCircle2 className="h-5 w-5 mr-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">CT-e Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{dashboardStats.ctePending}</div>
              <div className="ml-2 flex items-center text-amber-600 text-sm">
                <Clock className="h-5 w-5 mr-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">CT-e Rejeitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{dashboardStats.cteRejected}</div>
              <div className="ml-2 flex items-center text-red-600 text-sm">
                <XCircle className="h-5 w-5 mr-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* NF-e Table */}
      <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">NF-e Processadas</h2>
          
          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Filtrar por CNPJ/Emitente"
                value={cnpjFilter}
                onChange={(e) => setCnpjFilter(e.target.value)}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
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
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">Chave</TableHead>
                <TableHead className="font-semibold text-gray-700">Emitente</TableHead>
                <TableHead className="font-semibold text-gray-700">Valor</TableHead>
                <TableHead className="font-semibold text-gray-700">Status NF-e</TableHead>
                <TableHead className="font-semibold text-gray-700">Status CT-e</TableHead>
                <TableHead className="font-semibold text-gray-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-50">
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
                        <Button variant="outline" size="icon" title="Visualizar XML" className="hover:bg-blue-50 text-blue-600 border-blue-200">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" title="Reprocessar" className="hover:bg-amber-50 text-amber-600 border-amber-200">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" title="Notificar responsável" className="hover:bg-purple-50 text-purple-600 border-purple-200">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhuma nota fiscal encontrada com os filtros aplicados.
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

export default Dashboard;
