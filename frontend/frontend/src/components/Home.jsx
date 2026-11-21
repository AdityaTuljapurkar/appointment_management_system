import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/25 mb-3">
            Business Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Appointment Management System
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed">
            Manage client profiles, schedule appointments, and coordinate team follow-ups seamlessly across IST business hours.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link to="/login">
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold rounded-md border border-border bg-surface text-foreground hover:bg-surface-secondary transition-colors cursor-pointer shadow-xs"
              >
                Register New Account
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: View Appointments */}
          <Link
            to="/Appointments"
            className="group block p-5 rounded-xl border border-border bg-surface hover:bg-surface-secondary transition-all shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground dark:bg-primary dark:text-foreground flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground text-base group-hover:text-accent transition-colors">
              Appointments
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              View, search, and filter all scheduled, rescheduled, and completed bookings.
            </p>
          </Link>

          {/* Card 2: Book Appointment */}
          <Link
            to="/create_appointment"
            className="group block p-5 rounded-xl border border-border bg-surface hover:bg-surface-secondary transition-all shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground text-base group-hover:text-accent transition-colors">
              Book Appointment
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Create a new client booking with assigned staff and confirmation modal.
            </p>
          </Link>

          {/* Card 3: View Clients */}
          <Link
            to="/clients"
            className="group block p-5 rounded-xl border border-border bg-surface hover:bg-surface-secondary transition-all shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground dark:bg-primary dark:text-foreground flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground text-base group-hover:text-accent transition-colors">
              Clients Directory
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Explore customer database, category portfolios, and risk profiles.
            </p>
          </Link>

          {/* Card 4: Register Client */}
          <Link
            to="/create_client"
            className="group block p-5 rounded-xl border border-border bg-surface hover:bg-surface-secondary transition-all shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-secondary text-foreground border border-border flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground text-base group-hover:text-accent transition-colors">
              New Client Profile
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Add new customer accounts, contact details, and initial investment parameters.
            </p>
          </Link>
        </div>
      </div>

      {/* Features & Capabilities */}
      <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-4">Features & Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-surface-secondary/50 border border-divider">
            <div className="font-semibold text-foreground text-sm flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Easy Scheduling
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Record customer details, contact numbers, and appointment dates in Indian Standard Time (IST).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-secondary/50 border border-divider">
            <div className="font-semibold text-foreground text-sm flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Status Tracking
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Track appointments with semantic status badges across Unscheduled, Scheduled, Rescheduled, Cancelled, and Completed.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-secondary/50 border border-divider">
            <div className="font-semibold text-foreground text-sm flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Team Assignment
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Assign bookings directly to staff members or agents for clear accountability and follow-up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
