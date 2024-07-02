import * as React from "react"
import { Button } from "./ui/button";

export function Home()  {
    const url = "http://127.0.0.1:5000";
    const name = localStorage.getItem("name")
    const email = localStorage.getItem("email")
    if(!name && !email) {
        location.href = '/signin'
    }
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className=" flex gap-3 justify-between">
            <div className=" border p-5">
                <h6 className=" font-bold">Name: </h6>
                <h1>{name}</h1>
            </div>
            <div className=" border p-5">
                <h6 className=" font-bold">Eamil: </h6>
                <h1>{email}</h1>
            </div>
        </div>
        <Button className='ms-4' onClick={()=>{localStorage.clear(); location.reload()}}>Sign Out</Button>
    </div>
  )
}
