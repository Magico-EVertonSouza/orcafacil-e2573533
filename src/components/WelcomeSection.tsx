import { ClipboardList, Hammer, Ruler, FileCheck } from "lucide-react";
import logo from "@/assets/logo-orcafacil.png";

const steps = [
  {
    icon: ClipboardList,
    title: "Crie seu orçamento",
    description: "Dê um nome ao projeto e informe o cliente para começar.",
    color: "bg-service-pintura",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
  },
  {
    icon: Hammer,
    title: "Escolha os serviços",
    description: "Selecione reboco, pintura, piso, alvenaria e muito mais.",
    color: "bg-service-reboco",
    iconColor: "text-green-600",
    borderColor: "border-green-200",
  },
  {
    icon: Ruler,
    title: "Informe as medidas",
    description: "Adicione cômodos e paredes com as dimensões reais da obra.",
    color: "bg-service-piso",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200",
  },
  {
    icon: FileCheck,
    title: "Receba o resultado",
    description: "Veja materiais, custos e exporte por PDF ou WhatsApp.",
    color: "bg-service-alvenaria",
    iconColor: "text-violet-600",
    borderColor: "border-violet-200",
  },
];

const WelcomeSection = () => {
  return (
    <div className="mb-10">
      <div className="text-center mb-10 animate-fade-in">
        <img src={logo} alt="Logo OrçaFácil" width={80} height={80} className="mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Olá! Bem-vindo ao{" "}
          <span className="text-orcafacil-blue">OrçaFácil</span> 👋
        </h1>
        <p className="text-base text-muted-foreground max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
          Monte orçamentos profissionais para construção civil em minutos.
          <br />
          Siga os <strong>4 passos</strong> abaixo para começar:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`relative rounded-2xl border-2 ${step.borderColor} ${step.color} p-6 text-center shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 animate-fade-in`}
            style={{ animationDelay: `${300 + index * 120}ms`, animationFillMode: "both" }}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-orcafacil-blue text-white text-sm font-bold flex items-center justify-center shadow-md">
              {index + 1}
            </div>
            <div className={`mx-auto mb-3 w-14 h-14 rounded-xl bg-white/80 flex items-center justify-center shadow-sm ${step.iconColor}`}>
              <step.icon size={28} />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSection;
