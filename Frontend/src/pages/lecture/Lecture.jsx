// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import PropTypes from 'prop-types';

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [completedLec, setCompletedLec] = useState(0);
  const [lectLength, setLectLength] = useState(0);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
      navigate("/");
    } else {
      fetchLectures();
      fetchProgress();
    }
  }, []);

  const fetchLectures = async () => {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLectures(data.lectures);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLecture = async (id) => {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLecture(data.lecture);
    } catch (error) {
      console.error(error);
    } finally {
      setLecLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(`${server}/api/user/progress?course=${params.id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setCompleted(data.courseProgressPercentage);
      setCompletedLec(data.completedLectures);
      setLectLength(data.allLectures);
      setProgress(data.progress);
    } catch (error) {
      console.error(error);
    }
  };

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setVideoPrev(reader.result);
        setVideo(file);
      };
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(`${server}/api/course/${params.id}`, myForm, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setVideo(null);
      setVideoPrev("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        await axios.delete(`${server}/api/lecture/${id}`, {
          headers: { token: localStorage.getItem("token") },
        });
        toast.success("Lecture deleted successfully");
        fetchLectures();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete lecture");
      }
    }
  };

  const addProgress = async (id) => {
    try {
      await axios.post(`${server}/api/user/progress?course=${params.id}&lectureId=${id}`, {}, {
        headers: { token: localStorage.getItem("token") },
      });
      fetchProgress();
    } catch (error) {
      console.error(error);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <div className="progress">
        Lecture completed - {completedLec} out of {lectLength} <br />
        <progress value={completed} max={100}></progress> {completed}%
      </div>
      <div className="lecture-page">
        <div className="left">
          {lecLoading ? (
            <Loading />
          ) : lecture ? (
            <>
              <video
                src={`${server}/${lecture.video}`}
                width="100%"
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                autoPlay
                onEnded={() => addProgress(lecture._id)}
              ></video>
              <h1>{lecture.title}</h1>
              <h3>{lecture.description}</h3>
            </>
          ) : (
            <h1>Please Select a Lecture</h1>
          )}
        </div>
        <div className="right">
          {user?.role === "admin" && (
            <button className="common-btn" onClick={() => setShow(!show)}>
              {show ? "Close" : "Add Lecture +"}
            </button>
          )}
          {show && (
            <div className="lecture-form">
              <h2>Add Lecture</h2>
              <form onSubmit={submitHandler}>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Title" />
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Description" />
                <input type="file" onChange={changeVideoHandler} required />
                {videoPrev && <video src={videoPrev} width={300} controls></video>}
                <button disabled={btnLoading} type="submit" className="common-btn">
                  {btnLoading ? "Please Wait..." : "Add"}
                </button>
              </form>
            </div>
          )}
          {lectures.map((e, i) => (
            <div key={e._id}>
              <div onClick={() => fetchLecture(e._id)} className="lecture-number">
                {i + 1}. {e.title} {progress.some((p) => p.completedLectures.includes(e._id)) && <TiTick />}
              </div>
              {user?.role === "admin" && (
                <button
                  className="common-btn"
                  style={{ background: "red" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler(e._id);
                  }}
                >
                  Delete {e.title}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

Lecture.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    role: PropTypes.string,
    subscription: PropTypes.arrayOf(PropTypes.string)
  })
};

export default Lecture;
