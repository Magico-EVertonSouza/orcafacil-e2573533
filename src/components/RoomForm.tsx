
import { useState } from "react";
import { Room, Wall } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createWall, calculateWallArea, formatNumber } from "@/utils/calculationUtils";
import { Trash, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RoomFormProps {
  onRoomComplete: (room: Room) => void;
  onCancel: () => void;
  serviceType: string;
}

const RoomForm = ({ onRoomComplete, onCancel, serviceType }: RoomFormProps) => {
  const [roomName, setRoomName] = useState("");
  const [walls, setWalls] = useState<Wall[]>([{ id: uuidv4(), width: 0, height: 0, area: 0 }]);
  const { toast } = useToast();

  const addWall = () => {
    setWalls([...walls, { id: uuidv4(), width: 0, height: 0, area: 0 }]);
  };

  const removeWall = (id: string) => {
    if (walls.length <= 1) {
      toast({
        title: "Não é possível remover",
        description: "Você precisa ter pelo menos uma parede.",
        variant: "destructive",
      });
      return;
    }
    setWalls(walls.filter(wall => wall.id !== id));
  };

  const updateWall = (id: string, field: 'width' | 'height', value: number) => {
    setWalls(walls.map(wall => {
      if (wall.id === id) {
        const updatedWall = { 
          ...wall, 
          [field]: value 
        };
        updatedWall.area = calculateWallArea(updatedWall.width, updatedWall.height);
        return updatedWall;
      }
      return wall;
    }));
  };

  const calculateTotalArea = () => {
    return walls.reduce((total, wall) => total + wall.area, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!roomName.trim()) {
      toast({
        title: "Nome do cômodo obrigatório",
        description: "Por favor, dê um nome ao cômodo.",
        variant: "destructive",
      });
      return;
    }

    let hasError = false;
    walls.forEach((wall, index) => {
      if (wall.width <= 0 || wall.height <= 0) {
        toast({
          title: `Medidas inválidas na ${index + 1}ª parede`,
          description: "Largura e altura devem ser maiores que zero.",
          variant: "destructive",
        });
        hasError = true;
      }
    });

    if (hasError) return;

    const room: Room = {
      id: uuidv4(),
      name: roomName,
      walls: [...walls],
      totalArea: calculateTotalArea()
    };

    onRoomComplete(room);
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="bg-service-base">
        <CardTitle>{serviceType === 'piso' ? 'Adicionar Cômodo para Piso' : 'Adicionar Cômodo'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">Nome do Cômodo</Label>
            <Input
              id="roomName"
              placeholder="Ex: Sala, Quarto 1, Cozinha"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>{serviceType === 'piso' ? 'Áreas do Piso' : 'Paredes do Cômodo'}</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addWall}
                className="flex items-center gap-1"
              >
                <Plus size={16} />
                <span>Adicionar {serviceType === 'piso' ? 'Área' : 'Parede'}</span>
              </Button>
            </div>

            {walls.map((wall, index) => (
              <div key={wall.id} className="border p-4 rounded-md space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{serviceType === 'piso' ? `Área ${index + 1}` : `Parede ${index + 1}`}</h4>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeWall(wall.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`width-${wall.id}`}>
                      {serviceType === 'piso' ? 'Largura (m)' : 'Largura (m)'}
                    </Label>
                    <Input
                      id={`width-${wall.id}`}
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Ex: 3.5"
                      value={wall.width || ''}
                      onChange={(e) => updateWall(wall.id, 'width', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`height-${wall.id}`}>
                      {serviceType === 'piso' ? 'Comprimento (m)' : 'Altura (m)'}
                    </Label>
                    <Input
                      id={`height-${wall.id}`}
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Ex: 2.8"
                      value={wall.height || ''}
                      onChange={(e) => updateWall(wall.id, 'height', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {wall.width > 0 && wall.height > 0 && (
                  <div className="bg-gray-50 p-2 rounded text-sm">
                    Área: {formatNumber(wall.area)} m²
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gray-100 p-3 rounded-md mt-4">
            <p className="text-sm font-medium">
              Área total do cômodo: <span className="font-bold">{formatNumber(calculateTotalArea())} m²</span>
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Cômodo
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RoomForm;
