import Footer from "@/components/site/footer";
import Nav from "@/components/site/nav";
import NotFoundView from "@/components/site/not-found-view";

/**
 * Global 404 — covers unmatched URLs and `notFound()` thrown from any segment.
 * It renders the site chrome itself because the root layout has none.
 */
export default function NotFound() {
  return (
    <>
      <title>404 — Route not found · Foundry</title>
      <meta name="robots" content="noindex" />
      <Nav />
      <div className="mx-auto w-full max-w-[1240px] border-x border-line">
        <main id="content">
          <NotFoundView />
        </main>
        <Footer />
      </div>
    </>
  );
}
