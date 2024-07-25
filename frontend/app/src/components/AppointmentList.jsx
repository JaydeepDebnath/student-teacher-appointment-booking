import React from "react";

const AppointmentList = ({appointments, onUpdate, onCancel}) => {
 return (
    <div>
      <h3>Appointment List</h3>
      <ul>
        {appointments.map(appointment => (
          <li key={appointment._id}>
            {appointment.student.name} - {appointment.teacher.name} - {appointment.dateTime}
            <button onClick={() => onUpdate(appointment._id, { status: 'completed' })}>Complete</button>
            <button onClick={() => onCancel(appointment._id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentList;