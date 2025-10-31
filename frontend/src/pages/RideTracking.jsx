import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Phone, MessageCircle, Star, MapPin } from 'lucide-react';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const RideTracking = () => {
  const navigate = useNavigate();
  const [activeRide, setActiveRide] = useState(null);
  const [captainLocation, setCaptainLocation] = useState({ lat: 31.5497, lng: 74.3436 });
  const [rideStatus, setRideStatus] = useState('pickup');

  useEffect(() => {
    // Sample ride data
    const ride = {
      id: 'RIDE123',
      passenger: {
        name: 'Tahir Khan',
        rating: 4.9,
        phone: '+92-3061001040',
        image: 'T',
      },
      pickup: { lat: 31.5497, lng: 74.3436, name: 'Defence, Lahore' },
      dropoff: { lat: 31.5464, lng: 74.3139, name: 'Mall Road, Lahore' },
      fare: 520,
      distance: '8.7 km',
      eta: '12 min',
      paymentMethod: 'Cash',
      route: [
        [31.5497, 74.3436],
        [31.5500, 74.3450],
        [31.5470, 74.3200],
        [31.5464, 74.3139],
      ],
    };

    setActiveRide(ride);

    // Simulate captain location updates (real-time tracking)
    const interval = setInterval(() => {
      setCaptainLocation((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.005,
        lng: prev.lng + (Math.random() - 0.5) * 0.005,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleGoBack = () => {
    navigate('/captain-dashboard');
  };

  const updateRideStatus = (status) => {
    setRideStatus(status);
    if (status === 'completed') {
      setTimeout(() => {
        navigate('/captain-dashboard');
      }, 2000);
    }
  };

  if (!activeRide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No active ride</p>
          <button
            onClick={handleGoBack}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-gray-900">Active Ride</h1>
          <div className="text-right">
            <p className="text-sm text-gray-600">Ride #{activeRide.id}</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-96 lg:h-full">
              <MapContainer
                center={[captainLocation.lat, captainLocation.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />

                {/* Pickup Location */}
                <Marker position={[activeRide.pickup.lat, activeRide.pickup.lng]}>
                  <Popup>
                    <div>
                      <p className="font-bold">Pickup</p>
                      <p>{activeRide.pickup.name}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Dropoff Location */}
                <Marker position={[activeRide.dropoff.lat, activeRide.dropoff.lng]}>
                  <Popup>
                    <div>
                      <p className="font-bold">Dropoff</p>
                      <p>{activeRide.dropoff.name}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Captain Location (Current) */}
                <Marker
                  position={[captainLocation.lat, captainLocation.lng]}
                  icon={L.icon({
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
                    iconSize: [25, 41],
                    className: 'captain-marker',
                  })}
                >
                  <Popup>
                    <p>You are here</p>
                  </Popup>
                </Marker>

                {/* Route Line */}
                {rideStatus !== 'pickup' && (
                  <Polyline
                    positions={activeRide.route}
                    color="blue"
                    weight={3}
                    opacity={0.7}
                  />
                )}
              </MapContainer>
            </div>
          </div>

          {/* Ride Details - Right Side */}
          <div className="space-y-4">
            {/* Passenger Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Passenger Details</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {activeRide.passenger.image}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{activeRide.passenger.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-600">{activeRide.passenger.rating}</span>
                  </div>
                </div>
              </div>

              {/* Passenger Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold">Call</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-100 hover:bg-green-200 rounded-lg transition">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold">Message</span>
                </button>
              </div>
            </div>

            {/* Trip Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Trip Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600">From</p>
                    <p className="font-semibold text-gray-900">{activeRide.pickup.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600">To</p>
                    <p className="font-semibold text-gray-900">{activeRide.dropoff.name}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Distance</p>
                  <p className="font-bold text-gray-900">{activeRide.distance}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">ETA</p>
                  <p className="font-bold text-gray-900">{activeRide.eta}</p>
                </div>
              </div>
            </div>

            {/* Ride Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Ride Status</h3>
              <div className="space-y-2">
                {rideStatus === 'pickup' && (
                  <>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                      <p className="text-sm font-semibold text-yellow-900">Heading to pickup location...</p>
                    </div>
                    <button
                      onClick={() => updateRideStatus('in-transit')}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Passenger Picked Up
                    </button>
                  </>
                )}

                {rideStatus === 'in-transit' && (
                  <>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                      <p className="text-sm font-semibold text-blue-900">In transit to dropoff...</p>
                    </div>
                    <button
                      onClick={() => updateRideStatus('completed')}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Complete Ride
                    </button>
                  </>
                )}

                {rideStatus === 'completed' && (
                  <>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                      <p className="text-sm font-semibold text-green-900">✓ Ride completed!</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-2">Earnings for this ride</p>
                      <p className="text-3xl font-bold text-gray-900">₨{activeRide.fare}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Fare */}
            <div className="bg-black text-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-300">Total Fare</p>
                <p className="text-3xl font-bold">₨{activeRide.fare}</p>
              </div>
              <p className="text-xs text-gray-400">Payment: {activeRide.paymentMethod}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RideTracking;
