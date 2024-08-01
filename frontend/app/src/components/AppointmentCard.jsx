import React from "react";

const AppointmentCard = ({ appointment, onUpdate, onCancel, onReminder }) => {
    const handleReschedule = () => {
        const newTime = prompt('Enter new time:');
        if (newTime) {
            onUpdate(appointment._id, { ...appointment, time: newTime });
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="text-lg font-semibold">{appointment.title}</h3>
            <p className="text-gray-600">Date: {appointment.date}</p>
            <p className="text-gray-600">Time: {appointment.time}</p>
            <div className="flex space-x-2 mt-4">
                <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    onClick={handleReschedule}
                >
                    Reschedule
                </button>
                <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => onCancel(appointment._id)}
                >
                    Cancel
                </button>
                <button
                    className="bg-green-500 text-white px-3 py-1 rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={() => onReminder(appointment._id)}
                >
                    Set Reminder
                </button>
            </div>
        </div>
    );
};

export default AppointmentCard;