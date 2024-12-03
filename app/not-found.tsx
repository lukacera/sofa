import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] px-4">
      <div className="text-center space-y-8">
        {/* 404 Heading */}
        <h1 className="text-9xl font-extrabold text-secondary drop-shadow-lg">
          404
        </h1>

        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-gray-900">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Return Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white text-lg font-medium rounded-md shadow-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          <MoveLeft size={20} />
          Return Home
        </Link>
      </div>
    </main>
  );
}
