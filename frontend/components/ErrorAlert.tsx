interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="card bg-red-900/20 border-red-500/50">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-red-400 mb-1">Error</h3>
            <p className="text-red-300">{message}</p>
            <p className="text-sm text-red-400 mt-2">
              Please try again or contact support if the issue persists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
