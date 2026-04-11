
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, User, ClipboardList } from "lucide-react";
import logo from "@/assets/logo-orcafacil.png";

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
      <Card className="mb-6 overflow-hidden border-2 border-primary/10 shadow-lg">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-5 flex items-center gap-4">
          <div className="bg-primary/10 rounded-xl p-2.5">
            <Plus size={22} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Criar Novo Orçamento</h2>
            <p className="text-sm text-muted-foreground">Preencha os dados abaixo para começar</p>
          </div>
        </div>
        <CardContent className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="budget-title" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ClipboardList size={15} className="text-primary" />
              Nome do Orçamento <span className="text-destructive">*</span>
            </Label>
            <Input
              id="budget-title"
              placeholder="Ex: Casa João, Obra Maria..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-11 text-base border-primary/20 focus-visible:ring-primary/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-name" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User size={15} className="text-primary" />
              Nome do Cliente <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="client-name"
              placeholder="Ex: João Silva"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              className="h-11 text-base border-primary/20 focus-visible:ring-primary/30"
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={!newTitle.trim()}
            size="lg"
            className="w-full text-base font-semibold gap-2 h-12 shadow-md hover:shadow-lg transition-all"
          >
            <FileText size={18} />
            Criar Orçamento
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={logo} alt="OrçaFácil" width={36} height={36} />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
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
    </div>
  );
};

export default BudgetHeader;
