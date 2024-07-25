import React, { useState } from 'react';

const AppointmentForm = () => {
  const [formData,setFormData] = useState({
    student:'',
    teacher:'',
    dateTime:'',
    notes:'',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onsubmit(formData);
    setFormData({
      student:'',
      teacher:'',
      dateTime:'',
      notes:'',
    });
  };

  return (
    <div>
      <h3>Appointment Form</h3>
      <form onSubmit={handleSubmit}>
        <label>Student:</label>
        <input type="text" value={formData.student} onChange={(e) => setFormData({ ...formData, student: e.target.value })} />
        <label>Teacher:</label>
        <input type="text" value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} />
        <label>Date & Time:</label>
        <input type="datetime-local" value={formData.dateTime} onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })} />
        <label>Notes:</label>
        <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}></textarea>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
