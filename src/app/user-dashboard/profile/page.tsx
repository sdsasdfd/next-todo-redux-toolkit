"use client";
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { setUser } from '@/lib/store/features/authSlice';
import { useAppDispatch } from '@/lib/store/hooks';
import { RootState } from '@/lib/store/store';
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import z from 'zod'
import { CldUploadWidget } from 'next-cloudinary';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const schema = z.object({
    fullname: z.string().min(2, { message: "Fullname is required" }),
})

const Profile = () => {
    const user = useSelector((state:RootState)=> state.auth.user)
    const dispatch = useAppDispatch()

    const [imageUrl, setImageUrl] = useState(user.avatar_url || "") 
    const [imageChanged, setImageChanged] = useState(false)
   
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullname: user?.full_name || "",
        },
    })

    const { formState: {isDirty}} = form

    const onSubmit = async (data: z.infer<typeof schema>) => {
        console.log(data)
        const updatePayload: any = {
            id: user?.id
        }

        if(isDirty){
            console.log("Form field changed - include fullname")
            updatePayload.full_name = data?.fullname
        }

        if(imageChanged){
            console.log("Image changed - including avatar_url")
            updatePayload.avatar_url = imageUrl
        }
         console.log('Update payload:', updatePayload)
        console.log('Form is dirty:', isDirty)
        console.log('Image changed:', imageChanged)

        const res = await axios.patch('/api/update-profile', updatePayload)

        console.log('Response::', res.data)

        if(res.data.success === true){
            toast.success(res.data.message)
            dispatch(setUser(res.data.data))
            setImageChanged(false) // Reset image changed state after successful update
            form.reset({fullname: res.data.data.full_name})
        }

    }

      const handleImageUpload = (result: any) => {
        console.log("Upload successful:", result);
        if(typeof result.info === 'object' && 'url' in result.info){
            setImageUrl(result.info.url)
            setImageChanged(true) // Mark image as changed
            console.log("Image URL:", result.info.url)
        }else{
            console.log("upload result::", result.info);
        }
    }
  return (
    <div className='flex items-center justify-center flex-col h-[400px]'>
        {/* <Avatar className=' size-20'>
            <AvatarImage className='mb-6 size-full object-cover' src={imageUrl || '/images/userimg.jpg'}/>
             <AvatarFallback>image</AvatarFallback>
        </Avatar>
        <CldUploadWidget 
        uploadPreset='prep_nextjs'
        options={{
            maxFiles: 1,
            maxFileSize: 5000000, // 5MB
            clientAllowedFormats: ['jpg','jpeg', 'png', 'webp' ],
            sources: ['local', 'url', 'camera'],
            resourceType: 'image', 
            singleUploadAutoClose: false
        }}
        onSuccess={(result)=> {
            console.log("Upload successful:", result);
            if(typeof result.info === 'object' && 'url' in result.info){
                setImageUrl(result.info.url)
                setImageChanged(true)
                console.log("Image changed", imageChanged)
                console.log("Image URL:", result.info.url)
            }else{
                 console.log("upload result::", result.info);
            }
        }}
        onError={(error) => {
            console.error("Upload failed:", error);
        }}
        >
            {({open})=> (
                <Button onClick={()=> open()}>Upload Image</Button>
            )}
        </CldUploadWidget> */}
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-80'>
                 <div className='flex flex-col items-center space-y-4'>
                        <Avatar className='size-20'>
                            <AvatarImage className='size-full object-cover' src={ imageUrl || '/images/userimg.jpg'} key={imageUrl}/>
                            <AvatarFallback>image</AvatarFallback>
                        </Avatar>
                        
                        <CldUploadWidget 
                            uploadPreset='prep_nextjs'
                            options={{
                                maxFiles: 1,
                                maxFileSize: 5000000, // 5MB
                                clientAllowedFormats: ['jpg','jpeg', 'png', 'webp' ],
                                sources: ['local', 'url', 'camera'],
                                resourceType: 'image', 
                                singleUploadAutoClose: false
                            }}
                            onSuccess={handleImageUpload}
                            onError={(error) => {
                                console.error("Upload failed:", error);
                            }}
                        >
                            {({open})=> (
                                <Button type="button" onClick={()=> open()}>Upload Image</Button>
                            )}
                        </CldUploadWidget>
                    </div>
                <FormField control={form.control} name='fullname' render={({field})=> (
                    <FormItem>
                        <FormLabel>Fullname</FormLabel>
                        <FormControl>
                            <Input {...field}/>
                        </FormControl>
                    </FormItem>
                )}/>
                <Button type='submit' disabled={!isDirty && !imageChanged}>Save</Button>
            </form>
        </Form>
        
        <Link  href='/user-dashboard/update-password'>
        <Button variant={'outline'}>

        Update Password
        </Button>
        </Link>
    </div>
  )
}

export default Profile