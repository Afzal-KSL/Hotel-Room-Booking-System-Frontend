import { useQuery } from "@tanstack/react-query";
import { getHotels } from "../../api/hotelApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/Table";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery(["hotels"], getHotels);
  if (isLoading) return <p>Loading...</p>;

  const columns = ["ID", "Name", "Location"];
  const rows = data.data.map(h => ({
    ID: h.hotelId,
    Name: h.name,
    Location: h.location
  }));

  return (
    <DashboardLayout title="Admin Dashboard - Hotels">
      <Table columns={columns} data={rows} />
    </DashboardLayout>
  );
}