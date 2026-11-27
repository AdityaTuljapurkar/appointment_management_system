import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Navbar';
import Home from './components/Home';
import CreateAppointment from './components/Create_appointment';
import CreateClient from './components/create_client';
import ClientsDashboard from './components/ClientsDashboard';
import AppointmentsDashboard from './components/AppointmentsDashboard';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/clients" element={<ClientsDashboard />} />
            <Route path="/create_appointment" element={<CreateAppointment />} />
            <Route path="/create_client" element={<CreateClient />} />
            <Route path="/Appointments" element={<AppointmentsDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
