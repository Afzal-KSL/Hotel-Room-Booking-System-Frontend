import { useQuery } from "@tanstack/react-query";
import { getReservations } from "../../api/reservationApi";
import { getHotels } from "../../api/hotelApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/Table";
import { useState } from "react";

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("reservations");
  
  const { data: reservationsData, isLoading: reservationsLoading } = useQuery(["reservations"], getReservations);
  const { data: hotelsData, isLoading: hotelsLoading } = useQuery(["hotels"], getHotels);

  if (reservationsLoading || hotelsLoading) return <p>Loading...</p>;
    ID: r.reservationId,
    Hotel: r.hotel?.name,
    Guest: `${r.guest?.firstName} ${r.guest?.lastName}`,
    Room: r.room?.name,
    "Start Date": r.startDate,
    "End Date": r.endDate
  }));

  })) || [];

  const hotelColumns = ["ID", "Name", "Location", "Total Rooms"];
  const hotelRows = hotelsData?.data?.map(h => ({
    ID: h.hotelId,
    Name: h.name,
    Location: h.location,
    "Total Rooms": h.rooms?.length || 0
  })) || [];
  const reservationRows = reservationsData?.data?.map(r => ({
  return (
    <DashboardLayout title="Staff Dashboard">
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab("reservations")}
            className={`px-4 py-2 font-medium ${
              activeTab === "reservations"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Reservations
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`px-4 py-2 font-medium ${
              activeTab === "hotels"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Hotels Overview
          </button>
        </div>
      </div>
      {activeTab === "reservations" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Reservations</h2>
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{reservationRows.length}</div>
              <div className="text-gray-600">Total Active Reservations</div>
            </div>
          </div>
          <Table columns={reservationColumns} data={reservationRows} />
        </div>
      )}

      {activeTab === "hotels" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Hotels Overview</h2>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{hotelRows.length}</div>
              <div className="text-gray-600">Total Hotels</div>
            </div>
          </div>
          <Table columns={hotelColumns} data={hotelRows} />
        </div>
      )}
    </DashboardLayout>
  );
}