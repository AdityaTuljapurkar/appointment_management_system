import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatToIST } from '../utils/dateUtils';
import { API_URLS } from '../apiUrls';

export default function AppointmentsDashboard() {
    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    //time range 
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
        setter(prev => {
            if (prev.includes(value)) {
                const updated = prev.filter(item => item !== value);
                return updated;
            } else {
                const updated = [...prev, value];
                return updated;
            }
        });
    };

    // Remove an individual filter
    const removeFilter = (value, setter) => {
        setter(prev => {
            const updated = prev.filter(item => item !== value);
            return updated;
        });
    };

    // Clear all filters
    const clearAllFilters = () => {
        setStatusFilter([]);
        setAppointmentDateRange('');
    };

    // Fetch appointments from backend
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
        fetchAppointments();
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

        const today = new Date()

        const endDate = new Date()
        endDate.setDate(endDate.getDate()+Number(appointmentDateRange))

        const appointmentDate =  new Date(app.appointment_date)

        const matchDateRange =  !appointmentDateRange ||
        (
            app.appointment_date && 
            appointmentDate  >= today && 
            appointmentDate <= endDate 
        )

        return matchesSearch && matchesStatus && matchDateRange
    });

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h2>Appointments Dashboard</h2>
                    <p style={{ color: '#6b7280', margin: '4px 0 0' }}>
                        Total Appointments: <strong>{appointments.length}</strong>
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={fetchAppointments} style={styles.secondaryButton}>
                        Refresh
                    </button>
                    <Link to="/create_appointment">
                        <button style={styles.primaryButton}>
                            + Book New Appointment
                        </button>
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <div style={styles.filterContainer}>
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search by ID, client name, phone, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />

                {/* Status Dropdown */}
                <div style={styles.dropdownContainer}>
                    <button
                        onClick={() => toggleDropdown(
                            setStatusDropdown,
                            statusDropdown
                        )}
                        style={styles.secondaryButton}
                    >
                        Status ▼
                    </button>
                        {/* Appointment Date Filter */}

<div style={styles.dropdownContainer}>

    <button
        onClick={() => toggleDropdown(
            setDateDropdown,
            dateDropdown
        )}
        style={styles.secondaryButton}
    >
        Appointment Date ▼
    </button>

    {dateDropdown && (
        <div style={styles.dropdownMenu}>

            {[
                { label: 'Next 7 Days', value: '7' },
                { label: 'Next 14 Days', value: '14' },
                { label: 'Next 30 Days', value: '30' }
            ].map((range) => (

                <label
                    key={range.value}
                    style={styles.checkboxLabel}
                >

                    <input
                        type="radio"
                        name="appointmentDateRange"
                        checked={appointmentDateRange === range.value}
                        onChange={() => {
                            setAppointmentDateRange(range.value);
                            setDateDropdown(false);
                        }}
                    />

                    {range.label}

                </label>

            ))}

        </div>
    )}

</div>

                    {statusDropdown && (
                        <div style={styles.dropdownMenu}>
                            {[
                                'unscheduled',
                                'scheduled',
                                'rescheduled',
                                'cancelled',
                                'completed'
                            ].map((status) => (
                                <label
                                    key={status}
                                    style={styles.checkboxLabel}
                                >
                                    <input
                                        type="checkbox"
                                        checked={statusFilter.includes(status)}
                                        onChange={() => toggleFilter(
                                            status,
                                            setStatusFilter
                                        )}
                                    />
                                    <span style={{ textTransform: 'capitalize' }}>{status}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Clear All Filters */}
                {statusFilter.length > 0 && (
                    <button
                        onClick={clearAllFilters}
                        style={styles.clearButton}
                    >
                        Clear All
                    </button>
                )}
            </div>
{/* Selected Date Filter Tag */}

{appointmentDateRange && (

    <div style={styles.tagsContainer}>

        <span style={styles.filterTag}>

            Next {appointmentDateRange} Days

            <button
                onClick={() => setAppointmentDateRange('')}
                style={styles.removeTagButton}
            >
                ×
            </button>

        </span>

    </div>
)}
            {/* Selected Filter Tags */}
            {statusFilter.length > 0 && (
                <div style={styles.tagsContainer}>
                    {statusFilter.map((status) => (
                        <span key={status} style={styles.filterTag}>
                            <span style={{ textTransform: 'capitalize' }}>{status}</span>
                            <button
                                onClick={() => removeFilter(
                                    status,
                                    setStatusFilter
                                )}
                                style={styles.removeTagButton}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Loading, Error & Data Table */}
            {loading ? (
                <p style={styles.emptyTd}>
                    Loading appointments data...
                </p>
            ) : error ? (
                <p style={{ color: 'red', padding: '20px' }}>
                    Error: {error}
                </p>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thRow}>
                                <th style={styles.th}>Sr no</th>
                                <th style={styles.th}>Appointment ID</th>
                                <th style={styles.th}>Client ID</th>
                                <th style={styles.th}>Client Name</th>
                                <th style={styles.th}>Phone Number I</th>
                                <th style={styles.th}>Phone Number II</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Appointment Date (IST)</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Assigned To</th>
                                <th style={styles.th}>Created At (IST)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="11" style={styles.emptyTd}>
                                        No appointments found in the database.
                                    </td>
                                </tr>
                            ) : filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="11" style={styles.emptyTd}>
                                        No appointments match your search or filter criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredAppointments.map((app, index) => (
                                    <tr key={app.appointment_id} style={styles.tr}>
                                        <td style={styles.td}>{index + 1}</td>
                                        <td
                                            style={{
                                                ...styles.td,
                                                fontFamily: 'monospace',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {app.appointment_id}
                                        </td>
                                        <td
                                            style={{
                                                ...styles.td,
                                                fontFamily: 'monospace',
                                            }}
                                        >
                                            {app.client_id || '-'}
                                        </td>
                                        <td style={{ ...styles.td, fontWeight: '600' }}>
                                            {app.client_name || '-'}
                                        </td>
                                        <td style={styles.td}>{app.phone_number || '-'}</td>
                                        <td style={styles.td}>
                                            {app.secondary_phone || '-'}
                                        </td>
                                        <td style={styles.td}>{app.email || '-'}</td>
                                        <td style={styles.td}>
                                            {app.appointment_date
                                                ? formatToIST(app.appointment_date)
                                                : '-'}
                                        </td>
                                        <td style={styles.td}>
                                            <span style={getStatusBadgeStyle(app.status)}>
                                                {app.status || 'unscheduled'}
                                            </span>
                                        </td>
                                        <td style={styles.td}>{app.assigned_to || '-'}</td>
                                        <td style={styles.td}>
                                            {app.created_at
                                                ? formatToIST(app.created_at)
                                                : '-'}
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

// Status Badge Styling
const getStatusBadgeStyle = (status) => {
    const badgeMap = {
        scheduled: { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
        completed: { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
        rescheduled: { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
        cancelled: { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' },
        unscheduled: { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' },
    };
    const theme =
        badgeMap[status?.toLowerCase()] || {
            bg: '#f3f4f6',
            color: '#4b5563',
            border: '#e5e7eb',
        };

    return {
        backgroundColor: theme.bg,
        color: theme.color,
        border: `1px solid ${theme.border}`,
        padding: '3px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
        textTransform: 'capitalize',
    };
};

// Component Styling
const styles = {
    container: {
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
    },

    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '16px',
    },

    searchInput: {
        padding: '9px 14px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        minWidth: '280px',
        outline: 'none',
    },

    dropdownContainer: {
        position: 'relative',
        display: 'inline-block',
    },

    dropdownMenu: {
        position: 'absolute',
        top: 'calc(100% + 5px)',
        left: 0,
        backgroundColor: '#fff',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        padding: '10px',
        minWidth: '180px',
        zIndex: 10,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },

    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px',
        cursor: 'pointer',
    },

    clearButton: {
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        border: '1px solid #fecaca',
        padding: '9px 14px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
    },

    tagsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '16px',
    },

    filterTag: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#eff6ff',
        color: '#1d4ed8',
        border: '1px solid #bfdbfe',
        padding: '5px 10px',
        borderRadius: '20px',
        fontSize: '13px',
    },

    removeTagButton: {
        background: 'none',
        border: 'none',
        color: '#1d4ed8',
        cursor: 'pointer',
        fontSize: '17px',
        padding: 0,
        lineHeight: 1,
    },

    primaryButton: {
        backgroundColor: '#0066cc',
        color: '#fff',
        border: 'none',
        padding: '9px 16px',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer',
    },

    secondaryButton: {
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: '1px solid #d1d5db',
        padding: '9px 14px',
        borderRadius: '6px',
        cursor: 'pointer',
    },

    tableWrapper: {
        overflowX: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '14px',
    },

    thRow: {
        backgroundColor: '#f9fafb',
        borderBottom: '2px solid #e5e7eb',
    },

    th: {
        padding: '12px 14px',
        fontWeight: '600',
        color: '#374151',
        whiteSpace: 'nowrap',
    },

    tr: {
        borderBottom: '1px solid #f3f4f6',
    },

    td: {
        padding: '12px 14px',
        color: '#1f2937',
        whiteSpace: 'nowrap',
    },

    emptyTd: {
        textAlign: 'center',
        padding: '36px',
        color: '#6b7280',
        fontSize: '14px',
    },
};
