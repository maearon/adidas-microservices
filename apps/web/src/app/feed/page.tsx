"use client";
import { useCallback, useEffect, useState } from "react";
import flashMessage from "@/components/shared/flashMessages";
import Link from "next/link";
import { getGravatarUrl } from "@/utils/gravatar";
import { clearTokens, getGoogleAccessToken } from "@/lib/token";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export default function YouTubeFeed() {
  const [feedItems, setFeedItems] = useState<any[]>([
    {
      id: 1,
      user_name: "Mark Nguyen",
      user_id: "1",
      gravatar: getGravatarUrl("manhng132@gmail.com"),
      size: 50,
      content: "https://www.youtube.com/embed/VNx0ndx9kSA?si=VyQFWuJvQUjciNm-",
      image: getGravatarUrl("manhng132@gmail.com"),
      timestamp : "2 days ago"
    }
  ])
  const [googleAvatar, setGoogleAvatar] = useState<string>('')

  const extractVideoId = (youtubeUrl: string) => {
    const match = youtubeUrl.match(/embed\/([^?]*)/);
    return match ? match[1] : null;
  };

  const fetchVideoDetails = async (videoId: string) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${GOOGLE_API_KEY}&part=snippet`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.items?.length) return null;
    const snippet = data.items[0].snippet;
    return {
      videoId,
      title: snippet.title,
      description:
        snippet.description.length > 240
          ? snippet.description.substring(0, 240) + "..."
          : snippet.description,
      channelTitle: snippet.channelTitle,
    };
  };

  const setFeeds = useCallback(async () => { 
    if (feedItems) {
      const updatedFeedItems = await Promise.all(
        feedItems.map(async (item) => {
          const videoId = extractVideoId(item.content);
          if (videoId) {
            const details = await fetchVideoDetails(videoId);
            if (details) {
              return { ...item, ...details };
            }
          }
          return item;
        })
      );
      setFeedItems(updatedFeedItems)
    } else {
      setFeedItems([])
    }
  }, [])

  useEffect(() => {
    setFeeds()
  }, [setFeeds])

  const handleRate = async (videoId: string, rating: "like" | "dislike") => {
    const googleAccessToken = getGoogleAccessToken()
    if (!googleAccessToken) {
      flashMessage("warning", "Please login with Google first");
      return;
    }
    try {
      const [res1, res2, res3, res4] = await Promise.all([
        fetch('https://openidconnect.googleapis.com/v1/userinfo', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${googleAccessToken}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`https://www.googleapis.com/youtube/v3/videos/rate?id=${videoId}&rating=${rating}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleAccessToken}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('https://www.googleapis.com/auth/userinfo.email', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleAccessToken}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('https://www.googleapis.com/auth/userinfo.profile', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleAccessToken}`,
            'Content-Type': 'application/json',
          },
        }),
      ]);

      if (res1.ok) { // Ok
        // {
        //   "sub": "113289723847928374923",
        //   "name": "Nguyễn Văn A",
        //   "given_name": "Văn A",
        //   "family_name": "Nguyễn",
        //   "picture": "https://lh3.googleusercontent.com/a/abc12345",
        //   "email": "van.a@example.com",
        //   "email_verified": true,
        //   "locale": "vi"
        // }
        const userInfo = await res1.json();
        flashMessage('success', userInfo.email)
        console.log('success https://openidconnect.googleapis.com/v1/userinfo with token in Step 2', userInfo)
        setGoogleAvatar(userInfo.picture || feedItems[0].gravatar)
      }

      if (res3.ok) { // Ok
        const userInfo = await res1.json();
        flashMessage('success', String(res3.status))
        console.log('success https://openidconnect.googleapis.com/auth/userinfo.email with token in Step 2', userInfo)
      }

      if (res4.ok) { // Ok
        const userInfo = await res4.json();
        flashMessage('success', String(res4.status))
        console.log('success https://openidconnect.googleapis.com/auth/userinfo.profile with token in Step 2', userInfo)
      }
  
      if (res2.status === 204) {
        flashMessage("success", `Video ${rating}d successfully`);
      } else {
        flashMessage("error", `Failed to ${rating} video`);
      }

      if (res2.status === 401) {
        flashMessage('error', `Video ${rating} unsuccessfully`)
        clearTokens();
        handleRate(videoId, rating)
      }
    } catch (error) {
      flashMessage('error', `Video ${rating} unsuccessfully`)
      clearTokens();
      handleRate(videoId, rating)
    }
  };

  return (
  <ol className="microposts">
    { feedItems.map((i:any, t) => (
    <li key={t} id= {'micropost-'+i.id} >
      <Link href={'/users/'+i.user_id}>
        <img src={googleAvatar || feedItems[0].gravatar}></img>
      </Link>
      <span className="user"><Link href={'/users/'+i.user_id}>{i.user_name}</Link></span>
      
      <span className="content">
        <b>{i.title}</b>
        <Link target="_blank" href={"https://www.youtube.com/results?search_query="+i.channelTitle}> ({i.channelTitle})</Link>
        <div className="videoWrapper">
          <iframe
            src={i.videoId} allow="autoplay; encrypted-media" allowFullScreen>
          </iframe>
        </div>
        <p>{i.description}</p>
        {/* { i.image &&
          <img src={i.image}></img>
        } */}
        <div className="btn btn-primary" onClick={() => handleRate(i.videoId, "like")}>
          Like
        </div>
        <div className="btn btn-primary" onClick={() => handleRate(i.videoId, "dislike")}>
          Dislike
        </div>
      </span>
      <span className="timestamp">
      {'Shared '+i.timestamp+' ago. '}
      {/* {current_user?.id === i.user_id &&
        <Link href={'#/microposts/'+i.id} onClick={() => removeMicropost(i.id)}>delete</Link>
      } */}
      </span>
    </li>
    ))}
  </ol>
  )
}
