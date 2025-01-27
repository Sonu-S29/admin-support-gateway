import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const SupportDashboard = () => {
  return (
    <DashboardLayout userEmail="support@example.com">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Support Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Welcome!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You are logged in as a support user. You can view and manage your assigned tasks here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SupportDashboard;