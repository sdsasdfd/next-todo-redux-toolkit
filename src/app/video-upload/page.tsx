'use client'
import { Card } from '@/components/ui/card';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

type Video = {
    id: string
    video_guid: string;
    title: string;
    // add other properties if needed
};

const page = () => {
    const [videos, setVideos] = useState<Video[]>([])
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        if(e.target.files){
            setFile(e.target.files[0] || null);
        }
    }

    const fetchVideos = async()=>{
        try {
            const res = await axios.get('/api/video/get-videos')
            if(res.data.success){
                console.log("Fetched videos:", res.data.data);
                setVideos(res.data.data)
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error fetching video data:", error);
            } else {
                console.error("Unknown error fetching video data:", error);
            }
        }
    }


    useEffect(()=>{
        fetchVideos()
    }, [])


    const handleUpload = async()=> {
        try {
            setStatus("Creating video entry...")

            const res = await axios.post('/api/video/create', {title})

            console.log("Response data:", res.data)

            if(res.data.success === false){
                console.log("error", res.data.message)
                setStatus(`Error: ${res.data.message}`)
            }

            setStatus("Uploading video...")

            const uploadRes = await fetch(`https://video.bunnycdn.com/library/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/videos/${res.data.guid}`, {
                method: "PUT", 
                headers: {
                    AccessKey: process.env.NEXT_PUBLIC_BUNNY_STREAM_ACCESS_KEY ?? '',
                    'Content-Type': "application/octet-stream"
                }, 
                body: file
            })
            console.log("upload response", uploadRes)
            if (!uploadRes.ok) throw new Error("Upload failed");

      setStatus("✅ Upload complete!");
        } catch (error) {
            if(error instanceof Error){
                setStatus(error.message)
                console.error("Error creating video entry:", error);
            }else{
                console.error("Unknown error creating video entry:", error);
            }
        }
    }
  return (
     <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Upload Video to Bunny.net</h1>

      <input
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
      />

         <input
        type="text"
        placeholder="Video title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      {status && <p>{status}</p>}
      
      <Card className=' px-3'>
        <h1>My Videos</h1>

        {videos.map(video => (
            <div key={video?.video_guid} className="border rounded p-2">
 <h2 className="font-semibold">{video?.title}</h2>

    <iframe
            src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${video.video_guid}`}
            // src={`https://iframe.mediadelivery.net/play/486480/${video.video_guid}`}
           loading="lazy"
            style={{ width: "100%", aspectRatio: "16/9", border: "none" }}
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
            allowFullScreen
          ></iframe>
          <Link href={`/video-upload/${video.id}`}>View Details</Link>
            </div>

            
        ))}
      </Card>
      
      </div>
  )
}

export default page