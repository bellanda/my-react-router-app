import { Link, useParams } from "react-router";
import { Button } from "~/components/ui/button";

export function meta() {
  return [
    { title: "Reset Password - React Router v7 Demo" },
    { name: "description", content: "Reset password page example" },
  ];
}

export default function ResetPassword() {
  const { token } = useParams();

  return (
    <div>
      <h2 className="mb-6 text-center text-xl font-semibold">
        Create New Password
      </h2>

      <p className="mb-6 text-center text-slate-600 dark:text-slate-400">
        Your token: {token || "No token provided"}
      </p>

      <form className="space-y-4">
        <div>
          <label
            htmlFor="newPassword"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-(--background)"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-(--background)"
          />
        </div>

        <div>
          <Button className="w-full">Reset Password</Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Remember your password?{" "}
          <Link
            to="/auth/login"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Back to login
          </Link>
        </p>
      </div>

      <div className="mt-4 rounded-md bg-blue-50 p-4 text-sm text-slate-700 dark:bg-blue-900/20 dark:text-slate-300">
        <h3 className="mb-2 font-medium">Route Parameter Demo</h3>
        <p>
          This page demonstrates dynamic segment routes with the token
          parameter:
        </p>
        <code className="mt-2 block rounded bg-slate-100 p-2 dark:bg-(--background)">
          /auth/reset-password/:token
        </code>
        <p className="mt-2">
          The token value can be accessed via <code>useParams()</code> hook.
        </p>
      </div>
    </div>
  );
}
