type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  overlay?: boolean;
  className?: string;
}

const Spinner = ({
  size = "md",
  color = "#2563eb",
  overlay = false,
  className = "",
}: SpinnerProps) => {
  const spinnerElement = (
    <svg
      className={`spinner spinner-${size} ${className}`}
      viewBox="0 0 50 50"
      style={{ color }}
      role="status"
      aria-label="loading"
    >
      <circle
        className="spinner-path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );

  if (overlay) {
    return <div className="spinner-overlay">{spinnerElement}</div>;
  }

  return spinnerElement;
};

export default Spinner;
