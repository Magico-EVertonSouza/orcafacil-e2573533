
import { Room } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatNumber } from "@/utils/calculationUtils";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";

interface RoomsListProps {
  rooms: Room[];
  onRemoveRoom: (id: string) => void;
  serviceType: string;
}

const RoomsList = ({ rooms, onRemoveRoom, serviceType }: RoomsListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {rooms.length} {rooms.length === 1 ? 'Cômodo' : 'Cômodos'} Adicionados
      </h3>
      
      {rooms.map(room => (
        <Card key={room.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 py-3 px-4 flex flex-row justify-between items-center">
            <div>
              <h4 className="font-medium text-base">{room.name}</h4>
              <p className="text-sm text-gray-600">
                {room.walls.length} {serviceType === 'piso' ? 'áreas' : 'paredes'}, 
                {' '}Total: {formatNumber(room.totalArea)} m²
              </p>
            </div>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => onRemoveRoom(room.id)}
              className="h-8 w-8 p-0"
            >
              <Trash size={16} />
            </Button>
          </CardHeader>
          <CardContent className="py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {room.walls.map((wall, index) => (
                <div key={wall.id} className="text-sm p-2 border rounded bg-gray-50">
                  <p className="font-medium">
                    {serviceType === 'piso' ? `Área ${index + 1}` : `Parede ${index + 1}`}:
                  </p>
                  <p className="text-gray-600">
                    {formatNumber(wall.width)}m × {formatNumber(wall.height)}m = {formatNumber(wall.area)}m²
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoomsList;
