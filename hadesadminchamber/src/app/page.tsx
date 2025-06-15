'use client';

import Image from "next/image";
import { useState, useCallback } from "react";



// TODO
// DONE 1 - we need UI to prompt the user to go to https://cors-anywhere.herokuapp.com/corsdemo and request temporary access
// DONE 2 - we need UI to prompt the user for their API key
// DONE 3 - checkAuth()
// 4 - check which games the user is a moderator of/check user ID against mod list
// 5 - setup Get Next Run button to grab runs from relevant queues
// 6 - (after subsequent step setup) - check hold/active verifying flags in database and check timeouts there; assign a valid run to current verifier
// 7 - put run into the page
// 8 - setup UI for changing each field on the run that's relevant
// 9 - setup retiming tools built into page
// 10 - auto-gen mod retime message if timestamp doesn't match (w/ ms handling for h2)
// 11 - append message to stored desc
// 12 - push verified/rejected state to sr.com with API key for verification
// 13 - prompt user if they want to verify another run



interface keyInputProps {
  placeholder: string;
  blur: (event: any) => {};
}
interface runButtonProps {
  title: string;
  authInfo: object;
  click: () => {};
}

function GetRunButton({ title, authInfo, click }: runButtonProps) {
  console.log(authInfo)
  return (
    <div>
      <h2>Welcome, {authInfo.data.names.international}</h2>
      <button onClick={click} className="w-sm bg-sky-500 hover:bg-sky-700 cursor-pointer mt-8">{title}</button>
    </div>
  );
}

function APIKeyInput({ placeholder, blur }: keyInputProps) {
  return (
    <input onBlur={blur} className="w-lg h-8 p-2 mt-4 border border-white rounded-sm" type="text" placeholder={placeholder}></input>
  )
}

export default function Home() {
  let runList = [];
  const HADES = "o1y9okr6";
  const [verifKey, setVerifKey] = useState("");
  const [verifSuccess, setVerifSuccess] = useState(false);
  // todo - define expected properties of authData? not sure what the best practice is here, seeing an error on it tho
  const [authData, setAuthData] = useState({});

  async function getH1Runs() {
    const url = `https://www.speedrun.com/api/v1/runs?game=${HADES}&orderby=submitted&direction=desc`;
    try {
      let response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      const json = await response.json();
      console.log(json)
    } catch (exc: any) {
      console.error(exc.message)
    }
  }


  async function checkAuth(event: any) {
    const url = "https://cors-anywhere.herokuapp.com/https://www.speedrun.com/api/v1/profile";
    try {
      setVerifKey(event.currentTarget.value);
      // TODO - only seems to successfully check auth on second blur?
      console.log(verifKey)
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Host": "www.speedrun.com",
          "Accept": "application/json",
          "X-API-Key": verifKey,
        }
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json)
      setAuthData(json);
      setVerifSuccess(true);
      console.log(verifSuccess);
    } catch (exc: any) {
      console.error(exc.message)
      // TODO - show error to the user
      setVerifSuccess(false)
    }
  }

  return (
    <div className="flex flex-col justify-start items-center w-dvw h-dvh">

      <h1 className="font-bold text-8xl w-fit">Hades Admin Chamber</h1>
      <div>First, go to <a className="text-red-500" target="_blank" href="https://cors-anywhere.herokuapp.com/corsdemo">this link</a> and request temporary access.</div>
      
      <div>Then, <APIKeyInput blur={checkAuth} placeholder="Enter your sr.com API key here" /></div>
      
      {(verifSuccess && Object.keys(authData).length > 0) && 
        (
        <div>
          <GetRunButton click={getH1Runs} authInfo={authData} title="Get next run in queue" />
        </div>
        )
      }

    </div>
  );
}
