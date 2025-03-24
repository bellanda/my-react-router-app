import { Outlet, useLocation } from "react-router";
import { DashboardLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function meta() {
  return [
    { title: "Dashboard - React Router v7 Demo" },
    { name: "description", content: "Dashboard overview demonstrating nested routes" }
  ];
}

// Conteúdo do Index do Dashboard
function DashboardContent() {
  return (
    <div>
      <Tabs defaultValue="account" className="w-[100%]">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="tab-3">Aba 3</TabsTrigger>
          <TabsTrigger value="tab-4">Aba 4</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="tab-3">
          <Card>
            <CardHeader>
              <CardTitle>Esta é a aba 3</CardTitle>
              <CardDescription>Veja o conteúdo dela</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="tab-4">
          <Card>
            <CardHeader>
              <CardTitle>Esta é a aba 4</CardTitle>
              <CardDescription>Veja o conteúdo dela</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="border-b dark:border-slate-800 pb-5 mt-6">
        <h2 className="text-xl font-semibold">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-2">Welcome to your dashboard! Here's a summary of your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="text-blue-600 dark:text-blue-300 font-medium">Total Users</div>
          <div className="text-2xl font-bold mt-1">1,284</div>
          <div className="text-blue-600/70 dark:text-blue-400 text-sm mt-1">↑ 12% from last month</div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
          <div className="text-emerald-600 dark:text-emerald-300 font-medium">Revenue</div>
          <div className="text-2xl font-bold mt-1">$8,427</div>
          <div className="text-emerald-600/70 dark:text-emerald-400 text-sm mt-1">↑ 8% from last month</div>
        </div>

        <div className="bg-violet-50 dark:bg-violet-900/30 p-4 rounded-lg border border-violet-100 dark:border-violet-800">
          <div className="text-violet-600 dark:text-violet-300 font-medium">Conversion Rate</div>
          <div className="text-2xl font-bold mt-1">2.4%</div>
          <div className="text-rose-600/70 dark:text-rose-400 text-sm mt-1">↓ 0.5% from last month</div>
        </div>
      </div>

      <div className="border-t dark:border-slate-800 pt-6 mt-6">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground/70 mr-3">
                {activity.user.charAt(0)}
              </div>
              <div>
                <p className="text-foreground">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-muted-foreground text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Using Nested Routes</h3>
        <p className="text-indigo-700 dark:text-indigo-400 text-sm mb-2">
          This dashboard showcases how React Router v7 handles nested routes. You're currently viewing the index route (
          <code className="bg-indigo-100 dark:bg-indigo-900 px-1 rounded">/dashboard</code>).
        </p>
        <pre className="bg-slate-950 text-slate-200 p-3 rounded-md text-sm overflow-x-auto mt-2">
          {`// In routes.ts
route("dashboard", "routes/dashboard/index.tsx", [
  index("routes/dashboard/overview.tsx"),
  route("analytics", "routes/dashboard/analytics.tsx"),
  route("settings", "routes/dashboard/settings.tsx")
])`}
        </pre>
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

  return <DashboardLayout>{isIndexRoute ? <DashboardContent /> : <Outlet />}</DashboardLayout>;
}

const activities = [
  { user: "John Smith", action: "created a new post", time: "2 hours ago" },
  { user: "Emily Davis", action: "updated their profile", time: "5 hours ago" },
  { user: "Michael Johnson", action: "commented on a post", time: "Yesterday" },
  { user: "Sarah Wilson", action: "uploaded a new document", time: "2 days ago" }
];
