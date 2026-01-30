import Link from "next/link";
import HeaderNavigation from "@/components/HeaderNavigation";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <HeaderNavigation />
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            404
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Service not found
          </p>
          <Link
            href="/"
            className="inline-block bg-brown-dark text-white px-6 py-3 rounded-lg hover:bg-brown-light transition-colors"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
