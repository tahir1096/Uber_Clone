import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaptainContext } from '../context/CaptainContext';
import { Car, LogOut, TrendingUp, DollarSign, Users } from 'lucide-react';

const CaptainDashboard = () => {
  const { captain, logout, isAuthenticated } = useContext(CaptainContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/captain-login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!captain) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/uber-logo.png" alt="Uber" className="h-8 w-auto" />
          </div>

          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-gray-600">Captain</p>
              <p className="font-semibold text-gray-900">
                {captain.firstname} {captain.lastname || ''}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Status Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Online Status</h2>
            <button className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition">
              Go Online
            </button>
          </div>
          <div className="bg-green-50 border-2 border-green-200 p-6 rounded-lg">
            <p className="text-green-800 font-semibold">Currently Offline</p>
            <p className="text-green-700 text-sm mt-1">Turn on to start accepting rides</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Earnings Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Today's Earnings</h3>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">₹0.00</p>
            <p className="text-sm text-gray-600">0 rides completed</p>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Vehicle</h3>
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">{captain.vehicleDetails?.vehicleType || 'N/A'}</p>
            <p className="text-sm text-gray-600">{captain.vehicleDetails?.color || 'N/A'} - {captain.vehicleDetails?.plateNumber || 'N/A'}</p>
          </div>

          {/* Rating */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Rating</h3>
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-yellow-600 mb-2">5.0 ⭐</p>
            <p className="text-sm text-gray-600">Based on 0 ratings</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6">This Week</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Total Earnings</span>
                <span className="text-xl font-bold text-gray-900">₹0.00</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Rides Completed</span>
                <span className="text-xl font-bold text-gray-900">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Distance Driven</span>
                <span className="text-xl font-bold text-gray-900">0 km</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Profile</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Email</span>
                <span className="text-gray-900 truncate ml-4">{captain.email}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Status</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {captain.status || 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-900">Jan 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Available Rides Section */}
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Available Rides</h2>
          <p className="text-gray-600 mb-6">
            Go online to start accepting rides from nearby passengers
          </p>
          <button className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition">
            Go Online Now
          </button>
        </div>
      </main>
    </div>
  );
};

export default CaptainDashboard;
