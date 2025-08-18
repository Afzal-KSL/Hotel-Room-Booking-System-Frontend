import { useQuery } from "@tanstack/react-query";
import { getReservations } from "../../api/reservationApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/Table";
import { useAuth } from "../../context/AuthContext";

export default function GuestDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery(["reservations"], getReservations);
  if (isLoading) return <p>Loading...</p>;

  const myRows = data.data.filter(r => r.guest?.firstName === user?.username)
    .map(r => ({
      Hotel: r.hotel?.name,
      Room: r.room?.name,
      "Start Date": r.startDate,
      "End Date": r.endDate
    }));

  return (
    <DashboardLayout title="My Reservations">
      <Table columns={["Hotel", "Room", "Start Date", "End Date"]} data={myRows} />
    </DashboardLayout>
  );
}