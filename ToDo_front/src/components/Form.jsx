import React, { useState } from 'react'

const Form = () => {
    const [task , setTask]= useState('')
    const handelogin= async(e)=>{
        e.preventDefault();

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
