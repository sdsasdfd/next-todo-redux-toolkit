"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const VideoDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const { videoId } = params;
  const [videoDetails, setVideoDetails] = React.useState<any>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const getVideoDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/video/get-video`, {
        params: { videoId },
      });

      console.log("Video details:", res.data);

      if (res.data.success === true) {
        setVideoDetails(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching video details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete("/api/video/delete-video", {
        data: { videoId },
      });

      console.log("Video deleted successfully:", res.data);

      if (res.data.success === true) {
        // Handle successful deletion (e.g., redirect or show a message)
        console.log("Video deleted successfully", res.data.message);
        router.push("/video-upload");
      }
    } catch (error) {
      if (error) {
        console.log("Error deleting video:", error);
      } else {
        console.log("Unexpected error deleting video:", error);
      }
    }
  };

  const handleUpdate = async() => {
    const updates : {title?: string; file?: File} = {}

    if(title && title !== videoDetails?.title){
      updates.title = title
    }

    if(selectedFile){
      updates.file = selectedFile
    }

    if(Object.keys(updates).length === 0){
      console.log("No changes detected");
      return;
    }

    console.log("Update video details:", updates);

    if(Object.keys(updates).length > 0){
      const res = await axios.put('/api/video/update-video', {videoId, ...updates})

      console.log("Video updated successfully:", res.data);

    }

     setIsEditing(false);
  setIsDeleted(false);
  };

  useEffect(() => {
    getVideoDetails();
  }, []);

  useEffect(() => {
  if (videoDetails?.title) {
    setTitle(videoDetails.title);
  }
}, [videoDetails]);

  return (
    //     <div>

    //         {loading ? <p>Loading...</p> : <div>

    //         <h1> {videoDetails?.title} </h1>
    //         <div className=' my-4'>
    //           <Button onClick={handleDelete} variant={'outline'} className=' cursor-pointer'>Delete</Button>
    //           <Button variant={'default'} className=' cursor-pointer ml-4'>Update</Button>
    //         </div>
    //          <iframe
    //         src={`https://video.bunnycdn.com/play/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${videoDetails?.video_guid}`}

    //             // src={`https://iframe.mediadelivery.net/embed/486480/${videoDetails?.video_guid}`}
    //          loading="lazy"
    //             style={{ width: "100%", aspectRatio: "16/9", border: "none" }}
    //             allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
    //             allowFullScreen
    //         />

    //         {/* <div >
    //           <iframe
    //             src={`https://iframe.mediadelivery.net/embed/486480/${videoDetails?.video_guid}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`}
    //             loading="lazy"
    //             style={{ width: "100%", aspectRatio: "16/9", border: "none" }}
    //             allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
    //             allowFullScreen
    //           ></iframe>
    //         </div> */}
    //       </div>
    // }
    //     </div>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={title}
                placeholder="Enter video title"
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full rounded-md border px-3 py-2 text-base"
              />
            ) : (
              <h2 className="text-xl font-semibold">{videoDetails?.title}</h2>
            )}
          </div>

          <div className="relative w-full aspect-video bg-gray-100 rounded-md flex items-center justify-center">
            {isDeleted ? (
              <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                {previewUrl ? (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full rounded-md"
                  />
                ) : (
                  <>
                    <span className="mb-2 italic">No video uploaded</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="text-sm"
                    />
                  </>
                )}
              </div>
            ) : (
              <>
                <iframe
                  src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${videoDetails?.video_guid}`}
                  className="absolute top-0 left-0 w-full h-full border-0 rounded-md"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
                {isEditing && (
                  <button
                    onClick={() => setIsDeleted(true)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  >
                    <X size={20} />
                  </button>
                )}
              </>
            )}

            {/* {!isDeleted ? (
          <>
            <iframe
              src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${videoDetails?.video_guid}`}
              className="absolute top-0 left-0 w-full h-full border-0 rounded-md"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
            {isEditing && (
              <button
               
                onClick={()=> setIsDeleted(true)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 "
              >
                <X size={20} />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                <span className="mb-2 italic">No video uploaded</span>
                <input
                  type="file"
                  accept="video/*"
                  className="text-sm"
                />
              </div>
        )} */}
          </div>

          <div className="flex space-x-3">
            {isEditing ? (
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            )}
            {isEditing ? (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={handleDelete}
                disabled={isEditing || isDeleted}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoDetailsPage;
