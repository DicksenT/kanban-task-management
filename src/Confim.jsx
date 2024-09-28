import { useNavigate } from "react-router-dom"

function Confirm(props){
    const {column, data, handleDelete, setTask, setConfirm, type, currBoard, setData, navigate, darkMode} = props

    const deleteTask = () =>{
        if(type != 'board'){
            handleDelete(column, data)
            setTask(false)
        }
        else{
            setData(prevState =>(prevState.filter(board => board.name != currBoard)))            

        }   
        setConfirm(false)
    }
    return(
        <div className="taskBackground">
            <div className={`confirmation taskDetails ${darkMode && 'dark'}`}>
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