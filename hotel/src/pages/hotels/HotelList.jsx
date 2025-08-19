import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHotels, deleteHotel } from "../../api/hotelApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/Table";
import Button from "../../components/Button";
import SearchInput from "../../components/SearchInput";
import Paginator from "../../components/Paginator";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function HotelList() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: getHotels,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  if (isLoading) return <p>Loading...</p>;
  let hotels = data?.data || [];

  // Filter by search
  hotels = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.location.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(hotels.length / pageSize);
  const paginatedData = hotels.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DashboardLayout title="Manage Hotels">
      <div className="mb-4 flex justify-between">
        <div className="w-1/3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search hotels..." />
        </div>
        <Link to="/add-hotel">
          <Button>Add New Hotel</Button>
        </Link>
      </div>
      <Table
        columns={["ID", "Name", "Location", "Actions"]}
        data={paginatedData.map((h) => ({
          ID: h.hotelId,
          Name: h.name,
          Location: h.location,
          Actions: (
            <div className="flex space-x-2">
              <Link to={`/edit-hotel/${h.hotelId}`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button
                variant="danger"
                onClick={() => {
                  if (window.confirm("Delete this hotel?")) {
                    deleteMutation.mutate(h.hotelId);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          )
        }))}
      />
      <Paginator currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </DashboardLayout>
  );
}