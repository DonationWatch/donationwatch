import { NotFoundButton } from "@/components/layout/not-found-button";
import { NotFoundEyes } from "@/components/layout/not-found-eyes";
import { PageLogo } from "@/components/layout/page-logo";

// We don't use translations here as the build seems to embed then into all pages

export default function NotFound() {
  return (
    <html lang="en">
      <body className="@container flex min-h-screen flex-col">
        <main className="relative flex grow items-center justify-center overflow-hidden dark:text-white">
          <NotFoundEyes />
          <div className="relative z-10 flex flex-col">
            <div className="mb-8 flex items-center space-x-2 text-xl font-semibold">
              <PageLogo />
              <span>DonationWatch</span>
            </div>
            <div className="mb-12">
              <h2 className="mb-2 text-2xl font-bold">Page not found</h2>
              <p>{"I can't see what you're looking for."}</p>
            </div>
            <div>
              <NotFoundButton />
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
