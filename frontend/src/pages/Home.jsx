import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Zap, Shield, ArrowRight, DollarSign, Calendar, Clock, Navigation } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  // Hero Section State
  const [activeTab, setActiveTab] = useState('ride');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedTime, setSelectedTime] = useState('now');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [city, setCity] = useState('Lahore');

  useEffect(() => {
    window.addEventListener('scroll', () => setScrolled(window.scrollY > 50));
    return () => window.removeEventListener('scroll', () => {});
  }, []);

  // Time options
  const timeOptions = [
    'now',
    '15 mins',
    '30 mins',
    '1 hour',
    '2 hours',
    '3 hours'
  ];

  // Handle booking
  const handleBookRide = () => {
    if (!pickupLocation || !dropoffLocation) {
      alert('Please enter both pickup and dropoff locations');
      return;
    }
    
    // Store booking data and navigate
    const bookingData = {
      pickupLocation,
      dropoffLocation,
      date: selectedDate,
      time: selectedTime,
      rideType: activeTab
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/book-ride');
  };

  // Handle tab switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPickupLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          alert('Unable to get location. Please enter manually.');
          console.error(error);
        }
      );
    } else {
      alert('Geolocation not supported');
    }
  };

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Reliable Rides',
      description: 'Get a reliable ride in minutes with our trusted network of drivers'
    },
    { 
      icon: <Zap className="w-8 h-8" />,
      title: 'Fast & Easy',
      description: 'Request a ride in seconds and track your driver in real-time'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safe & Secure',
      description: 'Your safety is our priority with verified drivers and 24/7 support'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Affordable Pricing',
      description: 'Competitive pricing with transparent fares, no hidden charges'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <img src="/public/uber-logo.png" alt="Uber Logo" className="h-12 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 transition">
              Ride with Us
            </Link>
            <Link to="/captain-login" className="text-gray-600 hover:text-gray-900 transition">
              Drive with Us
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block px-6 py-2 text-gray-700 border-2 border-gray-300 rounded-full hover:border-gray-400 transition">
              Sign In
            </Link>
            <button onClick={() => navigate('/signup')} className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-white p-15">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Go anywhere with Uber
            </h1>

            {/* Request a Ride Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200 mb-8"
            >
              {/* Ride Request Tabs */}
              <div className="flex gap-6 mb-6 border-b border-gray-200 pb-4">
                <button 
                  onClick={() => handleTabChange('ride')}
                  className={`font-semibold transition ${activeTab === 'ride' ? 'text-gray-900 border-b-2 border-gray-900 pb-2' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Ride
                </button>
                <button 
                  onClick={() => handleTabChange('driver')}
                  className={`font-semibold transition ${activeTab === 'driver' ? 'text-gray-900 border-b-2 border-gray-900 pb-2' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Driver
                </button>
              </div>

              {/* Location Inputs */}
              <div className="space-y-4 mb-6">
                {/* Pickup Location */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <div className="w-3 h-3 bg-gray-900 rounded-full flex-shrink-0"></div>
                  <input
                    type="text"
                    placeholder="Pickup location"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none font-medium"
                  />
                  <button 
                    onClick={handleGetCurrentLocation}
                    title="Use current location"
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Navigation className="w-4 h-4 text-blue-600" />
                  </button>
                </div>

                {/* Divider */}
                <div className="flex justify-center py-2">
                  <div className="text-gray-400">━</div>
                </div>

                {/* Dropoff Location */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></div>
                  <input
                    type="text"
                    placeholder="Dropoff location"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Date & Time Section */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                {/* Date */}
                <div>
                  <label className="text-gray-600 text-sm font-medium mb-2 block">Date</label>
                  <div className="relative">
                    <button 
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="w-full flex items-center gap-2 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition text-gray-900 font-medium"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{selectedDate === 'today' ? 'Today' : selectedDate}</span>
                    </button>
                    {showDatePicker && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                        {['today', 'tomorrow', 'day-after'].map((date) => (
                          <button
                            key={date}
                            onClick={() => {
                              setSelectedDate(date);
                              setShowDatePicker(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition text-sm"
                          >
                            {date === 'today' ? 'Today' : date === 'tomorrow' ? 'Tomorrow' : 'Day after tomorrow'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="text-gray-600 text-sm font-medium mb-2 block">Time</label>
                  <div className="relative">
                    <button 
                      onClick={() => setShowTimePicker(!showTimePicker)}
                      className="w-full flex items-center gap-2 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition text-gray-900 font-medium justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{selectedTime === 'now' ? 'Now' : selectedTime}</span>
                      </div>
                      <span className="text-gray-400">▼</span>
                    </button>
                    {showTimePicker && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                        {timeOptions.map((time) => (
                          <button
                            key={time}
                            onClick={() => {
                              setSelectedTime(time);
                              setShowTimePicker(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition text-sm"
                          >
                            {time === 'now' ? 'Now' : time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBookRide}
                  className="flex-1 px-6 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition text-lg"
                >
                  {activeTab === 'ride' ? 'See prices' : 'Start driving'}
                </motion.button>
              </div>

              {/* Login Prompt */}
              <p className="text-center text-gray-600 text-sm mt-4">
                Log in to see your recent activity
              </p>
            </motion.div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative w-full h-96 rounded-3xl overflow-hidden">
              <img 
                src="/src/assets/image.png" 
                alt="Uber ride illustration" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose Uber?
            </h2>
            <p className="text-xl text-gray-600">
              Millions of people trust Uber for their daily rides
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-2"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Download the app or sign up online to start your Uber journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
              >
                Ride with Uber
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/captain-signup')}
                className="px-8 py-4 bg-white/10 text-white border-2 border-white rounded-full font-semibold hover:bg-white/20 transition"
              >
                Drive with Uber
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Riders</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Help</a></li>
                <li><a href="#" className="hover:text-white transition">Safety</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Drivers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Help</a></li>
                <li><a href="#" className="hover:text-white transition">Earnings</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2025 Uber Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;