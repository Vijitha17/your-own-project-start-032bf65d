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
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
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
    
    if (!email || !password || !role) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await login({ email, password, role });
      
      if (!response || !response.token) {
        throw new Error("Invalid response from server");
      }
      
      // Store token
      localStorage.setItem('token', response.token);
      
      // Store user role - ensure it matches the keys in menuByRole
      // The API might return role_name or role, so check both
      const userRole = response.user.role_name || response.user.role;
      localStorage.setItem('userRole', userRole);
      
      // For debugging
      console.log('Logged in user role:', userRole);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast({
        title: "Success",
        description: `Welcome, ${response.user.first_name}!`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "No response from server. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-gray-700 hover:text-gray-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <div className="mx-auto mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                C
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Login to CollegeIMS</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the inventory management system
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Management_Admin">Management Admin</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Principal">Principal</SelectItem>
                    <SelectItem value="HOD">HOD</SelectItem>
                    <SelectItem value="Department_Incharge">Department Incharge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      <footer className="py-6 text-center text-gray-700">
        <p>© {new Date().getFullYear()} College Inventory Management System</p>
      </footer>
    </div>
  );
};

export default Login;