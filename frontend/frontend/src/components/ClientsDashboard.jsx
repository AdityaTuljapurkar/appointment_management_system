
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatToIST } from '../utils/dateUtils';
import { API_URLS } from '../apiUrls';

export default function ClientsDashboard() {

    // Search state
    const [searchTerm, setSearchTerm] = useState("");

    // Client data states
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter selection states
    const [selectedRisks, setSelectedRisks] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Dropdown visibility states
    const [showRiskDropdown, setShowRiskDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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
        setSelectedRisks([]);
        setSelectedCategories([]);
    };

    // Fetch clients from Django backend
    const fetchClients = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(API_URLS.CLIENTS.LIST);

            if (!response.ok) {
                throw new Error(`Server returned status: ${response.status}`);
            }

            const data = await response.json();
            setClients(data);

        } catch (err) {
            setError(err.message || 'Failed to fetch clients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // Search and filter logic
    const filteredClients = clients.filter((client) => {

        const query = searchTerm.toLowerCase().trim();

        const matchesSearch =
            !query ||
            client.client_id?.toLowerCase().includes(query) ||
            client.client_name?.toLowerCase().includes(query) ||
            client.cutomer_phoneNumber?.includes(query) ||
            client.client_phoneNumber_secoundary?.includes(query);

        const matchesRisk =
            selectedRisks.length === 0 ||
            selectedRisks.includes(client.client_RiskProfile);

        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(client.client_category);

        return matchesSearch && matchesRisk && matchesCategory;
    });

    return (
        <div style={styles.container}>

            {/* Header */}
            <div style={styles.header}>

                <div>
                    <h2>Clients Dashboard</h2>

                    <p style={{ color: '#6b7280', margin: '4px 0 0' }}>
                        Total Registered Clients: <strong>{clients.length}</strong>
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>

                    <button
                        onClick={fetchClients}
                        style={styles.secondaryButton}
                    >
                        Refresh
                    </button>

                    <Link to="/create_client">
                        <button style={styles.primaryButton}>
                            + Create New Client
                        </button>
                    </Link>

                </div>

            </div>

            {/* Search and Filters */}
            <div style={styles.filterContainer}>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search by ID, name, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />

                {/* Risk Profile Dropdown */}
                <div style={styles.dropdownContainer}>

                    <button
                        onClick={() => toggleDropdown(
                            setShowRiskDropdown,
                            showRiskDropdown
                        )}
                        style={styles.secondaryButton}
                    >
                        Risk Profile ▼
                    </button>

                    {showRiskDropdown && (
                        <div style={styles.dropdownMenu}>

                            {['Conservative', 'Moderate', 'Aggresive'].map((risk) => (
                                <label
                                    key={risk}
                                    style={styles.checkboxLabel}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedRisks.includes(risk)}
                                        onChange={() => toggleFilter(
                                            risk,
                                            setSelectedRisks
                                        )}
                                    />

                                    {risk}
                                </label>
                            ))}

                        </div>
                    )}

                </div>

                {/* Client Category Dropdown */}
                <div style={styles.dropdownContainer}>

                    <button
                        onClick={() => toggleDropdown(
                            setShowCategoryDropdown,
                            showCategoryDropdown
                        )}
                        style={styles.secondaryButton}
                    >
                        Client Category ▼
                    </button>

                    {showCategoryDropdown && (
                        <div style={styles.dropdownMenu}>

                            {['Retail', 'HNI', 'Corporate'].map((category) => (
                                <label
                                    key={category}
                                    style={styles.checkboxLabel}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => toggleFilter(
                                            category,
                                            setSelectedCategories
                                        )}
                                    />

                                    {category}
                                </label>
                            ))}

                        </div>
                    )}

                </div>

                {/* Clear All Filters */}
                {(selectedRisks.length > 0 || selectedCategories.length > 0) && (
                    <button
                        onClick={clearAllFilters}
                        style={styles.clearButton}
                    >
                        Clear All
                    </button>
                )}

            </div>

            {/* Selected Filter Tags */}
            {(selectedRisks.length > 0 || selectedCategories.length > 0) && (
                <div style={styles.tagsContainer}>

                    {selectedRisks.map((risk) => (
                        <span key={risk} style={styles.filterTag}>
                            {risk}

                            <button
                                onClick={() => removeFilter(
                                    risk,
                                    setSelectedRisks
                                )}
                                style={styles.removeTagButton}
                            >
                                ×
                            </button>
                        </span>
                    ))}

                    {selectedCategories.map((category) => (
                        <span key={category} style={styles.filterTag}>
                            {category}

                            <button
                                onClick={() => removeFilter(
                                    category,
                                    setSelectedCategories
                                )}
                                style={styles.removeTagButton}
                            >
                                ×
                            </button>
                        </span>
                    ))}

                </div>
            )}

            {/* Loading, Error and Client Table */}
            {loading ? (

                <p style={styles.emptyTd}>
                    Loading clients data...
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
                                <th style={styles.th}>Client ID</th>
                                <th style={styles.th}>Client Name</th>
                                <th style={styles.th}>Customer Phone</th>
                                <th style={styles.th}>Secondary Phone</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Risk Profile</th>
                                <th style={styles.th}>Client Category</th>
                                <th style={styles.th}>Profile Value</th>
                                <th style={styles.th}>Client Objective</th>
                                <th style={styles.th}>Last Review Date (IST)</th>
                            </tr>
                        </thead>

                        <tbody>

                            {clients.length === 0 ? (

                                <tr>
                                    <td colSpan="11" style={styles.emptyTd}>
                                        No clients found in the database.
                                    </td>
                                </tr>

                            ) : filteredClients.length === 0 ? (

                                <tr>
                                    <td colSpan="11" style={styles.emptyTd}>
                                        No clients match your search or filter criteria.
                                    </td>
                                </tr>

                            ) : (

                                filteredClients.map((client, index) => (

                                    <tr key={client.client_id} style={styles.tr}>

                                        <td style={styles.td}>
                                            {index + 1}
                                        </td>

                                        <td style={{
                                            ...styles.td,
                                            fontFamily: 'monospace',
                                            fontWeight: 'bold'
                                        }}>
                                            {client.client_id}
                                        </td>

                                        <td style={{
                                            ...styles.td,
                                            fontWeight: '600'
                                        }}>
                                            {client.client_name}
                                        </td>

                                        <td style={styles.td}>
                                            {client.cutomer_phoneNumber}
                                        </td>

                                        <td style={styles.td}>
                                            {client.client_phoneNumber_secoundary || '-'}
                                        </td>

                                        <td style={styles.td}>
                                            {client.email}
                                        </td>

                                        <td style={styles.td}>
                                            <span style={getRiskBadgeStyle(client.client_RiskProfile)}>
                                                {client.client_RiskProfile}
                                            </span>
                                        </td>

                                        <td style={styles.td}>
                                            {client.client_category}
                                        </td>

                                        <td style={styles.td}>
                                            {client.Profile_value || '-'}
                                        </td>

                                        <td
                                            style={styles.objectiveTd}
                                            title={client.client_objective || ''}
                                        >
                                            {client.client_objective || '-'}
                                        </td>

                                        <td style={styles.td}>
                                            {client.last_review_date
                                                ? formatToIST(client.last_review_date)
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

// Risk Profile Badge Styling
const getRiskBadgeStyle = (risk) => {

    const badgeMap = {

        Conservative: {
            bg: '#e6fffa',
            color: '#047481',
            border: '#b2f5ea'
        },

        Moderate: {
            bg: '#fffaf0',
            color: '#dd6b20',
            border: '#feebc8'
        },

        Aggresive: {
            bg: '#fff5f5',
            color: '#e53e3e',
            border: '#fed7d7'
        },

    };

    const theme = badgeMap[risk] || {
        bg: '#edf2f7',
        color: '#4a5568',
        border: '#e2e8f0'
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

    objectiveTd: {
        padding: '12px 14px',
        color: '#1f2937',
        maxWidth: '220px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },

    emptyTd: {
        textAlign: 'center',
        padding: '36px',
        color: '#6b7280',
        fontSize: '14px',
    },
};
