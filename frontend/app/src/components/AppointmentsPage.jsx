import React,{useEffect} from "react";
import {useSelector,useDispatch } from 'react-redux'
import {fetchAppointments, bookAppointment, rescheduleAppointment, cancelAppointment,reminderAppointment, selectAppointments, selectLoading} from '../store/appointmentAuthSlice'
import AppointmentList from './AppointmentList'
import AppointmentForm from './AppointmentForm'

const AppointmentsPage = () => {
 const dispatch = useDispatch();
 const appointments = useSelector(selectAppointments)
 const loading = useSelector(selectLoading);

 useEffect(() => {
 dispatch(fetchAppointments());
 },[dispatch])


const handleBookAppointment = (appointmentData) => {
 dispatch(bookAppointment());
};

const handleRescheduledAppoinement = (id,appointmentData) => {
 dispatch(rescheduleAppointment({id,appointmentData}))
};

const handleCancelAppointment = (id) => {
 dispatch(cancelAppointment(id));
};

const handleReminderAppointment = (id) => {
 dispatch(reminderAppointment(id));
};

  return (
    <div>
      <h2>Appointments</h2>
      <AppointmentForm onSubmit={handleCreateAppointment} />
      {loading ? <p>Loading appointments...</p> : <AppointmentList appointments={appointments} onUpdate={handleUpdateAppointment} onCancel={handleCancelAppointment} />}
    </div>
  );

}

export default AppointmentsPage;
