import React from "react";
import { message } from "antd";
import { useContext, useEffect, useState } from "react";
import { signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext, logInContext } from "../../UserContext";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../Login/firebaseConfig";
import "../Login/Login.css";
import verified from "../../images/verified.png";
import nonVerified from "../../images/non-verified.svg";
import { async } from "@firebase/util";

const LoggedIn = () => {
  let auth = getAuth();
  const [moviesList, setMoviesList] = useState([]);
  const moviesCollectionRef = collection(db, "movies");
  const { data, setData } = useContext(UserContext);
  const [loggedIn, setLoggedIn] = useContext(logInContext);
  const [messageApi, contextHolder] = message.useMessage();
  //Updated Title State
  const [updatedTitle, setUpdatedTitle] = useState("");
  const navigate = useNavigate();
  const logOut = async () => {
    try {
      await signOut(auth);
      console.log("Logged Out");
      messageApi
        .open({
          type: "loading",
          content: "Redirecting...",
          duration: 1,
        })
        .then(() => message.success("LogOut Successful", 1))
        .then(() => localStorage.removeItem("loginKey"))
        .then(() => navigate("/"));
    } catch (err) {
      console.log(err);
    }
  };
  const getMovieList = async () => {
    //READ THE DATA FROM DATABASE
    //SET THE MOVIE LIST = THE DATA
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMoviesList(filteredData);
      console.log(filteredData);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    let newLoggedIn = localStorage.getItem("loginKey");
    if (!newLoggedIn) {
      navigate("/", { replace: true });
    } else {
      console.log(newLoggedIn);
    }
    getMovieList();
  }, []);
  //Delete Movies
  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };
  //Update Docs

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    getMovieList();
  };
  return (
    <div>
      <h5>LoggedIn as {auth?.currentUser?.email}</h5>
      <div>
        <h3>Movies Recently Watched By Me</h3>
        {moviesList.map((movie) => (
          <div>
            <h4>Movie Title: {movie.title}</h4>
            <p>
              Main Actor: {movie.actor}{" "}
              {movie.receivedAnOscar ? (
                <img
                  className="verified-icon"
                  src={verified}
                  alt="verified icon"
                />
              ) : (
                <img
                  className="verified-icon"
                  src={nonVerified}
                  alt="Non Verified Icon"
                />
              )}
            </p>
            <p>Released Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
            <input
              type="text"
              placeholder="New Title"
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update title
            </button>
          </div>
        ))}
      </div>
      {contextHolder}
      {data ? <button onClick={logOut}>Logout</button> : <button>Test</button>}
    </div>
  );
};

export default LoggedIn;
