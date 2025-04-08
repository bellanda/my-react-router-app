export function meta() {
  return [
    { title: "Dashboard Analytics - React Router v7 Demo" },
    {
      name: "description",
      content: "Dashboard analytics page demonstrating nested routes",
    },
  ];
}

export default function DashboardAnalytics() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Analytics Dashboard</h2>
      <p className="text-muted-foreground mb-6">
        This is the analytics page, demonstrating nested routes in React Router
        v7.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-card rounded-lg border p-4">
          <h3 className="mb-3 font-medium">Traffic Overview</h3>
          <div className="bg-muted flex h-48 items-center justify-center rounded">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold">8,249</div>
              <div className="text-muted-foreground text-sm">
                Visitors this month
              </div>
              <div className="mt-2 text-sm text-emerald-500">
                ↑ 12.5% from last month
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <h3 className="mb-3 font-medium">Conversion Rate</h3>
          <div className="bg-muted flex h-48 items-center justify-center rounded">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold">3.2%</div>
              <div className="text-muted-foreground text-sm">
                Average conversion rate
              </div>
              <div className="mt-2 text-sm text-rose-500">
                ↓ 0.5% from last month
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card mb-8 rounded-lg border p-4">
        <h3 className="mb-4 font-medium">Traffic Sources</h3>
        <div className="space-y-3">
          {trafficSources.map((source) => (
            <div key={source.name} className="flex items-center">
              <div className="w-1/3 text-sm">{source.name}</div>
              <div className="w-2/3">
                <div className="bg-muted h-2.5 w-full rounded-full">
                  <div
                    className="h-2.5 rounded-full bg-blue-600"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <div className="mt-1 flex justify-between text-xs">
                  <span>{source.visits.toLocaleString()} visits</span>
                  <span>{source.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950">
        <h3 className="mb-2 font-semibold text-indigo-800 dark:text-indigo-300">
          Nested Route Structure
        </h3>
        <p className="mb-2 text-sm text-indigo-700 dark:text-indigo-400">
          This page is accessed via the{" "}
          <code className="rounded bg-indigo-100 px-1 dark:bg-indigo-900">
            /dashboard/analytics
          </code>{" "}
          URL. It's defined as a nested route in the route configuration:
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md bg-slate-950 p-3 text-sm text-slate-200">
          {`route("dashboard", "routes/dashboard/index.tsx", [
  index("routes/dashboard/overview.tsx"),
  route("analytics", "routes/dashboard/analytics.tsx"),  // <-- You are here
  route("settings", "routes/dashboard/settings.tsx"),
])`}
        </pre>
      </div>
    </div>
  );
}

const trafficSources = [
  { name: "Direct", visits: 3245, percentage: 39 },
  { name: "Organic Search", visits: 2180, percentage: 26 },
  { name: "Social Media", visits: 1621, percentage: 20 },
  { name: "Referral", visits: 824, percentage: 10 },
  { name: "Email", visits: 379, percentage: 5 },
];
