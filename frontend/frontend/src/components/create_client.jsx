import { useState } from 'react';
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

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
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
      } else {
        setError(data.error || data.message || 'Failed to create client');
      }
    } catch {
      setError('Network error: Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Client</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="client_id">Client ID:* </label>
          <input
            type="text"
            id="client_id"
            name="client_id"
            required
            maxLength={10}
            placeholder="e.g. CLI001"
            value={formData.client_id}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="client_name">Client Name:* </label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            required
            value={formData.client_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="cutomer_phoneNumber">Primary Phone Number:* </label>
          <input
            type="tel"
            id="cutomer_phoneNumber"
            name="cutomer_phoneNumber"
            required
            maxLength={17}
            value={formData.cutomer_phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="client_phoneNumber_secoundary">Secondary Phone Number (Optional): </label>
          <input
            type="tel"
            id="client_phoneNumber_secoundary"
            name="client_phoneNumber_secoundary"
            maxLength={17}
            value={formData.client_phoneNumber_secoundary}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email">Email:* </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="client_RiskProfile">Risk Profile: </label>
          <select
            id="client_RiskProfile"
            name="client_RiskProfile"
            value={formData.client_RiskProfile}
            onChange={handleChange}
          >
            <option value="Conservative">Conservative</option>
            <option value="Moderate">Moderate</option>
            <option value="Aggresive">Aggresive</option>
          </select>
        </div>

        <div>
          <label htmlFor="client_category">Client Category: </label>
          <select
            id="client_category"
            name="client_category"
            value={formData.client_category}
            onChange={handleChange}
          >
            <option value="Retail">Retail</option>
            <option value="HNI">HNI</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>

        <div>
          <label htmlFor="Profile_value">Profile / Portfolio Value (Optional): </label>
          <input
            type="text"
            id="Profile_value"
            name="Profile_value"
            placeholder="e.g. 10 Lakhs"
            value={formData.Profile_value}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="client_objective">Client Objective (Optional): </label>
          <textarea
            id="client_objective"
            name="client_objective"
            rows={3}
            value={formData.client_objective}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="last_review_date">Last Review Date & Time (IST, Optional): </label>
          <input
            type="datetime-local"
            id="last_review_date"
            name="last_review_date"
            value={formData.last_review_date}
            onChange={handleChange}
          />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Client'}
          </button>
        </div>
      </form>
    </div>
  );
}
