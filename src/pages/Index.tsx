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
        // Check if user exists first
        const { data: { user: existingUser }, error: checkError } = await supabase.auth.getUser();
        if (existingUser) {
          toast({
            title: "Error",
            description: "You are already signed in. Please sign out first.",
            variant: "destructive",
          });
          return;
        }

        // Proceed with signup
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          if (signUpError.message === "User already registered") {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
            setMode("signin");
          } else {
            throw signUpError;
          }
          return;
        }

        if (!authData.user) {
          throw new Error("Signup failed");
        }

        // Insert into users table
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: email,
              is_admin: true, // First user is admin
              is_support: false
            }
          ]);

        if (insertError) throw insertError;

        toast({
          title: "Account created",
          description: "Please check your email to confirm your account.",
        });

        // Don't navigate yet - wait for email confirmation
      } else {
        // Handle sign in
        const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          if (signInError.message === "Email not confirmed") {
            toast({
              title: "Email not confirmed",
              description: "Please check your email and confirm your account before signing in.",
              variant: "destructive",
            });
          } else if (signInError.message === "Invalid login credentials") {
            toast({
              title: "Invalid credentials",
              description: "The email or password you entered is incorrect. Please try again.",
              variant: "destructive",
            });
          } else {
            throw signInError;
          }
          return;
        }

        if (!user) {
          throw new Error("Sign in failed");
        }

        // Get user role
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();

        if (userError) throw userError;

        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });

        // Redirect based on role
        navigate(userData?.is_admin ? '/admin' : '/support');
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