import React,{useEffect} from "react";
import {content} from 'redux'
import { fetchStudents } from "../store/actions";

const StudentList = ({ students, fetchStudents }) => {
    useEffect(() => {
      fetchStudents();
    }, [fetchStudents]);
  
    return (
      <div>
        <h2>Students</h2>
        <ul>
          {students.map(student => (
            <li key={student.id}>{student.name}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  const mapStateToProps = state => ({
    students: state.students.students,
  });
  
  export default connect(mapStateToProps, { fetchStudents })(StudentList);
  