export default function Footer() {
  return (
    <footer className="bg-secondary text-mainWhite py-4">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">Sofa AI</span>
          <span className="text-sm text-gray-300">© {new Date().getFullYear()} Sofa AI. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}