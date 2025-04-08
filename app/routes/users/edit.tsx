import { Link, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { DashboardLayout } from "~/layouts";

export function meta() {
  return [
    { title: "Edit User - React Router v7 Demo" },
    {
      name: "description",
      content:
        "Edit user page demonstrating nested dynamic segments with route prefixes",
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
    permissions: ["Read", "Write", "Admin"],
    bio: "Product manager with 5+ years of experience in software development.",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Editor",
    email: "jane.smith@example.com",
    status: "Active",
    permissions: ["Read", "Write"],
    bio: "Content creator specializing in technical documentation.",
  },
  {
    id: 3,
    name: "Bob Johnson",
    role: "Viewer",
    email: "bob.johnson@example.com",
    status: "Inactive",
    permissions: ["Read"],
    bio: "Marketing specialist with a focus on digital campaigns.",
  },
  {
    id: 4,
    name: "Alice Williams",
    role: "Editor",
    email: "alice.williams@example.com",
    status: "Active",
    permissions: ["Read", "Write"],
    bio: "Frontend developer with expertise in React and modern JavaScript.",
  },
  {
    id: 5,
    name: "Charlie Brown",
    role: "Viewer",
    email: "charlie.brown@example.com",
    status: "Active",
    permissions: ["Read"],
    bio: "Data analyst with a background in statistics and machine learning.",
  },
  {
    id: 6,
    name: "Diana Miller",
    role: "Administrator",
    email: "diana.miller@example.com",
    status: "Active",
    permissions: ["Read", "Write", "Admin"],
    bio: "DevOps engineer specializing in cloud infrastructure and CI/CD pipelines.",
  },
];

export default function EditUser() {
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
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link to={`/users/${user.id}`}>← Back to Profile</Link>
            </Button>
            <h1 className="text-3xl font-bold">Edit User</h1>
          </div>

          <div className="mb-8 overflow-hidden rounded-lg border bg-white shadow-sm dark:border-slate-800 dark:bg-(--background)">
            <div className="p-6">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={user.name}
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
                    defaultValue={user.email}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-(--background)"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    defaultValue={user.role}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-(--background)"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    defaultValue={user.bio}
                    rows={4}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-(--background)"
                  />
                </div>

                <div>
                  <span className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Permissions
                  </span>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={user.permissions.includes("Read")}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                        Read
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={user.permissions.includes("Write")}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                        Write
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={user.permissions.includes("Admin")}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                        Admin
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    defaultValue={user.status}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-(--background)"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <Button asChild variant="outline">
                    <Link to={`/users/${user.id}`}>Cancel</Link>
                  </Button>
                  <Button>Save Changes</Button>
                </div>
              </form>
            </div>
          </div>

          <div className="rounded-lg border border-lime-200 bg-lime-50 p-6 dark:border-lime-900 dark:bg-lime-950">
            <h3 className="mb-2 font-semibold text-lime-800 dark:text-lime-300">
              Nested Dynamic Segments
            </h3>
            <p className="mb-2 text-sm text-lime-700 dark:text-lime-400">
              This page demonstrates a nested dynamic segment in the URL
              pattern:{" "}
              <code className="rounded bg-lime-100 px-1 dark:bg-lime-900">
                /users/:userId/edit
              </code>
            </p>
            <pre className="mb-4 overflow-x-auto rounded-md bg-slate-950 p-3 text-sm text-slate-200">
              {`// In routes.ts
...prefix("users", [
  index("routes/users/index.tsx"),
  route(":userId", "routes/users/profile.tsx"),
  route(":userId/edit", "routes/users/edit.tsx")  // <- You are here: /users/${userId}/edit
])`}
            </pre>
            <p className="text-sm text-lime-700 dark:text-lime-400">
              The{" "}
              <code className="rounded bg-lime-100 px-1 dark:bg-lime-900">
                :userId
              </code>{" "}
              segment in the URL pattern is captured and accessible via{" "}
              <code className="rounded bg-lime-100 px-1 dark:bg-lime-900">
                useParams()
              </code>
              . The{" "}
              <code className="rounded bg-lime-100 px-1 dark:bg-lime-900">
                /edit
              </code>{" "}
              part is a static segment that comes after the dynamic segment,
              creating a nested route structure.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
