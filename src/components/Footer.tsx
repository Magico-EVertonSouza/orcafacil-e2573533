
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-6 mt-auto">
      <div className="container text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} OrçaFácil - Ferramenta de Orçamentos para Construção</p>
        <div className="flex justify-center mt-2 space-x-4">
          <Link to="/sobre" className="hover:text-orcafacil-blue transition-colors">Sobre</Link>
          <Link to="/privacidade" className="hover:text-orcafacil-blue transition-colors">Privacidade</Link>
          <Link to="/termos" className="hover:text-orcafacil-blue transition-colors">Termos de Uso</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
