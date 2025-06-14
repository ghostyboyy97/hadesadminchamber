'use client';

import Image from "next/image";
import { useState, useCallback } from "react";



// TODO
// 1 - we need UI to prompt the user to go to https://cors-anywhere.herokuapp.com/corsdemo and request temporary access
// 2 - we need UI to prompt the user for their API key
// 3 - checkAuth()
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
  blur: () => {};
}
interface runButtonProps {
  title: string;
  click: () => {};
}

function GetRunButton({ title, click }: runButtonProps) {
  return (
    <button onClick={click} className="w-sm bg-sky-500 hover:bg-sky-700 cursor-pointer mt-8">{title}</button>
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
  const [value, setValue] = useState("Change me");
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.currentTarget.value);
    setValue(event.currentTarget.value)
  }
  function checkKeyValid() {
    console.log(value)
  }

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


  async function checkAuth() {
    const url = "https://cors-anywhere.herokuapp.com/https://www.speedrun.com/api/v1/profile";
    // const url = "https://www.speedrun.com/api/v1/profile";
    try {
      console.log(value)
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Host": "www.speedrun.com",
          "Accept": "application/json",
          "X-API-Key": value,
        }
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json)
    } catch (exc: any) {
      console.error(exc.message)
    }
  }


  return (
    <div className="flex flex-col justify-start items-center w-dvw h-dvh">
      <h1 className="font-bold text-8xl w-fit">Hades Admin Chamber</h1>
      <APIKeyInput blur={checkAuth} placeholder="Enter your sr.com API key here" />
      <GetRunButton click={getH1Runs} title="Get next run in queue" />
    </div>
  );
}
