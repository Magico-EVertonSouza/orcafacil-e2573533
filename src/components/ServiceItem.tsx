
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceCalculation } from "@/types";
import { getServiceInfo } from "@/utils/serviceData";
import { formatNumber } from "@/utils/calculationUtils";
import { formatCurrencyByRegion } from "@/utils/regionData";
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
          {service.rooms.length} cômodos, área total: {formatNumber(service.totalArea)}m²
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium mb-2">Cômodos:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {service.rooms.map(room => (
              <div key={room.id} className="text-sm border p-2 rounded bg-white">
                <p className="font-medium">{room.name}</p>
                <p className="text-gray-600">
                  {room.walls.length} {service.type === 'piso' ? 'áreas' : 'paredes'}, 
                  total: {formatNumber(room.totalArea)}m²
                </p>
              </div>
            ))}
          </div>
        </div>
        
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
          <p className="font-bold text-lg">
            {formatCurrencyByRegion(service.totalPrice, service.region)}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceItem;
