import { useQuery } from "@tanstack/react-query";
import { getInventoryByHotel } from "../../api/inventoryApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/Table";
import SearchInput from "../../components/SearchInput";
import Paginator from "../../components/Paginator";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { useState } from "react";

export default function InventoryList() {
  const hotelId = 1; // Placeholder. Could be dynamic depending on logged user’s assigned hotel
  const { data, isLoading } = useQuery({
    queryKey: ["inventory", hotelId],
    queryFn: () => getInventoryByHotel(hotelId)
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  if (isLoading) return <p>Loading...</p>;

  let inventory = data?.data || [];

  inventory = inventory.filter(
    (inv) =>
      inv.hotelId.toString().includes(search) ||
      inv.roomTypeId.toString().includes(search) ||
      inv.date.includes(search)
  );

  const totalPages = Math.ceil(inventory.length / pageSize);
  const paginatedData = inventory.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DashboardLayout title="Manage Inventory">
      <div className="mb-4 flex justify-between">
        <div className="w-1/3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search inventory..." />
        </div>
        <Link to="/inventory">
          <Button>Update Inventory</Button>
        </Link>
      </div>
      <Table
        columns={["Hotel ID", "Room Type ID", "Date", "Total Inventory", "Reserved"]}
        data={paginatedData.map((inv) => ({
          "Hotel ID": inv.hotelId,
          "Room Type ID": inv.roomTypeId,
          Date: inv.date,
          "Total Inventory": inv.totalInventory,
          Reserved: inv.totalReserved,
        }))}
      />
      <Paginator currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </DashboardLayout>
  );
}