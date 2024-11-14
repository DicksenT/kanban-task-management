import { createContext, useEffect, useReducer } from "react";
import useGetData from "../Hooks/UseGetData";


export const kanbanContext = createContext()

const kanbanReducer = (state, action) =>{
    const {payload} = action
    switch (action.type){
        case 'SET_DATA':
            return{
            ...state,
            boards: payload
        }

        case 'SET_DARKMODE':
            return{
                ...state,
                darkMode: !state.darkMode
            }

        case 'SET_CURRBOARD':
            return{
                ...state,
                currBoard: payload
            }

        case 'ADD_BOARD':
            return{
                boards: [...state.boards, payload]
            }

        case 'EDIT_BOARD':
            return{
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard.name){
                        return payload
                    }
                    return board
                })
            }

        case 'DEL_BOARD':
            return{
                ...state,
                boards: state.boards.filter(board => board.name != payload)
            }

        case 'ADD_COLUMN':
            return{
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard.name){
                        return{
                            ...board,
                            columns: [...state.columns,payload]
                        }
                    }
                    return board
                })
            }

        case 'ADD_TASK':
            return{
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard.name){
                        return{
                            ...board,
                            totalTask: board.totalTask+1,
                            columns: board.columns.map((column)=>{
                                if(column.name === payload.currColumn){
                                    return{
                                        ...column,
                                        tasks: [...column.tasks, payload.newTask]
                                    }
                                }
                                return column
                            })
                        }
                    }
                    return board
                })
            }
        

        case 'DEL_TASK':
            return{
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard.name){
                        return{
                            ...board,
                            totalTask: board.totalTask-1,
                            columns: board.columns.map((column) =>{
                                if(column.name === payload.currColumn){
                                    console.log(column + ' and ' + payload.delTask);
                                    
                                    return{
                                        ...column,
                                        tasks: column.tasks.filter((task) => task.name != payload.delTask)
                                    }
                                }
                                return column
                            })
                        }
                    }
                    return board
                })
            }

        case 'EDIT_TASK':            
            return{
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard.name){
                        return{
                            ...board,
                            columns: board.columns.map((column) =>{
                                if(column.name === payload.currColumn){
                                    return{
                                        ...column,
                                        tasks: column.tasks.map((task) =>{
                                            if(task._id === payload.currTask._id){
                                                return payload.newTask
                                            }
                                            return task
                                        })
                                    }
                                }
                                return column
                            })
                        }
                    }
                    return board
                })
            }

        case 'CHANGE_STATUS':
            return{
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard.name){
                        return{
                            ...board,
                            columns: board.columns.map((column) =>{
                                if(column.name === payload.currColumn){
                                    return{
                                        ...column,
                                        tasks: column.tasks.filter((task) =>task != payload.currTask)
                                    }
                                }
                                if(column.name === payload.newCol){
                                    return{
                                        ...column,
                                        tasks: [...column.tasks, payload.currTask]
                                    }
                                }
                                return column
                            })
                        }
                    }
                    return board
                })
            }

        case 'CHANGE_SUBTASK':           
            return{
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard.name){
                        return{
                            ...board,
                            columns: board.columns.map((column) =>{
                                if(column.name === payload.currColumn){
                                    return{
                                        ...column,
                                        tasks: column.tasks.map((task) =>{
                                            if(task.title === payload.currTask){
                                                return{
                                                    ...task,
                                                    subtasks: task.subtasks.map((subtask) =>{
                                                        console.log('subtask:' + subtask.title + ' payload ' + payload.currSubtask);
                                                        
                                                        if(subtask.title === payload.currSubtask.title){
                                                            console.log('called');
                                                            
                                                            return{
                                                                ...subtask,
                                                                isCompleted: !subtask.isCompleted
                                                            }
                                                        }
                                                        return subtask
                                                    })
                                                }
                                            }
                                            return task
                                        })
                                    }
                                }
                                return column
                            })

                        }
                    }
                    return board
                })
            }
        
        case 'LOGOUT':
            return{
                boards:[],
                currBoard:null,
                darkMode:false
            }

        default:
            return state
    }
}

export const KanbanContextProvider = ({children}) =>{
const [state, dispatch] = useReducer(kanbanReducer, {
    boards:[],
    currBoard: null,
    darkMode: false
})

const {fetchData, fetchResult, isSuccess} = useGetData()
useEffect(() =>{
    const mountFetch = async()=>{
        await fetchData()
    }
    mountFetch()
},[])
useEffect(() =>{
    if(isSuccess){
        dispatch({type:"SET_DATA", payload:fetchResult.boards})
    }
},[fetchResult])

    return(
        <kanbanContext.Provider value={{state, dispatch}}>
            {children}
        </kanbanContext.Provider>
    )
}