
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const PDFPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return (
    <Layout>
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">PDF</h1>
        <p className="mb-6">O PDF agora é baixado diretamente. Redirecionando...</p>
        <Button onClick={() => navigate('/')} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Voltar para o início
        </Button>
      </div>
    </Layout>
  );
};

export default PDFPage;
