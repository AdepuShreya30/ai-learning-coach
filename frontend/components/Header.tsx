export default function Header() {
  return (
    <header className="bg-gradient-dark border-b border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-gradient">AI Learning Coach</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Personalized learning powered by artificial intelligence
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
