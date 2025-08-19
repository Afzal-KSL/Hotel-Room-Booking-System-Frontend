import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRooms, deleteRoom } from "../../api/roomApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/Table";
import Button from "../../components/Button";
import SearchInput from "../../components/SearchInput";
import Paginator from "../../components/Paginator";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function RoomList() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms
  });
  const deleteMutation = useMutation({
      mutationFn: deleteRoom,
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  if (isLoading) return <p>Loading...</p>;

  let rooms = data?.data || [];

  rooms = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.number.toString().includes(search) ||
      r.hotel?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(rooms.length / pageSize);
  const paginatedData = rooms.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DashboardLayout title="Manage Rooms">
      <div className="mb-4 flex justify-between">
        <div className="w-1/3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search rooms..." />
        </div>
        <Link to="/add-room">
          <Button>Add New Room</Button>
        </Link>
      </div>
      <Table
        columns={["ID", "Name", "Number", "Floor", "Available", "Hotel", "Actions"]}
        data={paginatedData.map((r) => ({
          ID: r.roomId,
          Name: r.name,
          Number: r.number,
          Floor: r.floor,
          Available: r.available ? "Yes" : "No",
          Hotel: r.hotel?.name,
          Actions: (
            <div className="flex space-x-2">
              <Link to={`/edit-room/${r.roomId}`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button
                variant="danger"
                onClick={() => {
                  if (window.confirm("Delete this room?")) {
                    deleteMutation.mutate(r.roomId);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          ),
        }))}
      />
      <Paginator currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </DashboardLayout>
  );
}