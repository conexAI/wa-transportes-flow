
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Check, X, Camera, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SignatureCanvas from 'react-signature-canvas';

const Checklist = () => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [checkItems, setCheckItems] = useState({
    fuel: false,
    tires: false,
    lights: false,
    equipment: false,
    documentation: false,
  });
  const [observations, setObservations] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [signatureRef, setSignatureRef] = useState<SignatureCanvas | null>(null);
  const [signatureURL, setSignatureURL] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample data
  const drivers = [
    { id: 'joao', name: 'João Silva' },
    { id: 'carla', name: 'Carla Oliveira' },
    { id: 'miguel', name: 'Miguel Santos' },
  ];

  const vehicles = [
    { id: 'abc1234', name: 'ABC-1234 - VW Delivery' },
    { id: 'def5678', name: 'DEF-5678 - Mercedes Sprinter' },
    { id: 'ghi9012', name: 'GHI-9012 - Ford Transit' },
  ];

  const handleCheckChange = (id: string, checked: boolean) => {
    setCheckItems(prev => ({ ...prev, [id]: checked }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearSignature = () => {
    if (signatureRef) {
      signatureRef.clear();
      setSignatureURL('');
    }
  };

  const saveSignature = () => {
    if (signatureRef && !signatureRef.isEmpty()) {
      setSignatureURL(signatureRef.getTrimmedCanvas().toDataURL('image/png'));
    } else {
      toast.error('Por favor, adicione uma assinatura');
    }
  };

  const handleSubmit = () => {
    if (!selectedDriver) {
      toast.error('Por favor, selecione um motorista');
      return;
    }

    if (!selectedVehicle) {
      toast.error('Por favor, selecione um veículo');
      return;
    }

    if (!signatureURL) {
      toast.error('Por favor, adicione a assinatura do motorista');
      return;
    }

    // Simulate submission
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Checklist salvo com sucesso!');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-6"
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Checklist de Saída de Veículos</CardTitle>
          <CardDescription>
            Preencha todos os dados abaixo antes da saída do veículo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Driver Selection */}
          <div className="space-y-2">
            <Label htmlFor="driver">Motorista</Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motorista" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map(driver => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Selection */}
          <div className="space-y-2">
            <Label htmlFor="vehicle">Veículo</Label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o veículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Checklist Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Itens de Verificação</h3>
            
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fuel" 
                  checked={checkItems.fuel} 
                  onCheckedChange={(checked) => handleCheckChange('fuel', checked as boolean)}
                />
                <Label htmlFor="fuel">Nível de combustível adequado</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tires" 
                  checked={checkItems.tires} 
                  onCheckedChange={(checked) => handleCheckChange('tires', checked as boolean)}
                />
                <Label htmlFor="tires">Pneus calibrados</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="lights" 
                  checked={checkItems.lights} 
                  onCheckedChange={(checked) => handleCheckChange('lights', checked as boolean)}
                />
                <Label htmlFor="lights">Lanternas e faróis funcionando</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="equipment" 
                  checked={checkItems.equipment} 
                  onCheckedChange={(checked) => handleCheckChange('equipment', checked as boolean)}
                />
                <Label htmlFor="equipment">Equipamentos obrigatórios (triângulo, estepe, macaco)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="documentation" 
                  checked={checkItems.documentation} 
                  onCheckedChange={(checked) => handleCheckChange('documentation', checked as boolean)}
                />
                <Label htmlFor="documentation">Documentação do veículo completa</Label>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observações Adicionais</Label>
            <Textarea
              id="observations"
              placeholder="Adicione observações relevantes aqui..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={4}
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Fotos de Avarias</h3>
            
            <div className="grid gap-4">
              <div className="flex items-center">
                <Button variant="outline" className="mr-2" onClick={() => document.getElementById('photo-upload')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Adicionar Fotos
                </Button>
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
                <span className="text-sm text-gray-500">Fotos antes da saída do veículo</span>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((src, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={src} 
                        alt={`Avaria ${index + 1}`} 
                        className="rounded-md h-32 w-full object-cover"
                      />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Driver Signature */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Assinatura do Motorista</h3>
            
            <div className="border rounded-md p-2">
              <div className="bg-gray-50 rounded border border-dashed border-gray-300 h-40 flex items-center justify-center overflow-hidden">
                {signatureURL ? (
                  <img src={signatureURL} alt="Assinatura" className="max-h-full" />
                ) : (
                  <div className="h-full w-full">
                    <SignatureCanvas
                      ref={(ref) => setSignatureRef(ref)}
                      canvasProps={{
                        className: 'signature-canvas',
                      }}
                      backgroundColor='rgba(245, 245, 245, 0.5)'
                    />
                  </div>
                )}
              </div>
              
              <div className="flex mt-2 space-x-2">
                <Button variant="outline" size="sm" onClick={clearSignature}>
                  <X className="h-4 w-4 mr-1" /> Limpar
                </Button>
                {!signatureURL && (
                  <Button variant="outline" size="sm" onClick={saveSignature}>
                    <Check className="h-4 w-4 mr-1" /> Confirmar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? 'Salvando...' : 'Finalizar Checklist'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Checklist;
