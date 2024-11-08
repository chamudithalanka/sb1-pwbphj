import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, Clock, Download, User, Phone } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface AppointmentData {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
}

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(
    null
  );

  useEffect(() => {
    const data = localStorage.getItem('appointmentData');
    if (!data) {
      navigate('/');
      return;
    }
    setAppointmentData(JSON.parse(data));
  }, [navigate]);

  const downloadPDF = async () => {
    const element = document.getElementById('confirmation-content');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
    });

    const pdf = new jsPDF({
      format: 'a4',
      unit: 'px',
    });

    const imgWidth = 595.28;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`appointment-confirmation-${appointmentData?.id}.pdf`);
  };

  if (!appointmentData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-2xl mx-auto p-6 space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Appointment Confirmed!
        </h1>
        <p className="text-muted-foreground">
          Your appointment has been successfully booked
        </p>
      </div>

      <div
        id="confirmation-content"
        className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{appointmentData.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{appointmentData.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{appointmentData.date}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{appointmentData.time}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">Appointment ID</p>
            <p className="font-mono text-sm">{appointmentData.id}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={downloadPDF}
          className="flex-1"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button
          onClick={() => navigate('/')}
          className="flex-1"
        >
          Book Another Appointment
        </Button>
      </div>
    </motion.div>
  );
}