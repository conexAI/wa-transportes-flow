
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/utils/animations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Save, 
  Server, 
  Shield, 
  Bell, 
  Mail, 
  Truck, 
  Users, 
  Building
} from 'lucide-react';

const Settings = () => {
  const [companySettings, setCompanySettings] = useState({
    name: 'WA Transportes LTDA',
    cnpj: '12.345.678/0001-90',
    address: 'Rua das Flores, 123 - São Paulo/SP',
    email: 'contato@watransportes.com.br',
    phone: '(11) 3456-7890'
  });

  const [apiSettings, setApiSettings] = useState({
    sefazUrl: 'https://api.sefaz.gov.br/prod',
    sefazTimeout: '30',
    certificatePath: '/certs/cert.pfx',
    certificatePassword: '********'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dailySummary: true,
    errorAlerts: true
  });

  const handleCompanyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configurações da empresa atualizadas com sucesso!');
  };

  const handleApiUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configurações da API atualizadas com sucesso!');
  };

  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configurações de notificações atualizadas com sucesso!');
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do sistema</p>
      </div>
      
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid grid-cols-3 lg:w-[400px] mb-4">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Integração</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>
                Configure as informações da sua empresa utilizadas em documentos e relatórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompanyUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input 
                      id="company-name" 
                      value={companySettings.name}
                      onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-cnpj">CNPJ</Label>
                    <Input 
                      id="company-cnpj" 
                      value={companySettings.cnpj}
                      onChange={(e) => setCompanySettings({...companySettings, cnpj: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="company-address">Endereço</Label>
                    <Input 
                      id="company-address" 
                      value={companySettings.address}
                      onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input 
                      id="company-email" 
                      type="email"
                      value={companySettings.email}
                      onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Telefone</Label>
                    <Input 
                      id="company-phone" 
                      value={companySettings.phone}
                      onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de API</CardTitle>
              <CardDescription>
                Configure as integrações com APIs da SEFAZ e certificados digitais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApiUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sefaz-url">URL SEFAZ</Label>
                    <Input 
                      id="sefaz-url" 
                      value={apiSettings.sefazUrl}
                      onChange={(e) => setApiSettings({...apiSettings, sefazUrl: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sefaz-timeout">Timeout (segundos)</Label>
                    <Input 
                      id="sefaz-timeout" 
                      type="number"
                      value={apiSettings.sefazTimeout}
                      onChange={(e) => setApiSettings({...apiSettings, sefazTimeout: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certificate-path">Caminho do Certificado</Label>
                    <Input 
                      id="certificate-path" 
                      value={apiSettings.certificatePath}
                      onChange={(e) => setApiSettings({...apiSettings, certificatePath: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certificate-password">Senha do Certificado</Label>
                    <Input 
                      id="certificate-password" 
                      type="password"
                      value={apiSettings.certificatePassword}
                      onChange={(e) => setApiSettings({...apiSettings, certificatePassword: e.target.value})}
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Modo de Contingência</h4>
                      <p className="text-sm text-gray-500">Ativa o modo de contingência em caso de falha da SEFAZ</p>
                    </div>
                    <Switch id="contingency-mode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Logs de Requisição</h4>
                      <p className="text-sm text-gray-500">Armazena logs detalhados de todas as requisições</p>
                    </div>
                    <Switch id="request-logs" defaultChecked />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure como e quando deseja receber notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationUpdate} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações por Email</h4>
                      <p className="text-sm text-gray-500">Receber alertas por email</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações Push</h4>
                      <p className="text-sm text-gray-500">Receber alertas no navegador</p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Resumo Diário</h4>
                      <p className="text-sm text-gray-500">Receber resumo diário das operações</p>
                    </div>
                    <Switch 
                      id="daily-summary" 
                      checked={notificationSettings.dailySummary}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, dailySummary: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Alertas de Erro</h4>
                      <p className="text-sm text-gray-500">Receber notificações de erros críticos</p>
                    </div>
                    <Switch 
                      id="error-alerts" 
                      checked={notificationSettings.errorAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, errorAlerts: checked})}
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="notification-emails">Emails para Notificação</Label>
                  <Input 
                    id="notification-emails" 
                    placeholder="email1@exemplo.com, email2@exemplo.com"
                  />
                  <p className="text-xs text-gray-500">Separe múltiplos emails por vírgula</p>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Salvar Preferências
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
