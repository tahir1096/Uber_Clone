import { createContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [captainData, setCaptainData] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          
          // Load captain info from localStorage if available
          const storedCaptainInfo = localStorage.getItem('captainInfo');
          if (storedCaptainInfo) {
            setCaptainData(JSON.parse(storedCaptainInfo));
          }
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, captainInfo = null) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: captainInfo ? {
            firstname: captainInfo.firstname,
            lastname: captainInfo.lastname,
            vehicleType: captainInfo.vehicleType,
            vehicleColor: captainInfo.vehicleColor,
            plateNumber: captainInfo.plateNumber,
            vehicleModel: captainInfo.vehicleModel,
            seatingCapacity: captainInfo.seatingCapacity,
            isCaptain: true,
          } : {}
        }
      });
      if (error) throw error;
      
      // Store captain info locally
      if (captainInfo) {
        setCaptainData(captainInfo);
        localStorage.setItem('captainInfo', JSON.stringify(captainInfo));
      }
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/user-dashboard`,
        },
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut: signOutUser,
    signInWithGoogle,
    captainData,
    setCaptainData,
    isOnline,
    setIsOnline,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};
