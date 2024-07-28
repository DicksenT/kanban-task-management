function Confirm(props){
    return(
        <div className="taskBackground">
            <div className="confirmation">
                <h4>Delete this task?</h4>
                <p>{`Are you sure want to delete the '' task and its subtasks? This action cannot be reversed`}</p>
                <div className="buttonChoice">
                    <button className="confirm">Confirm</button>
                    <button className="cancel">Cancel</button>
                </div>
            </div>
        </div>
    )

}
export default Confirm