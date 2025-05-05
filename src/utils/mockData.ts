
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
    cteStatus: 'Emitido',
    date: '2023-05-01'
  },
  { 
    id: 2, 
    key: '35221234567890123456789012345678901234567891', 
    issuer: 'Fornecedor XYZ S.A.',
    value: 'R$ 1.750,00',
    nfeStatus: 'Autorizada',
    cteStatus: 'Pendente',
    date: '2023-05-02'
  },
  { 
    id: 3, 
    key: '35221234567890123456789012345678901234567892', 
    issuer: 'Distribuidora ZZZ Ltda',
    value: 'R$ 3.200,00',
    nfeStatus: 'Autorizada',
    cteStatus: 'Emitido',
    date: '2023-05-03'
  },
  { 
    id: 4, 
    key: '35221234567890123456789012345678901234567893', 
    issuer: 'Indústria RST Ltda',
    value: 'R$ 5.100,00',
    nfeStatus: 'Rejeitada',
    cteStatus: 'Rejeitado',
    date: '2023-05-04'
  },
  { 
    id: 5, 
    key: '35221234567890123456789012345678901234567894', 
    issuer: 'Comércio QWE Eireli',
    value: 'R$ 980,00',
    nfeStatus: 'Autorizada',
    cteStatus: 'Emitido',
    date: '2023-05-05'
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

// BI Dashboard data
export const biData = {
  revenue: {
    monthly: [
      { month: 'Jan', value: 250000 },
      { month: 'Fev', value: 310000 },
      { month: 'Mar', value: 280000 },
      { month: 'Abr', value: 320000 },
      { month: 'Mai', value: 290000 },
      { month: 'Jun', value: 350000 },
      { month: 'Jul', value: 380000 },
      { month: 'Ago', value: 410000 },
      { month: 'Set', value: 390000 },
      { month: 'Out', value: 420000 },
      { month: 'Nov', value: 450000 },
      { month: 'Dez', value: 490000 }
    ],
    quarterly: [
      { quarter: 'Q1', value: 840000 },
      { quarter: 'Q2', value: 960000 },
      { quarter: 'Q3', value: 1180000 },
      { quarter: 'Q4', value: 1360000 }
    ],
    yearly: [
      { year: '2020', value: 2800000 },
      { year: '2021', value: 3200000 },
      { year: '2022', value: 3600000 },
      { year: '2023', value: 4100000 },
      { year: '2024', value: 4340000 }
    ]
  },
  trips: {
    monthly: [
      { month: 'Jan', value: 120 },
      { month: 'Fev', value: 145 },
      { month: 'Mar', value: 135 },
      { month: 'Abr', value: 150 },
      { month: 'Mai', value: 140 },
      { month: 'Jun', value: 165 },
      { month: 'Jul', value: 175 },
      { month: 'Ago', value: 185 },
      { month: 'Set', value: 180 },
      { month: 'Out', value: 190 },
      { month: 'Nov', value: 205 },
      { month: 'Dez', value: 215 }
    ],
    quarterly: [
      { quarter: 'Q1', value: 400 },
      { quarter: 'Q2', value: 455 },
      { quarter: 'Q3', value: 540 },
      { quarter: 'Q4', value: 610 }
    ],
    yearly: [
      { year: '2020', value: 1450 },
      { year: '2021', value: 1650 },
      { year: '2022', value: 1800 },
      { year: '2023', value: 1950 },
      { year: '2024', value: 2005 }
    ]
  },
  drivers: {
    active: 28,
    inactive: 5,
    onTrip: 22,
    available: 6,
    performance: [
      { name: 'João Silva', trips: 42, performance: 95 },
      { name: 'Carla Oliveira', trips: 38, performance: 92 },
      { name: 'Miguel Santos', trips: 45, performance: 98 },
      { name: 'Roberto Costa', trips: 36, performance: 90 },
      { name: 'Ana Pereira', trips: 40, performance: 93 }
    ]
  },
  vehicles: {
    active: 25,
    maintenance: 3,
    idle: 2,
    utilization: [
      { month: 'Jan', percentage: 75 },
      { month: 'Fev', percentage: 80 },
      { month: 'Mar', percentage: 78 },
      { month: 'Abr', percentage: 82 },
      { month: 'Mai', percentage: 79 },
      { month: 'Jun', percentage: 85 },
      { month: 'Jul', percentage: 87 },
      { month: 'Ago', percentage: 86 },
      { month: 'Set', percentage: 84 },
      { month: 'Out', percentage: 88 },
      { month: 'Nov', percentage: 90 },
      { month: 'Dez', percentage: 92 }
    ]
  },
  expenses: {
    fuel: 42,
    maintenance: 28,
    tolls: 15,
    other: 15
  }
};
