import { UserAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { Link, replace, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/context/ThemeContext";
import { User, Lock, Eye, EyeOff, Shield } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signInUser } = UserAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLoginPage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await signInUser(email, password);
      if (response.success) {
        navigate("/dashboard", { replace: true });
      } else {
        setError(response.error || "An error occurred during sign in.");
      }
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Left Side - Background Image */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
              : "bg-gradient-to-br from-primary/80 to-primary"
          }`}
          style={{
            backgroundImage:
              theme === "light"
                ? `url('/login-page/dde41bf6-44a0-45d4-b721-1cebb49350a9.png')`
                : `url('/login-page/a31f2b07.jpg')`,
          }}
        >
          {/* Dark overlay for better text readability */}
          <div
            className={`absolute inset-0 ${
              theme === "dark" ? "bg-black/60" : "bg-black/40"
            }`}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Welcome to <br />
              DLKS System
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Digital Work Management System - Streamlining operations with
              advanced technology and seamless workflows.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Shield className="w-6 h-6 text-white/80" />
              <span className="text-white/80">
                Secure • Efficient • Reliable
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-8">
        <Card className="w-full max-w-md p-8 shadow-2xl border border-border bg-card/95 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              User Login
            </h2>
            <p className="text-muted-foreground">Access your DLKS account</p>
            <p className="text-sm text-muted-foreground mt-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign Up!
              </Link>
            </p>
          </div>

          <form onSubmit={handleLoginPage} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 text-base rounded-lg border-2 focus:border-purple-500"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 text-base rounded-lg border-2 focus:border-purple-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-foreground cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
