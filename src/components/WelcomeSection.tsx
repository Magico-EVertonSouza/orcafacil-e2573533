import { ClipboardList, Hammer, Ruler, FileCheck } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Crie seu orçamento",
    description: "Dê um nome ao projeto e informe o cliente para começar.",
  },
  {
    icon: Hammer,
    title: "Escolha os serviços",
    description: "Selecione reboco, pintura, piso, alvenaria e muito mais.",
  },
  {
    icon: Ruler,
    title: "Informe as medidas",
    description: "Adicione cômodos e paredes com as dimensões reais da obra.",
  },
  {
    icon: FileCheck,
    title: "Receba o resultado",
    description: "Veja materiais, custos e exporte por PDF ou WhatsApp.",
  },
];

const WelcomeSection = () => {
  return (
    <div className="mb-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Bem-vindo ao <span className="text-primary">OrçaFácil</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Monte orçamentos profissionais para construção civil em poucos minutos,
          sem complicações. Siga os passos abaixo para começar:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative rounded-xl border bg-card p-5 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow">
              {index + 1}
            </div>
            <step.icon className="mx-auto mb-3 text-primary" size={32} />
            <h3 className="font-semibold mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSection;
