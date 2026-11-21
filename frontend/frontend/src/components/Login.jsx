import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Placeholder for backend authentication flow
    setTimeout(() => {
      setLoading(false);
      // Simulating a temporary notice until backend auth endpoint is attached
      setError('Backend authentication will be wired up with your auth endpoint.');
    }, 600);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 sm:py-12">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Brand / Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-accent text-accent-foreground items-center justify-center font-bold text-xl shadow-xs">
            A
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Sign in to access your Appointment Management dashboard
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-md border border-[#fca5a5] bg-[#fee2e2] text-[#991b1b] dark:border-[#5a272d] dark:bg-[#3b2023] dark:text-[#f87171] text-xs leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username / Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-foreground"
            >
              Username or Email
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="Enter your username or email"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-foreground"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setError('Password reset instructions will be sent via email.')}
                className="text-xs text-accent hover:underline cursor-pointer font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-foreground cursor-pointer text-xs"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="rounded-xs border-border accent-primary cursor-pointer w-4 h-4"
            />
            <label
              htmlFor="rememberMe"
              className="text-xs sm:text-sm text-muted cursor-pointer select-none"
            >
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 text-sm font-semibold rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-divider text-center text-xs sm:text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-accent hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
