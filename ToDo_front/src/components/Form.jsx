import axios from 'axios';
import React, { useState } from 'react'

const Form = (props) => {
    const [task , setTask]= useState('')

    const handelogin= async(e)=>{
      e.preventDefault();
      try {
          const response = await axios.post(
              "http://127.0.0.1:8000/post/",
              { details: task },  // ✅ Send task details in the request body
              {
                  headers: {
                      Authorization: `Bearer ${props.access}`,  // ✅ Proper header format
                      "Content-Type": "application/json"
                  }
              }
          );
          console.log(response.data);  // ✅ Handle response
      } catch (error) {
          console.error("Error posting task:", error);
      }

    }
    

  return (
    <div>

        <form onSubmit={handelogin}>
            <input type="text" placeholder='Enter the task' id='task' name='task' value={task} onChange={(e)=>setTask(e.target.value)} />
            <button type='submit'>add</button>
        </form>
      
    </div>
  )
}

export default Form
