
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
      className="container px-4 sm:px-6 mx-auto py-6 max-w-3xl"
    >
      <Card className="mb-6 w-full overflow-hidden">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">Checklist de Saída de Veículos</CardTitle>
          <CardDescription className="text-sm sm:text-base break-words">
            Preencha todos os dados abaixo antes da saída do veículo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-4 sm:px-6">
          {/* Driver Selection */}
          <div className="space-y-2 w-full">
            <Label htmlFor="driver" className="text-sm sm:text-base">Motorista</Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger className="w-full min-h-12">
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
          <div className="space-y-2 w-full">
            <Label htmlFor="vehicle" className="text-sm sm:text-base">Veículo</Label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger className="w-full min-h-12">
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
          <div className="space-y-4 w-full">
            <h3 className="text-base sm:text-lg font-medium">Itens de Verificação</h3>
            
            <div className="grid gap-4 w-full">
              {Object.entries({
                fuel: "Nível de combustível adequado",
                tires: "Pneus calibrados",
                lights: "Lanternas e faróis funcionando",
                equipment: "Equipamentos obrigatórios (triângulo, estepe, macaco)",
                documentation: "Documentação do veículo completa"
              }).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-3 w-full p-2 hover:bg-muted rounded-md">
                  <div className="min-w-[24px] flex items-center justify-center">
                    <Checkbox 
                      id={key} 
                      checked={checkItems[key as keyof typeof checkItems]} 
                      onCheckedChange={(checked) => handleCheckChange(key, checked as boolean)}
                      className="h-5 w-5"
                    />
                  </div>
                  <Label 
                    htmlFor={key} 
                    className="text-sm sm:text-base flex-1 cursor-pointer overflow-wrap-break-word break-words"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Observations */}
          <div className="space-y-2 w-full">
            <Label htmlFor="observations" className="text-sm sm:text-base">Observações Adicionais</Label>
            <Textarea
              id="observations"
              placeholder="Adicione observações relevantes aqui..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={4}
              className="w-full resize-y"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-4 w-full">
            <h3 className="text-base sm:text-lg font-medium">Fotos de Avarias</h3>
            
            <div className="grid gap-4 w-full">
              <div className="flex flex-wrap gap-2 items-center">
                <Button 
                  variant="outline" 
                  className="h-12 min-w-[140px] flex-shrink-0" 
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                  {images.map((src, index) => (
                    <div key={index} className="relative group w-full aspect-square">
                      <img 
                        src={src} 
                        alt={`Avaria ${index + 1}`} 
                        className="rounded-md h-full w-full object-cover"
                      />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-8 w-8 opacity-90"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Driver Signature */}
          <div className="space-y-4 w-full">
            <h3 className="text-base sm:text-lg font-medium">Assinatura do Motorista</h3>
            
            <div className="border rounded-md p-2 w-full">
              <div className="bg-gray-50 rounded border border-dashed border-gray-300 h-40 flex items-center justify-center overflow-hidden w-full">
                {signatureURL ? (
                  <img src={signatureURL} alt="Assinatura" className="max-h-full max-w-full" />
                ) : (
                  <div className="h-full w-full">
                    <SignatureCanvas
                      ref={(ref) => setSignatureRef(ref)}
                      canvasProps={{
                        className: 'signature-canvas',
                        width: '100%',
                        height: '100%'
                      }}
                      backgroundColor='rgba(245, 245, 245, 0.5)'
                    />
                  </div>
                )}
              </div>
              
              <div className="flex mt-2 space-x-2">
                <Button variant="outline" size="sm" className="h-10 min-w-[100px]" onClick={clearSignature}>
                  <X className="h-4 w-4 mr-1" /> Limpar
                </Button>
                {!signatureURL && (
                  <Button variant="outline" size="sm" className="h-10 min-w-[100px]" onClick={saveSignature}>
                    <Check className="h-4 w-4 mr-1" /> Confirmar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="w-full h-12 text-base"
          >
            {loading ? 'Salvando...' : 'Finalizar Checklist'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Checklist;
