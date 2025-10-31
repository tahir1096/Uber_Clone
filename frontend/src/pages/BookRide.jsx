import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, Search, Clock, Users, Loader } from 'lucide-react';
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

// Create custom icons for different marker types
const createCustomIcon = (type) => {
  let html = '';
  if (type === 'pickup') {
    html = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" fill="none">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 13.2 16 24 16 24s16-10.8 16-24c0-8.8-7.2-16-16-16z" fill="#2563eb" stroke="#1e40af" stroke-width="1"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>`;
  } else if (type === 'dropoff') {
    html = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" fill="none">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 13.2 16 24 16 24s16-10.8 16-24c0-8.8-7.2-16-16-16z" fill="#dc2626" stroke="#991b1b" stroke-width="1"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>`;
  } else if (type === 'current') {
    html = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" fill="none">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 13.2 16 24 16 24s16-10.8 16-24c0-8.8-7.2-16-16-16z" fill="#10b981" stroke="#047857" stroke-width="1"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>`;
  }
  
  return L.divIcon({
    html: html,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
    className: 'custom-marker'
  });
};

// Sample location data
const sampleLocations = [
  { name: 'Defence, Lahore', lat: 31.5497, lng: 74.3436 },
  { name: 'Mall Road, Lahore', lat: 31.5464, lng: 74.3139 },
  { name: 'Johar Town, Lahore', lat: 31.4809, lng: 74.2940 },
  { name: 'Airport Road, Lahore', lat: 31.5165, lng: 74.1437 },
  { name: 'Saddar, Lahore', lat: 31.5474, lng: 74.3436 },
  { name: 'Gulberg, Lahore', lat: 31.5622, lng: 74.2167 },
];

// SVG icons for ride types
const rideTypeIcons = {
  bike: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
    <rect width="200" height="200" fill="#f3f4f6" rx="8"/>
    <g transform="translate(50, 50)">
      <circle cx="15" cy="50" r="15" stroke="#1f2937" stroke-width="3" fill="none"/>
      <circle cx="85" cy="50" r="15" stroke="#1f2937" stroke-width="3" fill="none"/>
      <rect x="30" y="35" width="40" height="30" stroke="#1f2937" stroke-width="3" fill="none" rx="3"/>
      <circle cx="50" cy="30" r="4" fill="#1f2937"/>
      <line x1="50" y1="30" x2="50" y2="50" stroke="#1f2937" stroke-width="2"/>
    </g>
  </svg>`,
  rickshaw: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
    <rect width="200" height="200" fill="#f3f4f6" rx="8"/>
    <g transform="translate(25, 45)">
      <circle cx="15" cy="65" r="12" stroke="#1f2937" stroke-width="3" fill="none"/>
      <circle cx="135" cy="65" r="12" stroke="#1f2937" stroke-width="3" fill="none"/>
      <path d="M 30 70 L 45 20 L 120 20 L 135 70" stroke="#1f2937" stroke-width="3" fill="none" stroke-linejoin="round"/>
      <rect x="50" y="15" width="40" height="25" fill="#f97316" opacity="0.3" rx="2"/>
      <line x1="20" y1="50" x2="130" y2="50" stroke="#1f2937" stroke-width="2"/>
    </g>
  </svg>`,
  car: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
    <rect width="200" height="200" fill="#f3f4f6" rx="8"/>
    <g transform="translate(20, 50)">
      <circle cx="20" cy="60" r="15" stroke="#1f2937" stroke-width="3" fill="none"/>
      <circle cx="140" cy="60" r="15" stroke="#1f2937" stroke-width="3" fill="none"/>
      <path d="M 20 70 L 35 35 L 125 35 L 140 70 Z" stroke="#1f2937" stroke-width="3" fill="none" stroke-linejoin="round"/>
      <rect x="50" y="25" width="50" height="25" stroke="#1f2937" stroke-width="2" fill="#e0e7ff" rx="3"/>
      <rect x="35" y="45" width="25" height="15" stroke="#1f2937" stroke-width="1.5" fill="none" rx="2"/>
      <rect x="100" y="45" width="25" height="15" stroke="#1f2937" stroke-width="1.5" fill="none" rx="2"/>
    </g>
  </svg>`
};

const rideTypes = [
  { id: 'bike', name: 'Bike', perKm: 10, description: 'Budget-friendly option for 1 person', icon: rideTypeIcons.bike, capacity: 1 },
  { id: 'rickshaw', name: 'Rickshaw', perKm: 15, description: 'Economy ride for 3 passengers', icon: rideTypeIcons.rickshaw, capacity: 3 },
  { id: 'car', name: 'Car', perKm: 30, description: 'Comfortable ride for 4 passengers', icon: rideTypeIcons.car, capacity: 4 },
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
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleGoBack = () => {
    navigate('/user-dashboard');
  };

  // Get current location from device
  const getCurrentLocation = () => {
    setLoadingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude, name: 'Your Current Location' };
        setCurrentLocation(location);
        setCurrentMapCenter(location);
        setLoadingLocation(false);
        // Auto-select as pickup location
        selectLocation(location, 'pickup');
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to access your location. Please check permissions.');
        setLoadingLocation(false);
      }
    );
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-96 lg:h-[500px] relative">
              <MapContainer
                center={[currentMapCenter.lat, currentMapCenter.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {currentLocation && (
                  <Marker position={[currentLocation.lat, currentLocation.lng]} icon={createCustomIcon('current')}>
                    <Popup>📍 {currentLocation.name}</Popup>
                  </Marker>
                )}
                {pickupLocation && (
                  <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={createCustomIcon('pickup')}>
                    <Popup>📍 Pickup: {pickupLocation.name}</Popup>
                  </Marker>
                )}
                {dropoffLocation && (
                  <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={createCustomIcon('dropoff')}>
                    <Popup>📍 Dropoff: {dropoffLocation.name}</Popup>
                  </Marker>
                )}
                <MapUpdater location={currentMapCenter} />
              </MapContainer>
              
              {/* Current Location Button - Positioned on map */}
              <button
                onClick={getCurrentLocation}
                disabled={loadingLocation}
                className="absolute bottom-4 right-4 z-50 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 disabled:opacity-50 transition border border-gray-200"
                title="Get current location"
              >
                {loadingLocation ? (
                  <Loader className="w-5 h-5 animate-spin text-blue-600" />
                ) : (
                  <Navigation className="w-5 h-5 text-blue-600" />
                )}
              </button>
            </div>
          </div>

          {/* Right - Booking Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit lg:sticky lg:top-24 z-30">
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
                      <button
                        onClick={getCurrentLocation}
                        disabled={loadingLocation}
                        title="Use current location"
                        className="p-1 hover:bg-blue-50 rounded transition disabled:opacity-50"
                      >
                        {loadingLocation ? (
                          <Loader className="w-5 h-5 animate-spin text-blue-600" />
                        ) : (
                          <Navigation className="w-5 h-5 text-blue-600" />
                        )}
                      </button>
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
                              <div 
                                className="w-16 h-16 flex-shrink-0"
                                dangerouslySetInnerHTML={{ __html: ride.icon }}
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
