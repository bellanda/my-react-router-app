import { Link, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { DashboardLayout } from "~/layouts";

export function meta() {
  return [
    { title: "User Profile - React Router v7 Demo" },
    {
      name: "description",
      content:
        "User profile demonstrating dynamic segments with route prefixes",
    },
  ];
}

// Mock user data
const users = [
  {
    id: 1,
    name: "John Doe",
    role: "Administrator",
    email: "john.doe@example.com",
    status: "Active",
    avatar: "JD",
    joinDate: "January 12, 2022",
    lastActive: "Today",
    permissions: ["Read", "Write", "Admin"],
    bio: "Product manager with 5+ years of experience in software development.",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Editor",
    email: "jane.smith@example.com",
    status: "Active",
    avatar: "JS",
    joinDate: "March 5, 2022",
    lastActive: "Yesterday",
    permissions: ["Read", "Write"],
    bio: "Content creator specializing in technical documentation.",
  },
  {
    id: 3,
    name: "Bob Johnson",
    role: "Viewer",
    email: "bob.johnson@example.com",
    status: "Inactive",
    avatar: "BJ",
    joinDate: "August 18, 2022",
    lastActive: "2 weeks ago",
    permissions: ["Read"],
    bio: "Marketing specialist with a focus on digital campaigns.",
  },
  {
    id: 4,
    name: "Alice Williams",
    role: "Editor",
    email: "alice.williams@example.com",
    status: "Active",
    avatar: "AW",
    joinDate: "October 30, 2022",
    lastActive: "3 days ago",
    permissions: ["Read", "Write"],
    bio: "Frontend developer with expertise in React and modern JavaScript.",
  },
  {
    id: 5,
    name: "Charlie Brown",
    role: "Viewer",
    email: "charlie.brown@example.com",
    status: "Active",
    avatar: "CB",
    joinDate: "December 15, 2022",
    lastActive: "1 week ago",
    permissions: ["Read"],
    bio: "Data analyst with a background in statistics and machine learning.",
  },
  {
    id: 6,
    name: "Diana Miller",
    role: "Administrator",
    email: "diana.miller@example.com",
    status: "Active",
    avatar: "DM",
    joinDate: "February 7, 2023",
    lastActive: "Today",
    permissions: ["Read", "Write", "Admin"],
    bio: "DevOps engineer specializing in cloud infrastructure and CI/CD pipelines.",
  },
];

export default function UserProfile() {
  const { userId } = useParams();
  const id = parseInt(userId as string, 10);

  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-4 text-2xl font-bold">User Not Found</h1>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              We couldn't find a user with ID {userId}.
            </p>
            <Button asChild>
              <Link to="/users">Back to Users</Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center">
            <Button asChild variant="outline" size="sm" className="mr-4">
              <Link to="/users">← Back to Users</Link>
            </Button>
            <h1 className="text-3xl font-bold">User Profile</h1>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-(--background)">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {user.avatar}
                  </div>
                  <h2 className="mb-1 text-xl font-semibold">{user.name}</h2>
                  <div className="mb-4 rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-(--background)">
                    {user.role}
                  </div>
                  <div
                    className={`mb-6 rounded-full px-2 py-1 text-xs ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300"
                    }`}
                  >
                    {user.status}
                  </div>

                  <div className="w-full space-y-4">
                    <div className="border-t pt-4 dark:border-slate-800">
                      <div className="mb-1 text-sm text-slate-500 dark:text-slate-400">
                        Email
                      </div>
                      <div>{user.email}</div>
                    </div>
                    <div className="border-t pt-4 dark:border-slate-800">
                      <div className="mb-1 text-sm text-slate-500 dark:text-slate-400">
                        Joined
                      </div>
                      <div>{user.joinDate}</div>
                    </div>
                    <div className="border-t pt-4 dark:border-slate-800">
                      <div className="mb-1 text-sm text-slate-500 dark:text-slate-400">
                        Last Active
                      </div>
                      <div>{user.lastActive}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-(--background)">
                <h3 className="mb-4 text-lg font-semibold">Bio</h3>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  {user.bio}
                </p>

                <h3 className="mt-6 mb-4 text-lg font-semibold">Permissions</h3>
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-(--background)">
                <h3 className="mb-4 text-lg font-semibold">Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link to={`/users/${user.id}/edit`}>Edit Profile</Link>
                  </Button>
                  <Button variant="destructive">Deactivate Account</Button>
                </div>
              </div>

              <div className="rounded-lg border border-teal-200 bg-teal-50 p-6 dark:border-teal-900 dark:bg-teal-950">
                <h3 className="mb-2 font-semibold text-teal-800 dark:text-teal-300">
                  Dynamic Segments with Route Prefixes
                </h3>
                <p className="mb-2 text-sm text-teal-700 dark:text-teal-400">
                  This page demonstrates the use of dynamic segments with route
                  prefixes in React Router v7.
                </p>
                <pre className="mb-4 overflow-x-auto rounded-md bg-slate-950 p-3 text-sm text-slate-200">
                  {`// In routes.ts
...prefix("users", [
  index("routes/users/index.tsx"),
  route(":userId", "routes/users/profile.tsx"),  // <- You are here: /users/${userId}
  route(":userId/edit", "routes/users/edit.tsx")
])`}
                </pre>
                <div className="overflow-x-auto rounded-md bg-slate-950 p-3 text-sm text-slate-200">
                  {`// In profile.tsx
export default function UserProfile() {
  const { userId } = useParams();
  const id = parseInt(userId as string, 10);
  
  // Use the userId parameter to fetch the user data
  const user = users.find(u => u.id === id);
  // ...
}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
