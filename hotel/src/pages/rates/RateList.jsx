import { useQuery } from "@tanstack/react-query";
import { getRates } from "../../api/rateApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/Table";
import SearchInput from "../../components/SearchInput";
import Paginator from "../../components/Paginator";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { useState } from "react";

export default function RateList() {
  const { data, isLoading } = useQuery({
    queryKey: ["rates"],
    queryFn: getRates,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  if (isLoading) return <p>Loading...</p>;

  let rates = data?.data || [];

  rates = rates.filter(
    (r) =>
      r.hotelId.toString().includes(search) ||
      r.roomTypeId.toString().includes(search) ||
      r.date.includes(search)
  );

  const totalPages = Math.ceil(rates.length / pageSize);
  const paginatedData = rates.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DashboardLayout title="Manage Rates">
      <div className="mb-4 flex justify-between">
        <div className="w-1/3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search rates..." />
        </div>
        <Link to="/rates">
          <Button>Add or Update Rate</Button>
        </Link>
      </div>
      <Table
        columns={["Hotel ID", "Room Type ID", "Date", "Rate"]}
        data={paginatedData.map((r) => ({
          "Hotel ID": r.hotelId,
          "Room Type ID": r.roomTypeId,
          Date: r.date,
          Rate: r.rate,
        }))}
      />
      <Paginator currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </DashboardLayout>
  );
}