
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceCalculation } from "@/types";
import { getServiceInfo } from "@/utils/serviceData";
import { formatCurrency, formatNumber } from "@/utils/calculationUtils";
import MaterialsList from "@/components/MaterialsList";
import { Trash, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ServiceItemProps {
  service: ServiceCalculation;
  onRemove: (id: string) => void;
}

const ServiceItem = ({ service, onRemove }: ServiceItemProps) => {
  const serviceInfo = getServiceInfo(service.type);
  const Icon = serviceInfo.icon;
  const { currency, locale, region, country } = service.regionPricing;
  const isPiso = service.type === "piso";

  return (
    <Card className="mb-4">
      <CardHeader className={cn("flex flex-row items-center justify-between flex-wrap gap-2", serviceInfo.backgroundColor)}>
        <div className="flex items-center gap-3">
          <div className="rounded-full p-2 bg-white">
            <Icon size={20} className="text-orcafacil-blue" />
          </div>
          <div>
            <CardTitle className="text-lg">{serviceInfo.name}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin size={12} />
              <span>{region}, {country}</span>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {service.rooms.length} {service.rooms.length === 1 ? "cômodo" : "cômodos"} — {formatNumber(service.totalArea)} m²
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <Accordion type="multiple" className="w-full">
          {service.rooms.map((room, idx) => (
            <AccordionItem key={room.id} value={room.id}>
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center justify-between w-full pr-2">
                  <span>{room.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatNumber(room.totalArea)} m² — {formatCurrency(room.totalPrice, currency, locale)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mb-2 text-xs text-muted-foreground space-y-1">
                  {room.walls.map((wall, i) => (
                    <div key={wall.id}>
                      {isPiso ? `Área ${i + 1}` : `Parede ${i + 1}`}: {formatNumber(wall.width)}m × {formatNumber(wall.height)}m = {formatNumber(wall.area)} m²
                    </div>
                  ))}
                </div>
                <MaterialsList materials={room.materials} showPrices={true} currency={currency} locale={locale} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {service.rooms.length > 1 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">Materiais consolidados (total)</h4>
            <MaterialsList materials={service.materials} showPrices={true} currency={currency} locale={locale} />
          </div>
        )}
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
          <p className="text-sm text-muted-foreground">Total deste serviço:</p>
          <p className="font-bold text-lg">{formatCurrency(service.totalPrice, currency, locale)}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceItem;
