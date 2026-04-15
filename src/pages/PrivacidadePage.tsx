import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Mail, Lock, Eye } from "lucide-react";

const PrivacidadePage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-primary" size={28} />
          <h1 className="text-2xl font-bold">Política de Privacidade</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString("pt-PT")}
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail size={18} /> Dados Coletados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p>
              Para utilizar o OrçaFácil, coletamos apenas as informações
              estritamente necessárias:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Email</strong> — utilizado para criar e autenticar a sua
                conta.
              </li>
              <li>
                <strong>Nome do cliente</strong> (opcional) — informado por si ao
                criar um orçamento, utilizado apenas dentro do documento de
                orçamento.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye size={18} /> Finalidade dos Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p>Os seus dados são utilizados exclusivamente para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Permitir o acesso à sua conta.</li>
              <li>
                Armazenar e recuperar os seus orçamentos de forma segura.
              </li>
              <li>Gerar documentos PDF com os dados do orçamento.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock size={18} /> Proteção e Partilha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Os seus dados <strong>não são partilhados</strong> com
                terceiros, para nenhum fim.
              </li>
              <li>
                Cada utilizador tem acesso apenas aos seus próprios orçamentos — a
                segurança é garantida a nível de base de dados.
              </li>
              <li>
                Utilizamos encriptação em trânsito (HTTPS) e políticas de
                segurança ao nível do servidor para proteger os seus dados.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contacto</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            <p>
              Se tiver questões sobre a sua privacidade ou os seus dados,
              entre em contacto connosco através do email indicado na página
              "Sobre".
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PrivacidadePage;
