import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import CreateAppointment from './components/Create_appointment';
import CreateClient from './components/create_client';
import ClientsDashboard from './components/ClientsDashboard';
import AppointmentsDashboard from './components/AppointmentsDashboard';
function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |  
        <Link to="/clients"> Clients</Link> |  
        <Link to="/Appointments">Appointments</Link>
        
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<ClientsDashboard />} />
        <Route path="/create_appointment" element={<CreateAppointment />} />
        <Route path="/create_client" element={<CreateClient />} />
        <Route path='/Appointments' element={<AppointmentsDashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
