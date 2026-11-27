import { useState } from 'react';
import axios from 'axios';
import { API_URLS } from '../API_urls';

export default function Register() {
  const [formData, setFormData] = useState({
    employee_name: '',
    employee_phoneNumber: '',
    employee_email: '',
    role: 'Advisor',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        API_URLS.EMPLOYEES.CREATE,
        {
          employee_name: formData.employee_name.trim(),
          employee_phoneNumber: formData.employee_phoneNumber.trim(),
          employee_email: formData.employee_email.trim(),
          role: formData.role,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      setSuccess(`Employee created successfully! Assigned ID: ${response.data.employee_ID}`);
      setFormData({
        employee_name: '',
        employee_phoneNumber: '',
        employee_email: '',
        role: 'Advisor',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/logout';
        return;
      }
      const data = err.response?.data;
      const msg =
        data?.error ||
        data?.detail ||
        (data && typeof data === 'object' ? Object.values(data).flat().join(' ') : null) ||
        'Failed to register employee.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 sm:py-12">
      <div className="w-full max-w-lg bg-surface border border-border rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-accent text-accent-foreground items-center justify-center font-bold text-xl shadow-xs">
            A
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Register New Employee
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Admin-only: Create a staff account and assign their role
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
            <div className="space-y-1.5">
              <label htmlFor="employee_name" className="block text-sm font-semibold text-foreground">
                Full Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                id="employee_name"
                name="employee_name"
                required
                placeholder="e.g. Aditya Sharma"
                value={formData.employee_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="employee_phoneNumber" className="block text-sm font-semibold text-foreground">
                Phone Number <span className="text-accent">*</span>
              </label>
              <input
                type="tel"
                id="employee_phoneNumber"
                name="employee_phoneNumber"
                required
                maxLength={17}
                placeholder="e.g. +91 9876543210"
                value={formData.employee_phoneNumber}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="employee_email" className="block text-sm font-semibold text-foreground">
                Work Email <span className="text-accent">*</span>
              </label>
              <input
                type="email"
                id="employee_email"
                name="employee_email"
                required
                placeholder="name@company.com"
                value={formData.employee_email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="role" className="block text-sm font-semibold text-foreground">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
              >
                <option value="Advisor">Financial Advisor</option>
                <option value="Relationship Manager">Relationship Manager</option>
                <option value="Coordinator">Front Desk / Coordinator</option>
                <option value="Admin">Branch Admin / Manager</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Password <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 pr-12 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-foreground cursor-pointer text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 text-sm font-semibold rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            {loading ? 'Registering...' : 'Create Employee'}
          </button>
        </form>
      </div>
    </div>
  );
}