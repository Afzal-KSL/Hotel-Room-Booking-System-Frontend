import { useQuery } from "@tanstack/react-query";
import { getReservations } from "../../api/reservationApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/Table";

export default function StaffDashboard() {
  const { data, isLoading } = useQuery(["reservations"], getReservations);
  if (isLoading) return <p>Loading...</p>;

  const columns = ["ID", "Hotel", "Guest", "Room", "Start Date", "End Date"];
  const rows = data.data.map(r => ({
    ID: r.reservationId,
    Hotel: r.hotel?.name,
    Guest: `${r.guest?.firstName} ${r.guest?.lastName}`,
    Room: r.room?.name,
    "Start Date": r.startDate,
    "End Date": r.endDate
  }));

  return (
    <DashboardLayout title="Staff Dashboard - Reservations">
      <Table columns={columns} data={rows} />
    </DashboardLayout>
  );
}