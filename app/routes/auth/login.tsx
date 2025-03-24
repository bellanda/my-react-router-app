import { Link } from "react-router";
import { Button } from "../../components/ui/button";

export function meta() {
  return [{ title: "Login - React Router v7 Demo" }, { name: "description", content: "Login page example" }];
}

export default function Login() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center">Login to Your Account</h2>

      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Remember me</span>
          </label>
          <Link to="/auth/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Forgot password?
          </Link>
        </div>

        <div>
          <Button className="w-full">Log in</Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
