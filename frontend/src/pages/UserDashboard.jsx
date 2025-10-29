import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { MapPin, Phone, LogOut, Home as HomeIcon, History } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
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
            <span className="text-gray-700">Welcome, {user.firstname}!</span>
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
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Profile Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.firstname[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {user.firstname} {user.lastname || ''}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="space-y-3 border-t pt-4">
              <p className="text-sm text-gray-600">Member since: Jan 2025</p>
              <p className="text-sm text-gray-600">Rides Completed: 0</p>
              <p className="text-sm text-gray-600">Rating: 5.0 ⭐</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Book a Ride</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                <History className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Ride History</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Support</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹0.00</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Rides Taken</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Distance Covered</p>
                <p className="text-2xl font-bold text-gray-900">0 km</p>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
          <HomeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Ready to start? Book your first ride and get ₹100 discount on your ride!
          </p>
          <button className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition">
            Book a Ride Now
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
