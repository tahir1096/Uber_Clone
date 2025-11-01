import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { SupabaseAuthContext } from '../context/SupabaseAuthContext';

const CaptainSignUp = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    vehicleType: '',
    vehicleColor: '',
    plateNumber: '',
    seatingCapacity: '',
    vehicleModel: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Vehicle Info

  const { signUp } = useContext(SupabaseAuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    if (!formData.firstname.trim()) {
      setError('First name is required');
      return;
    }
    if (formData.firstname.length < 3) {
      setError('First name must be at least 3 characters');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.vehicleType) {
      setError('Vehicle type is required');
      return;
    }
    if (!formData.vehicleColor) {
      setError('Vehicle color is required');
      return;
    }
    if (!formData.plateNumber) {
      setError('Plate number is required');
      return;
    }
    if (!formData.seatingCapacity) {
      setError('Seating capacity is required');
      return;
    }
    if (!formData.vehicleModel) {
      setError('Vehicle model is required');
      return;
    }

    setLoading(true);

    // Sign up with Supabase and pass vehicle details
    const result = await signUp(formData.email, formData.password, {
      firstname: formData.firstname,
      lastname: formData.lastname,
      vehicleType: formData.vehicleType,
      vehicleColor: formData.vehicleColor,
      plateNumber: formData.plateNumber,
      vehicleModel: formData.vehicleModel,
      seatingCapacity: formData.seatingCapacity,
    });

    if (result.success) {
      setError('Check your email for confirmation link!');
      // User can log in after confirming email
      setTimeout(() => {
        navigate('/captain-login');
      }, 2000);
    } else {
      setError(result.error || 'Sign up failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-black text-white py-4 px-4 sm:px-6">
        <img src="/src/assets/Uber_logo_2018.png" alt="Uber" className="h-8 w-auto" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Become a Captain</h1>
          <p className="text-gray-600 mb-2 text-sm">
            Step {step} of 2
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <form className="space-y-4 mt-6">
              {/* First Name */}
              <div>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition text-lg"
                />
              </div>

              {/* Last Name */}
              <div>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Last name (optional)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition text-lg"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition text-lg"
                />
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full mt-6 bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition"
              >
                Next: Vehicle Details
              </button>
            </form>
          )}

          {/* Step 2: Vehicle Information */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {/* Vehicle Type */}
              <div>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition text-lg"
                >
                  <option value="">Select vehicle type</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="auto-rikshaw">Auto Rikshaw</option>
                </select>
              </div>

              {/* Vehicle Color */}
              <div>
                <input
                  type="text"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={handleChange}
                  placeholder="Vehicle color"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition text-lg"
                />
              </div>

              {/* Plate Number */}
              <div>
                <input
                  type="text"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  placeholder="Plate number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition text-lg"
                />
              </div>

              {/* Vehicle Model */}
              <div>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  placeholder="Vehicle model"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition text-lg"
                />
              </div>

              {/* Seating Capacity */}
              <div>
                <select
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition text-lg"
                >
                  <option value="">Select seating capacity</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6+">6+</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-lg transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-900">
            Already have an account?{' '}
            <Link to="/captain-login" className="text-black font-semibold hover:underline">
              Login
            </Link>
          </p>

          {/* User Signup Link */}
          <p className="text-center mt-3 text-gray-600 text-sm">
            Looking to ride?{' '}
            <Link to="/signup" className="text-black font-semibold hover:underline">
              Sign up as User
            </Link>
          </p>

          {/* Terms Text */}
          <p className="text-center mt-8 text-xs text-gray-500">
            By signing up, you agree to our Terms. Learn how we process your data in our Privacy Policy and Cookies Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignUp;