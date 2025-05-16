
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceCalculation } from "@/types";
import { getServiceInfo } from "@/utils/serviceData";
import { formatCurrency, formatNumber } from "@/utils/calculationUtils";
import MaterialsList from "@/components/MaterialsList";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceItemProps {
  service: ServiceCalculation;
  onRemove: (id: string) => void;
}

const ServiceItem = ({ service, onRemove }: ServiceItemProps) => {
  const serviceInfo = getServiceInfo(service.type);
  const Icon = serviceInfo.icon;

  return (
    <Card className="mb-4">
      <CardHeader className={cn("flex flex-row items-center justify-between", serviceInfo.backgroundColor)}>
        <div className="flex items-center gap-3">
          <div className="rounded-full p-2 bg-white">
            <Icon size={20} className="text-orcafacil-blue" />
          </div>
          <CardTitle className="text-lg">{serviceInfo.name}</CardTitle>
        </div>
        <div className="text-sm text-gray-600">
          {formatNumber(service.width)}m x {formatNumber(service.height)}m = {formatNumber(service.area)}m²
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <MaterialsList materials={service.materials} showPrices={true} />
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-3">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onRemove(service.id)}
          className="flex items-center gap-1"
        >
          <Trash size={16} />
          <span>Remover</span>
        </Button>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total deste serviço:</p>
          <p className="font-bold text-lg">{formatCurrency(service.totalPrice)}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceItem;
