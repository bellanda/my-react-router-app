export function meta() {
  return [
    { title: "Dashboard Analytics - React Router v7 Demo" },
    { name: "description", content: "Dashboard analytics page demonstrating nested routes" }
  ];
}

export default function DashboardAnalytics() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
      <p className="text-muted-foreground mb-6">This is the analytics page, demonstrating nested routes in React Router v7.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-3">Traffic Overview</h3>
          <div className="h-48 flex items-center justify-center bg-muted rounded">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">8,249</div>
              <div className="text-sm text-muted-foreground">Visitors this month</div>
              <div className="text-emerald-500 text-sm mt-2">↑ 12.5% from last month</div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-3">Conversion Rate</h3>
          <div className="h-48 flex items-center justify-center bg-muted rounded">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">3.2%</div>
              <div className="text-sm text-muted-foreground">Average conversion rate</div>
              <div className="text-rose-500 text-sm mt-2">↓ 0.5% from last month</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-4 mb-8">
        <h3 className="font-medium mb-4">Traffic Sources</h3>
        <div className="space-y-3">
          {trafficSources.map((source) => (
            <div key={source.name} className="flex items-center">
              <div className="w-1/3 text-sm">{source.name}</div>
              <div className="w-2/3">
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${source.percentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{source.visits.toLocaleString()} visits</span>
                  <span>{source.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900 rounded-lg p-4">
        <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Nested Route Structure</h3>
        <p className="text-indigo-700 dark:text-indigo-400 text-sm mb-2">
          This page is accessed via the <code className="bg-indigo-100 dark:bg-indigo-900 px-1 rounded">/dashboard/analytics</code>{" "}
          URL. It's defined as a nested route in the route configuration:
        </p>
        <pre className="bg-slate-950 text-slate-200 p-3 rounded-md text-sm overflow-x-auto mt-2">
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
  { name: "Email", visits: 379, percentage: 5 }
];
