import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { SupabaseAuthContext } from '../context/SupabaseAuthContext';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signInWithGoogle } = useContext(SupabaseAuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // Give the session a moment to update
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 500);
      } else {
        setError(result.error || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    const result = await signInWithGoogle();
    
    if (result.success) {
      navigate('/user-dashboard');
    } else {
      setError(result.error || 'Google login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Logo */}
      <div className="bg-black text-white py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <img src="/src/assets/Uber_logo_2018.png" alt="Uber" className="h-8 w-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">What's your email?</h1>
            <p className="text-gray-600">We'll use this to sign you in</p>
          </div>

          {/* Login Card */}
          <div className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email or phone number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition text-lg"
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition text-lg"
                />
              </div>

              {/* Show Password Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {showPassword ? 'Hide password' : 'Show password'}
              </button>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-black hover:bg-gray-900 text-white font-semibold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  'Continue'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-600">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Alternative Login */}
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 rounded-lg transition disabled:opacity-50 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button 
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 rounded-lg transition disabled:opacity-50 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 13.5c0-1.02-.09-1.98-.27-2.89-.2-1.03-.53-2.07-1.02-3.1-.48-1.02-1.2-1.94-2.09-2.67-.88-.73-1.96-1.28-3.13-1.64-1.16-.36-2.38-.5-3.62-.4-1.24.1-2.43.45-3.49 1.04-1.06.59-1.93 1.38-2.56 2.34-.63.96-.97 2.07-.97 3.31 0 1.02.09 1.98.27 2.89.2 1.03.53 2.07 1.02 3.1.48 1.02 1.2 1.94 2.09 2.67.88.73 1.96 1.28 3.13 1.64 1.16.36 2.38.5 3.62.4 1.24-.1 2.43-.45 3.49-1.04 1.06-.59 1.93-1.38 2.56-2.34.63-.96.97-2.07.97-3.31zm-2.1 0c0 .61-.05 1.2-.16 1.77-.11.57-.28 1.11-.52 1.62-.24.51-.56.97-.96 1.36-.4.39-.87.67-1.4.84-.53.17-1.08.22-1.63.15-.55-.07-1.07-.25-1.53-.54-.46-.29-.84-.68-1.12-1.15-.28-.47-.44-1-.48-1.56-.04-.56-.02-1.11.08-1.65.1-.54.28-1.05.54-1.51.26-.46.61-.85 1.03-1.15.42-.3.89-.5 1.38-.58.49-.08.97-.06 1.43.06.46.12.88.34 1.24.65.36.31.63.72.81 1.21.18.49.26 1.03.23 1.57z"/>
              </svg>
              <span>Continue with Apple</span>
            </button>

            {/* Sign Up Link */}
            <p className="text-center mt-6 text-gray-600">
              New to Uber?{' '}
              <Link to="/signup" className="text-black hover:text-gray-700 font-semibold">
                Create account
              </Link>
            </p>

            {/* Captain Login Link */}
            <p className="text-center mt-3 text-gray-600 text-sm">
              Want to drive?{' '}
              <Link to="/captain-login" className="text-black hover:text-gray-700 font-semibold">
                Login as Captain
              </Link>
            </p>

            {/* Terms */}
            <p className="text-center text-gray-500 text-xs mt-6">
              By continuing, you agree to calls, including by autodialer, WhatsApp, or texts from Uber and its affiliates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;