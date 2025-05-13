
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-3">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-orcafacil-blue">
          <Calculator size={24} />
          <span className="text-xl font-bold">OrçaFácil</span>
        </Link>
        <div className="flex space-x-2">
          <Link to="/orcamentos">
            <Button variant="ghost">Meus Orçamentos</Button>
          </Link>
          <Link to="/ajuda">
            <Button variant="ghost">Ajuda</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
