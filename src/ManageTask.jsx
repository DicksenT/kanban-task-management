import cross from '/assets/icon-cross.svg'
import chevronDown from '/assets/icon-chevron-down.svg'
import { useEffect, useRef, useState } from 'react'
function ManageTask(props){
    const {type, statues, setTask, handleAddTask} = props
    const [openStatusSelect, setOpenStatusSelect] = useState(false)
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [subtasks, setSubtasks] = useState([
      {id:Math.floor(Math.random() * 9999999) , title: '', isCompleted: false}
    ])
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
    
    const addSubtask = () =>{
      const newSubtask = {id:Math.floor(Math.random() * 9999999), title: '', isCompleted:false}
      setSubtasks([...subtasks, newSubtask])
     
    }
    
    const handleSubmit = () =>{
      const newTask = {
        title: title,
        description: description,
        subtasks: subtasks
      }
      handleAddTask(currStatus, newTask)
     setTask(false)
    }
    
    const handleSubtaskTitle = (id, newTitle) =>{
      setSubtasks(prevState => 
        prevState.map((subtask) =>(
          subtask.id === id ? {...subtask, title: newTitle} : subtask
        )
        )
      )
    }
 
    const handleDelete = (id) =>{
      setSubtasks(prevState => prevState.filter(subtask => subtask.id !== id))
    }

    return(
        <div className="addNewTaskBg" ref={taskBg} >
            <div className="addNewTask">
              <h3>{type === 'edit' ? 'Edit Task' : 'Add New Task'}</h3>
              <form action="" className='addForm' onSubmit={(e) => e.preventDefault()}>
                <div className="inputContainer">
                  <label htmlFor="title">Title</label>
                  <input type="text" name='title' placeholder='e.g Take coffee break' 
                  value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
                </div>

                <div className="inputContainer">
                  <label htmlFor="description">Description</label>
                  <textarea name="description" id="" 
                  value={description} onChange={(e) => setDescription(e.currentTarget.value)}></textarea>
                </div>
                
                <div className="inputContainer">
                  <label htmlFor="subtasks">Subtasks</label>
                  <ul className="subtaskInputContainer">
                    {subtasks && subtasks.map((subtask) => (
                      <li className='subtaskInput'>
                        <input type="text" value={subtask.title} onChange={(e) => handleSubtaskTitle(subtask.id, e.target.value)}/>
                        <img src={cross} className='pointer' alt="" onClick={() => handleDelete(subtask.id)} />
                      </li>
                    ))}
                    
                  </ul>
                  <button className='addSubtaskBtn pointer' onClick={addSubtask}>Add New Subtask</button>
                </div>

                <div className="inputContainer">
                  <label htmlFor="statuesSelect">Status</label>
                  <ul className={`statusTask ${openStatusSelect ? 'statusSelect' : ''}`}>
                    <div className="setStatus statusClick pointer" onClick={() => setOpenStatusSelect(prevState => !prevState)}>
                      <li>{currStatus}</li>
                      <img src={chevronDown} alt="" />
                    </div>
                    {statues.map((status) =>{
                        if(status != currStatus){
                          return(
                            <li className='otherStatus pointer' onClick={() => setCurrStatus(status)}>{status}</li>
                          )
                        }
                    })}
                  </ul>
                </div>
                <button className='addSubtaskBtn pointer' onClick={handleSubmit} type='submit'>Add Task</button>
              </form>
            </div>
        </div>
    )
}
export default ManageTask