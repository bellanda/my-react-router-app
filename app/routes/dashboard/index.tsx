import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  FileText,
  Users,
} from "lucide-react";
import { Outlet, useLocation } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DashboardLayout } from "~/layouts";

export function meta() {
  return [
    { title: "Dashboard - React Router v7 Demo" },
    {
      name: "description",
      content: "Dashboard overview demonstrating nested routes",
    },
  ];
}

// Conteúdo do Index do Dashboard
function DashboardContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your account
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,427</div>
            <div className="flex items-center pt-1 text-sm text-emerald-600">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+5.2% from last month</span>
            </div>
            <Progress className="mt-4" value={65} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <div className="flex items-center pt-1 text-sm text-emerald-600">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+12% from last month</span>
            </div>
            <Progress className="mt-4" value={80} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <BarChart3 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4%</div>
            <div className="flex items-center pt-1 text-sm text-rose-600">
              <ArrowDownRight className="mr-1 h-4 w-4" />
              <span>-0.5% from last month</span>
            </div>
            <Progress className="mt-4" value={24} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <div className="flex items-center pt-1 text-sm text-emerald-600">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+2 from last month</span>
            </div>
            <Progress className="mt-4" value={50} />
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Account Settings</h3>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account details and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="User"
                    />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change avatar
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Pedro Duarte" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="@peduarte" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      defaultValue="pedro@example.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Admin" disabled />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input id="confirm" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Notification settings will be added here in the future.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Recent Activity</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.user}</span>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {activity.action}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle>React Router v7 Features</CardTitle>
            <CardDescription>
              This dashboard showcases React Router v7's powerful nested routing
              capabilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm">
              You're currently viewing the index route (
              <code className="bg-muted rounded px-1 text-xs">/dashboard</code>
              ). You can navigate to nested routes to see more content.
            </p>
            <pre className="mt-2 overflow-x-auto rounded-md bg-slate-950 p-3 text-sm text-slate-200">
              {`// In routes.ts
        route("dashboard", "routes/dashboard/index.tsx", [
          route("analytics", "routes/dashboard/analytics.tsx"),
          route("settings", "routes/dashboard/settings.tsx")
        ])`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente principal que renderiza o layout e o conteúdo apropriado
export default function Dashboard() {
  // Usar useLocation em vez de window.location para compatibilidade com SSR
  const location = useLocation();
  const pathname = location.pathname;
  const isIndexRoute = pathname === "/dashboard" || pathname === "/dashboard/";

  return (
    <DashboardLayout>
      {isIndexRoute ? <DashboardContent /> : <Outlet />}
    </DashboardLayout>
  );
}

const activities = [
  {
    user: "John Smith",
    action: "Created a new project 'E-commerce redesign'",
    time: "2 hours ago",
    type: "Project",
  },
  {
    user: "Emily Davis",
    action: "Updated the API documentation for the payment gateway",
    time: "5 hours ago",
    type: "Documentation",
  },
  {
    user: "Michael Johnson",
    action: "Resolved 5 customer support tickets",
    time: "Yesterday",
    type: "Support",
  },
  {
    user: "Sarah Wilson",
    action: "Deployed new version v2.3.0 to production",
    time: "2 days ago",
    type: "Deployment",
  },
];
