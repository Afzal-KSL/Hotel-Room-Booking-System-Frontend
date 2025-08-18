import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHotels } from "../../api/hotelApi";
import { Link } from "react-router-dom";
import GuestProfileMenu from "../../components/GuestProfileMenu";

export default function Home() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["hotels"],
    queryFn: getHotels,
    retry: 3,
    retryDelay: 1000,
  });

  const [search, setSearch] = useState("");

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600 font-semibold">Loading hotels...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            {error.response?.data?.message || error.message || "Failed to load hotels"}
          </p>
          <button 
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hotels = (data?.data || []).filter(
    h =>
      h.name?.toLowerCase().includes(search.toLowerCase()) ||
      h.location?.toLowerCase().includes(search.toLowerCase()) ||
      h.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-50 py-10 relative px-6">
      {/* Profile avatar top-right corner */}
      <div className="fixed top-6 right-8 z-50 flex items-center space-x-4">
        <div className="bg-white px-4 py-2 rounded-lg shadow-md">
          <span className="text-sm text-gray-600">Welcome back!</span>
        </div>
        <GuestProfileMenu />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">Find Your Perfect Stay</h1>
          <p className="text-gray-600 text-lg">Discover amazing hotels and book your next adventure</p>
        </div>

        {/* Search bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search hotels by name, location, or address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-2xl px-5 py-4 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none bg-white shadow text-lg"
          />
        </div>

        {hotels.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-blue-300 text-6xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hotels found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map(hotel => (
              <div
                key={hotel.hotelId}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col"
              >
                {hotel.image ? (
                  <img
                    src={`data:image/jpeg;base64,${hotel.image}`}
                    alt={hotel.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                <div className="w-full h-48 bg-blue-100 hidden items-center justify-center text-blue-400 text-4xl rounded-t-lg">
                  🏨
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">
                    {hotel.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-1">📍 {hotel.location}</p>
                  <p className="text-gray-400 text-xs mb-4">{hotel.address}</p>
                  <Link
                    to={`/hotels/${hotel.hotelId}`}
                    className="mt-auto inline-block px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-semibold transition transform hover:scale-105"
                  >
                    View Details & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}