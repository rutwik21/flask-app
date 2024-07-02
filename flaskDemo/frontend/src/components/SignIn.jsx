import * as React from "react"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Signin } from '../lib/validParamenters';
import axios from 'axios';
import { useToast } from "../components/ui/use-toast"

import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Link } from "react-router-dom"

export function SignIn() {
  const url = "http://127.0.0.1:5000";

  const { toast } = useToast()
    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(Signin),
      });
    
      const onSubmit = async (data) => {
        console.log(data)
        try {
          const res = await axios.post(`${url}/signin`, data);
          console.log(res)
          if(res.status === 200 && res.data['success']){
            localStorage.setItem('userId', res.data['userId'])
            localStorage.setItem('name', res.data['name'])
            localStorage.setItem('email', res.data['email'])
            location.href = '/home'
          }
          else if(res.status === 200 && !res.data['success']){
            toast({
              variant: "destructive",
              title: res.data['massage'],
            })
          }
          
        } catch (error) {
          console.log(error)      
        }
      }
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[350px] ">
            <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Sign in to your account.</CardDescription>
            </CardHeader>
            <CardContent>
            <form>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input type="text" id="email" placeholder="Enter your email address here"  {...register('email')}/>
                        {formState.errors.email && (<span className='text-red-500'>
                            {formState.errors.email?.message}</span>)}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" placeholder="Enter your password here"  {...register('password')}/>
                        {formState.errors.password && (<span className='text-red-500'>
                            {formState.errors.password?.message}</span>)}
                    </div>
                </div>
            </form>
            </CardContent>
            <CardFooter className=" flex justify-between">
            <Button onClick={handleSubmit(onSubmit)}>Sign in</Button>
            <Link to='/signup' ><Button variant="outline" className='border-0'>New here?</Button></Link> 
            </CardFooter>
        </Card>
    </div>
  )
}
