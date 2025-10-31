import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupabaseAuthContext } from '../context/SupabaseAuthContext';
import { ArrowLeft, Clock, MapPin, Star } from 'lucide-react';

const RideHistory = () => {
  const { user } = useContext(SupabaseAuthContext);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/user-dashboard');
  };

  // Sample ride history data
  const rideHistory = [
    {
      id: 1,
      date: 'Oct 28, 2025',
      time: '2:30 PM',
      from: 'Defence, Lahore',
      to: 'Mall Road, Lahore',
      distance: '5.2 km',
      price: '₨350',
      status: 'Completed',
      driver: 'Ahmed Khan',
      rating: 5,
    },
    {
      id: 2,
      date: 'Oct 25, 2025',
      time: '5:15 PM',
      from: 'Saddar, Lahore',
      to: 'Johar Town, Lahore',
      distance: '8.7 km',
      price: '₨520',
      status: 'Completed',
      driver: 'Muhammad Ali',
      rating: 4,
    },
    {
      id: 3,
      date: 'Oct 20, 2025',
      time: '11:00 AM',
      from: 'Airport Road, Lahore',
      to: 'Mall of Lahore',
      distance: '15.3 km',
      price: '₨890',
      status: 'Completed',
      driver: 'Hassan Raza',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <img src="/uber-logo.png" alt="Uber" className="h-8 w-auto" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Ride History</h1>
          <div className="w-8"></div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {rideHistory.length > 0 ? (
            rideHistory.map((ride) => (
              <div
                key={ride.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ride Details */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {ride.date} at {ride.time}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">From</p>
                          <p className="font-semibold text-gray-900">{ride.from}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">To</p>
                          <p className="font-semibold text-gray-900">{ride.to}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ride Stats */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-600">Distance</p>
                          <p className="text-lg font-bold text-gray-900">{ride.distance}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-600">Total</p>
                          <p className="text-lg font-bold text-gray-900">{ride.price}</p>
                        </div>
                      </div>

                      <div className="text-sm">
                        <p className="text-gray-600">Driver: <span className="font-semibold">{ride.driver}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Rating:</span>
                      <div className="flex gap-1">
                        {Array(5).fill(0).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < ride.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{ride.rating}.0</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
              <p className="text-gray-600 mb-4">No ride history yet</p>
              <button
                onClick={handleGoBack}
                className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition"
              >
                Book Your First Ride
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RideHistory;
