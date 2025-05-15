
import { useState } from 'react';
import { regions } from '@/utils/regionData';
import { Region } from '@/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RegionSelectorProps {
  onRegionSelect: (region: Region) => void;
  selectedRegion: Region;
}

const RegionSelector = ({ onRegionSelect, selectedRegion }: RegionSelectorProps) => {
  const handleRegionChange = (value: string) => {
    const region = regions.find(r => r.code === value);
    if (region) {
      onRegionSelect(region);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="bg-service-base">
        <CardTitle>Selecione a Região</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="region">País/Região</Label>
          <Select 
            value={selectedRegion.code} 
            onValueChange={handleRegionChange}
          >
            <SelectTrigger id="region" className="w-full">
              <SelectValue placeholder="Selecione um país/região" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.code} value={region.code}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-2">
            Os preços dos materiais serão ajustados conforme a região selecionada.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionSelector;
