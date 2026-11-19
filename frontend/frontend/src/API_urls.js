const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_URLS = {
  BASE: BASE_URL,


  APPOINTMENTS: {
    LIST: `${BASE_URL}/v1/appointments/`,
    CREATE: `${BASE_URL}/v1/appointments/create/`,
  },


  CLIENTS: {
    LIST: `${BASE_URL}/v1/clients/`,
    CREATE: `${BASE_URL}/v1/clients/create/`,
  },
};

export default API_URLS;