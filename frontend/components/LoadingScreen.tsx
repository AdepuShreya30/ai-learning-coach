interface LoadingScreenProps {
  topic: string;
}

export default function LoadingScreen({ topic }: LoadingScreenProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center py-16">
        <div className="flex justify-center mb-8">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin"></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Generating Your Quiz</h2>
        <p className="text-gray-400 mb-8">
          Our AI is creating personalized questions about <span className="text-primary font-semibold">{topic}</span>
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          This usually takes 2-3 seconds. Please wait...
        </p>
      </div>
    </div>
  );
}
