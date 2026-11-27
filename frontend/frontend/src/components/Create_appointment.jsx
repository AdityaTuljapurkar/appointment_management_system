import { useState } from 'react';
import axios from 'axios';
import { toISTISOString, formatToIST } from '../utils/dateUtils';
import { API_URLS } from '../API_urls';

export default function CreateAppointment({
  apiUrl = API_URLS.APPOINTMENTS.CREATE,
  onAppointmentCreated,
}) {
  const [formData, setFormData] = useState({
    client_id: '',
    client_name: '',
    email: '',
    appointment_date: '',
    status: 'scheduled',
    assigned_to: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State to hold confirmed appointment data for the popup
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

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
    setError('');

    try {
      const payload = {
        client_id: formData.client_id.trim(),
        appointment_date: toISTISOString(formData.appointment_date),
        status: formData.status,
        client_name: formData.client_name.trim(),
        email: formData.email.trim(),
        assigned_to: formData.assigned_to.trim(),
      };

      const response = await axios.post(apiUrl, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });

      const data = response.data;
      const serverData = data.data || {};
      setConfirmedAppointment({
        appointment_id: data.appointment_id || serverData.appointment_id || 'N/A',
        client_id: serverData.client_id || formData.client_id,
        client_name: serverData.client_name || formData.client_name || 'N/A',
        email: serverData.email || formData.email || 'N/A',
        phone_number: serverData.phone_number || 'N/A',
        appointment_date: serverData.appointment_date || payload.appointment_date,
        status: serverData.status || formData.status,
        assigned_to: formData.assigned_to || serverData.assigned_to || 'Unassigned',
      });

      // Reset form
      setFormData({
        client_id: '',
        client_name: '',
        email: '',
        appointment_date: '',
        status: 'scheduled',
        assigned_to: '',
      });

      if (onAppointmentCreated) {
        onAppointmentCreated(data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/logout';
        return;
      }
      if (err.response?.status === 404) {
        setError('User not found');
      } else {
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to create appointment'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setConfirmedAppointment(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-divider pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Book New Appointment
        </h2>
        <p className="text-sm text-muted mt-1">
          Schedule and assign client appointments with real-time validation.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-md border border-[#fca5a5] bg-[#fee2e2] text-[#991b1b] dark:border-[#5a272d] dark:bg-[#3b2023] dark:text-[#f87171] text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border rounded-xl p-6 sm:p-8 space-y-5 shadow-xs"
      >
        {/* 1. Client ID */}
        <div className="space-y-1.5">
          <label htmlFor="client_id" className="block text-sm font-semibold text-foreground">
            Client ID <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="client_id"
            name="client_id"
            required
            placeholder="e.g. CL-00123"
            value={formData.client_id}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
          />
        </div>

        {/* 2. Client Name */}
        <div className="space-y-1.5">
          <label htmlFor="client_name" className="block text-sm font-semibold text-foreground">
            Client Name
          </label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            placeholder="e.g. Aditya"
            value={formData.client_name}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
          />
        </div>

        {/* 3. Appointment Date & Time (IST) */}
        <div className="space-y-1.5">
          <label htmlFor="appointment_date" className="block text-sm font-semibold text-foreground">
            Appointment Date & Time (IST) <span className="text-accent">*</span>
          </label>
          <input
            type="datetime-local"
            id="appointment_date"
            name="appointment_date"
            required
            value={formData.appointment_date}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
          />
        </div>

        {/* 4. Appointment Status */}
        <div className="space-y-1.5">
          <label htmlFor="status" className="block text-sm font-semibold text-foreground">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
          >
            <option value="scheduled">Scheduled</option>
            <option value="unscheduled">Unscheduled</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* 5. Assigned To */}
        <div className="space-y-1.5">
          <label htmlFor="assigned_to" className="block text-sm font-semibold text-foreground">
            Assigned To
          </label>
          <input
            type="text"
            id="assigned_to"
            name="assigned_to"
            placeholder="e.g. Staff Name or Agent ID"
            value={formData.assigned_to}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus transition-colors"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>

      {/* Confirmation Popup Modal */}
      {confirmedAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-xl p-6 sm:p-7 max-w-lg w-full shadow-xl space-y-4 text-foreground">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#22c55e] text-white flex items-center justify-center font-bold text-sm shrink-0">
                ✓
              </span>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Appointment Confirmed
                </h3>
                <p className="text-xs text-muted">
                  The appointment has been successfully recorded in the system.
                </p>
              </div>
            </div>

            <div className="bg-surface-secondary border border-border rounded-lg p-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted font-medium">Appointment ID:</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded-sm bg-accent/15 text-accent border border-accent/30 text-xs">
                  {confirmedAppointment.appointment_id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted font-medium">Client ID:</span>
                <span className="font-mono font-medium text-foreground">
                  {confirmedAppointment.client_id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted font-medium">Client Name:</span>
                <span className="font-semibold text-foreground">
                  {confirmedAppointment.client_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted font-medium">Email:</span>
                <span className="text-foreground">{confirmedAppointment.email}</span>
              </div>
              {confirmedAppointment.phone_number !== 'N/A' && (
                <div className="flex items-center justify-between">
                  <span className="text-muted font-medium">Phone Number:</span>
                  <span className="text-foreground">
                    {confirmedAppointment.phone_number}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted font-medium">Appointment Time (IST):</span>
                <span className="text-foreground whitespace-nowrap">
                  {formatToIST(confirmedAppointment.appointment_date) ||
                    confirmedAppointment.appointment_date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted font-medium">Status:</span>
                <span className="capitalize font-medium text-foreground">
                  {confirmedAppointment.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted font-medium">Assigned To:</span>
                <span className="text-foreground">
                  {confirmedAppointment.assigned_to}
                </span>
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2 text-sm font-semibold rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
