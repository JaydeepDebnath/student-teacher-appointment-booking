import React from "react";
import AppointmentCard from "./AppointmentCard";

const AppointmentList = ({appointments, onUpdate, onCancel,onReminder}) => {
 return (
  <div className="mt-6">
            {appointments.length === 0 ? (
                <p className="text-center text-gray-500">No appointments scheduled</p>
            ) : (
                appointments.map(app => (
                    <AppointmentCard
                        key={app._id}
                        appointment={app}
                        onUpdate={onUpdate}
                        onCancel={onCancel}
                        onReminder={onReminder}
                    />
                ))
            )}
        </div>
    );
}

export default AppointmentList;