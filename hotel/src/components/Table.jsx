export default function Table({ columns, data }) {
  return (
    <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
      <thead className="bg-blue-100">
        <tr>
          {columns.map((col, idx) => (
            <th key={idx} className="border p-2">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="text-center p-3 text-gray-500">
              No records found.
            </td>
          </tr>
        )}
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-blue-50">
            {Object.values(row).map((val, i) => (
              <td key={i} className="border p-2">{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}