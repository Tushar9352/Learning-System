// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import "./coursestudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import PropTypes from 'prop-types';

const CourseStudy = ({ user }) => {
  const params = useParams();
  const { fetchCourse, course } = CourseData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse(params.id);
  }, [fetchCourse, params.id]);

  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return navigate("/");

  return (
    <>
      {course && (
        <div className="course-study-page">
          <img src={`${server}/${course.image}`} alt="" width={350} />
          <h2>{course.title}</h2>
          <h4>{course.description}</h4>
          <h5>by - {course.createdBy}</h5>
          <h5>Duration - {course.duration} weeks</h5>
          <Link to={`/lectures/${course._id}`}>
            <h2>Lectures</h2>
          </Link>
        </div>
      )}
    </>
  );
};

CourseStudy.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
    subscription: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

export default CourseStudy;
