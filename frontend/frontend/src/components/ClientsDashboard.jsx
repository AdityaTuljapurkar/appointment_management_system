import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatToIST } from '../utils/dateUtils';
import { API_URLS } from '../apiUrls';

export default function ClientsDashboard() {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

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
    setSelectedRisks([]);
    setSelectedCategories([]);
  };

  // Fetch clients from Django backend (e.g. on manual refresh)
  const fetchClients = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(API_URLS.CLIENTS.LIST, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setClients(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/logout';
        return;
      }
      setError(err.response?.data?.error || err.message || 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const response = await axios.get(API_URLS.CLIENTS.LIST, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        if (!ignore) {
          setClients(response.data);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          window.location.href = '/logout';
          return;
        }
        if (!ignore) {
          setError(err.response?.data?.error || err.message || 'Failed to fetch clients');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Clients Dashboard
          </h2>
          <p className="text-sm text-muted mt-1">
            Total Registered Clients: <strong className="text-foreground">{clients.length}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchClients}
            className="px-4 py-2 text-sm font-medium rounded-md border border-border bg-surface text-foreground hover:bg-surface-secondary transition-colors cursor-pointer shadow-xs"
          >
            Refresh
          </button>
          <Link to="/create_client">
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors cursor-pointer shadow-xs"
            >
              + Create New Client
            </button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by ID, name, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3.5 py-2 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-focus focus:border-focus min-w-[280px] flex-1 sm:flex-initial transition-colors"
        />

        {/* Risk Profile Dropdown */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => toggleDropdown(setShowRiskDropdown, showRiskDropdown)}
            className="px-3.5 py-2 text-sm font-medium rounded-md border border-border bg-surface text-foreground hover:bg-surface-secondary transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Risk Profile</span>
            <span className="text-xs">▼</span>
          </button>

          {showRiskDropdown && (
            <div className="absolute top-[calc(100%+6px)] left-0 bg-surface border border-border rounded-md shadow-lg p-2.5 min-w-[190px] z-30">
              {['Conservative', 'Moderate', 'Aggresive'].map((risk) => (
                <label
                  key={risk}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm hover:bg-surface-secondary text-foreground text-sm cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedRisks.includes(risk)}
                    onChange={() => toggleFilter(risk, setSelectedRisks)}
                    className="rounded-xs border-border accent-primary cursor-pointer"
                  />
                  <span>{risk}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Client Category Dropdown */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => toggleDropdown(setShowCategoryDropdown, showCategoryDropdown)}
            className="px-3.5 py-2 text-sm font-medium rounded-md border border-border bg-surface text-foreground hover:bg-surface-secondary transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Client Category</span>
            <span className="text-xs">▼</span>
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-[calc(100%+6px)] left-0 bg-surface border border-border rounded-md shadow-lg p-2.5 min-w-[190px] z-30">
              {['Retail', 'HNI', 'Corporate'].map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm hover:bg-surface-secondary text-foreground text-sm cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleFilter(category, setSelectedCategories)}
                    className="rounded-xs border-border accent-primary cursor-pointer"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Clear All Filters */}
        {(selectedRisks.length > 0 || selectedCategories.length > 0) && (
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
      {(selectedRisks.length > 0 || selectedCategories.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedRisks.map((risk) => (
            <span
              key={risk}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-border bg-surface-secondary text-foreground shadow-2xs"
            >
              <span>{risk}</span>
              <button
                type="button"
                onClick={() => removeFilter(risk, setSelectedRisks)}
                className="text-muted hover:text-foreground text-sm leading-none cursor-pointer p-0"
                aria-label={`Remove filter ${risk}`}
              >
                ×
              </button>
            </span>
          ))}

          {selectedCategories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-border bg-surface-secondary text-foreground shadow-2xs"
            >
              <span>{category}</span>
              <button
                type="button"
                onClick={() => removeFilter(category, setSelectedCategories)}
                className="text-muted hover:text-foreground text-sm leading-none cursor-pointer p-0"
                aria-label={`Remove filter ${category}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Loading, Error and Client Table */}
      {loading ? (
        <div className="p-12 text-center text-muted bg-surface border border-border rounded-lg text-sm">
          Loading clients data...
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
                  Client ID
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Client Name
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Customer Phone
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Secondary Phone
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Email
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Risk Profile
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Client Category
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Profile Value
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Client Objective
                </th>
                <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                  Last Review Date (IST)
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-12 px-4 text-center text-muted text-sm">
                    No clients found in the database.
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-12 px-4 text-center text-muted text-sm">
                    No clients match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client, index) => (
                  <tr
                    key={client.client_id}
                    className="border-b border-divider hover:bg-surface-secondary/60 dark:hover:bg-surface-secondary/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-muted">{index + 1}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {client.client_id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {client.client_name}
                    </td>
                    <td className="py-3.5 px-4 text-foreground">
                      {client.cutomer_phoneNumber}
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      {client.client_phoneNumber_secoundary || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-foreground">{client.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={getRiskBadgeClass(client.client_RiskProfile)}>
                        {client.client_RiskProfile}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-foreground">
                      {client.client_category}
                    </td>
                    <td className="py-3.5 px-4 text-foreground">
                      {client.Profile_value || '-'}
                    </td>
                    <td
                      className="py-3.5 px-4 text-muted max-w-[200px] truncate"
                      title={client.client_objective || ''}
                    >
                      {client.client_objective || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-muted whitespace-nowrap">
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

// Risk Profile Badge Styling (STRICT SEMANTIC PRESERVATION AS REQUIRED BY SPEC)
function getRiskBadgeClass(risk) {
  const base = 'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border';
  switch (risk) {
    case 'Conservative':
      // Semantic Green in both themes
      return `${base} bg-[#DDF2E5] text-[#246B45] border-[#BFE3CD] dark:bg-[#1B3528] dark:text-[#4ADE80] dark:border-[#25503C]`;
    case 'Moderate':
      // Semantic Amber / Orange in both themes
      return `${base} bg-[#FEF3C7] text-[#B45309] border-[#FDE68A] dark:bg-[#3B2E1E] dark:text-[#FBBF24] dark:border-[#574125]`;
    case 'Aggresive':
    case 'Aggressive':
      // Semantic Red / Coral in both themes
      return `${base} bg-[#FCE4E0] text-[#C83E35] border-[#F5C5BD] dark:bg-[#3B2023] dark:text-[#F87171] dark:border-[#5A272D]`;
    default:
      return `${base} bg-surface-secondary text-muted border-border`;
  }
}
