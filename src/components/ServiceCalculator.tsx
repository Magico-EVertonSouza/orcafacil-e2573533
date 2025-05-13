
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceType } from "@/types";
import { getServiceInfo } from "@/utils/serviceData";
import { calculateArea, calculateMaterials, calculateTotalPrice, formatNumber } from "@/utils/calculationUtils";

interface ServiceCalculatorProps {
  serviceType: ServiceType;
  onAddService: (width: number, height: number) => void;
  onCancel: () => void;
}

const ServiceCalculator = ({ serviceType, onAddService, onCancel }: ServiceCalculatorProps) => {
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [area, setArea] = useState<number | null>(null);

  const { toast } = useToast();
  const serviceInfo = getServiceInfo(serviceType);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(e.target.value);
    calculateAreaValue(e.target.value, height);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(e.target.value);
    calculateAreaValue(width, e.target.value);
  };

  const calculateAreaValue = (w: string, h: string) => {
    const widthValue = parseFloat(w);
    const heightValue = parseFloat(h);

    if (!isNaN(widthValue) && !isNaN(heightValue)) {
      setArea(calculateArea(widthValue, heightValue));
    } else {
      setArea(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const widthValue = parseFloat(width);
    const heightValue = parseFloat(height);

    if (isNaN(widthValue) || widthValue <= 0) {
      toast({
        title: "Largura inválida",
        description: "Por favor, informe uma largura válida maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(heightValue) || heightValue <= 0) {
      toast({
        title: "Altura/Comprimento inválido",
        description: "Por favor, informe uma altura ou comprimento válido maior que zero.",
        variant: "destructive",
      });
      return;
    }

    onAddService(widthValue, heightValue);
  };

  const Icon = serviceInfo.icon;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className={cn("flex flex-row items-center gap-4", serviceInfo.backgroundColor)}>
        <div className="rounded-full p-2 bg-white">
          <Icon size={24} className="text-orcafacil-blue" />
        </div>
        <CardTitle>Calcular {serviceInfo.name}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="width">Largura (metros)</Label>
            <Input
              id="width"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Ex: 3.5"
              value={width}
              onChange={handleWidthChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">
              {serviceType === 'piso' ? 'Comprimento (metros)' : 'Altura (metros)'}
            </Label>
            <Input
              id="height"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Ex: 2.8"
              value={height}
              onChange={handleHeightChange}
            />
          </div>
          {area !== null && (
            <div className="bg-orcafacil-light-gray p-3 rounded-md">
              <p className="text-sm font-medium">
                Área total: <span className="font-bold">{formatNumber(area)} m²</span>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={area === null || area <= 0}>
            Adicionar ao Orçamento
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ServiceCalculator;
