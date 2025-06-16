const ts = "touchstart";
const tm = "touchmove";
const te = "touchend";
let isResizing = false;
let api_key = "";


function main(){
    // v1
    $(".retime_ctr__tab").on(te, function(){
        $(".retime_ctr__tab").removeClass('active')
        $(this).addClass('active')
        $(".iframe_ctr").removeClass('active')
        $(`.${$(this).data('js-iframe')}`).addClass('active')
    });

    $(".resize_divider__handle").on(ts, function(){
        isResizing = true;
        $("iframe, .retime_ctr__tab").css('pointer-events', 'none');

    });
    
    $("body").on(tm, function(e){
        if (isResizing){
            $(".resize_divider__handle").parent().css('left', e.clientX)
            let srWidth = e.clientX/window.innerWidth * 100;
            $(".srcom_ctr").css("width", srWidth + "%")
            $(".retime_ctr").css("width", (100 - srWidth) + "%")
        }
    })
    .on(te, function(){
        isResizing = false;
        $("iframe, .retime_ctr__tab").css('pointer-events', 'auto');
    });

    addEventListener("resize", onWindowResize)

    // v2
    let checkForKey = localStorage["__hades_verifyguikey__"];
    if (checkForKey){
        api_key = checkForKey;
        $("#api_key").val(api_key)
    }
    console.log(checkForKey)
    $("#api_key").on("blur", function(){
        api_key = $(this).val();
        localStorage.setItem("__hades_verifyguikey__", api_key);
    });
}

function onWindowResize(){
    // $(".resize_divider").css("left", $(".srcom_ctr").offset().width/window.innerWidth * 100 + "%")
}

// dynamic loading next run in the queue:
    // we're going to start with just h1 runs for an example
    
    // step 1: dynamic loading of a run
    // need to GET list of unverified runs
    // need to find next run that's not assigned to anyone
    // need a button that says "Assign to me!" which assigns to current verifier
    // load that run into the frame


function getGame(){
    $.ajax({
        type: "GET",
        url: "https://www.speedrun.com/api/v1/games?name=Hades",
        dataType: "json",
        timeout: 1000,
        success: function(data){
            console.log("data retrieved!")
            console.log(data)
        },
        error: function (xhr, type){
            console.log("error occured")
            console.log(xhr)
            console.log(type)
        }
    })
}
function getAuth(){
    $.ajax({
        type: "GET",
        url: "https://www.speedrun.com/api/v1/profile",
        xhrFields: {
            "Host": "www.speedrun.com",
            "Accept": "application/json",
            "x-api-key": api_key,
        },
        dataType: "json",
        timeout: 1000,
        success: function(data){
            console.log("data retrieved!")
            console.log(data)
        },
        error: function (xhr, type){
            console.log("error occured")
            console.log(xhr)
            console.log(type)
        }
    });
}
function getAuth2(){
    const testReq = new XMLHttpRequest();
    testReq.onreadystatechange = ()=>{
        if (testReq.readyState === 4){
            console.log(testReq.response)
        }
    }
    testReq.open("GET", "https://cors-anywhere.herokuapp.com/https://www.speedrun.com/api/v1/profile", true)
    testReq.setRequestHeader("X-API-Key", "np9eme8wcxxbihv3uqveddl1g")
    testReq.send();
}
function getGameVariables(category){
    $.ajax({
        type: "GET",
        url: `https://www.speedrun.com/api/v1/categories/${category}/variables`,
        dataType: "json",
        timeout: 1000,
        success: function(data){
            console.log("data retrieved!")
            console.log(data)
        },
        error: function (xhr, type){
            console.log("error occured")
            console.log(xhr)
            console.log(type)
        }
    })
}
let runsList = [];
// https://github.com/ManicJamie/speedruncom-apiv2-docs/blob/1b244cae12a8986e66b81a036158590f08738a6a/endpoints/POST/GetModerationRuns.md
function getH1Runs(){
    $.ajax({
        type: "POST",
        // without cors-anywhere - 301 CORS error
        // with cors-anywhere - 405 method not allowed error
        url: "https://cors-anywhere.herokuapp.com/https://speedrun.com/api/v2/GetModerationRuns",
        // url: "https://speedrun.com/api/v2/GetModerationRuns",
        data: {
            "gameId": HADES,
            "limit": "20",
            "page": "1",
        },
        headers: {
            "X-API-Key": api_key,
        },
        dataType: "json",
        timeout: 1000,
        success: function(resp){
            console.log("data retrieved!");
            console.log(resp);
            resp.data.forEach((run) => {
                // console.log(run.status)
                // if (run.status.status === "new"){
                //     runsList.push(run);
                // }
            })
        },
        error: function (xhr, type){
            console.log("error occured")
            console.log(xhr)
            console.log(type)
        }
    })
}

function getH1Runsv1(){
    $.ajax({
        type: "GET",
        url: "https://www.speedrun.com/api/v1/runs",
        data: {
            game: "o1y9okr6",
            // status: "new",
            orderby: "submitted",
            direction: "desc",
        },
        dataType: "json",
        timeout: 1000,
        success: function(resp){
            console.log("data retrieved!");
            console.log(resp);
            resp.data.forEach((run) => {
                // console.log(run.status)
                if (run.status.status === "new"){
                }
                runsList.push(run);
            })
        },
        error: function (xhr, type){
            console.log("error occured")
            console.log(xhr)
            console.log(type)
        }
    })
}

    // step 2: modification of a run
    // make a UI that shows all of the relevant fields that could be edited
    // add edit buttons to make a change accordingly, with dropdowns for valid selections/text fields for times and links and such
    // add desc field that can be changed
    // add verify/reject button with associated information

    // step 3: retiming tools
    // youtube retimer built into page
    // twitch VOD timestamping
    // bilibili retiming tool

    // step 4: push verification state to sr.com
    
    // step 5: return user to list of all runs

    // step 6: integrate h1/h2 variability

    // step 7: user testing
