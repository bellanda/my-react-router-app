import { Link } from "react-router";
import { DashboardLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";

export function meta() {
  return [
    { title: "Users - React Router v7 Demo" },
    { name: "description", content: "Users listing demonstrating route prefixes" }
  ];
}

const users = [
  { id: 1, name: "John Doe", role: "Administrator", email: "john.doe@example.com", status: "Active" },
  { id: 2, name: "Jane Smith", role: "Editor", email: "jane.smith@example.com", status: "Active" },
  { id: 3, name: "Bob Johnson", role: "Viewer", email: "bob.johnson@example.com", status: "Inactive" },
  { id: 4, name: "Alice Williams", role: "Editor", email: "alice.williams@example.com", status: "Active" },
  { id: 5, name: "Charlie Brown", role: "Viewer", email: "charlie.brown@example.com", status: "Active" },
  { id: 6, name: "Diana Miller", role: "Administrator", email: "diana.miller@example.com", status: "Active" }
];

export default function UsersIndex() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Users</h1>
            <Button>Add New User</Button>
          </div>

          <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-lg overflow-hidden shadow-sm mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-(--background) border-b dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-(--background)">{user.role}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/users/${user.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline px-2"
                          prefetch="intent"
                        >
                          View
                        </Link>
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="text-slate-600 dark:text-slate-400 hover:underline px-2"
                          prefetch="intent"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-fuchsia-50 dark:bg-fuchsia-950 border border-fuchsia-200 dark:border-fuchsia-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-fuchsia-800 dark:text-fuchsia-300 mb-4">Route Prefixes in React Router v7</h2>
            <p className="text-fuchsia-700 dark:text-fuchsia-400 mb-4">
              This section demonstrates the use of route prefixes in React Router v7. The prefix utility allows you to add a common
              path prefix to a set of routes without introducing a parent layout component.
            </p>
            <pre className="bg-slate-950 text-slate-200 p-4 rounded-md text-sm overflow-x-auto mb-4">
              {`// In routes.ts
...prefix("users", [
  index("routes/users/index.tsx"),         // <- You are here: /users
  route(":userId", "routes/users/profile.tsx"),  // /users/:userId
  route(":userId/edit", "routes/users/edit.tsx") // /users/:userId/edit
])`}
            </pre>
            <p className="text-fuchsia-700 dark:text-fuchsia-400 mb-2">
              The key differences between <code className="bg-fuchsia-100 dark:bg-fuchsia-900 px-1 rounded">prefix()</code> and{" "}
              <code className="bg-fuchsia-100 dark:bg-fuchsia-900 px-1 rounded">layout()</code>:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-fuchsia-700 dark:text-fuchsia-400">
              <li>
                <strong>prefix()</strong> only adds a URL path prefix without introducing a parent layout component.
              </li>
              <li>
                <strong>layout()</strong> creates a new UI nesting (via{" "}
                <code className="bg-fuchsia-100 dark:bg-fuchsia-900 px-1 rounded">&lt;Outlet /&gt;</code>) but doesn't add path
                segments.
              </li>
              <li>
                <strong>route() with children</strong> creates both path nesting and UI nesting through a parent component with an{" "}
                <code className="bg-fuchsia-100 dark:bg-fuchsia-900 px-1 rounded">&lt;Outlet /&gt;</code>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
