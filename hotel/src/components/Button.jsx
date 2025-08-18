export default function Button({ children, type = "button", onClick, variant = "primary" }) {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles[variant]} px-4 py-2 rounded transition`}
    >
      {children}
    </button>
  );
}