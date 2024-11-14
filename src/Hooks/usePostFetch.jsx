import { useState } from "react"

const usePostFetch = () =>{
    const [isSuccess, setIsSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [fetchResult, setFetchResult] = useState('')
    const fetchingUrl = async(url, body, method)=>{
        try{                              
            setIsSuccess(false)
            setError('')
            setIsLoading(true)
            const response = await fetch(`https://kanban-task-management-web-app-86h6.onrender.com/${url}`,
                {credentials:'include',
                    method: method,
                    body:JSON.stringify(body),
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                }
            )
            const json = await response.json()
            
            if(response.ok){
                setFetchResult(json)
                setIsLoading(false)
                setIsSuccess(true)
            }
            else{
                throw new Error(response.statusText)
            }
        }catch{
            try{
                const refreshToken = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/user/refreshToken',
                    {credentials:"include"}
                )
                if(refreshToken.ok){
                    const response = await fetch(`https://kanban-task-management-web-app-86h6.onrender.com/${url}`,
                        {credentials:'include',
                            method: method,
                            body:JSON.stringify(body),
                            headers: {
                                'Content-Type' : 'application/json'
                            }
                        }
                    )
                    const json = await response.json()
                    if(response.ok){
                        setFetchResult(json)
                        setIsLoading(false)
                        setIsSuccess(true)
                    }
                    else{
                        throw new Error(response.statusText)
                    }
                }
            }catch(error){
                console.log(error);
                
                setError(error)
            }
        }
    }
    return{fetchingUrl, error, isLoading, isSuccess, fetchResult}
}
export default usePostFetch