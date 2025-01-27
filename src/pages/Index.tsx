import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthForm from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const { toast } = useToast();

  const handleAuth = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // We'll implement actual auth logic with Supabase later
      toast({
        title: mode === "signin" ? "Welcome back!" : "Account created",
        description: mode === "signin" ? "Successfully logged in." : "Your account has been created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {mode === "signin"
              ? "Sign in to access your dashboard"
              : "Sign up to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AuthForm mode={mode} onSubmit={handleAuth} isLoading={isLoading} />
            <div className="text-center text-sm text-gray-500">
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-blue-600 hover:underline font-medium"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;