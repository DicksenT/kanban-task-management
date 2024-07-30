function Confirm(props){
    const {column, task, handleDelete, setTask, setConfirm} = props
    
    const deleteTask = () =>{
        handleDelete(column, task)
        setTask(false)
        setConfirm(false)
    }
    return(
        <div className="taskBackground">
            <div className="confirmation taskDetails">
                <h4>Delete this task?</h4>
                <p>{`Are you sure want to delete the '${task.title}' task and its subtasks? This action cannot be reversed`}</p>
                <div className="buttonChoice">
                    <button className="confirm" onClick={deleteTask}>Delete</button>
                    <button className="cancel" onClick={() => setConfirm(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )

}
export default Confirm