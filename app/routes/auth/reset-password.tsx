import { Link, useParams } from "react-router";
import { Button } from "~/components/ui/button";

export function meta() {
  return [{ title: "Reset Password - React Router v7 Demo" }, { name: "description", content: "Reset password page example" }];
}

export default function ResetPassword() {
  const { token } = useParams();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center">Create New Password</h2>

      <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">Your token: {token || "No token provided"}</p>

      <form className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-(--background)"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-(--background)"
          />
        </div>

        <div>
          <Button className="w-full">Reset Password</Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Remember your password?{" "}
          <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to login
          </Link>
        </p>
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm text-slate-700 dark:text-slate-300">
        <h3 className="font-medium mb-2">Route Parameter Demo</h3>
        <p>This page demonstrates dynamic segment routes with the token parameter:</p>
        <code className="mt-2 block bg-slate-100 dark:bg-(--background) p-2 rounded">/auth/reset-password/:token</code>
        <p className="mt-2">
          The token value can be accessed via <code>useParams()</code> hook.
        </p>
      </div>
    </div>
  );
}
