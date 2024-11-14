import cross from '/assets/icon-cross.svg'
import chevronDown from '/assets/icon-chevron-down.svg'
import { useContext, useEffect, useRef, useState } from 'react'
import { kanbanContext } from '../context/KanbanContext'
import usePostFetch from '../Hooks/usePostFetch'
function ManageTask(props){
    const {type, statues, setTask, data, status} = props
    const {state, dispatch} = useContext(kanbanContext)
    const [openStatusSelect, setOpenStatusSelect] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [subtasks, setSubtasks] = useState([])
    const [currStatus, setCurrStatus] = useState()

    const taskBg = useRef(null)

    useEffect(() =>{
      setCurrStatus(state.currBoard.columns[0])
    },[])

    useEffect(() =>{
      console.log(currStatus);
    },[currStatus])

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
        const newSubtask = {title: '', isCompleted:false, newId:Math.floor(Math.random() * 999999)}
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

    const {fetchingUrl, isSuccess, fetchResult, error: fetchError} = usePostFetch()

    const handleSubmit = async(e) =>{
      e.preventDefault()
      const finalTask = {
        title: title,
        description: description,
      }
      const body ={
        colId: currStatus._id,
        newTask: finalTask,
        subtasks: subtasks
      }
      if(!errorCheck()){
        await fetchingUrl(`task/${type === 'edit' ?
            `editTask/${data._id}` : 'addTask'}`,
          body,
        type === 'edit' ? 'PATCH' : 'POST')
      }
    }
    useEffect(()=>{
      if(isSuccess){
        dispatch({type: type === 'edit' ? 'EDIT_TASK' : 'ADD_TASK', 
          payload:{currColumn: currStatus.name, currTask:data, newTask:fetchResult}})
        console.log(fetchResult);
        
        setTask(false)
      }
    },[fetchResult])

    useEffect(() =>{
      console.log(fetchError);
    },[fetchError])

    const handleSubtaskTitle = (currsubtask, newTitle) =>{
      setSubtasks(prevState => 
        prevState.map((subtask) =>(
          subtask === currsubtask ? {...subtask, title: newTitle} : subtask
        )
        )
      )
    }
 
    const handleDelete = (id, newId) =>{
      setSubtasks(prevState => prevState.filter(subtask => '_id' in subtask ? subtask._id !== id : subtask.newId !== newId))
    }

    const [subtaskEmpty, setSubtaskEmpty] = useState(false)

    return(
        <div className='addNewTaskBg'  ref={taskBg} >
            <div className={`addNewTask ${state.darkMode && 'dark'}`}>
              <h3>{type === 'edit' ? 'Edit Task' : 'Add New Task'}</h3>
              <form action="" className='addForm' onSubmit={(e) => handleSubmit(e)}>
                <div className="inputContainer">
                  <label htmlFor="title">Title</label>
                  <input 
                  className={error && 'error'} type="text" name='title' 
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
                        onChange={(e) => handleSubtaskTitle(subtask, e.target.value)}
                        placeholder={subError ? 'Please Enter Subtask Title Or Remove It' : subtask.first ? 'e.g Brew coffee': ''}
                        onClick={() => setSubError(false)}/>
                        <img src={cross} className='pointer' alt="" onClick={() => handleDelete(subtask.id, subtask.newId)} />
                      </li>
                    ))}
                    
                  </ul>
                  <button className={`addSubtaskBtn pointer`} onClick={addSubtask}>Add New Subtask</button>
                </div>

                <div className="inputContainer">
                  <label htmlFor="statuesSelect">Status</label>
                  <ul className={`statusTask ${openStatusSelect && 'statusSelect'}`}>
                    <div className="setStatus statusClick pointer" onClick={() => setOpenStatusSelect(prevState => !prevState)}>
                      <li>{currStatus && currStatus.name}</li>
                      <img src={chevronDown} alt="" />
                    </div>
                    {statues.map((status) =>{
                        if(status != currStatus){
                          return(
                            <li className='otherStatus pointer' onClick={() => setCurrStatus(status)}>{status.name}</li>
                          )
                        }
                    })}
                  </ul>
                </div>
                <button className='addSubtaskBtn pointer' type='submit'>
                  {type === 'edit' ? 'Edit Task' : 'Add Task'}
                </button>
              </form>
            </div>
        </div>
    )
}
export default ManageTask