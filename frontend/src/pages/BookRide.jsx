import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupabaseAuthContext } from '../context/SupabaseAuthContext';
import { ArrowLeft, MapPin, Navigation, Search, Clock, Users } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

// Sample location data
const sampleLocations = [
  { name: 'Defence, Lahore', lat: 31.5497, lng: 74.3436 },
  { name: 'Mall Road, Lahore', lat: 31.5464, lng: 74.3139 },
  { name: 'Johar Town, Lahore', lat: 31.4809, lng: 74.2940 },
  { name: 'Airport Road, Lahore', lat: 31.5165, lng: 74.1437 },
  { name: 'Saddar, Lahore', lat: 31.5474, lng: 74.3436 },
  { name: 'Gulberg, Lahore', lat: 31.5622, lng: 74.2167 },
];

const rideTypes = [
  { id: 'bike', name: 'Bike', perKm: 10, description: 'Budget-friendly option for 1 person', icon: '🏍️', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop', capacity: 1 },
  { id: 'rickshaw', name: 'Rickshaw', perKm: 15, description: 'Economy ride for 3 passengers', icon: '🛺', image: 'https://images.unsplash.com/photo-1533473359331-35ac8b3fd8e9?w=200&h=200&fit=crop', capacity: 3 },
  { id: 'car', name: 'Car', perKm: 30, description: 'Comfortable ride for 4 passengers', icon: '🚗', image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=200&h=200&fit=crop', capacity: 4 },
];

const MapUpdater = ({ location }) => {
  const map = useMap();
  
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 15);
    }
  }, [location, map]);
  
  return null;
};

const BookRide = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [selectedRideType, setSelectedRideType] = useState('bike');
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [currentMapCenter, setCurrentMapCenter] = useState({ lat: 31.5497, lng: 74.3436 });
  const [bookingStatus, setBookingStatus] = useState('idle');

  const handleGoBack = () => {
    navigate('/user-dashboard');
  };

  const handleLocationSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = sampleLocations.filter(loc =>
        loc.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowLocationSearch(true);
    } else {
      setFilteredLocations([]);
      setShowLocationSearch(false);
    }
  };

  const selectLocation = (location, type) => {
    if (type === 'pickup') {
      setPickupLocation(location);
      setCurrentMapCenter(location);
      setStep(2);
    } else {
      setDropoffLocation(location);
      calculateFare(location);
      setStep(3);
    }
    setSearchQuery('');
    setFilteredLocations([]);
    setShowLocationSearch(false);
  };

  const calculateFare = (dropoff) => {
    if (!pickupLocation || !dropoff) return;
    
    // Simple distance calculation (Haversine formula)
    const R = 6371;
    const dLat = (dropoff.lat - pickupLocation.lat) * (Math.PI / 180);
    const dLng = (dropoff.lng - pickupLocation.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pickupLocation.lat * (Math.PI / 180)) *
        Math.cos(dropoff.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    const rideType = rideTypes.find(rt => rt.id === selectedRideType);
    const fare = distance * rideType.perKm;
    const time = Math.round(distance / 40 * 60); // Assuming 40 km/h average speed

    setEstimatedFare(Math.round(fare));
    setEstimatedTime(time);
  };

  const handleRideTypeChange = (rideTypeId) => {
    setSelectedRideType(rideTypeId);
    if (dropoffLocation) {
      calculateFare(dropoffLocation);
    }
  };

  const confirmRide = async () => {
    setBookingStatus('booking');
    
    // Simulate booking
    setTimeout(() => {
      setBookingStatus('confirmed');
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 2000);
    }, 2000);
  };

  if (bookingStatus === 'confirmed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ride Booked!</h2>
          <p className="text-gray-600 mb-4">Finding nearby captains...</p>
          <div className="animate-pulse text-gray-400">Redirecting...</div>
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
          <h1 className="text-xl font-bold text-gray-900">Book a Ride</h1>
          <div className="w-8"></div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-96 lg:h-full">
              <MapContainer
                center={[currentMapCenter.lat, currentMapCenter.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {pickupLocation && (
                  <Marker position={[pickupLocation.lat, pickupLocation.lng]}>
                    <Popup>Pickup: {pickupLocation.name}</Popup>
                  </Marker>
                )}
                {dropoffLocation && (
                  <Marker position={[dropoffLocation.lat, dropoffLocation.lng]}>
                    <Popup>Dropoff: {dropoffLocation.name}</Popup>
                  </Marker>
                )}
                <MapUpdater location={currentMapCenter} />
              </MapContainer>
            </div>
          </div>

          {/* Right - Booking Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24">
            <div className="space-y-6">
              {/* Progress Steps */}
              <div className="flex justify-between mb-6">
                <div className={`flex-1 text-center pb-2 border-b-2 ${step >= 1 ? 'border-black' : 'border-gray-200'}`}>
                  <span className={`text-sm font-semibold ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>Location</span>
                </div>
                <div className={`flex-1 text-center pb-2 border-b-2 ${step >= 2 ? 'border-black' : 'border-gray-200'}`}>
                  <span className={`text-sm font-semibold ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>Ride</span>
                </div>
                <div className={`flex-1 text-center pb-2 border-b-2 ${step >= 3 ? 'border-black' : 'border-gray-200'}`}>
                  <span className={`text-sm font-semibold ${step >= 3 ? 'text-black' : 'text-gray-400'}`}>Confirm</span>
                </div>
              </div>

              {/* Step 1: Location Selection */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900">Select Pickup Location</h3>
                  <div className="relative">
                    <div className="flex items-center gap-2 p-3 border-2 border-blue-400 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <input
                        type="text"
                        placeholder="Search location..."
                        value={searchQuery}
                        onChange={(e) => handleLocationSearch(e.target.value)}
                        onFocus={() => {
                          if (searchQuery.length > 0) {
                            setShowLocationSearch(true);
                          }
                        }}
                        className="flex-1 outline-none bg-transparent"
                      />
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    {showLocationSearch && filteredLocations.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                        <div className="p-2 text-xs text-gray-500 font-semibold">SUGGESTED LOCATIONS</div>
                        {filteredLocations.map((location) => (
                          <button
                            key={location.name}
                            onClick={() => selectLocation(location, 'pickup')}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-gray-900">{location.name}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-600 font-semibold mb-3">POPULAR LOCATIONS</p>
                    <div className="grid grid-cols-2 gap-2">
                      {sampleLocations.map((location) => (
                        <button
                          key={location.name}
                          onClick={() => selectLocation(location, 'pickup')}
                          className="p-3 text-left bg-gray-50 hover:bg-blue-50 rounded-lg transition text-sm border border-gray-200"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <p className="font-semibold text-gray-900">{location.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Dropoff Selection */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">From</h4>
                    <p className="font-semibold text-gray-900">{pickupLocation?.name}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    Change Pickup
                  </button>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Select Dropoff Location</h3>
                    <div className="relative mb-4">
                      <div className="flex items-center gap-2 p-3 border-2 border-red-400 rounded-lg">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <input
                          type="text"
                          placeholder="Search location..."
                          value={searchQuery}
                          onChange={(e) => handleLocationSearch(e.target.value)}
                          onFocus={() => {
                            if (searchQuery.length > 0) {
                              setShowLocationSearch(true);
                            }
                          }}
                          className="flex-1 outline-none bg-transparent"
                        />
                        <Search className="w-5 h-5 text-gray-400" />
                      </div>
                      {showLocationSearch && filteredLocations.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                          <div className="p-2 text-xs text-gray-500 font-semibold">SUGGESTED LOCATIONS</div>
                          {filteredLocations.map((location) => (
                            <button
                              key={location.name}
                              onClick={() => selectLocation(location, 'dropoff')}
                              className="w-full text-left px-4 py-3 hover:bg-red-50 border-b last:border-b-0 transition"
                            >
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                                <div>
                                  <p className="font-semibold text-gray-900">{location.name}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {sampleLocations.map((location) => (
                        <button
                          key={location.name}
                          onClick={() => selectLocation(location, 'dropoff')}
                          className="p-3 text-left bg-gray-50 hover:bg-red-50 rounded-lg transition text-sm border border-gray-200"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <p className="font-semibold text-gray-900">{location.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Ride Type & Confirmation */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">From</p>
                        <p className="text-sm font-semibold text-gray-900">{pickupLocation?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">To</p>
                        <p className="text-sm font-semibold text-gray-900">{dropoffLocation?.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-bold text-gray-900 mb-3">Choose Ride Type</h3>
                    <div className="space-y-2">
                      {rideTypes.map((ride) => (
                        <button
                          key={ride.id}
                          onClick={() => handleRideTypeChange(ride.id)}
                          className={`w-full p-4 rounded-lg border-2 transition text-left ${
                            selectedRideType === ride.id
                              ? 'border-black bg-black/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img 
                                src={ride.image} 
                                alt={ride.name}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                              <div>
                                <p className="font-bold text-gray-900">{ride.name}</p>
                                <p className="text-xs text-gray-600">{ride.description}</p>
                                <p className="text-xs text-gray-500 mt-1">₨{ride.perKm}/km</p>
                              </div>
                            </div>
                            <p className="font-bold text-gray-900">₨{Math.round(estimatedFare)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Estimated Time
                      </span>
                      <span className="font-semibold text-gray-900">{estimatedTime} min</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-black">₨{estimatedFare}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={confirmRide}
                      disabled={bookingStatus === 'booking'}
                      className="w-full px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                    >
                      {bookingStatus === 'booking' ? 'Booking...' : 'Confirm Ride'}
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      className="w-full px-6 py-2 bg-gray-200 text-gray-900 rounded-full font-semibold hover:bg-gray-300 transition"
                    >
                      Change Location
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookRide;
