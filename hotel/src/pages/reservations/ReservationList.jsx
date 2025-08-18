import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReservations, deleteReservation } from "../../api/reservationApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/Table";
import Button from "../../components/Button";
import SearchInput from "../../components/SearchInput";
import Paginator from "../../components/Paginator";
import { useState } from "react";

export default function ReservationList() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["reservations"], getReservations);

  const deleteMutation = useMutation(deleteReservation, {
    onSuccess: () => queryClient.invalidateQueries(["reservations"]),
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  if (isLoading) return <p>Loading...</p>;

  let reservations = data?.data || [];

  reservations = reservations.filter(
    (r) =>
      r.hotel?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.guest?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      r.guest?.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(reservations.length / pageSize);
  const paginatedData = reservations.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DashboardLayout title="Manage Reservations">
      <div className="mb-4 w-1/3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by hotel or guest..." />
      </div>
      <Table
        columns={["ID", "Hotel", "Guest", "Room", "Start Date", "End Date", "Actions"]}
        data={paginatedData.map((r) => ({
          ID: r.reservationId,
          Hotel: r.hotel?.name,
          Guest: `${r.guest?.firstName} ${r.guest?.lastName}`,
          Room: r.room?.name,
          "Start Date": r.startDate,
          "End Date": r.endDate,
          Actions: (
            <Button
              variant="danger"
              onClick={() => {
                if (window.confirm("Cancel this reservation?")) {
                  deleteMutation.mutate(r.reservationId);
                }
              }}
            >
              Delete
            </Button>
          ),
        }))}
      />
      <Paginator currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </DashboardLayout>
  );
}