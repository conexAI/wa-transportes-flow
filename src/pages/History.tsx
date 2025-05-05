
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/utils/animations';
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
  Calendar,
  Clock, 
  FileText, 
  Search, 
  Truck, 
  User
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for history
const historyItems = [
  { 
    id: 1, 
    date: '2023-05-01', 
    time: '08:30',
    type: 'CT-e', 
    documentNumber: '12345678901234567890',
    user: 'João Silva',
    action: 'Emissão',
    status: 'Concluído'
  },
  { 
    id: 2, 
    date: '2023-05-02', 
    time: '10:15',
    type: 'CT-e', 
    documentNumber: '98765432109876543210',
    user: 'Maria Oliveira',
    action: 'Cancelamento',
    status: 'Concluído'
  },
  { 
    id: 3, 
    date: '2023-05-03', 
    time: '14:45',
    type: 'NF-e', 
    documentNumber: '45678901234567890123',
    user: 'Carlos Santos',
    action: 'Consulta',
    status: 'Concluído'
  },
  { 
    id: 4, 
    date: '2023-05-04', 
    time: '16:20',
    type: 'CT-e', 
    documentNumber: '78901234567890123456',
    user: 'Ana Pereira',
    action: 'Emissão',
    status: 'Erro'
  },
  { 
    id: 5, 
    date: '2023-05-05', 
    time: '09:10',
    type: 'NF-e', 
    documentNumber: '56789012345678901234',
    user: 'Roberto Alves',
    action: 'Processamento',
    status: 'Concluído'
  }
];

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredHistory = historyItems.filter(item => {
    // Apply search filter
    if (searchTerm && 
        !item.documentNumber.includes(searchTerm) && 
        !item.user.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply type filter
    if (typeFilter && typeFilter !== 'all' && item.type !== typeFilter) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    
    // Apply date range filter
    if (dateRange.start && new Date(item.date) < new Date(dateRange.start)) {
      return false;
    }
    
    if (dateRange.end && new Date(item.date) > new Date(dateRange.end)) {
      return false;
    }
    
    return true;
  });

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Histórico</h1>
        <p className="text-gray-600">Visualize o histórico de operações do sistema</p>
      </div>
      
      {/* Filters */}
      <Card className="bg-white shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-gray-700">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por documento ou usuário"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="CT-e">CT-e</SelectItem>
                  <SelectItem value="NF-e">NF-e</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Erro">Erro</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Data inicial"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Data final"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* History Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-700 w-32">Data/Hora</TableHead>
              <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
              <TableHead className="font-semibold text-gray-700">Número</TableHead>
              <TableHead className="font-semibold text-gray-700">Usuário</TableHead>
              <TableHead className="font-semibold text-gray-700">Ação</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 w-24">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm text-gray-800">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        {item.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {item.type === 'CT-e' ? (
                        <Truck className="h-4 w-4 mr-2 text-blue-600" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2 text-green-600" />
                      )}
                      {item.type}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {item.documentNumber.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      {item.user}
                    </div>
                  </TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Concluído' ? 'bg-green-100 text-green-800' : 
                        item.status === 'Erro' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Visualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhum registro encontrado com os filtros aplicados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default History;
