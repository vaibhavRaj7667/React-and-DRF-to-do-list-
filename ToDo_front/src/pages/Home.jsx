import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from "../components/Form";

const Home = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [user , setuser]= useState([]);
  const [acces, setAcces]= useState()
  const [taskData,setTaskData]=useState([])


console.log(taskData)

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
        refresh: refreshToken,
      });
  
      // Store the new access token
      localStorage.setItem("access_token", response.data.access);
  
      return response.data.access; // Return the new access token
    } catch (error) {
      console.log("Error refreshing token:", error);
      return null; // In case refresh fails, return null
    }
  };
  
 


  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token");

    if (!refreshToken) {
        console.error("No refresh token found in localStorage");
        return;
    }

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/logout/",
            { refresh_token: refreshToken },  // Request body
            { 
                headers: { 
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json" // Ensure proper content type
                }
            }
        );

        console.log("Logout successful:", response.data);

        // Remove tokens after successful logout
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access_token");

    } catch (error) {
        console.error("Logout failed:", error.response ? error.response.data : error.message);
    }
};







  const fetchMessage = async () => {
    try {
      // Get the access token and refresh token from localStorage
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      setAcces(accessToken)

      if (!accessToken || !refreshToken) {
        setError("No token found. Please login.");
        return;
      }

      try {
        // Attempt to fetch the message with the access token
        const response = await axios.get("http://127.0.0.1:8000/home/", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Attach JWT access token
          },
        });
        
        
        setTaskData(response.data.data)
        setMessage(response.data.message); // Set message from backend
      } catch (error) {
        
        if (error.response && error.response.status === 401) {
          const newAccessToken = await refreshAccessToken(refreshToken);
          if (newAccessToken) {
           
            const retryResponse = await axios.get("http://127.0.0.1:8000/home/", {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            setMessage(retryResponse.data.message); // Set message from backend
          } else {
            setError("Unable to refresh the access token. Please log in again.");
          }
        } else {
          setError("Failed to fetch message. Please check authentication.");
        }
      }
    } catch (error) {
      console.log(error);
      setError("Error fetching message.");
    }
  };


  useEffect(()=>{
    const fetchuser=async()=>{
      const token = localStorage.getItem("access_token");
      if (!token){
        alert("wtf bro");
        return;
      }
      try {
        const response = await axios.get("http://127.0.0.1:8000/user/",{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        console.log(response.data)
        setuser(response.data)
      } catch (error) {
        alert("error")
      }
    }

    fetchuser();
  },[])





  
  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <h1>{user.user}hi</h1>

      {error ? <p style={{ color: "red" }}>{error}</p> : <p>{message}</p>}

        <Form access={acces}/>

    <button onClick={logout}>logout</button>

      <p>
            {taskData.map((task,id)=>(
              <>
              <h1>{task.details}</h1>
              
              </>
              
            ))}

      </p>
    


    </div>
  );
};

export default Home;
