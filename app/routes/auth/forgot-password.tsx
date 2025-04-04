import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export function meta() {
  return [{ title: "Forgot Password - React Router v7 Demo" }, { name: "description", content: "Password recovery page example" }];
}

export default function ForgotPassword() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center">Reset Your Password</h2>

      <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">
        Enter your email address below and we'll send you a link to reset your password.
      </p>

      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-(--background)"
          />
        </div>

        <div>
          <Button className="w-full">Send Reset Link</Button>
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
    </div>
  );
}
