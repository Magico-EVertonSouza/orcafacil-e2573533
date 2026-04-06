import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceType, Wall, Room, RegionPricing, ServiceCalculation } from "@/types";
import { getServiceInfo } from "@/utils/serviceData";
import { calculateRoomTotalArea, calculateMaterials, calculateTotalPrice, formatNumber, formatCurrency } from "@/utils/calculationUtils";
import { getCountries, getRegionsByCountry, getDefaultRegion } from "@/utils/regionData";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2, ChevronRight, ChevronLeft, MapPin } from "lucide-react";

interface ServiceCalculatorProps {
  serviceType: ServiceType;
  onAddService: (calculation: ServiceCalculation) => void;
  onCancel: () => void;
}

type Step = "region" | "rooms" | "review";

interface RoomDraft {
  id: string;
  name: string;
  walls: WallDraft[];
}

interface WallDraft {
  id: string;
  width: string;
  height: string;
}

const ServiceCalculator = ({ serviceType, onAddService, onCancel }: ServiceCalculatorProps) => {
  const { toast } = useToast();
  const serviceInfo = getServiceInfo(serviceType);
  const Icon = serviceInfo.icon;

  const [step, setStep] = useState<Step>("region");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<RegionPricing | null>(null);

  const [roomDrafts, setRoomDrafts] = useState<RoomDraft[]>([
    { id: uuidv4(), name: "Cômodo 1", walls: [{ id: uuidv4(), width: "", height: "" }] },
  ]);

  const countries = getCountries();

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedRegion(null);
  };

  const handleRegionChange = (regionLabel: string) => {
    const regionsList = getRegionsByCountry(selectedCountry);
    const found = regionsList.find(r => r.region === regionLabel);
    if (found) setSelectedRegion(found);
  };

  // Room management
  const addRoom = () => {
    setRoomDrafts(prev => [
      ...prev,
      { id: uuidv4(), name: `Cômodo ${prev.length + 1}`, walls: [{ id: uuidv4(), width: "", height: "" }] },
    ]);
  };

  const removeRoom = (roomId: string) => {
    if (roomDrafts.length <= 1) return;
    setRoomDrafts(prev => prev.filter(r => r.id !== roomId));
  };

  const updateRoomName = (roomId: string, name: string) => {
    setRoomDrafts(prev => prev.map(r => r.id === roomId ? { ...r, name } : r));
  };

  // Wall management
  const addWall = (roomId: string) => {
    setRoomDrafts(prev => prev.map(r =>
      r.id === roomId ? { ...r, walls: [...r.walls, { id: uuidv4(), width: "", height: "" }] } : r
    ));
  };

  const removeWall = (roomId: string, wallId: string) => {
    setRoomDrafts(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      if (r.walls.length <= 1) return r;
      return { ...r, walls: r.walls.filter(w => w.id !== wallId) };
    }));
  };

  const updateWall = (roomId: string, wallId: string, field: "width" | "height", value: string) => {
    setRoomDrafts(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      return { ...r, walls: r.walls.map(w => w.id === wallId ? { ...w, [field]: value } : w) };
    }));
  };

  const isPiso = serviceType === "piso";

  const validateRooms = (): boolean => {
    for (const room of roomDrafts) {
      for (const wall of room.walls) {
        const w = parseFloat(wall.width);
        const h = parseFloat(wall.height);
        if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0) {
          toast({
            title: "Dimensões inválidas",
            description: `Preencha todas as dimensões de "${room.name}" com valores maiores que zero.`,
            variant: "destructive",
          });
          return false;
        }
        if (w > 100 || h > 100) {
          toast({
            title: "Dimensão muito grande",
            description: `Valores acima de 100 metros não são permitidos.`,
            variant: "destructive",
          });
          return false;
        }
      }
    }
    return true;
  };

  const buildCalculation = (): ServiceCalculation | null => {
    if (!selectedRegion) return null;

    const rooms: Room[] = roomDrafts.map(draft => {
      const walls: Wall[] = draft.walls.map(w => {
        const width = parseFloat(w.width);
        const height = parseFloat(w.height);
        return { id: w.id, width, height, area: width * height };
      });
      const totalArea = calculateRoomTotalArea(walls);
      const materials = calculateMaterials(serviceType, totalArea, selectedRegion);
      const totalPrice = calculateTotalPrice(materials);
      return { id: draft.id, name: draft.name, walls, totalArea, materials, totalPrice };
    });

    const totalArea = rooms.reduce((sum, r) => sum + r.totalArea, 0);
    const allMaterials = calculateMaterials(serviceType, totalArea, selectedRegion);
    const totalPrice = calculateTotalPrice(allMaterials);

    return {
      id: uuidv4(),
      type: serviceType,
      rooms,
      totalArea,
      materials: allMaterials,
      totalPrice,
      regionPricing: selectedRegion,
      width: 0,
      height: 0,
      area: totalArea,
    };
  };

  const handleNextToRooms = () => {
    if (!selectedRegion) {
      toast({ title: "Selecione a região", description: "Escolha o país e a região antes de continuar.", variant: "destructive" });
      return;
    }
    setStep("rooms");
  };

  const handleNextToReview = () => {
    if (!validateRooms()) return;
    setStep("review");
  };

  const handleSubmit = () => {
    const calc = buildCalculation();
    if (calc) onAddService(calc);
  };

  const calculation = step === "review" ? buildCalculation() : null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className={cn("flex flex-row items-center gap-4", serviceInfo.backgroundColor)}>
        <div className="rounded-full p-2 bg-white">
          <Icon size={24} className="text-orcafacil-blue" />
        </div>
        <CardTitle>Calcular {serviceInfo.name}</CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          {(["region", "rooms", "review"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={cn(
                "rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold",
                step === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </span>
              <span className={cn("hidden sm:inline", step === s ? "font-semibold" : "text-muted-foreground")}>
                {s === "region" ? "Região" : s === "rooms" ? "Cômodos" : "Resumo"}
              </span>
              {i < 2 && <ChevronRight size={14} className="text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* Step 1: Region */}
        {step === "region" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-primary" />
              <p className="text-sm text-muted-foreground">Selecione o país e região para preços localizados.</p>
            </div>
            <div className="space-y-2">
              <Label>País</Label>
              <Select value={selectedCountry} onValueChange={handleCountryChange}>
                <SelectTrigger><SelectValue placeholder="Selecione o país" /></SelectTrigger>
                <SelectContent>
                  {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {selectedCountry && (
              <div className="space-y-2">
                <Label>Região</Label>
                <Select value={selectedRegion?.region ?? ""} onValueChange={handleRegionChange}>
                  <SelectTrigger><SelectValue placeholder="Selecione a região" /></SelectTrigger>
                  <SelectContent>
                    {getRegionsByCountry(selectedCountry).map(r => (
                      <SelectItem key={r.region} value={r.region}>{r.region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Rooms & Walls */}
        {step === "rooms" && (
          <div className="space-y-6">
            {roomDrafts.map((room, roomIdx) => (
              <div key={room.id} className="border rounded-lg p-4 space-y-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label htmlFor={`room-name-${room.id}`} className="text-xs text-muted-foreground">Nome do cômodo</Label>
                    <Input
                      id={`room-name-${room.id}`}
                      value={room.name}
                      onChange={e => updateRoomName(room.id, e.target.value)}
                      placeholder="Ex: Sala, Quarto 1"
                      maxLength={50}
                    />
                  </div>
                  {roomDrafts.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRoom(room.id)} className="mt-4">
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    {isPiso ? "Áreas do piso" : "Paredes"}
                  </Label>
                  {room.walls.map((wall, wallIdx) => (
                    <div key={wall.id} className="flex items-end gap-2">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs text-muted-foreground">Largura (m)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="100"
                          placeholder="Ex: 3.5"
                          value={wall.width}
                          onChange={e => updateWall(room.id, wall.id, "width", e.target.value)}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          {isPiso ? "Comprimento (m)" : "Altura (m)"}
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="100"
                          placeholder="Ex: 2.8"
                          value={wall.height}
                          onChange={e => updateWall(room.id, wall.id, "height", e.target.value)}
                        />
                      </div>
                      {room.walls.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeWall(room.id, wall.id)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addWall(room.id)} className="flex items-center gap-1">
                    <Plus size={14} />
                    {isPiso ? "Adicionar área" : "Adicionar parede"}
                  </Button>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addRoom} className="flex items-center gap-2 w-full">
              <Plus size={16} />
              Adicionar cômodo
            </Button>
          </div>
        )}

        {/* Step 3: Review */}
        {step === "review" && calculation && (
          <div className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-md text-sm">
              <span className="font-medium">Região:</span> {selectedRegion?.region}, {selectedRegion?.country} ({selectedRegion?.currency})
            </div>
            {calculation.rooms.map(room => (
              <div key={room.id} className="border rounded-lg p-4 space-y-2">
                <h4 className="font-semibold">{room.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {room.walls.length} {isPiso ? (room.walls.length === 1 ? "área" : "áreas") : (room.walls.length === 1 ? "parede" : "paredes")} — Área total: {formatNumber(room.totalArea)} m²
                </p>
                <div className="text-sm space-y-1">
                  {room.walls.map((wall, i) => (
                    <span key={wall.id} className="inline-block mr-3 text-muted-foreground">
                      {isPiso ? `Área ${i+1}` : `Parede ${i+1}`}: {formatNumber(wall.width)}m × {formatNumber(wall.height)}m = {formatNumber(wall.area)} m²
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Área total do serviço</p>
              <p className="text-xl font-bold">{formatNumber(calculation.totalArea)} m²</p>
              <p className="text-sm text-muted-foreground mt-2">Total estimado</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(calculation.totalPrice, selectedRegion?.currency, selectedRegion?.locale)}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {step === "region" && (
          <>
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button onClick={handleNextToRooms} disabled={!selectedRegion}>
              Próximo <ChevronRight size={16} />
            </Button>
          </>
        )}
        {step === "rooms" && (
          <>
            <Button type="button" variant="outline" onClick={() => setStep("region")}>
              <ChevronLeft size={16} /> Voltar
            </Button>
            <Button onClick={handleNextToReview}>
              Revisar <ChevronRight size={16} />
            </Button>
          </>
        )}
        {step === "review" && (
          <>
            <Button type="button" variant="outline" onClick={() => setStep("rooms")}>
              <ChevronLeft size={16} /> Voltar
            </Button>
            <Button onClick={handleSubmit}>
              Adicionar ao Orçamento
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServiceCalculator;
