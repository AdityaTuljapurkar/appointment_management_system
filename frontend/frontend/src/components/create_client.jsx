import { useState } from 'react';
import axios from 'axios';
import { toISTISOString } from '../utils/dateUtils';
import { API_URLS } from '../API_urls';

export default function CreateClient({
  apiUrl = API_URLS.CLIENTS.CREATE,
  onClientCreated,
}) {
  const [formData, setFormData] = useState({
    client_id: '',
    client_name: '',
    cutomer_phoneNumber: '',
    client_phoneNumber_secoundary: '',
    email: '',
    client_RiskProfile: 'Conservative',
    client_category: 'Retail',
    Profile_value: '',
    client_objective: '',
    last_review_date: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        ...formData,
        client_phoneNumber_secoundary: formData.client_phoneNumber_secoundary || null,
        Profile_value: formData.Profile_value || null,
        client_objective: formData.client_objective || null,
        last_review_date: formData.last_review_date
          ? toISTISOString(formData.last_review_date)
          : null,
      };

      const response = await axios.post(apiUrl, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });

      const data = response.data;
      setMessage(
        `${data.message || 'Client created successfully'}${
          data.client_id ? ` (ID: ${data.client_id})` : ''
        }`
      );
      setFormData({
        client_id: '',
        client_name: '',
        cutomer_phoneNumber: '',
        client_phoneNumber_secoundary: '',
        email: '',
        client_RiskProfile: 'Conservative',
        client_category: 'Retail',
        Profile_value: '',
        client_objective: '',
        last_review_date: '',
      });
      if (onClientCreated) {
        onClientCreated(data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/logout';
        return;
      }
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Network error: Could not reach the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-divider pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Create New Client
        </h2>
        <p className="text-sm text-muted mt-1">
          Register client profiles, contact numbers, and investment risk categories.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-md border border-[#bbf7d0] bg-[#dcfce7] text-[#15803d] dark:border-[#25503c] dark:bg-[#1b3528] dark:text-[#4ade80] text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-md border border-[#fca5a5] bg-[#fee2e2] text-[#991b1b] dark:border-[#5a272d] dark:bg-[#3b2023] dark:text-[#f87171] text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border rounded-xl p-6 sm:p-8 space-y-6 shadow-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Client ID */}
          <div className="space-y-1.5">
            <label htmlFor="client_id" className="block text-sm font-semibold text-foreground">
              Client ID <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              id="client_id"
              name="client_id"
              required
              maxLength={10}
              placeholder="e.g. CLI001"
              value={formData.client_id}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
            />
          </div>

          {/* Client Name */}
          <div className="space-y-1.5">
            <label htmlFor="client_name" className="block text-sm font-semibold text-foreground">
              Client Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.client_name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
            />
          </div>

          {/* Primary Phone */}
          <div className="space-y-1.5">
            <label
              htmlFor="cutomer_phoneNumber"
              className="block text-sm font-semibold text-foreground"
            >
              Primary Phone Number <span className="text-accent">*</span>
            </label>
            <input
              type="tel"
              id="cutomer_phoneNumber"
              name="cutomer_phoneNumber"
              required
              maxLength={17}
              placeholder="e.g. +91 9876543210"
              value={formData.cutomer_phoneNumber}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
            />
          </div>

          {/* Secondary Phone */}
          <div className="space-y-1.5">
            <label
              htmlFor="client_phoneNumber_secoundary"
              className="block text-sm font-semibold text-foreground"
            >
              Secondary Phone (Optional)
            </label>
            <input
              type="tel"
              id="client_phoneNumber_secoundary"
              name="client_phoneNumber_secoundary"
              maxLength={17}
              placeholder="e.g. +91 9876543211"
              value={formData.client_phoneNumber_secoundary}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold text-foreground">
              Email Address <span className="text-accent">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="e.g. client@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
            />
          </div>

          {/* Risk Profile */}
          <div className="space-y-1.5">
            <label
              htmlFor="client_RiskProfile"
              className="block text-sm font-semibold text-foreground"
            >
              Risk Profile
            </label>
            <select
              id="client_RiskProfile"
              name="client_RiskProfile"
              value={formData.client_RiskProfile}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
            >
              <option value="Conservative">Conservative</option>
              <option value="Moderate">Moderate</option>
              <option value="Aggresive">Aggresive</option>
            </select>
          </div>

          {/* Client Category */}
          <div className="space-y-1.5">
            <label
              htmlFor="client_category"
              className="block text-sm font-semibold text-foreground"
            >
              Client Category
            </label>
            <select
              id="client_category"
              name="client_category"
              value={formData.client_category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
            >
              <option value="Retail">Retail</option>
              <option value="HNI">HNI</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>

          {/* Profile Value */}
          <div className="space-y-1.5">
            <label
              htmlFor="Profile_value"
              className="block text-sm font-semibold text-foreground"
            >
              Profile / Portfolio Value (Optional)
            </label>
            <input
              type="text"
              id="Profile_value"
              name="Profile_value"
              placeholder="e.g. 15 Lakhs"
              value={formData.Profile_value}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
            />
          </div>

          {/* Last Review Date */}
          <div className="space-y-1.5">
            <label
              htmlFor="last_review_date"
              className="block text-sm font-semibold text-foreground"
            >
              Last Review Date & Time (IST)
            </label>
            <input
              type="datetime-local"
              id="last_review_date"
              name="last_review_date"
              value={formData.last_review_date}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
            />
          </div>

          {/* Client Objective */}
          <div className="space-y-1.5 sm:col-span-2">
            <label
              htmlFor="client_objective"
              className="block text-sm font-semibold text-foreground"
            >
              Client Objective (Optional)
            </label>
            <textarea
              id="client_objective"
              name="client_objective"
              rows={3}
              placeholder="e.g. Wealth generation and long-term retirement planning."
              value={formData.client_objective}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Client'}
          </button>
        </div>
      </form>
    </div>
  );
}
