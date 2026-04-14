
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import logo from "@/assets/logo-orcafacil.png";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm py-3">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="OrçaFácil" width={32} height={32} />
          <span className="text-xl font-bold text-primary">OrçaFácil</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Link to="/orcamentos">
            <Button variant="ghost">Meus Orçamentos</Button>
          </Link>
          <Link to="/ajuda">
            <Button variant="ghost">Ajuda</Button>
          </Link>
          {user && (
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut size={14} className="mr-1" />
              Sair
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
