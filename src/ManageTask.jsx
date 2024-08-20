import cross from '/assets/icon-cross.svg'
import chevronDown from '/assets/icon-chevron-down.svg'
import { useEffect, useRef, useState } from 'react'
function ManageTask(props){
    const {type, statues, setTask, handleAddTask, data, status, handleEdit, darkMode} = props
    const [openStatusSelect, setOpenStatusSelect] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [subtasks, setSubtasks] = useState([
      {id:Math.floor(Math.random() * 9999999) , title: '', isCompleted: false, first: true}
    ])
    const [currStatus, setCurrStatus] = useState()

    const taskBg = useRef(null)

    useEffect(() =>{
      setCurrStatus(statues[0].name)
    },[statues])

    useEffect(() =>{
      if(type === 'edit'){
        setTitle(data.title)
        setDescription(data.description)
        setSubtasks(data.subtasks)
        setCurrStatus(status)
      }
    },[])

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
    },[type])
    
    const checkEmpty = () =>{
      if(subtasks.length > 0 && subtasks[subtasks.length - 1].title === ''){
        return true
      }
      return false
    }

    const addSubtask = () =>{
      if(!checkEmpty()){
        const newSubtask = {id:Math.floor(Math.random() * 9999999), title: '', isCompleted:false, first: false}
        setSubtasks([...subtasks, newSubtask])
      }
     
    }
    const [error, setError] = useState(false)
    const [subError, setSubError] = useState(false)

    const errorCheck = () =>{
      if(title && !checkEmpty()){
        return false
      }
      else{
        if(title === ''){
          setError(true)
        }
        if(checkEmpty()){
          setSubError(true)
        }
        return true
      }
    }

    const handleSubmit = () =>{
      const newTask = {
        title: title,
        description: description,
        subtasks: subtasks
      }
      if(!errorCheck()){
        if(type === 'edit'){
          handleEdit(currStatus, newTask, data)
        }
        else{
          handleAddTask(currStatus, newTask)
        }
        setTask(false)
      }
      
    }

   
    
    const handleSubtaskTitle = (id, newTitle) =>{
      setSubtasks(prevState => 
        prevState.map((subtask) =>(
          subtask.id === id ? {...subtask, title: newTitle} : subtask
        )
        )
      )
    }
 
    const handleDelete = (id, title) =>{
      setSubtasks(prevState => prevState.filter(subtask => 'id' in subtask ? subtask.id !== id : subtask.title !== title))
    }

    const [subtaskEmpty, setSubtaskEmpty] = useState(false)

    return(
        <div className='addNewTaskBg'  ref={taskBg} >
            <div className={`addNewTask ${darkMode ? 'dark' : ''}`}>
              <h3>{type === 'edit' ? 'Edit Task' : 'Add New Task'}</h3>
              <form action="" className='addForm' onSubmit={(e) => e.preventDefault()}>
                <div className="inputContainer">
                  <label htmlFor="title">Title</label>
                  <input 
                  className={error ? 'error' : ''} type="text" name='title' 
                  placeholder={error ?  'Please input title' : 'e.g Take coffee break'} 
                  value={title} 
                  onChange={(e) => setTitle(e.currentTarget.value)}
                  onClick={() => setError(false)}/>
                </div>

                <div className="inputContainer">
                  <label htmlFor="description">Description</label>
                  <textarea name="description" id="" 
                  value={description} onChange={(e) => setDescription(e.currentTarget.value)}
                  placeholder="e.g It's always good to take a break. This 15 minute break will recharge the batteries a little."></textarea>
                </div>
                
                <div className="inputContainer">
                  <label htmlFor="subtasks">Subtasks</label>
                  <ul className="subtaskInputContainer">
                    {subtasks && subtasks.map((subtask) => (
                      <li className='subtaskInput'>
                        <input className={subError && 'error'} type="text" value={subtask.title} 
                        onChange={(e) => handleSubtaskTitle(subtask.id, e.target.value)}
                        placeholder={subError ? 'Please Enter Subtask Title Or Remove It' : subtask.first ? 'e.g Brew coffee': ''}
                        onClick={() => setSubError(false)}/>
                        <img src={cross} className='pointer' alt="" onClick={() => handleDelete(subtask.id, subtask.title)} />
                      </li>
                    ))}
                    
                  </ul>
                  <button className={`addSubtaskBtn pointer`} onClick={addSubtask}>Add New Subtask</button>
                </div>

                <div className="inputContainer">
                  <label htmlFor="statuesSelect">Status</label>
                  <ul className={`statusTask ${openStatusSelect ? 'statusSelect' : ''}`}>
                    <div className="setStatus statusClick pointer" onClick={() => setOpenStatusSelect(prevState => !prevState)}>
                      <li>{currStatus}</li>
                      <img src={chevronDown} alt="" />
                    </div>
                    {statues.map((status) =>{
                        if(status.name != currStatus){
                          return(
                            <li className='otherStatus pointer' onClick={() => setCurrStatus(status.name)}>{status.name}</li>
                          )
                        }
                    })}
                  </ul>
                </div>
                <button className='addSubtaskBtn pointer' onClick={handleSubmit} type='submit'>{type === 'edit' ? 'Edit Task' : 'Add Task'}</button>
              </form>
            </div>
        </div>
    )
}
export default ManageTask