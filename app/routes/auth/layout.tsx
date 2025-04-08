import { Outlet } from "react-router";
import { AuthLayout } from "~/layouts";

export function meta() {
  return [
    { title: "Authentication - React Router v7 Demo" },
    {
      name: "description",
      content:
        "Authentication pages using clean layout without sidebar or navbar",
    },
  ];
}

export default function AuthPageLayout() {
  return (
    <AuthLayout
      logoText="React Router v7 Demo"
      showBackLink={true}
      backLinkText="Back to home"
    >
      <div className="mb-4 text-center">
        <h1 className="mb-1 text-2xl font-bold">Authentication</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your account to continue
        </p>
      </div>

      <Outlet />
    </AuthLayout>
  );
}
