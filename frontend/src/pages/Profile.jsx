import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getProfile } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (!data) {
          throw new Error('No profile data received');
        }
        setProfile(data);
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast({
          title: "Error loading profile",
          description: error.message || "Failed to load profile data",
          variant: "destructive",
        });
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} />
          <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} />
          <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Profile not found</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <h1 className="text-2xl font-bold mb-6">User Profile</h1>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {profile.first_name || 'N/A'} {profile.last_name || ''}</p>
                    <p><span className="font-medium">Email:</span> {profile.email || 'N/A'}</p>
                    <p><span className="font-medium">Role:</span> {profile.role || profile.role_name || 'N/A'}</p>
                  </div>

                  {profile.college_name && (
                    <div className="space-y-2">
                      <p><span className="font-medium">College:</span> {profile.college_name}</p>
                      {profile.department_name && (
                        <p><span className="font-medium">Department:</span> {profile.department_name}</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><span className="font-medium">Account Created:</span> {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
                  <p><span className="font-medium">Last Updated:</span> {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;