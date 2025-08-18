import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHotel } from "../../api/hotelApi";
import { useAuth } from "../../context/AuthContext";
import GuestProfileMenu from "../../components/GuestProfileMenu";

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Fix: Use simple date format (YYYY-MM-DD only)
  const currentDate = new Date().toISOString().split('T')[0];

  const { data, isLoading, error } = useQuery({
    queryKey: ["hotel", id, currentDate],
    queryFn: () => getHotel(id, currentDate),
    enabled: !!id, // Only run query when id exists
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600 font-semibold">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Hotel</h2>
          <p className="text-gray-600 mb-4">
            {error.response?.data?.message || error.message || "Sorry, we couldn't load the hotel details."}
          </p>
          <button 
            onClick={() => navigate('/home')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  const hotel = data?.data;

  // Add null check
  if (!hotel) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-gray-500 text-6xl mb-4">🏨</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hotel Not Found</h2>
          <p className="text-gray-600 mb-4">The hotel you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/home')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  const handleBookRoom = (room) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const renderRoomImage = (room) => {
    if (room.image) {
      return (
        <img
          src={`data:image/jpeg;base64,${room.image}`}
          alt={room.name}
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    return (
      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-400 text-6xl rounded-lg">
        🛏️
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Fixed Profile Menu */}
      <div className="fixed top-6 right-8 z-50">
        <GuestProfileMenu />
      </div>

      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium"
          >
            ← Back to Hotels
          </button>
          <h1 className="text-xl font-bold text-gray-800 truncate ml-4">
            {hotel.name || 'Hotel Details'}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hotel Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-4xl font-bold text-blue-700 mb-4">{hotel.name}</h1>
              <div className="space-y-3">
                <p className="text-gray-600 text-lg flex items-center">
                  <span className="text-2xl mr-3">📍</span>
                  {hotel.address}
                </p>
                <p className="text-gray-500 flex items-center">
                  <span className="text-2xl mr-3">🌆</span>
                  {hotel.location}
                </p>
              </div>
            </div>
            
            {/* Hotel Image */}
            <div className="flex justify-center">
              {hotel.image ? (
                <img
                  src={`data:image/jpeg;base64,${hotel.image}`}
                  alt={hotel.name}
                  className="w-full max-w-md h-64 object-cover rounded-xl shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full max-w-md h-64 bg-gradient-to-br from-blue-100 to-blue-200 hidden items-center justify-center text-blue-400 text-8xl rounded-xl shadow-md">
                🏨
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-blue-600 mr-3">🛏️</span>
            Available Rooms
          </h2>
          
          {hotel.rooms && hotel.rooms.length > 0 ? (
            <div className="space-y-6">
              {hotel.rooms.map(room => (
                <div
                  key={room.roomId}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Room Image */}
                    <div className="lg:col-span-1">
                      {renderRoomImage(room)}
                    </div>
                    
                    {/* Room Details */}
                    <div className="lg:col-span-1 space-y-3">
                      <h3 className="text-2xl font-bold text-blue-700">{room.name}</h3>
                      <div className="space-y-2">
                        <p className="text-gray-600 flex items-center">
                          <span className="font-semibold mr-2">Floor:</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{room.floor}</span>
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <span className="font-semibold mr-2">Room Number:</span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">{room.number}</span>
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <span className="font-semibold mr-2">Available:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            room.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {room.isAvailable ? 'Yes' : 'No'}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Booking Section */}
                    <div className="lg:col-span-1 flex flex-col justify-center">
                      {room.isAvailable ? (
                        <div className="text-center space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-2xl font-bold text-blue-700">₹2,999</p>
                            <p className="text-gray-600 text-sm">per night</p>
                          </div>
                          <button
                            onClick={() => handleBookRoom(room)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105"
                          >
                            Book Now
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 font-medium">Room Unavailable</p>
                            <p className="text-gray-400 text-sm">Check other rooms</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-300 text-8xl mb-4">🚫</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Rooms Available</h3>
              <p className="text-gray-500">This hotel currently has no rooms listed.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          hotel={hotel}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedRoom(null);
          }}
        />
      )}
    </div>
  );
}

// Booking Modal Component (same as before)
function BookingModal({ room, hotel, onClose }) {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleBooking = async () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (new Date(bookingData.checkIn) >= new Date(bookingData.checkOut)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    setLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      alert('Booking successful! You will receive a confirmation email shortly.');
      setLoading(false);
      onClose();
      navigate('/dashboard/guest');
    }, 2000);
  };

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const totalAmount = calculateNights() * 2999;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Book Room</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Room Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">{room.name}</h3>
            <p className="text-blue-600">{hotel.name}</p>
            <p className="text-sm text-gray-600">{hotel.address}</p>
          </div>

          {/* Booking Form */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Check-in Date</label>
              <input
                type="date"
                name="checkIn"
                value={bookingData.checkIn}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Check-out Date</label>
              <input
                type="date"
                name="checkOut"
                value={bookingData.checkOut}
                onChange={handleInputChange}
                min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Number of Guests</label>
            <select
              name="guests"
              value={bookingData.guests}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {/* Price Summary */}
          {calculateNights() > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>₹2,999 × {calculateNights()} night{calculateNights() > 1 ? 's' : ''}</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={loading || !bookingData.checkIn || !bookingData.checkOut}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition"
            >
              {loading ? 'Booking...' : `Confirm Booking - ₹${totalAmount.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}