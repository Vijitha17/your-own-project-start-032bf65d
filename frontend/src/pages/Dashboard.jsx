import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart as BarChartIcon, 
  Calendar, 
  Package, 
  ShoppingCart, 
  Users, 
  AlertTriangle 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const DashboardCard = ({ title, value, icon: Icon, description, className }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${className}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const RecentActivityItem = ({ title, time, description, icon: Icon }) => (
  <div className="flex items-start space-x-4 py-3">
    <div className="rounded-full bg-blue-100 p-2">
      <Icon className="h-4 w-4 text-blue-600" />
    </div>
    <div className="flex-1 space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const PendingApprovalItem = ({ department, items, requestedBy, date }) => (
  <div className="border rounded-md p-3 mb-3 hover:bg-blue-50 cursor-pointer transition-colors">
    <div className="flex justify-between mb-2">
      <h4 className="font-medium text-sm">{department}</h4>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
    <p className="text-sm text-muted-foreground mb-1">
      {items.join(", ")}
    </p>
    <p className="text-xs text-muted-foreground">Requested by: {requestedBy}</p>
  </div>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // Sample data for charts
  const expenditureData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  const analyticsData = [
    { name: 'Mon', requests: 20, approvals: 15, purchases: 8 },
    { name: 'Tue', requests: 26, approvals: 19, purchases: 12 },
    { name: 'Wed', requests: 15, approvals: 10, purchases: 5 },
    { name: 'Thu', requests: 32, approvals: 25, purchases: 18 },
    { name: 'Fri', requests: 18, approvals: 12, purchases: 6 },
    { name: 'Sat', requests: 8, approvals: 5, purchases: 2 },
    { name: 'Sun', requests: 3, approvals: 2, purchases: 1 },
  ];

  const departmentSpendingData = [
    { name: 'Computer Science', value: 35 },
    { name: 'Information Technology', value: 25 },
    { name: 'Mechanical', value: 20 },
    { name: 'Bio Medical', value: 15 },
    { name: 'Agricultural', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
  }, [navigate]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log("Sidebar toggled to:", !sidebarOpen); // For debugging
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                  title="Total Requests"
                  value="24"
                  icon={Package}
                  description="8 pending approvals"
                  className="text-blue-600"
                />
                <DashboardCard
                  title="Current Stock Items"
                  value="1,248"
                  icon={Package}
                  description="142 items low in stock"
                  className="text-green-600"
                />
                <DashboardCard
                  title="Total Users"
                  value="42"
                  icon={Users}
                  description="Across all departments"
                  className="text-violet-600"
                />
                <DashboardCard
                  title="Recent Purchases"
                  value="15"
                  icon={ShoppingCart}
                  description="3 awaiting delivery"
                  className="text-orange-600"
                />
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Expenditure Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={expenditureData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8" name="Expenditure ($)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Annual Inventory Audit</p>
                          <p className="text-xs text-muted-foreground">May 15, 2025</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Budget Planning Meeting</p>
                          <p className="text-xs text-muted-foreground">May 20, 2025</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Lab Equipment Service Due</p>
                          <p className="text-xs text-muted-foreground">May 25, 2025</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analyticsData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="requests" stroke="#8884d8" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="approvals" stroke="#82ca9d" />
                          <Line type="monotone" dataKey="purchases" stroke="#ffc658" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Department Spending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={departmentSpendingData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {departmentSpendingData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <PendingApprovalItem 
                    department="Computer Science Dept."
                    items={["20 Desktop Computers", "2 Projectors"]}
                    requestedBy="John Doe (HOD)"
                    date="Today, 10:30 AM"
                  />
                  <PendingApprovalItem 
                    department="Physics Lab"
                    items={["Oscilloscope", "Digital Multimeter", "Power Supply Units"]}
                    requestedBy="Jane Smith (Lab Assistant)"
                    date="Yesterday, 4:15 PM"
                  />
                  <PendingApprovalItem 
                    department="Administrative Office"
                    items={["5 Filing Cabinets", "Office Stationery"]}
                    requestedBy="Michael Johnson (Admin)"
                    date="May 10, 2025"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0 divide-y">
                    <RecentActivityItem
                      title="New Purchase Order"
                      time="2 hours ago"
                      description="New purchase order created for Computer Science Department"
                      icon={ShoppingCart}
                    />
                    <RecentActivityItem
                      title="Stock Allocated"
                      time="4 hours ago"
                      description="10 chairs allocated to Physics Department"
                      icon={Package}
                    />
                    <RecentActivityItem
                      title="Request Approved"
                      time="Yesterday"
                      description="Lab equipment request approved by Principal"
                      icon={Users}
                    />
                    <RecentActivityItem
                      title="New User Added"
                      time="2 days ago"
                      description="New department admin added for Chemistry Department"
                      icon={Users}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;