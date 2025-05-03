import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Plus, 
  Filter, 
  User, 
  UserPlus, 
  Building, 
  BookOpen,
  MapPin 
} from "lucide-react";
import UserList from "@/components/users/UserList";
import UserForm from "@/components/users/UserForm";
import CollegeList from "@/components/users/CollegeList";
import DepartmentList from "@/components/users/DepartmentList";
import LocationList from "@/components/users/LocationList";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api";

const UserManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Get user role from auth context or localStorage
  const userRole = localStorage.getItem("userRole") || "";
  const isAdmin = userRole === "Management_Admin";
  const isPrincipal = userRole === "Principal";
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      setIsCreating(false);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      await updateUser(userId, userData);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">User Management</h1>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="pl-8 pr-4 py-2 w-full rounded-md border border-input bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Only show Add User button for Admin */}
              {isAdmin && !isCreating && (
                <Button onClick={() => setIsCreating(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              )}
              
              {isCreating && (
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
          
          {isCreating ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Create New User</h2>
              <UserForm 
                onSubmit={handleCreateUser}
                onCancel={() => setIsCreating(false)} 
              />
            </div>
          ) : (
            <Tabs defaultValue="users" className="space-y-4">
              <TabsList>
                <TabsTrigger value="users" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                
                {/* Only show Colleges tab for Admin */}
                {isAdmin && (
                  <TabsTrigger value="colleges" className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Colleges
                  </TabsTrigger>
                )}
                
                <TabsTrigger value="departments" className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Departments
                </TabsTrigger>
                
                {/* Only show Locations tab for Admin */}
                {isAdmin && (
                  <TabsTrigger value="locations" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Locations
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="users" className="space-y-4">
                <UserList 
                  users={filteredUsers}
                  loading={loading}
                  onUpdate={isAdmin ? handleUpdateUser : null}
                  onDelete={isAdmin ? handleDeleteUser : null}
                  showActions={isAdmin} // Pass this prop to control action column visibility
                />
              </TabsContent>
              
              {/* Only render college content for Admin */}
              {isAdmin && (
                <TabsContent value="colleges" className="space-y-4">
                  <CollegeList />
                </TabsContent>
              )}
              
              <TabsContent value="departments" className="space-y-4">
                <DepartmentList />
              </TabsContent>
              
              {/* Only render locations content for Admin */}
              {isAdmin && (
                <TabsContent value="locations" className="space-y-4">
                  <LocationList />
                </TabsContent>
              )}
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserManagement;