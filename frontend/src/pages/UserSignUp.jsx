import React from 'react'

const UserSignUp = () => {
  const handleCaptain = () => {
    window.location.href = '/captain-signup';
  };

  React.useEffect(() => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'I am a Captain — Sign up';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '18px',
      bottom: '18px',
      padding: '10px 14px',
      borderRadius: '8px',
      border: 'none',
      background: '#0b5cff',
      color: '#fff',
      cursor: 'pointer',
      zIndex: 9999,
      boxShadow: '0 6px 20px rgba(11,92,255,0.18)',
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
      fontSize: '14px',
    });

    btn.addEventListener('click', handleCaptain);
    document.body.appendChild(btn);

    return () => {
      btn.removeEventListener('click', handleCaptain);
      btn.remove();
    };
  }, []);
  const [loading, setLoading] = React.useState(false);


  const handleGoogle = () => {
    // Redirect to your Google OAuth endpoint
    window.location.href = '/api/auth/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const phone = form.phone.value.trim();

    if (!name) {
      alert('Please enter your full name.');
      setLoading(false);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Sign up failed. Please try again.');
        setLoading(false);
        return;
      }

      alert('Account created. Check your email for verification.');
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          maxWidth: 480,
          width: '94%',
          margin: '28px auto',
          padding: 18,
          boxShadow: '0 6px 24px rgba(10,10,10,0.08)',
          borderRadius: 12,
          background: '#fff',
          fontFamily: 'Inter, Roboto, Arial, sans-serif',
        }}
      >
        <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 600 }}>Create an account</h2>
        <p style={{ margin: '0 0 16px', color: '#666', fontSize: 14 }}>
          Sign up with email or continue with Google to request rides.
        </p>

        <div style={{ display: 'flex', gap: 8, flexDirection: 'column', marginBottom: 10 }}>
          <button
            type="button"
            onClick={handleGoogle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #e6e6e6',
              background: '#fff',
              cursor: 'pointer',
              boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.02)',
              fontSize: 15,
            }}
            aria-label="Sign up with Google"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path fill="#fbbc05" d="M43.6 20.4H42V20H24v8h11.3C34.7 32.7 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 2.9l5.7-5.7C33.4 6.1 28.9 4 24 4 12.97 4 4 12.97 4 24s8.97 20 20 20 20-8.97 20-20c0-1.4-.15-2.7-.4-3.6z"/>
              <path fill="#ea4335" d="M6.3 14.7l6.6 4.8C14.8 16.1 19 13.6 24 13.6c3.1 0 5.9 1.1 8 2.9l5.7-5.7C33.4 6.1 28.9 4 24 4 16.2 4 9.2 7.9 6.3 14.7z"/>
              <path fill="#34a853" d="M24 44c4.9 0 9.4-1.9 12.9-5.1l-6.2-5.1C28.9 33.6 26 34.6 24 34.6c-6 0-10.7-3.3-12.4-8.2l-6.7 5.2C8 38.8 15.4 44 24 44z"/>
              <path fill="#4285f4" d="M43.6 20.4H42V20H24v8h11.3C34.9 30.2 30.7 34 25 34c-0.1 0-0.2 0-0.3 0 6 0 10.7-3.3 12.4-8.2l6.5 5.1C46.9 31.3 48 27.1 48 24c0-1.4-.15-2.7-.4-3.6z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#333' }}>
            Full name
            <input
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="First and last name"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 14px',
                marginTop: 8,
                borderRadius: 8,
                border: '1px solid #e8e8e8',
                fontSize: 15,
                boxSizing: 'border-box',
              }}
            />
          </label>

          <label style={{ display: 'block', fontSize: 13, color: '#333' }}>
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 14px',
                marginTop: 8,
                borderRadius: 8,
                border: '1px solid #e8e8e8',
                fontSize: 15,
                boxSizing: 'border-box',
              }}
            />
          </label>

          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
            <label style={{ display: 'block', fontSize: 13, color: '#333' }}>
              Password
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Create a password"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 14px',
                  marginTop: 8,
                  borderRadius: 8,
                  border: '1px solid #e8e8e8',
                  fontSize: 15,
                  boxSizing: 'border-box',
                }}
              />
            </label>

            <label style={{ display: 'block', fontSize: 13, color: '#333' }}>
              Confirm
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Confirm"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 14px',
                  marginTop: 8,
                  borderRadius: 8,
                  border: '1px solid #e8e8e8',
                  fontSize: 15,
                  boxSizing: 'border-box',
                }}
              />
            </label>
          </div>

          <label style={{ display: 'block', fontSize: 13, color: '#333' }}>
            Phone (optional)
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 555 5555"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 14px',
                marginTop: 8,
                borderRadius: 8,
                border: '1px solid #e8e8e8',
                fontSize: 15,
                boxSizing: 'border-box',
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: '12px 14px',
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: loading ? 'default' : 'pointer',
              fontSize: 16,
            }}
            aria-busy={loading}
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>

          <div style={{ marginTop: 8, fontSize: 12, color: '#666', textAlign: 'center' }}>
            By creating an account you agree to the Terms & Privacy.
          </div>
        </form>
      </div>
    </>
  )
}

export default UserSignUp