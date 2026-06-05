type ErrorCartoonRobotProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export default function ErrorCartoonRobot({
  title = "Oops! Something went wrong",
  message = "We couldn't load the data. Please try again.",
  onRetry,
}: ErrorCartoonRobotProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      {/* Robot */}
      <div className="robot animate-float">
        <div className="robot-head">
          <div className="eyes">
            <span className="eye"></span>
            <span className="eye"></span>
          </div>
          <div className="mouth"></div>
        </div>
        <div className="robot-body"></div>
      </div>

      {/* Text */}
      <h3 className="mt-8 text-lg font-semibold text-gray-700">{title}</h3>
      <p className="mt-2 text-gray-500 max-w-sm">{message}</p>

      {/* Retry */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
}
