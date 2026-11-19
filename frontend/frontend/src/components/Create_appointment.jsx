import { useState } from 'react';
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
        // Optional fields passed to backend (can be expanded in backend later)
        client_name: formData.client_name.trim(),
        email: formData.email.trim(),
        assigned_to: formData.assigned_to.trim(),
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
        // Prepare details for the confirmation popup
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
      } else if (response.status === 404) {
        setError('User not found');
      } else {
        setError(data.error || data.message || 'Failed to create appointment');
      }
    } catch {
      setError('Network error: Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setConfirmedAppointment(null);
  };

  return (
    <div style={styles.container}>
      <h2>Book New Appointment</h2>

      {error && <p style={styles.errorBanner}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* 1. Client ID */}
        <div style={styles.fieldGroup}>
          <label htmlFor="client_id" style={styles.label}>
            Client ID:*
          </label>
          <input
            type="text"
            id="client_id"
            name="client_id"
            required
            placeholder="e.g. CL-00123"
            value={formData.client_id}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* 2. Client Name */}
        <div style={styles.fieldGroup}>
          <label htmlFor="client_name" style={styles.label}>
            Client Name:
          </label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            placeholder="e.g. Aditya Sharma"
            value={formData.client_name}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* 3. Client Email (Optional manual entry / override)
        <div style={styles.fieldGroup}>
          <label htmlFor="email" style={styles.label}>
            Client Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="e.g. aditya@example.com"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
        </div> */}

        {/* 4. Appointment Date & Time (IST) */}
        <div style={styles.fieldGroup}>
          <label htmlFor="appointment_date" style={styles.label}>
            Appointment Date & Time (IST):*
          </label>
          <input
            type="datetime-local"
            id="appointment_date"
            name="appointment_date"
            required
            value={formData.appointment_date}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* 5. Appointment Status */}
        <div style={styles.fieldGroup}>
          <label htmlFor="status" style={styles.label}>
            Status:
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="scheduled">Scheduled</option>
            <option value="unscheduled">Unscheduled</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* 6. Assigned To (Placeholder for backend linking later) */}
        <div style={styles.fieldGroup}>
          <label htmlFor="assigned_to" style={styles.label}>
            Assigned To:
          </label>
          <input
            type="text"
            id="assigned_to"
            name="assigned_to"
            placeholder="e.g. Agent Name or Staff ID "
            value={formData.assigned_to}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>

      {/* Confirmation Popup Modal */}
      {confirmedAppointment && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <span style={styles.checkIcon}>✓</span>
              <h3 style={{ margin: 0, color: '#166534' }}>Appointment Confirmed</h3>
            </div>

            <p style={{ margin: '8px 0 16px', color: '#555', fontSize: '14px' }}>
              The appointment has been successfully recorded. Here are the details:
            </p>

            <div style={styles.detailsGrid}>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Appointment ID:</span>
                <span style={styles.appointmentIdBadge}>
                  {confirmedAppointment.appointment_id}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Client ID:</span>
                <span style={styles.detailVal}>{confirmedAppointment.client_id}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Client Name:</span>
                <span style={styles.detailVal}>{confirmedAppointment.client_name}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Email:</span>
                <span style={styles.detailVal}>{confirmedAppointment.email}</span>
              </div>
              {confirmedAppointment.phone_number !== 'N/A' && (
                <div style={styles.detailRow}>
                  <span style={styles.detailKey}>Phone Number:</span>
                  <span style={styles.detailVal}>{confirmedAppointment.phone_number}</span>
                </div>
              )}
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Appointment Time (IST):</span>
                <span style={styles.detailVal}>
                  {formatToIST(confirmedAppointment.appointment_date) || confirmedAppointment.appointment_date}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Status:</span>
                <span style={styles.detailVal}>{confirmedAppointment.status}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Assigned To:</span>
                <span style={styles.detailVal}>{confirmedAppointment.assigned_to}</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={handleCloseModal} style={styles.closeBtn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '550px',
    margin: '20px 0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '16px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontWeight: '600',
    fontSize: '14px',
  },
  input: {
    padding: '9px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#0066cc',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #f87171',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '14px',
  },
  // Modal / Popup styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px 28px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  checkIcon: {
    backgroundColor: '#22c55e',
    color: '#fff',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  detailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#f8fafc',
    padding: '14px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  },
  detailKey: {
    fontWeight: '600',
    color: '#475569',
  },
  detailVal: {
    color: '#1e293b',
    fontWeight: '500',
  },
  appointmentIdBadge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '3px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: '13px',
  },
  closeBtn: {
    backgroundColor: '#0066cc',
    color: '#fff',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
