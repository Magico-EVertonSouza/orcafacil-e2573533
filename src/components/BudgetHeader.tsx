
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from "lucide-react";

interface BudgetHeaderProps {
  mode: "create" | "editing";
  title?: string;
  clientName?: string;
  status?: string;
  onCreate?: (title: string, clientName?: string) => void;
}

const BudgetHeader = ({ mode, title, clientName, status, onCreate }: BudgetHeaderProps) => {
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("");

  const handleCreate = () => {
    if (!newTitle.trim() || !onCreate) return;
    onCreate(newTitle.trim(), newClient.trim() || undefined);
  };

  if (mode === "create") {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            Criar Novo Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="budget-title">Nome do Orçamento *</Label>
            <Input
              id="budget-title"
              placeholder="Ex: Casa João, Obra Maria..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="client-name">Nome do Cliente (opcional)</Label>
            <Input
              id="client-name"
              placeholder="Ex: João Silva"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} disabled={!newTitle.trim()}>
            <FileText size={16} className="mr-2" />
            Criar Orçamento
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <FileText size={24} />
          {title}
          <Badge variant={status === "finalizado" ? "default" : "secondary"}>
            {status || "rascunho"}
          </Badge>
        </h1>
        {clientName && (
          <p className="text-muted-foreground mt-1">Cliente: {clientName}</p>
        )}
      </div>
    </div>
  );
};

export default BudgetHeader;
