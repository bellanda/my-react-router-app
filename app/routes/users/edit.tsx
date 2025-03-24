import { Link, useParams } from "react-router";
import { MainLayout } from "../../components/layout/main-layout";
import { Button } from "../../components/ui/button";

export function meta() {
  return [
    { title: "Edit User - React Router v7 Demo" },
    { name: "description", content: "Edit user page demonstrating nested dynamic segments with route prefixes" }
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
    bio: "Product manager with 5+ years of experience in software development."
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Editor",
    email: "jane.smith@example.com",
    status: "Active",
    permissions: ["Read", "Write"],
    bio: "Content creator specializing in technical documentation."
  },
  {
    id: 3,
    name: "Bob Johnson",
    role: "Viewer",
    email: "bob.johnson@example.com",
    status: "Inactive",
    permissions: ["Read"],
    bio: "Marketing specialist with a focus on digital campaigns."
  },
  {
    id: 4,
    name: "Alice Williams",
    role: "Editor",
    email: "alice.williams@example.com",
    status: "Active",
    permissions: ["Read", "Write"],
    bio: "Frontend developer with expertise in React and modern JavaScript."
  },
  {
    id: 5,
    name: "Charlie Brown",
    role: "Viewer",
    email: "charlie.brown@example.com",
    status: "Active",
    permissions: ["Read"],
    bio: "Data analyst with a background in statistics and machine learning."
  },
  {
    id: 6,
    name: "Diana Miller",
    role: "Administrator",
    email: "diana.miller@example.com",
    status: "Active",
    permissions: ["Read", "Write", "Admin"],
    bio: "DevOps engineer specializing in cloud infrastructure and CI/CD pipelines."
  }
];

export default function EditUser() {
  const { userId } = useParams();
  const id = parseInt(userId as string, 10);

  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">We couldn't find a user with ID {userId}.</p>
            <Button asChild>
              <Link to="/users">Back to Users</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="outline" size="sm">
              <Link to={`/users/${user.id}`}>← Back to Profile</Link>
            </Button>
            <h1 className="text-3xl font-bold">Edit User</h1>
          </div>

          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg overflow-hidden shadow-sm mb-8">
            <div className="p-6">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={user.name}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue={user.email}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    defaultValue={user.role}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    defaultValue={user.bio}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Permissions</span>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={user.permissions.includes("Read")}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Read</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={user.permissions.includes("Write")}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Write</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={user.permissions.includes("Admin")}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Admin</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    defaultValue={user.status}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
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

          <div className="bg-lime-50 dark:bg-lime-950 border border-lime-200 dark:border-lime-900 rounded-lg p-6">
            <h3 className="font-semibold text-lime-800 dark:text-lime-300 mb-2">Nested Dynamic Segments</h3>
            <p className="text-lime-700 dark:text-lime-400 text-sm mb-2">
              This page demonstrates a nested dynamic segment in the URL pattern:{" "}
              <code className="bg-lime-100 dark:bg-lime-900 px-1 rounded">/users/:userId/edit</code>
            </p>
            <pre className="bg-slate-950 text-slate-200 p-3 rounded-md text-sm overflow-x-auto mb-4">
              {`// In routes.ts
...prefix("users", [
  index("routes/users/index.tsx"),
  route(":userId", "routes/users/profile.tsx"),
  route(":userId/edit", "routes/users/edit.tsx")  // <- You are here: /users/${userId}/edit
])`}
            </pre>
            <p className="text-lime-700 dark:text-lime-400 text-sm">
              The <code className="bg-lime-100 dark:bg-lime-900 px-1 rounded">:userId</code> segment in the URL pattern is captured
              and accessible via <code className="bg-lime-100 dark:bg-lime-900 px-1 rounded">useParams()</code>. The{" "}
              <code className="bg-lime-100 dark:bg-lime-900 px-1 rounded">/edit</code> part is a static segment that comes after the
              dynamic segment, creating a nested route structure.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
