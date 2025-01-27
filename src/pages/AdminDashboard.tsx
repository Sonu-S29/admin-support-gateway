import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminDashboard = () => {
  // This will be replaced with actual data from Supabase once connected
  const mockSupportUsers = [
    { id: 1, email: "support1@example.com" },
    { id: 2, email: "support2@example.com" },
  ];

  return (
    <DashboardLayout isAdmin userEmail="admin@example.com">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Support Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSupportUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                >
                  <span>{user.email}</span>
                  <span className="text-sm text-gray-500">Support User</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;