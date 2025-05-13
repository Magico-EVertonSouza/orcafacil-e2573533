
import { Card, CardContent } from "@/components/ui/card";
import { ServiceInfo } from "@/utils/serviceData";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceInfo;
  onClick: () => void;
}

const ServiceCard = ({ service, onClick }: ServiceCardProps) => {
  const Icon = service.icon;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-transform hover:scale-105 border-2",
        service.backgroundColor
      )}
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <div className="rounded-full p-3 bg-white mb-3">
          <Icon size={32} className="text-orcafacil-blue" />
        </div>
        <h3 className="text-lg font-medium mb-1">{service.name}</h3>
        <p className="text-sm text-gray-600">{service.description}</p>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
