import { Button } from "~/components/ui/button";

export function meta() {
  return [
    { title: "Dashboard Settings - React Router v7 Demo" },
    { name: "description", content: "Dashboard settings page demonstrating nested routes" }
  ];
}

export default function DashboardSettings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard Settings</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        This is the settings page of the dashboard, demonstrating nested routes in React Router v7.
      </p>

      <div className="space-y-8">
        <div className="bg-white dark:bg-(--background) border dark:border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                id="name"
                defaultValue="John Doe"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-(--background)"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                defaultValue="john.doe@example.com"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-(--background)"
              />
            </div>
            <div className="pt-2">
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-(--background) border dark:border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{notification.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{notification.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-(--background) border dark:border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Security</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-(--background)"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-(--background)"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-(--background)"
              />
            </div>
            <div className="pt-2">
              <Button>Update Password</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-900 rounded-lg p-4">
        <h3 className="font-semibold text-violet-800 dark:text-violet-300 mb-2">Nested Route Structure</h3>
        <p className="text-violet-700 dark:text-violet-400 text-sm mb-2">
          This settings page is accessed via the{" "}
          <code className="bg-violet-100 dark:bg-violet-900 px-1 rounded">/dashboard/settings</code> URL. It demonstrates how React
          Router v7 allows you to organize related routes in a nested structure:
        </p>
        <pre className="bg-slate-950 text-slate-200 p-3 rounded-md text-sm overflow-x-auto mt-2">
          {`route("dashboard", "routes/dashboard/index.tsx", [
  index("routes/dashboard/overview.tsx"),
  route("analytics", "routes/dashboard/analytics.tsx"),
  route("settings", "routes/dashboard/settings.tsx"),  // <-- You are here
])`}
        </pre>
      </div>
    </div>
  );
}

const notifications = [
  {
    id: 1,
    name: "Email Notifications",
    description: "Receive emails about activity related to your account",
    enabled: true
  },
  {
    id: 2,
    name: "Marketing Communications",
    description: "Receive emails about new features, products and offers",
    enabled: false
  },
  {
    id: 3,
    name: "Desktop Notifications",
    description: "Receive browser notifications when you're online",
    enabled: true
  },
  {
    id: 4,
    name: "Weekly Reports",
    description: "Receive weekly summary of your dashboard analytics",
    enabled: true
  }
];
