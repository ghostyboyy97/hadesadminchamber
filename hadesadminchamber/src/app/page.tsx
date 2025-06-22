'use client';

import { time } from "console";
import Image from "next/image";
import { useState, useCallback } from "react";



// TODO
// DONE 1 - we need UI to prompt the user to go to https://cors-anywhere.herokuapp.com/corsdemo and request temporary access
// DONE 2 - we need UI to prompt the user for their API key
// DONE 3 - checkAuth()
// DONE 4 - check which games the user is a moderator of/check user ID against mod list
// DONE 5 - setup Get Next Run button to grab runs from H1 QUEUES queues
// HOLD 6 - (after subsequent step setup) - check hold/active verifying flags in database and check timeouts there; assign a valid run to current verifier
// DONE 7 - put run into the page
// DONE 7.1 - on get a game, get all its category values and such
// 8 - setup UI for changing each field on the run that's relevant
// 9 - setup retiming tools built into page
// 10 - auto-gen mod retime message if timestamp doesn't match (w/ ms handling for h2)
// 11 - append message to stored desc
// 12 - push verified/rejected state to sr.com with API key for verification
// 13 - prompt user if they want to verify another run

// after initial pass
  // 5.1 - get runs from all relevant queues
  // 6 - setup database and check hold/active flags


// plan of attack
  // friday - figure out mapping of variables/values for a given run
  // saturday - set up UI inputs
  // sunday - figure out retiming tools and auto-gen mod message, append to stored desc
  // monday - try pushing the verified run to sr.com!


interface keyInputProps {
  placeholder: string;
  blur: (event: any) => {};
}
interface runButtonProps {
  title: string;
  authInfo: object; // TODO - define typing for authInfo
  click: (event: any) => {};
}
interface runInfoProps{
  runData: object;
}

const gameIDToGameStringMap: object = {
  "o1y9okr6": "Hades",
};

function GetRunButton({ title, authInfo, click }: runButtonProps) {
  return (
    <div>
      <h2>Welcome, {authInfo.data.names.international}</h2>
      <button onClick={click} className="w-sm bg-sky-500 hover:bg-sky-700 cursor-pointer mt-8">{title}</button>
    </div>
  );
}

function APIKeyInput({ placeholder, blur }: keyInputProps) {
  // TODO - style input so that it hides the API key by default, maybe add a toggle to show it?
  return (
    <input onBlur={blur} className="w-lg h-8 p-2 mt-4 border border-white rounded-sm" type="password" placeholder={placeholder}></input>
  )
}








// TODO - move time controls into scope of Home (or import properly)

function getTimeFromInput(inputID: string){
  let input = document.querySelector(`#${inputID}`);
  let timeVal = input.value === "" ? input.placeholder : input.value;
  return parseInt(timeVal);
}

function updateTimeOnRun(val: string, timeType: string){
  // we need to
    // determine which time type we're chanigng (timeType)
    // get the hrs, mins, sec, (and ms for hades2) after change
  let hrs = getTimeFromInput(`${timeType}_hrs`);
  let mins = getTimeFromInput(`${timeType}_mins`);
  let sec = getTimeFromInput(`${timeType}_sec`);
  console.log((3600 * hrs) + (60*mins) + sec);
    // combine these together mathematically for the int value
    // combine these together in a concatenated string for the string versions
    // update primary time if relevant
    // update mod note

  // document.querySelector("#modNote").value = nextRunInQueue.comment.toString() + `\n\nMod Note: RTA retimed (manual entry)`
}






function RunDisplay({runData}: runInfoProps){
  let videoEmbedForm = runData.videos.links[0].uri;
  if (videoEmbedForm.includes("youtube")){
    // link comes in 
    // TODO - timestamp handling
    let splitURL = videoEmbedForm.split("?v=");
    videoEmbedForm = `https://www.youtube.com/embed/${splitURL[1]}?autoplay=0&wmode=transparent&start=0`;
  } else if (videoEmbedForm.includes("youtu.be")){
    let splitURL = videoEmbedForm.split(".be/");
    videoEmbedForm = `https://www.youtube.com/embed/${splitURL[1]}?autoplay=0&wmode=transparent&start=0`;
  }
  // TODO - twitch/bilibili handling

  // TODO - can have more than 1 player submitted, join that data before inserting
  // TODO - time processing
  let ingameTime = runData.times.ingame;
  let ingameMins = 0;
  let ingameSec = 0;
  let isIGTValid = true;
  console.log(ingameTime);
  if (ingameTime === null){
    // TODO - check category and see if IGT should be valid
  } else {
    ingameTime = ingameTime.split("PT")[1]; // trim PT off the front
  }

  let realTime = runData.times.realtime_t;
  let rtaHrs = 0;
  let rtaMins = 0;
  let rtaSec = 0;
  if (realTime === null){
    // TODO - check cases where RTA is *not* valid (i.e. h2 fresh file cases)
  } else {
    console.log(realTime)
    while (realTime > 3600){
      rtaHrs += 1;
      realTime = realTime - 3600;
      console.log("add an hr");
    }
    while (realTime > 60){
      rtaMins += 1;
      realTime = realTime - 60;
      console.log("add a min")
    }
    rtaSec = realTime;
  }

  let categoryData = runData.category.data.variables.data;
  let runValues = runData.values;

  // 0nwork5l = game version
  let runVersion = runData.values["0nwork5l"];
  runVersion = categoryData.find((el)=>{return el.id === "0nwork5l"}).values.values[runVersion].label;

  // jlzre7x8 - modded vs unmodded (for OwO at least - different per category?)
  let isRunModded = runData.values["jlzre7x8"];
  isRunModded = categoryData.find((el)=>{return el.id === "jlzre7x8"}).values.values[isRunModded].label;

  // jlzre7x8 - modded vs unmodded (for OwO at least - different per category?)
  let runWeapon = runData.values["dloy46m8"];
  runWeapon = categoryData.find((el)=>{return el.id === "dloy46m8"}).values.values[runWeapon].label;
  

  // TODO - dermine if show major update, heat, seeded vs unseeded
  // TODO - values object processing for things like modded/seeded/version/aspect
  return (
    <div className="flex flex-col justify-start items-center w-dvw h-dvh">
      <iframe className="w-4xl h-auto aspect-video" src={videoEmbedForm}></iframe>

      <div>Date: {runData.date}, Submitted: {runData.submitted}, Submitted by: {runData.players.data[0].names.international}</div>
      <div>Game: {runData.game.data.names.international}, Major update?: (only relevant for h2), Version: {runVersion}, Platform: {runData.platform.data.name}</div>
      <div>Category: {runData.category.data.name}, Heat?: (optional), Seeded?: (set value here), Modded?: {isRunModded}, Weapon/Aspect: {runWeapon}</div>
      <div>RTA (required): <input type="number" min={0} onChange={e => updateTimeOnRun(e.target.value, "rta")} placeholder={rtaHrs.toString()} id="rta_hrs"></input>hrs, <input type="number" min={0} max={59} onChange={e => updateTimeOnRun(e.target.value, "rta")} placeholder={rtaMins.toString()} id="rta_mins"></input>mins, <input type="number" min={0} max={59} onChange={e => updateTimeOnRun(e.target.value, "rta")} placeholder={rtaSec.toString()} id="rta_sec"></input>sec</div>
      <textarea id="modNote" className="bg-white w-4xl h-64" defaultValue={runData.comment ?? ""}></textarea>
    </div>
  )
}

export default function Home() {
  let runList = [];
  const HADES = "o1y9okr6";
  const HADES_2 = "3dxy5vv6";
  const HADES_CE = "369pqq31";
  const [verifKey, setVerifKey] = useState("");
  const [verifSuccess, setVerifSuccess] = useState(false);
  // todo - define expected properties of authData? not sure what the best practice is here, seeing an error on it tho
  const [authData, setAuthData] = useState({});
  const [allGames, setAllGames] = useState(Array(0));
  const [nextRunInQueue, setNextRunInQueue] = useState({});

  async function getNextRunInQueue(runID: string){
    // testing the embedding as suggested by sr.com
    console.log("getting run passed in from getH1Runs")
    const url = `https://www.speedrun.com/api/v1/runs/${runID}?embed=players,category.variables,game.variables,platform.variables`;
    try {
      let response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log("getting h1 runs - success!")
      console.log(json.data);
      if (json.data){
        setNextRunInQueue(json.data);
      }
      // TODO - else, queues are empty!
    } catch (exc: any) {
      console.error(exc.message)
    }
  }


  async function getH1Runs() {
    console.log("getting h1 runs...")
    const url = `https://www.speedrun.com/api/v1/runs?game=${HADES}&orderby=submitted&direction=asc&status=new`;
    try {
      let response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log("getting h1 runs - success!")
      console.log(json.data);
      if (json.data.length > 0){
        // setNextRunInQueue(json.data[0]);
        // getH1SRComVariables(json.data[0].category);
        // getRunnerFromID(json.data[0].players[0].id);

        console.log("testing run specific embedding")
        getNextRunInQueue(json.data[0].id);
      }
      // TODO - else, queues are empty!
    } catch (exc: any) {
      console.error(exc.message)
    }
  }

  async function getModeratedGames(userID: string){
    console.log("getting moderated games...");
    const url = `https://www.speedrun.com/api/v1/games?moderator=${userID}`;
    try {
      let response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok){
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);
      console.log("getting moderated games - success!");
      let allIDs: string[] = [];
      // json.data is an array of all games this user moderates
      // TODO - if empty/error, assuming they arent a moderator? test with someone's profile id here, handle UI accordingly
      // TODO - for each game, pass its ID into getRuns(), have getRuns() set up some conditional to handle checking when all runs area ready
      json.data.forEach((game: object) =>{
        console.log(game.id)
        allIDs.push(game.id);
      });
      setAllGames(allIDs);


    } catch (exc: any){
      console.error(exc.message);
    }
  }


  async function checkAuth(event: any) {
    // TODO - need to locally store auth success and auth key, check that locally stored confirmation as to not overwhelm heroku temp access
    console.log("checking auth...");
    console.log(event.target.value)
    const url = "https://cors-anywhere.herokuapp.com/https://www.speedrun.com/api/v1/profile";
    try {
      setVerifKey(event.target.value);
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Host": "www.speedrun.com",
          "Accept": "application/json",
          "X-API-Key": event.target.value,
        }
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log("checking auth - success!");
      setVerifSuccess(true);
      setAuthData(json);
      getModeratedGames(json.data.id);
      
    } catch (exc: any) {
      console.error(exc.message)
      // TODO - show error to the user
      setVerifSuccess(false)
    }
  }

  // TODO - once H1 case confirmed, change getH1Runs to getAllValidRuns

  // TODO - temp changed APIKeyInput blur from checkAuth to getH1Runs to prevent 429 error
  return (
    <div className="flex flex-col justify-start items-center w-dvw h-dvh">

      <h1 className="font-bold text-8xl w-fit">Hades Admin Chamber</h1>
      <div>First, go to <a className="text-red-500" target="_blank" href="https://cors-anywhere.herokuapp.com/corsdemo">this link</a> and request temporary access.</div>
      
      <div>Then, <APIKeyInput blur={getH1Runs} placeholder="Enter your sr.com API key here" /></div>
      
      {(verifSuccess && Object.keys(authData).length > 0 && allGames.length > 0) && 
        (
        <div>
          <GetRunButton click={getH1Runs} authInfo={authData} title="Get next run in queue" />
        </div>
        )
      }
      {(Object.keys(nextRunInQueue).length > 0) &&
        <RunDisplay runData={nextRunInQueue}/>
      }

    </div>
  );
}
