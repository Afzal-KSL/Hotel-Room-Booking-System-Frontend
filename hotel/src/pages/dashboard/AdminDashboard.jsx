import { useQuery } from "@tanstack/react-query";
import { getHotels } from "../../api/hotelApi";
import { getUsersByRole } from "../../api/authApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/Table";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("hotels");
  
  const { data: hotelsData, isLoading: hotelsLoading } = useQuery(["hotels"], getHotels);
  const { data: usersData, isLoading: usersLoading } = useQuery(["users"], () => 
    Promise.all([
      getUsersByRole("GUEST"),
      getUsersByRole("STAFF"),
      getUsersByRole("ADMIN")
    ])
  );

  if (hotelsLoading || usersLoading) return <p>Loading...</p>;

  const hotelColumns = ["ID", "Name", "Location"];
  const hotelRows = hotelsData?.data?.map(h => ({
    ID: h.hotelId,
    Name: h.name,
    Location: h.location
  })) || [];

  const userColumns = ["ID", "Username", "Role", "Profile Status"];
  const allUsers = usersData ? [
    ...usersData[0].data.map(u => ({ ...u, role: "GUEST" })),
    ...usersData[1].data.map(u => ({ ...u, role: "STAFF" })),
    ...usersData[2].data.map(u => ({ ...u, role: "ADMIN" }))
  ] : [];
  
  const userRows = allUsers.map(u => ({
    ID: u.userId,
    Username: u.username,
    Role: u.role,
    "Profile Status": u.role === "GUEST" ? (u.guest ? "Complete" : "Incomplete") : "N/A"
  }));
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
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
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium ${
              activeTab === "users"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 font-medium ${
              activeTab === "stats"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Statistics
          </button>
        </div>
      </div>

      {activeTab === "hotels" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Hotels Overview</h2>
          <Table columns={hotelColumns} data={hotelRows} />
        </div>
      )}

      {activeTab === "users" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">User Role Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{usersData?.[0]?.data?.length || 0}</div>
                <div className="text-gray-600">Guests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{usersData?.[1]?.data?.length || 0}</div>
                <div className="text-gray-600">Staff</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{usersData?.[2]?.data?.length || 0}</div>
                <div className="text-gray-600">Admins</div>
              </div>
            </div>
          </div>
          <Table columns={userColumns} data={userRows} />
        </div>
      )}

      {activeTab === "stats" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">System Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="text-3xl font-bold text-blue-600">{hotelRows.length}</div>
              <div className="text-gray-600">Total Hotels</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="text-3xl font-bold text-green-600">{allUsers.length}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="text-3xl font-bold text-purple-600">
                {allUsers.filter(u => u.role === "GUEST" && u.guest).length}
              </div>
              <div className="text-gray-600">Active Guests</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="text-3xl font-bold text-orange-600">
                {allUsers.filter(u => u.role === "STAFF").length}
              </div>
              <div className="text-gray-600">Staff Members</div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}