
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface RoomCounterProps {
  onRoomCountConfirm: (count: number) => void;
  onCancel: () => void;
  serviceType: string;
}

const RoomCounter = ({ onRoomCountConfirm, onCancel, serviceType }: RoomCounterProps) => {
  const [roomCount, setRoomCount] = useState<string>("1");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const count = parseInt(roomCount, 10);
    
    if (isNaN(count) || count < 1) {
      toast({
        title: "Valor inválido",
        description: "Por favor, informe um número válido de cômodos maior que zero.",
        variant: "destructive",
      });
      return;
    }
    
    if (count > 10) {
      toast({
        title: "Muitos cômodos",
        description: "Para melhor performance, limite a 10 cômodos por orçamento.",
        variant: "destructive",
      });
      return;
    }

    onRoomCountConfirm(count);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="bg-service-base">
        <CardTitle>Configurar Cômodos</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomCount">
              {serviceType === 'piso' 
                ? 'Quantas áreas de piso deseja calcular?' 
                : 'Quantos cômodos deseja calcular?'}
            </Label>
            <Input
              id="roomCount"
              type="number"
              min="1"
              max="10"
              placeholder="Ex: 3"
              value={roomCount}
              onChange={(e) => setRoomCount(e.target.value)}
            />
          </div>
          <p className="text-sm text-gray-500">
            {serviceType === 'piso'
              ? 'Você poderá adicionar múltiplas áreas para cada ambiente.'
              : 'Você poderá adicionar múltiplas paredes para cada cômodo.'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Continuar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RoomCounter;
