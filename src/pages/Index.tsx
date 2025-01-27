import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthForm from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (mode === "signup") {
        // First, create the user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        // Check if there are any existing users
        const { data: existingUsers, error: queryError } = await supabase
          .from('users')
          .select('id')
          .limit(1);

        if (queryError) throw queryError;

        // Determine if this should be an admin (first user) or support user
        const isAdmin = !existingUsers || existingUsers.length === 0;

        // Insert the user into our users table with the appropriate role
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user?.id,
              email: email,
              is_admin: isAdmin,
              is_support: !isAdmin
            }
          ]);

        if (insertError) throw insertError;

        toast({
          title: "Account created",
          description: `Successfully created ${isAdmin ? 'admin' : 'support'} account.`,
        });

        // Redirect based on role
        navigate(isAdmin ? '/admin' : '/support');
      } else {
        // Handle sign in
        const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        // Get user role from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', user?.id)
          .single();

        if (userError) throw userError;

        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });

        // Redirect based on role
        navigate(userData.is_admin ? '/admin' : '/support');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
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