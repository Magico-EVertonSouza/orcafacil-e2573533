
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Material } from "@/types";
import { formatCurrency, formatNumber } from "@/utils/calculationUtils";

interface MaterialsListProps {
  materials: Material[];
  showPrices?: boolean;
  currency?: string;
  locale?: string;
}

const MaterialsList = ({ materials, showPrices = true, currency = "EUR", locale = "pt-PT" }: MaterialsListProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead>Unidade</TableHead>
            {showPrices && (
              <>
                <TableHead className="text-right">Preço Unit.</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{material.name}</TableCell>
              <TableCell className="text-right">{formatNumber(material.quantity)}</TableCell>
              <TableCell>{material.unit}</TableCell>
              {showPrices && (
                <>
                  <TableCell className="text-right">{formatCurrency(material.pricePerUnit, currency, locale)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(material.quantity * material.pricePerUnit, currency, locale)}</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaterialsList;
