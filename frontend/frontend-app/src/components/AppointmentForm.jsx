import React, { useState } from 'react';
import Input from './Input';

const AppointmentForm = () => {
  const [formData,setFormData] = useState({
    student:'',
    teacher:'',
    dateTime:'',
    notes:'',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData({
      student: '',
      teacher: '',
      dateTime: '',
      notes: '',
    });
  };

  return (
    <div>
    <h3>Appointment Form</h3>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="student">Student:</label>
        <input
          id="student"
          type="text"
          value={formData.student}
          onChange={(e) => setFormData({ ...formData, student: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="teacher">Teacher:</label>
        <input
          id="teacher"
          type="text"
          value={formData.teacher}
          onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="dateTime">Date & Time:</label>
        <input
          id="dateTime"
          type="datetime-local"
          value={formData.dateTime}
          onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      <button type="submit">Book Appointment</button>
    </form>
  </div>
  );
};

export default AppointmentForm;
