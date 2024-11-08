import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import AppointmentForm from '@/components/AppointmentForm';
import ConfirmationPage from '@/components/ConfirmationPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="w-full">
          <Routes>
            <Route path="/" element={<AppointmentForm />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
          <Toaster position="top-center" />
        </div>
      </div>
    </Router>
  );
}

export default App;