import cross from '/assets/icon-cross.svg'
import chevronDown from '/assets/icon-chevron-down.svg'
import { useEffect, useRef, useState } from 'react'
function ManageTask(props){
    const {type, statues, setTask} = props
    const [openStatusSelect, setOpenStatusSelect] = useState(false)
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [subtask, setSubtask] = useState()
    const [currStatus, setCurrStatus] = useState()

    const taskBg = useRef(null)

    useEffect(() =>{
      setCurrStatus(statues[0])
    },[statues])

    useEffect(() =>{
      const handleClick = (e) =>{
        if(e.target === taskBg.current){
          setTask(false)
        }
      }
      window.addEventListener('click', handleClick)
      return()=>{
        window.removeEventListener('click', handleClick)
      }
    },[])
    
    

    return(
        <div className="addNewTaskBg" ref={taskBg}>
            <div className="addNewTask">
              <h3>{type === 'edit' ? 'Add New Task' : ''}</h3>
              <form action="" className='addForm'>
                <label htmlFor="title">Title</label>
                <input type="text" name='title' placeholder='e.g Take coffee break' 
                value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>

                <label htmlFor="description">Description</label>
                <textarea name="description" id="" 
                value={description} onChange={(e) => setDescription(e.currentTarget.value)}></textarea>

                <label htmlFor="subtasks">Subtasks</label>
                <ul className="subtaskInputContainer">
                  <li className='subtaskInput'>
                    <input type="text" />
                    <img src={cross} alt="" />
                  </li>
                </ul>
                <button className='addSubtaskBtn'>Add New Subtask</button>

                <label htmlFor="statuesSelect">Status</label>
                <ul className={`statusTask ${openStatusSelect ? 'statusSelect' : ''}`}>
                  <div className="setStatus statusClick" onClick={() => setOpenStatusSelect(prevState => !prevState)}>
                     <li>{currStatus}</li>
                     <img src={chevronDown} alt="" />
                  </div>
                  {statues.map((status) =>{
                      if(status != currStatus){
                        return(
                          <li className='otherStatus' onClick={() => setCurrStatus(status)}>{status}</li>
                        )
                      }
                  })}
                </ul>
              </form>
            </div>
        </div>
    )
}
export default ManageTask