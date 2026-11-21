import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatToIST } from '../utils/dateUtils';
import { API_URLS } from '../apiUrls';

export default function AppointmentsDashboard() {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Time range state
  const [dateDropdown, setDateDropdown] = useState(false);
  const [appointmentDateRange, setAppointmentDateRange] = useState('');

  // Appointments data states
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter selection states
  const [statusFilter, setStatusFilter] = useState([]);

  // Dropdown visibility state
  const [statusDropdown, setStatusDropdown] = useState(false);

  // Dropdown toggle function
  const toggleDropdown = (setter, currentState) => {
    setter(!currentState);
  };

  // Filter selection toggle function
  const toggleFilter = (value, setter) => {
    setter((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
  };

  // Remove an individual filter
  const removeFilter = (value, setter) => {
    setter((prev) => prev.filter((item) => item !== value));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter([]);
    setAppointmentDateRange('');
  };

  // Fetch appointments from backend (e.g. on manual refresh)
  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URLS.APPOINTMENTS.LIST);
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const response = await fetch(API_URLS.APPOINTMENTS.LIST);
        if (!response.ok) {
          throw new Error(`Server returned status: ${response.status}`);
        }
        const data = await response.json();
        if (!ignore) {
          setAppointments(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to fetch appointments');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Search and filter logic
  const filteredAppointments = appointments.filter((app) => {
    const query = searchTerm.toLowerCase().trim();

    // Search bar match
    const matchesSearch =
      !query ||
      app.appointment_id?.toLowerCase().includes(query) ||
      app.client_id?.toLowerCase().includes(query) ||
      app.client_name?.toLowerCase().includes(query) ||
      app.phone_number?.includes(query) ||
      app.secondary_phone?.includes(query) ||
      app.email?.toLowerCase().includes(query) ||
      app.status?.toLowerCase().includes(query);

    // Status filter match
    const matchesStatus =
      statusFilter.length === 0 ||
      statusFilter.includes(app.status?.toLowerCase());

    // Date range filter match
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Number(appointmentDateRange));
    const appointmentDate = new Date(app.appointment_date);

    const matchDateRange =
      !appointmentDateRange ||
      (app.appointment_date &&
        appointmentDate >= today &&
        appointmentDate <= endDate);

    return matchesSearch && matchesStatus && matchDateRange;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Appointments Dashboard
          </h2>
          <p className="text-sm text-muted mt-1">
            Total Appointments: <strong className="text-foreground">{appointments.length}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAppointments}
            className="px-4 py-2 text-sm font-medium rounded-md border border-border bg-surface text-foreground hover:bg-surface-secondary transition-colors cursor-pointer shadow-xs"
          >
            Refresh
          </button>
          <Link to="/create_appointment">
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors cursor-pointer shadow-xs"
            >
              + Book New Appointment
            </button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by ID, client name, phone, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3.5 py-2 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus min-w-[280px] flex-1 sm:flex-initial transition-colors"
        />

        {/* Status Dropdown */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => toggleDropdown(setStatusDropdown, statusDropdown)}
            className="px-3.5 py-2 text-sm font-medium rounded-md border border-border bg-surface text-foreground hover:bg-surface-secondary transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Status</span>
            <span className="text-xs">▼</span>
          </button>

          {statusDropdown && (
            <div className="absolute top-[calc(100%+6px)] left-0 bg-surface border border-border rounded-md shadow-lg p-2.5 min-w-[190px] z-30">
              {['unscheduled', 'scheduled', 'rescheduled', 'cancelled', 'completed'].map(
                (status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm hover:bg-surface-secondary text-foreground text-sm cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={statusFilter.includes(status)}
                      onChange={() => toggleFilter(status, setStatusFilter)}
                      className="rounded-xs border-border accent-primary cursor-pointer"
                    />
                    <span className="capitalize">{status}</span>
                  </label>
                )
              )}
            </div>
          )}
        </div>

        {/* Appointment Date Filter Dropdown */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => toggleDropdown(setDateDropdown, dateDropdown)}
            className="px-3.5 py-2 text-sm font-medium rounded-md border border-border bg-surface text-foreground hover:bg-surface-secondary transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Appointment Date</span>
            <span className="text-xs">▼</span>
          </button>

          {dateDropdown && (
            <div className="absolute top-[calc(100%+6px)] left-0 bg-surface border border-border rounded-md shadow-lg p-2.5 min-w-[190px] z-30">
              {[
                { label: 'Next 7 Days', value: '7' },
                { label: 'Next 14 Days', value: '14' },
                { label: 'Next 30 Days', value: '30' },
              ].map((range) => (
                <label
                  key={range.value}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm hover:bg-surface-secondary text-foreground text-sm cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="appointmentDateRange"
                    checked={appointmentDateRange === range.value}
                    onChange={() => {
                      setAppointmentDateRange(range.value);
                      setDateDropdown(false);
                    }}
                    className="rounded-xs border-border accent-primary cursor-pointer"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Clear All Filters */}
        {(statusFilter.length > 0 || appointmentDateRange) && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-3.5 py-2 text-sm font-semibold rounded-md border border-[#fca5a5] bg-[#fee2e2] hover:bg-[#fecaca] text-[#b91c1c] dark:border-[#5a272d] dark:bg-[#3b2023] dark:hover:bg-[#4c292d] dark:text-[#f87171] transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Selected Filter Tags */}
      {(statusFilter.length > 0 || appointmentDateRange) && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Tag */}
          {appointmentDateRange && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-border bg-surface-secondary text-foreground shadow-2xs">
              <span>Next {appointmentDateRange} Days</span>
              <button
                type="button"
                onClick={() => setAppointmentDateRange('')}
                className="text-muted hover:text-foreground text-sm leading-none cursor-pointer p-0"
                aria-label="Remove date range filter"
              >
                ×
              </button>
            </span>
          )}

          {/* Status Tags */}
          {statusFilter.map((status) => (
            <span
              key={status}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-border bg-surface-secondary text-foreground shadow-2xs"
            >
              <span className="capitalize">{status}</span>
              <button
                type="button"
                onClick={() => removeFilter(status, setStatusFilter)}
                className="text-muted hover:text-foreground text-sm leading-none cursor-pointer p-0"
                aria-label={`Remove filter ${status}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Loading, Error & Data Table */}
      {loading ? (
        <div className="p-12 text-center text-muted bg-surface border border-border rounded-lg text-sm">
          Loading appointments data...
        </div>
      ) : error ? (
        <div className="p-4 rounded-md border border-[#fca5a5] bg-[#fee2e2] text-[#991b1b] dark:border-[#5a272d] dark:bg-[#3b2023] dark:text-[#f87171] text-sm">
          Error: {error}
        </div>
      ) : (
        <div className="overflow-x-auto border border-border rounded-lg bg-surface shadow-xs">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-primary text-primary-foreground dark:bg-surface-secondary dark:text-foreground border-b border-divider">
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Sr no
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Appointment ID
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Client ID
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Client Name
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Phone Number I
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Phone Number II
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Email
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Appointment Date (IST)
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Status
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Assigned To
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Created At (IST)
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-12 px-4 text-center text-muted text-sm">
                    No appointments found in the database.
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-12 px-4 text-center text-muted text-sm">
                    No appointments match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app, index) => (
                  <tr
                    key={app.appointment_id}
                    className="border-b border-divider hover:bg-surface-secondary/60 dark:hover:bg-surface-secondary/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-muted">{index + 1}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {app.appointment_id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted">
                      {app.client_id || '-'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {app.client_name || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-foreground">{app.phone_number || '-'}</td>
                    <td className="py-3.5 px-4 text-muted">
                      {app.secondary_phone || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-foreground">{app.email || '-'}</td>
                    <td className="py-3.5 px-4 text-foreground whitespace-nowrap">
                      {app.appointment_date ? formatToIST(app.appointment_date) : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={getStatusBadgeClass(app.status)}>
                        {app.status || 'unscheduled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-foreground">{app.assigned_to || '-'}</td>
                    <td className="py-3.5 px-4 text-muted whitespace-nowrap">
                      {app.created_at ? formatToIST(app.created_at) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Status Badge Styling Helper
function getStatusBadgeClass(status) {
  const base = 'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border';
  switch (status?.toLowerCase()) {
    case 'scheduled':
      return `${base} bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd] dark:bg-[#1e3a5f] dark:text-[#7dd3fc] dark:border-[#2563eb]`;
    case 'completed':
      return `${base} bg-[#dcfce7] text-[#15803d] border-[#bbf7d0] dark:bg-[#1b3528] dark:text-[#4ade80] dark:border-[#25503c]`;
    case 'rescheduled':
      return `${base} bg-[#fef3c7] text-[#b45309] border-[#fde68a] dark:bg-[#3b2e1e] dark:text-[#fbbf24] dark:border-[#574125]`;
    case 'cancelled':
      return `${base} bg-[#fee2e2] text-[#b91c1c] border-[#fca5a5] dark:bg-[#3b2023] dark:text-[#f87171] dark:border-[#5a272d]`;
    case 'unscheduled':
    default:
      return `${base} bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb] dark:bg-[#2d2b38] dark:text-[#9ca3af] dark:border-[#3a3542]`;
  }
}
