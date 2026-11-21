import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    role: 'Staff',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }

    setLoading(true);

    // Placeholder for backend registration flow
    setTimeout(() => {
      setLoading(false);
      setSuccess('Registration template ready. Connect your backend API endpoint to register users.');
    }, 600);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 sm:py-12">
      <div className="w-full max-w-lg bg-surface border border-border rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Brand / Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-accent text-accent-foreground items-center justify-center font-bold text-xl shadow-xs">
            A
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Join AppointFlow to manage customer bookings and advisor schedules
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-md border border-[#fca5a5] bg-[#fee2e2] text-[#991b1b] dark:border-[#5a272d] dark:bg-[#3b2023] dark:text-[#f87171] text-xs leading-relaxed">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-md border border-[#bbf7d0] bg-[#dcfce7] text-[#15803d] dark:border-[#25503c] dark:bg-[#1b3528] dark:text-[#4ade80] text-xs leading-relaxed">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-foreground"
              >
                Full Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                placeholder="e.g. Aditya Sharma"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
              />
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-foreground"
              >
                Username <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="e.g. aditya_s"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-foreground"
              >
                Work Email <span className="text-accent">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-foreground"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
              >
                <option value="Staff">Staff Member</option>
                <option value="Advisor">Financial Advisor</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-foreground"
              >
                Password <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  placeholder="Min. 8 characters"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-foreground"
              >
                Confirm Password <span className="text-accent">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                required
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
              />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 rounded-xs border-border accent-primary cursor-pointer w-4 h-4 shrink-0"
            />
            <label
              htmlFor="agreeTerms"
              className="text-xs sm:text-sm text-muted cursor-pointer select-none leading-normal"
            >
              I agree to the{' '}
              <button
                type="button"
                onClick={() => setError('Terms of Service dialog.')}
                className="text-accent hover:underline cursor-pointer font-medium p-0"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setError('Privacy Policy dialog.')}
                className="text-accent hover:underline cursor-pointer font-medium p-0"
              >
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 text-sm font-semibold rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-divider text-center text-xs sm:text-sm text-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-accent hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
