import React from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, logInContext } from "../../UserContext";

const LoggedIn = () => {
  const { data, setData } = useContext(UserContext);
  const {loggedIn, setLoggedIn} = useContext(logInContext)
  const navigate = useNavigate();
  const logOut = () => {
    setData(false);
    navigate("/");
  };
  useEffect(() => {
     console.log(loggedIn)
   });
  return (
    <div>
      {data ? (
        <h5>LoggedIn</h5>
      ) : (
        <h5>You need to kindly Login to reach Here</h5>
      )}
      {data ? <button onClick={logOut}>Logout</button> : <button>Test</button>}
    </div>
  );
};

export default LoggedIn;
