import Link from "next/link";
import { redirect } from "next/navigation";
import { authConfigReady, getAdminSession } from "@/lib/auth";

export const metadata = {
  title: "Admin Login | Scripts & Spirits",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  const params = await searchParams;

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="admin-shell login-shell">
      <section className="login-panel">
        <Link className="brand-lockup" href="/" aria-label="Scripts and Spirits home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>Scripts &amp; Spirits</span>
        </Link>
        <div>
          <p className="kicker">Admin</p>
          <h1>Admin sign in</h1>
        </div>

        {authConfigReady() ? (
          <form className="login-form" action="/api/auth/login" method="post">
            {params.error ? (
              <p className="login-error">
                {params.error === "backend"
                  ? "The admin credential sheet is not reachable yet."
                  : "The user name or password did not match."}
              </p>
            ) : null}
            <label className="field-label">
              User name
              <input name="username" autoComplete="username" required />
            </label>
            <label className="field-label">
              Password
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            <button className="button primary login-button" type="submit">
              Sign In
            </button>
          </form>
        ) : (
          <p className="admin-note">
            Admin login needs <code>SCRIPTS_SPIRITS_ADMIN_WEBHOOK_URL</code> for the
            Google Sheet, or local <code>ADMIN_USERNAME</code> and <code>ADMIN_PASSWORD</code>.
          </p>
        )}
      </section>
    </main>
  );
}
