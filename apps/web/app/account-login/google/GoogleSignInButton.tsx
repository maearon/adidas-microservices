"use client";
import { BaseButton } from "@/components/ui/base-button";
import Link from "next/link";
// import { NextPage } from 'next'
// import Image from "next/image";
// https://console.cloud.google.com/apis/credentials?inv=1&invt=Ab5Jog&project=apt-helix-426002-r5
// git checkout 1242dc57c527178d6bffd6980c884ba4478bafd4 -- config/environments/development.rb
// https://myaccount.google.com/lesssecureapps
// https://accounts.google.com/DisplayUnlockCaptcha
// https://support.google.com/mail/answer/185833?hl=en
import React, {  useCallback, useEffect, useRef, useState } from 'react'
// import { useAppSelector } from '@/store/hooks';
// import { selectUser } from '@/store/sessionSlice';
import flashMessage from '@/components/shared/flashMessages';
import { getGravatarUrl } from '@/utils/gravatar';
import { clearTokens, getGoogleAccessToken } from "@/lib/token";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchUser } from "@/store/sessionSlice";
// https://developers.google.com/oauthplayground/

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const GOOGLE_APIS_YOUTUBE_FORCE_SSL_SCOPE = process.env.GOOGLE_APIS_YOUTUBE_FORCE_SSL_SCOPE;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const scope = [
  GOOGLE_APIS_YOUTUBE_FORCE_SSL_SCOPE, // https://www.googleapis.com/auth/youtube.force-ssl
  'openid', 
  'email',
  'profile', // openid email profile to https://openidconnect.googleapis.com/v1/userinfo
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
].join(' ');

// const Home: NextPage = () => {
export default function GoogleSignInButton() {
  const dispatch = useDispatch<AppDispatch>()
  const [feedItems, setFeedItems] = useState<any[]>([
    {
      id: 1,
      user_name: "Mark Nguyen",
      user_id: "1",
      gravatar_id: getGravatarUrl("manhng132@gmail.com"),
      size: 50,
      content: "https://www.youtube.com/embed/VNx0ndx9kSA?si=VyQFWuJvQUjciNm-",
      image: getGravatarUrl("manhng132@gmail.com"),
      timestamp : "2 days ago"
    }
  ])
  // const inputEl = useRef<HTMLInputElement>(null)
  // const { value: current_user, status } = useAppSelector(selectUser)
  // const loading = status === "loading"
  // const [authCode, setAuthCode] = useState<string | null>(null);

  const extractVideoId = (youtubeUrl: string): string | null => {
    const regExp = /embed\/([^?]*)/;
    const match = youtubeUrl.match(regExp);
    return (match && match[1]) ? match[1] : null;
  };

  const fetchVideoDetails = async (videoId: string) => {
    // https://www.geeksforgeeks.org/how-to-get-youtube-video-data-by-using-youtube-data-api-and-php/
    // https://console.cloud.google.com/apis/credentials?orgonly=true&project=apt-helix-426002-r5&supportedpurview=project,organizationId,folder
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${GOOGLE_API_KEY}&part=snippet`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const videoData = data.items[0].snippet;
      return {
        title: videoData.title,
        description: videoData.description.length > 240 ? videoData.description.substring(0, 240) + '...' : videoData.description,
        videoId: videoId,
        channelTitle: videoData.channelTitle,
      };
    } catch (error) {
      // flashMessage('error', 'Failed to fetch video details') // 2
      return {
        title: 'Number of requests you can make to the API within a given period has been surpassed' ,
        description: 'Number of requests you can make to the API within a given period has been surpassed',
        videoId: videoId,
        channelTitle: 'Number of requests you can make to the API within a given period has been surpassed',
      };
    }
  };

  // const feed_items = [
  //   {
  //     id: 1,
  //     user_name: "Mark Nguyen",
  //     user_id: "1",
  //     gravatar_id: getGravatarUrl("manhng132@gmail.com"),
  //     size: 50,
  //     content: "https://www.youtube.com/embed/VNx0ndx9kSA?si=VyQFWuJvQUjciNm-",
  //     timestamp : "2 days ago"
  //   }
  // ]

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

  const handleAuthClick = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  useEffect(() => {
    setFeeds()
  }, [setFeeds])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code !== null) {
      const params = new URLSearchParams();
      params.append('code', code);
      params.append('client_id', GOOGLE_CLIENT_ID || '');
      params.append('client_secret', GOOGLE_CLIENT_SECRET || '');
      params.append('redirect_uri', GOOGLE_REDIRECT_URI || '');
      params.append('grant_type', 'authorization_code');

      fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      })
      .then(response => response.json())
      .then(data => {
        console.log("data response from Google Oauth2 https://oauth2.googleapis.com/token", data)
        localStorage.setItem('accessToken', data.access_token);
        setFeeds();
        window.history.pushState({}, document.title, "/");
      })
      .catch(error => {
        flashMessage('error', 'Error exchanging code for token')
      });
    } else {
      // flashMessage('error', 'Authorization code is missing from URL') // 1
    }
  }, [setFeeds]);

  const handleRate = async (videoId: any, rating: any) => {
    const googleAccessToken = getGoogleAccessToken()
  
    if (!googleAccessToken) {
      flashMessage('warning', 'Access token is missing. Please authenticate.')
      handleAuthClick();
      return;
    }
  
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos/rate?id=${videoId}&rating=${rating}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${googleAccessToken}` },
        }
      );
      const res2 = await fetch(
        `https://openidconnect.googleapis.com/v1/userinfo`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${googleAccessToken}` },
        }
      );
      if (res.status === 204) {
        // flashMessage("success", `Video ${rating}d successfully`);
      } else {
        // flashMessage("error", `Failed to ${rating} video`);
      }
      if (res2.ok) {
        // {
        //   email: "manhng132@gmail.com"
        //   email_verified: true
        //   family_name: "nguyen"
        //   given_name: "manh"
        //   name: "manh nguyen"
        //   picture: "https://lh3.googleusercontent.com/a/ACg8ocLABlR9TESszfWuPgp8_pC_X2s8mMji8OkZ8vPT7aTMx_gwDbk=s96-c"
        //   sub: "115118617219596393121"
        // }
        const userInfo = await res2.json();
        flashMessage("success", `Logged in with Google ${userInfo.email} successfully`);
        console.log("res2 https://openidconnect.googleapis.com/v1/userinfo", userInfo);
        await dispatch(fetchUser()) // ✅ Redux fetch user sau log in
      } else {
        clearTokens();
        const errorInfo = await res2.text();
        flashMessage("error", `Failed to log in with Google: ${errorInfo}`);
      }
      if (res.status === 401) {
        // flashMessage('error', `Video ${rating} unsuccessfully`)
        // localStorage.removeItem("accessToken");
        // handleRate(videoId, rating)
        clearTokens();
      }
    } catch (error) {
      // flashMessage('error', `Video ${rating} unsuccessfully`)
      // localStorage.removeItem("accessToken");
      // handleRate(videoId, rating)
      clearTokens();
    }
  };

//   return (
//     <ol className="microposts">
//       { feedItems.map((i:any, t) => (
//       <li key={t} id= {'micropost-'+i.id} >
//         <Link href={'/users/'+i.user_id}>
//           <Image
//             className={"gravatar"}
//             src={"https://secure.gravatar.com/avatar/"+i.gravatar_id+"?s="+i.size}
//             alt={i.user_name}
//             width={i.size}
//             height={i.size}
//             priority
//           />
//         </Link>
//         <span className="user"><Link href={'/users/'+i.user_id}>{i.user_name}</Link></span>
        
//         <span className="content">
//           <b>{i.title}</b>
//           <Link target="_blank" href={"https://www.youtube.com/results?search_query="+i.channelTitle}> ({i.channelTitle})</Link>
//           <div className="videoWrapper">
//             <iframe
//               src={i.videoId} allow="autoplay; encrypted-media" allowFullScreen>
//             </iframe>
//           </div>
//           <p>{i.description}</p>
//           { i.image &&
//             <Image
//               className={"gravatar"}
//               src={i.image}
//               alt={i.user_name}
//               width={50}
//               height={50}
//               priority
//             />
//           }
//           <div className="btn btn-primary" onClick={() => handleRate(i.videoId, "like")}>
//             Like
//           </div>
//           <div className="btn btn-primary" onClick={() => handleRate(i.videoId, "dislike")}>
//             Dislike
//           </div>
//         </span>
//         <span className="timestamp">
//         {'Shared '+i.timestamp+' ago. '}
//         {current_user?.id === i.user_id &&
//           <Link href={'#/microposts/'+i.id} onClick={() => removeMicropost(i.id)}>delete</Link>
//         }
//         </span>
//       </li>
//       ))}
//     </ol>
//   )
// }

// export default Home
// import { BaseButton } from "@/components/ui/base-button";
// import Link from "next/link";

// export default function GoogleSignInButton() {
  return (
    <BaseButton
      variant="outline"  
      className="bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 hover:text-black dark:hover:text-white border border-border rounded-full"
      asChild
    >
      <Link href="" onClick={() => handleRate(feedItems[0].videoId, "like")} className="flex w-full items-center gap-2">
        <GoogleIcon />
        Log in with Google
      </Link>
    </BaseButton>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.2em"
      height="1.2em"
      viewBox="0 0 256 262"
    >
      <path
        fill="#4285f4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      />
      <path
        fill="#34a853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      />
      <path
        fill="#fbbc05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
      />
      <path
        fill="#eb4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      />
    </svg>
  );
}
