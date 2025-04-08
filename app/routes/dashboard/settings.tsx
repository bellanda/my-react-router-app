import { Button } from "~/components/ui/button";

export function meta() {
  return [
    { title: "Dashboard Settings - React Router v7 Demo" },
    {
      name: "description",
      content: "Dashboard settings page demonstrating nested routes",
    },
  ];
}

export default function DashboardSettings() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Dashboard Settings</h2>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        This is the settings page of the dashboard, demonstrating nested routes
        in React Router v7.
      </p>

      <div className="space-y-8">
        <div className="rounded-lg border bg-white p-6 dark:border-slate-700 dark:bg-(--background)">
          <h3 className="mb-4 text-lg font-medium">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Display Name
              </label>
              <input
                type="text"
                id="name"
                defaultValue="John Doe"
                className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-(--background)"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                defaultValue="john.doe@example.com"
                className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-(--background)"
              />
            </div>
            <div className="pt-2">
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 dark:border-slate-700 dark:bg-(--background)">
          <h3 className="mb-4 text-lg font-medium">Notification Preferences</h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between"
              >
                <div>
                  <h4 className="font-medium">{notification.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {notification.description}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    defaultChecked={notification.enabled}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-slate-600 dark:bg-slate-700 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 dark:border-slate-700 dark:bg-(--background)">
          <h3 className="mb-4 text-lg font-medium">Security</h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-(--background)"
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-(--background)"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-(--background)"
              />
            </div>
            <div className="pt-2">
              <Button>Update Password</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950">
        <h3 className="mb-2 font-semibold text-violet-800 dark:text-violet-300">
          Nested Route Structure
        </h3>
        <p className="mb-2 text-sm text-violet-700 dark:text-violet-400">
          This settings page is accessed via the{" "}
          <code className="rounded bg-violet-100 px-1 dark:bg-violet-900">
            /dashboard/settings
          </code>{" "}
          URL. It demonstrates how React Router v7 allows you to organize
          related routes in a nested structure:
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md bg-slate-950 p-3 text-sm text-slate-200">
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
    enabled: true,
  },
  {
    id: 2,
    name: "Marketing Communications",
    description: "Receive emails about new features, products and offers",
    enabled: false,
  },
  {
    id: 3,
    name: "Desktop Notifications",
    description: "Receive browser notifications when you're online",
    enabled: true,
  },
  {
    id: 4,
    name: "Weekly Reports",
    description: "Receive weekly summary of your dashboard analytics",
    enabled: true,
  },
];
