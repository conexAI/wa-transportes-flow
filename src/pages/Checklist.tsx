
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pageTransition, fadeInUp, staggerContainer } from '@/utils/animations';
import { checklistItems, drivers, vehicles } from '@/utils/mockData';
import { toast } from 'sonner';
import { Check, Image, Trash2, Upload } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

const Checklist = () => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [checkItems, setCheckItems] = useState<{ [key: string]: boolean }>({});
  const [observations, setObservations] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleCheckChange = (id: string, checked: boolean) => {
    setCheckItems((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...newFiles]);
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  const removeImage = (index: number) => {
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const clearSignature = () => {
    sigCanvasRef.current?.clear();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!selectedDriver) {
      toast.error('Por favor, selecione um motorista');
      return;
    }
    
    if (!selectedVehicle) {
      toast.error('Por favor, selecione um veículo');
      return;
    }
    
    // Check if signature exists
    if (sigCanvasRef.current?.isEmpty()) {
      toast.error('Por favor, adicione a assinatura do motorista');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Success message
      toast.success('Checklist salvo com sucesso!');
      
      // Reset form
      setSelectedDriver('');
      setSelectedVehicle('');
      setCheckItems({});
      setObservations('');
      setImages([]);
      setPreviewUrls([]);
      clearSignature();
    }, 1500);
  };
  
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold text-gray-800">Checklist de Saída de Veículos</h1>
        <p className="text-gray-600">Preencha os campos abaixo para concluir o checklist de saída</p>
      </motion.div>
      
      <form onSubmit={handleSubmit}>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* Driver and Vehicle Selection */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Selecione o Motorista</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar motorista" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id.toString()}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Selecione o Veículo</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.plate} - {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Checklist Items */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Itens do Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {checklistItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={checkItems[item.id] || false}
                      onCheckedChange={(checked) => 
                        handleCheckChange(item.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={item.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
                
                <div className="pt-4">
                  <Label htmlFor="observations" className="text-sm font-medium mb-2 block">
                    Observações adicionais
                  </Label>
                  <Textarea
                    id="observations"
                    placeholder="Digite observações adicionais, se necessário"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="resize-none"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Image Upload */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fotos de Avarias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Input
                      ref={fileInputRef}
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Adicionar Fotos
                    </Button>
                    <span className="ml-4 text-sm text-gray-500">
                      {images.length} {images.length === 1 ? 'foto' : 'fotos'} selecionada(s)
                    </span>
                  </div>
                  
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="h-32 w-full object-cover rounded-md border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Signature */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assinatura do Motorista</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-md bg-gray-50 h-44 flex items-center justify-center overflow-hidden">
                    <SignatureCanvas
                      ref={sigCanvasRef}
                      canvasProps={{
                        className: 'signature-canvas',
                        width: 600,
                        height: 200,
                        style: { width: '100%', height: '100%' }
                      }}
                      backgroundColor="rgba(247, 248, 249, 0)"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearSignature}
                    >
                      Limpar Assinatura
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Submit Button */}
          <motion.div variants={fadeInUp} className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-wa-default hover:bg-blue-700"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Finalizar Checklist
                </span>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Checklist;
