
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/utils/animations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FileText, Search, ArrowRight, FilePlus, FileCheck, Upload, Truck, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CreateInvoice = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceKey, setInvoiceKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [invoiceType, setInvoiceType] = useState('nfe');

  const handleSearchInvoice = () => {
    if (!invoiceNumber && !invoiceKey) {
      toast.error('Informe o número da nota ou a chave de acesso');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success('Nota fiscal encontrada com sucesso!');
    }, 2000);
  };

  const handleCreateInvoice = () => {
    if (!invoiceNumber) {
      toast.error('Informe o número da nota fiscal');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Nota fiscal lançada com sucesso!');
      setInvoiceNumber('');
      setInvoiceKey('');
      setIsSuccess(false);
    }, 2000);
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success(`Arquivo "${files[0].name}" importado com sucesso!`);
      // Reset the file input
      e.target.value = '';
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Lançar Nota</h1>
        <p className="text-gray-600">Crie e gerencie notas fiscais eletrônicas</p>
      </div>
      
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid grid-cols-2 lg:w-[400px] mb-4">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            <span>Lançamento Manual</span>
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Importar XML</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Manual Entry */}
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Lançamento Manual</CardTitle>
              <CardDescription>
                Digite o número da nota fiscal ou a chave de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="invoice-number">Número da Nota Fiscal</Label>
                    <Input
                      id="invoice-number"
                      placeholder="Digite o número da nota fiscal"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invoice-type">Tipo de Documento</Label>
                    <Select
                      value={invoiceType}
                      onValueChange={setInvoiceType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nfe">NF-e</SelectItem>
                        <SelectItem value="nfce">NFC-e</SelectItem>
                        <SelectItem value="cte">CT-e</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="invoice-key">Chave de Acesso (opcional)</Label>
                  <Input
                    id="invoice-key"
                    placeholder="Digite a chave de acesso completa"
                    value={invoiceKey}
                    onChange={(e) => setInvoiceKey(e.target.value)}
                    className="font-mono border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSearchInvoice}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    disabled={(!invoiceNumber && !invoiceKey) || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                        <span>Processando...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        <span>Buscar Informações</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {isSuccess && (
                <div className="mt-8">
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Dados da Nota Encontrada</h3>
                      <div 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        <FileCheck className="h-3.5 w-3.5 mr-1" />
                        Autorizada
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500 text-sm">Emitente</Label>
                        <p className="text-gray-800 font-medium">Empresa ABCD Ltda</p>
                      </div>
                      
                      <div>
                        <Label className="text-gray-500 text-sm">CNPJ Emitente</Label>
                        <p className="text-gray-800 font-medium">12.345.678/0001-90</p>
                      </div>
                      
                      <div>
                        <Label className="text-gray-500 text-sm">Valor Total</Label>
                        <p className="text-gray-800 font-medium">R$ 2.500,00</p>
                      </div>
                      
                      <div>
                        <Label className="text-gray-500 text-sm">Data de Emissão</Label>
                        <p className="text-gray-800 font-medium">01/05/2023</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-500 text-sm">Chave de Acesso</Label>
                      <p className="text-gray-800 font-mono text-sm">35230512345678901234567890123456789012345678</p>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                      <Truck className="h-4 w-4" />
                      <AlertTitle>Transporte Pendente</AlertTitle>
                      <AlertDescription>
                        Esta nota fiscal está disponível para emissão de CT-e. Clique em "Lançar Nota" para prosseguir.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              )}
            </CardContent>
            {isSuccess && (
              <CardFooter className="flex justify-end space-x-2 pt-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setInvoiceNumber('');
                    setInvoiceKey('');
                    setIsSuccess(false);
                  }}
                  className="border-gray-300 text-gray-600"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateInvoice}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full mr-1"></div>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Truck className="h-4 w-4 mr-1" />
                      <span>Lançar Nota</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        {/* Import XML */}
        <TabsContent value="import">
          <Card className="relative">
            <CardHeader>
              <CardTitle>Importar XML</CardTitle>
              <CardDescription>
                Faça upload de um arquivo XML de nota fiscal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="xml-upload"
                  className="hidden"
                  accept=".xml"
                  onChange={handleUploadFile}
                />
                <label
                  htmlFor="xml-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-700">Solte o arquivo aqui ou clique para fazer upload</p>
                    <p className="text-sm text-gray-500">Suporta arquivos XML de NF-e, NFC-e e CT-e</p>
                  </div>
                  <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Arquivo
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default CreateInvoice;
