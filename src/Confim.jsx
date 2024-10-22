import { useContext } from "react"
import { kanbanContext } from "./context/KanbanContext"

function Confirm(props){
    const {column, data,  setTask, setConfirm, type} = props
    const {state, dispatch} = useContext(kanbanContext)

    const deleteTask = async() =>{
        const fetchUrl = async(url) =>{
            try{
                const response = await fetch(url,
                    {credentials:"include",
                        method:'DELETE'
                    }
                )
                if(response.ok){
                    return true
                }
            }catch{
                try{
                    const refresh = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/user/refreshToken',
                        {credentials:'include'}
                    )
                    if(refresh.ok){
                        const response = await fetch(url,
                            {credentials:"include",
                                method:"DELETE"
                            }
                        )
                        if (response.ok){
                            return true
                        }
                    }

                }catch{
                    console.log('failed');
                }
            }
            return false
        }
        if(type != 'board'){
            const taskUrl =`https://kanban-task-management-web-app-86h6.onrender.com/task/${data._id}`
            const response = await fetchUrl(taskUrl)
            if(response.ok){
                dispatch({type:'DEL_TASK', payload:{currColumn:column, delTask:data.name}})
            }
            setTask(false)
        }
        else{
            const boardUrl = `https://kanban-task-management-web-app-86h6.onrender.com/board/${state.currBoard._id}`
            const response = await fetchUrl(boardUrl)
            if(response){
                dispatch({type:'DEL_BOARD', payload:state.currBoard.name})
            }
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