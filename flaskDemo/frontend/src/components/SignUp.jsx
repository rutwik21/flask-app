import * as React from "react"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Signup } from '../lib/validParamenters';
import axios from 'axios';
import { useToast } from "../components/ui/use-toast"

import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Link } from "react-router-dom"

export function SignUp() {
  const url = "http://127.0.0.1:5000";

  const { toast } = useToast()

  const { register, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(Signup),
  });

  const onSubmit = async (data) => {
    console.log(data)
    try {
      const res = await axios.post(`${url}/signup`, data);
      console.log(res)
      if(res.status === 200 && res.data['success']){
        toast({
          variant: "success",
          title: "Hola!",
          description: "Registration Successful",
        })
        reset();
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
            <CardTitle>Sign up</CardTitle>
            <CardDescription>Register yourself.</CardDescription>
            </CardHeader>
            <CardContent>
            <form>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" id="name" placeholder="Enter your name here" {...register('name')} />
                        {formState.errors.name && (<span className='text-red-500'>
                          {formState.errors.name?.message}</span>)}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input type="text" id="email" placeholder="Enter your email address here" {...register('email')} />
                        {formState.errors.email && (<span className='text-red-500'>
                          {formState.errors.email?.message}</span>)}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="profile">Profile Pricture</Label>
                        <Input accept="image/*" type="file" id="profile" {...register('profile')} />
                        {formState.errors.profile && (<span className='text-red-500'>
                          {formState.errors.profile?.message}</span>)}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" placeholder="Enter a secure password here" {...register('password')}/>
                        {formState.errors.password && (<span className='text-red-500'>
                          {formState.errors.password?.message}</span>)}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input type="text" id="confirmPassword" placeholder="Confirm your password " {...register('confirmPassword')}/>
                        {formState.errors.confirmPassword && (<span className='text-red-500'>
                          {formState.errors.confirmPassword?.message}</span>)}
                    </div>
                </div>
            </form>
            </CardContent>
            <CardFooter className=" flex justify-between">
            <Button onClick={handleSubmit(onSubmit)}>Sign up</Button>
            <Link to='/signin' ><Button variant="outline" className='border-0'>Existing member? </Button></Link>
            </CardFooter>
            
        </Card>
    </div>
  )
}
