import { NotFoundButton } from "../components/not-found-button";
import { PageLogo } from "../components/page-logo";

// We don't use translations here as the build seems to embed then into all pages

export default function NotFound() {
  return (
    <html lang="en">
      <body className="@container flex min-h-screen flex-col">
        <main className="flex grow items-center justify-center dark:text-white">
          <div className="flex flex-col">
            <div className="mb-8 flex items-center space-x-2 text-xl font-semibold">
              <PageLogo />
              <span>DonationWatch</span>
            </div>
            <div className="mb-12">
              <h2 className="mb-2 text-2xl font-bold">Page not found</h2>
              <p>{"Sorry, the page you're looking for isn't here."}</p>
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
