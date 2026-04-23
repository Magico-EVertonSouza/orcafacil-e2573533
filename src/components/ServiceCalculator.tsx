import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ServiceType, Wall, Room, RegionPricing, ServiceCalculation } from "@/types";

import { getServiceInfo } from "@/utils/serviceData";
import { calculateRoomTotalArea, calculateTotalPrice, formatNumber, formatCurrency } from "@/utils/calculationUtils";

// 🔥 AGORA USAMOS O ENGINE CERTO (NÃO MAIS calculateMaterials)
import calculateForUser from "@/utils/calculationEngine";

import { getCountries, getRegionsByCountry } from "@/utils/regionData";
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

  // 🔥 NOVO: modo pladur (parede ou teto)
  const [pladurMode, setPladurMode] = useState<"parede" | "teto">("parede");

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

  /**
   * =========================================
   * VALIDAÇÃO
   * =========================================
   */
  const validateRooms = (): boolean => {
    for (const room of roomDrafts) {
      for (const wall of room.walls) {
        const w = parseFloat(wall.width);
        const h = parseFloat(wall.height);

        if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0) {
          toast({
            title: "Dimensões inválidas",
            description: `Preencha corretamente "${room.name}".`,
            variant: "destructive",
          });
          return false;
        }
      }
    }
    return true;
  };

  /**
   * =========================================
   * BUILD FINAL DO ORÇAMENTO
   * =========================================
   */
  const buildCalculation = (): ServiceCalculation | null => {
    if (!selectedRegion) return null;

    const rooms: Room[] = roomDrafts.map(draft => {
      const walls: Wall[] = draft.walls.map(w => {
        const width = parseFloat(w.width);
        const height = parseFloat(w.height);

        return {
          id: w.id,
          width,
          height,
          area: width * height,
        };
      });

      const totalArea = calculateRoomTotalArea(walls);

      /**
       * 🔥 AQUI ESTÁ A CORREÇÃO PRINCIPAL:
       * usamos o ENGINE com suporte a "parede / teto"
       */
      const result = calculateForUser(
        serviceType,
        totalArea,
        selectedRegion,
        serviceType === "pladur" ? pladurMode : undefined
      );

      const totalPrice = calculateTotalPrice(result.materials);

      return {
        id: draft.id,
        name: draft.name,
        walls,
        totalArea,
        materials: result.materials,
        totalPrice,
      };
    });

    const totalArea = rooms.reduce((sum, r) => sum + r.totalArea, 0);

    const allResult = calculateForUser(
      serviceType,
      totalArea,
      selectedRegion,
      serviceType === "pladur" ? pladurMode : undefined
    );

    const totalPrice = calculateTotalPrice(allResult.materials);

    return {
      id: uuidv4(),
      type: serviceType,
      rooms,
      totalArea,
      materials: allResult.materials,
      totalPrice,
      regionPricing: selectedRegion,
      width: 0,
      height: 0,
      area: totalArea,
    };
  };

  /**
   * =========================================
   * HANDLERS
   * =========================================
   */
  const handleNextToRooms = () => {
    if (!selectedRegion) {
      toast({
        title: "Selecione a região",
        description: "Escolha país e região antes de continuar.",
        variant: "destructive",
      });
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
      
      {/* HEADER */}
      <CardHeader className={cn("flex flex-row items-center gap-4", serviceInfo.backgroundColor)}>
        <div className="rounded-full p-2 bg-white">
          <Icon size={24} />
        </div>
        <CardTitle>Calcular {serviceInfo.name}</CardTitle>
      </CardHeader>

      <CardContent className="pt-6">

        {/* 🔥 PLADUR MODE SELECTOR (NOVO) */}
        {serviceType === "pladur" && (
          <div className="mb-4 space-y-2">
            <Label>Tipo de Pladur</Label>
            <Select value={pladurMode} onValueChange={(v: "parede" | "teto") => setPladurMode(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parede">Parede</SelectItem>
                <SelectItem value="teto">Teto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* REGION */}
        {step === "region" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <p className="text-sm text-muted-foreground">
                Escolha região para preços localizados
              </p>
            </div>

            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="País" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCountry && (
              <Select value={selectedRegion?.region ?? ""} onValueChange={handleRegionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Região" />
                </SelectTrigger>
                <SelectContent>
                  {getRegionsByCountry(selectedCountry).map(r => (
                    <SelectItem key={r.region} value={r.region}>{r.region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* (ROOMS E REVIEW NÃO MEXIDOS PARA NÃO POLUIR) */}
        {step === "rooms" && <div>/* igual ao teu original */</div>}
        {step === "review" && calculation && <div>/* igual ao teu original */</div>}

      </CardContent>

      {/* FOOTER */}
      <CardFooter className="flex justify-between">

        {step === "region" && (
          <>
            <Button variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button onClick={handleNextToRooms}>Próximo</Button>
          </>
        )}

        {step === "rooms" && (
          <>
            <Button variant="outline" onClick={() => setStep("region")}>Voltar</Button>
            <Button onClick={handleNextToReview}>Revisar</Button>
          </>
        )}

        {step === "review" && (
          <>
            <Button variant="outline" onClick={() => setStep("rooms")}>Voltar</Button>
            <Button onClick={handleSubmit}>Adicionar ao orçamento</Button>
          </>
        )}

      </CardFooter>
    </Card>
  );
};

export default ServiceCalculator;
