export default function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block text-gray-700 font-medium">{label}</label>
      <input
        {...props}
        className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>
  );
}