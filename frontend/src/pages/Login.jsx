import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  EyeOff, 
  ArrowLeft 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { login } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password || !role) {
      toast({
        title: "Error",
        description: "Please enter email, password, and select a role",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Starting login process with:', { email, role });
      const response = await login({ email, password, role });
      console.log('Login successful, response:', response);
      
      // Store all required authentication data
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role_name);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast({
        title: "Success",
        description: `Welcome back! Logged in as ${response.user.role_name}`,
      });
      
      console.log('Navigating to dashboard...');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error details:', error);
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response) {
        // Handle specific error messages from the backend
        switch (error.response.status) {
          case 401:
            errorMessage = error.response.data.message || "Invalid credentials";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = error.response.data.message || "Login failed. Please try again.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-college-50 to-college-100 flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-college-700 hover:text-college-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <div className="mx-auto mb-4">
              <div className="h-12 w-12 rounded-full bg-college-600 flex items-center justify-center text-white text-xl font-bold">
                C
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Login to CollegeIMS</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the inventory management system
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin} id="login-form" name="login-form" aria-label="Login form">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  aria-label="Email address"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-college-600 hover:text-college-800">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-select">Role</Label>
                <Select 
                  value={role} 
                  onValueChange={setRole} 
                  required
                  name="role"
                >
                  <SelectTrigger id="role-select" aria-label="Select your role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Management_Admin" id="role-management-admin">Management Admin</SelectItem>
                    <SelectItem value="Management" id="role-management">Management</SelectItem>
                    <SelectItem value="Principal" id="role-principal">Principal</SelectItem>
                    <SelectItem value="HOD" id="role-hod">HOD</SelectItem>
                    <SelectItem value="Department_Incharge" id="role-department-incharge">Department Incharge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-college-700 hover:bg-college-800" 
                disabled={isLoading}
                aria-label="Login button"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      <footer className="py-6 text-center text-college-700">
        <p>© 2025 College Inventory Management System</p>
      </footer>
    </div>
  );
};

export default Login;
