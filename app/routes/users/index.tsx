import { Link } from "react-router";
import { DashboardLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";

export function meta() {
  return [
    { title: "Users - React Router v7 Demo" },
    {
      name: "description",
      content: "Users listing demonstrating route prefixes",
    },
  ];
}

const users = [
  {
    id: 1,
    name: "John Doe",
    role: "Administrator",
    email: "john.doe@example.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Editor",
    email: "jane.smith@example.com",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    role: "Viewer",
    email: "bob.johnson@example.com",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Alice Williams",
    role: "Editor",
    email: "alice.williams@example.com",
    status: "Active",
  },
  {
    id: 5,
    name: "Charlie Brown",
    role: "Viewer",
    email: "charlie.brown@example.com",
    status: "Active",
  },
  {
    id: 6,
    name: "Diana Miller",
    role: "Administrator",
    email: "diana.miller@example.com",
    status: "Active",
  },
];

export default function UsersIndex() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Users</h1>
            <Button>Add New User</Button>
          </div>

          <div className="mb-8 overflow-hidden rounded-lg border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-slate-50 dark:border-slate-800 dark:bg-(--background)">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-(--background)">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          to={`/users/${user.id}`}
                          className="px-2 text-blue-600 hover:underline dark:text-blue-400"
                          prefetch="intent"
                        >
                          View
                        </Link>
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="px-2 text-slate-600 hover:underline dark:text-slate-400"
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

          <div className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 p-6 dark:border-fuchsia-900 dark:bg-fuchsia-950">
            <h2 className="mb-4 text-xl font-semibold text-fuchsia-800 dark:text-fuchsia-300">
              Route Prefixes in React Router v7
            </h2>
            <p className="mb-4 text-fuchsia-700 dark:text-fuchsia-400">
              This section demonstrates the use of route prefixes in React
              Router v7. The prefix utility allows you to add a common path
              prefix to a set of routes without introducing a parent layout
              component.
            </p>
            <pre className="mb-4 overflow-x-auto rounded-md bg-slate-950 p-4 text-sm text-slate-200">
              {`// In routes.ts
...prefix("users", [
  index("routes/users/index.tsx"),         // <- You are here: /users
  route(":userId", "routes/users/profile.tsx"),  // /users/:userId
  route(":userId/edit", "routes/users/edit.tsx") // /users/:userId/edit
])`}
            </pre>
            <p className="mb-2 text-fuchsia-700 dark:text-fuchsia-400">
              The key differences between{" "}
              <code className="rounded bg-fuchsia-100 px-1 dark:bg-fuchsia-900">
                prefix()
              </code>{" "}
              and{" "}
              <code className="rounded bg-fuchsia-100 px-1 dark:bg-fuchsia-900">
                layout()
              </code>
              :
            </p>
            <ul className="list-disc space-y-2 pl-5 text-fuchsia-700 dark:text-fuchsia-400">
              <li>
                <strong>prefix()</strong> only adds a URL path prefix without
                introducing a parent layout component.
              </li>
              <li>
                <strong>layout()</strong> creates a new UI nesting (via{" "}
                <code className="rounded bg-fuchsia-100 px-1 dark:bg-fuchsia-900">
                  &lt;Outlet /&gt;
                </code>
                ) but doesn't add path segments.
              </li>
              <li>
                <strong>route() with children</strong> creates both path nesting
                and UI nesting through a parent component with an{" "}
                <code className="rounded bg-fuchsia-100 px-1 dark:bg-fuchsia-900">
                  &lt;Outlet /&gt;
                </code>
                .
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
