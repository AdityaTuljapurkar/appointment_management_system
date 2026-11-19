import { Link } from 'react-router-dom';


export default function Home() {
  return (
    <div>
      <header>
        <h1>Appointment Management System</h1>
        <p>Manage, schedule, and track customer appointments seamlessly.</p>
      </header>

      <section>
          
        <div>
          <h3>Quick Actions</h3>
          <p>Book a new appointment or manage customer bookings.</p>
          <Link to="/create_appointment">
            <button type="button">Create New Appointment</button>
          </Link>
        </div>
      </section>

      <section>
        <h3>Features & Capabilities</h3>
        <ul>
          <li>
            <strong>Easy Scheduling:</strong> Record customer details, contact numbers, and appointment dates.
          </li>
          <li>
            <strong>Status Tracking:</strong> Keep track of appointments (Unscheduled, Scheduled, Rescheduled, Cancelled, Completed).
          </li>
          <li>
            <strong>Team Assignment:</strong> Assign appointments to available staff members.
          </li>
        </ul>
      </section>
    </div>
  );
}
