
// Mock drivers
export const drivers = [
  { id: 1, name: 'João Silva' },
  { id: 2, name: 'Carla Oliveira' },
  { id: 3, name: 'Miguel Santos' }
];

// Mock vehicles
export const vehicles = [
  { id: 1, plate: 'ABC-1234', model: 'VW Delivery' },
  { id: 2, plate: 'DEF-5678', model: 'Mercedes-Benz Sprinter' },
  { id: 3, plate: 'GHI-9012', model: 'Ford Cargo' }
];

// Mock invoices (NF-e)
export const invoices = [
  { 
    id: 1, 
    key: '35221234567890123456789012345678901234567890', 
    issuer: 'Empresa ABCD Ltda',
    value: 'R$ 2.500,00',
    nfeStatus: 'Autorizada',
    cteStatus: 'Emitido'
  },
  { 
    id: 2, 
    key: '35221234567890123456789012345678901234567891', 
    issuer: 'Fornecedor XYZ S.A.',
    value: 'R$ 1.750,00',
    nfeStatus: 'Autorizada',
    cteStatus: 'Pendente'
  },
  { 
    id: 3, 
    key: '35221234567890123456789012345678901234567892', 
    issuer: 'Distribuidora ZZZ Ltda',
    value: 'R$ 3.200,00',
    nfeStatus: 'Autorizada',
    cteStatus: 'Emitido'
  },
  { 
    id: 4, 
    key: '35221234567890123456789012345678901234567893', 
    issuer: 'Indústria RST Ltda',
    value: 'R$ 5.100,00',
    nfeStatus: 'Rejeitada',
    cteStatus: 'Rejeitado'
  },
  { 
    id: 5, 
    key: '35221234567890123456789012345678901234567894', 
    issuer: 'Comércio QWE Eireli',
    value: 'R$ 980,00',
    nfeStatus: 'Autorizada',
    cteStatus: 'Emitido'
  }
];

// Dashboard stats
export const dashboardStats = {
  cteEmitted: 352,
  ctePending: 48,
  cteRejected: 12
};

// Checklist items
export const checklistItems = [
  { id: 'fuel', label: 'Nível de combustível' },
  { id: 'tires', label: 'Pneus calibrados' },
  { id: 'lights', label: 'Lanternas funcionando' },
  { id: 'equipment', label: 'Equipamentos obrigatórios (triângulo, estepe, macaco)' },
  { id: 'documents', label: 'Documentação do veículo' }
];
