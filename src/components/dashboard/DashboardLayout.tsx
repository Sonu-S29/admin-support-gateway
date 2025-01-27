import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
  userEmail?: string;
}

const DashboardLayout = ({ children, isAdmin, userEmail }: DashboardLayoutProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    // We'll implement actual logout logic later with Supabase
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="font-semibold text-lg">
              {isAdmin ? "Admin Dashboard" : "User Dashboard"}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;