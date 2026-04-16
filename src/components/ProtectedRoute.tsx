import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // 🔥 LOGIN AGORA É OPCIONAL — NÃO BLOQUEIA MAIS O APP
  return <>{children}</>;
};

export default ProtectedRoute;
