import { useContext } from "react"
import { kanbanContext } from "./context/KanbanContext"

function Confirm(props){
    const {column, data,  setTask, setConfirm, type} = props
    const {state, dispatch} = useContext(kanbanContext)

    const deleteTask = () =>{
        if(type != 'board'){
            dispatch({type:"DEL_TASK", payload:{currColumn:column, delTask:data}})
            setTask(false)
        }
        else{
            dispatch({type:"DEL_BOARD"})
        }   
        setConfirm(false)
    }
    return(
        <div className="taskBackground">
            <div className={`confirmation taskDetails ${state.darkMode && 'dark'}`}>
                <h4>Delete this task?</h4>
                <p>Are you sure want to delete the 
                    '<span className="bold">{type === 'board' ? currBoard : data.title}</span>' 
                    {type === 'board' ? 
                    'board ? This action will remove all columns and tasks and cannot be reversed' 
                    :"task and its subtasks? This action cannot be reversed"}</p>
                <div className="buttonChoice">
                    <button className="confirm" onClick={deleteTask}>Delete</button>
                    <button className="cancel" onClick={() => setConfirm(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )

}
export default Confirm