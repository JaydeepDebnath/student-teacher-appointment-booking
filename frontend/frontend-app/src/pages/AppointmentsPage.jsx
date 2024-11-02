import React,{useEffect, useState} from "react";
import {useSelector,useDispatch } from 'react-redux'
import {
  fetchAppointments,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  reminderAppointment,
  selectAppointments, 
  selectLoading} from '../store/appointmentAuthSlice'
import Button from "../components/Button";
import AppointmentList from '../components/AppointmentList'
import AppointmentForm from '../components/AppointmentForm'
import {toast} from 'react-toastify'


const AppointmentsPage = () => {
 const dispatch = useDispatch();
 const appointments = useSelector(selectAppointments)
 const loading = useSelector(selectLoading);
 const [showForm,setShowForm] = useState(false);

 useEffect(() => { 
 dispatch(fetchAppointments());
 },[dispatch])


const handleBookAppointment = async (appointmentData) => {
  try {
    await dispatch(bookAppointment(appointmentData)).unwrap();
    toast.success('Appointment booked successfully!');
  } catch (error) {
    toast.error('Failed to book appointment.');
  }
};

const handleRescheduledAppointment = async (id,appointmentData) => {
  try {
    await dispatch(rescheduleAppointment({ id, appointmentData })).unwrap();
    toast.success('Appointment rescheduled successfully!');
  } catch (error) {
    toast.error('Failed to reschedule appointment.');
  }
};

const handleCancelAppointment = async (id) => {
  try {
    await dispatch(cancelAppointment(id)).unwrap();
    toast.success('Appointment canceled successfully!');
  } catch (error) {
    toast.error('Failed to cancel appointment.');
  }
};

const handleReminderAppointment = async (id) => {
  try {
    await dispatch(reminderAppointment({ id })).unwrap();
    toast.success('Reminder sent successfully!');
  } catch (error) {
    toast.error('Failed to send reminder.');
  }


};

return (
  <div className="bg-gray-100 text-gray-900 p-6 
  rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-center 
      mb-6 text-blue-800"
      >
        Appointments
        </h2>
      <Button
          className="bg-blue-500 text-white px-4 py-2 
          rounded-lg shadow hover:bg-blue-600 focus:outline-none
           focus:ring-2 focus:ring-blue-500"
          onClick={() => setShowForm(!showForm)}
      >
          {showForm ? 'Close Form' : 'Book Appointment'}
      </Button>
      {showForm && <AppointmentForm 
      onSubmit={handleBookAppointment}
      />}
      {loading ? (
          <p className="text-center mt-4">Loading appointments...</p>
      ) : (
          <AppointmentList
              appointments={appointments}
              onUpdate={handleRescheduledAppointment}
              onCancel={handleCancelAppointment}
              onReminder={handleReminderAppointment}
          />
      )}
  </div>
);

}

export default AppointmentsPage;
