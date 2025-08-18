export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
    />
  );
}