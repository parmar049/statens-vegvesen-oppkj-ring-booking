const fetch = require('node-fetch');
const Push = require('pushover-notifications')
const nodeSchedule = require('node-schedule');

let trafficStations = [{ stationId: "081", stationName: "Risiloka" }
                      //{ stationId: "051", stationName: "Drobak" }
                     //{ stationId: "071", stationName: "Lilistrom"},
                     //{ stationId: "061", stationName: "Billingstad"}
                        ];
let sentNotifications = new Set()
const COOKIE = "nmstat=5ab23de0-48ae-c3f4-f619-3809b285e5d4; _hjSessionUser_332272=eyJpZCI6ImJjOGViNTZjLTJhNWUtNTljMi1hZThhLTQ3MDk0NjRlODk3OSIsImNyZWF0ZWQiOjE2NTA2MTQxODE4NTgsImV4aXN0aW5nIjp0cnVlfQ==; SELVBETJENING-XSRF-TOKEN=cc071ed574eb6e94685b4e1d6e23158f718e52460ef0181bee0600edc502; SELVBETJENING-XSRF-TOKEN-HTTPONLY=cc071ed574eb6e94685b4e1d6e23158f718e52460ef0181bee0600edc502; TS01c05a7b=01165c59e7f8152ee2db3cc00428787f0015e8da8ae95d6dd24ae529553dc21d4f4105f530230e4136a2c2ced920513b9e794a23f3; brukertype=privat; brukerId=MjgzNTI5Mzc=; amlbcookie=05; _gid=GA1.2.2128772220.1659609266; _hjSession_332272=eyJpZCI6IjM1YTFhYTA2LTY0N2UtNGY5NC05NGFlLTMwZDA0OWYxNGY4NCIsImNyZWF0ZWQiOjE2NTk2MDkyNjU4MDUsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; iPlanetDirectoryProOAM=2rUiwtVJSFfuu-2qc7ac6Izga_E.*AAJTSQACMDIAAlNLABw1YmVXSEtuQ3F2a0xjNkRDeEc0dHFDUmMrUEk9AAR0eXBlAANDVFMAAlMxAAIwNQ..*; TS012f4073=01709944298c699bccfd547c0eee3b751e7fa8448104c82079248cb068b2e251c36c452c7d12976d85a13b24bf61838842fd8a6b454aa568eb3d4ee5fc34082e27b0eb0baaeb74221a2e3960fadb5033fe114a18f755cb189e039b183722df72e9b0dbf35f1370c500377ec9f335daf7122ca1fbc8e012625c434d7dad8025c75e75460afc98c5dd0aa6277b7e5fa48641a422930f67749c6187728dfb4fca53ef4dd5f41563fb5cde0b06e252c1468eb8df9ffb59e83597cb3b18f9a42e578b8a4b49050ede278bf0d09400d11e180128051034a86785f8b4b6f4b6923db78f5dc8775269; SVVSecurityTokenIdporten=eyJ0eXAiOiJKV1QiLCJraWQiOiJ4cTF1ejA4TndCanVtVWN0TlhXNUtWS0d2czA9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoid2VrZXhMT2NURHFFNGJaa3hvaXZIUSIsInN1YiI6IjA1MDY5MTE4MTg4IiwiYXVkaXRUcmFja2luZ0lkIjoiNDM1MWMxODUtYzQ1Ni00ZDRiLTk5Y2YtMTRjNGEwM2Y5ODhhLTMxNjgwNjY1MCIsImlzcyI6Imh0dHBzOi8vd3d3LnZlZ3Zlc2VuLm5vOjQ0My9vcGVuYW0vb2F1dGgyL25vcmdlLm5vIiwidG9rZW5OYW1lIjoiaWRfdG9rZW4iLCJhdWQiOiJzdnYtZGluc2lkZWYtOTRkNmRiNjQtMTdkMS00Yzc5LThjZjItM2FjNDdjZGE4ZTRhIiwiY19oYXNoIjoiSERLYkIyQW8zaHVvRDFBYUtib2VUdyIsImFjciI6IkxldmVsNCIsInVpZCI6IjA1MDY5MTE4MTg4Iiwib3JnLmZvcmdlcm9jay5vcGVuaWRjb25uZWN0Lm9wcyI6ImNIRHM0d1hzT1VUS2dOQzhQMTB3OWE5WUZISSIsInNfaGFzaCI6IkVTS2k1SHYyYVdrQ3Z1WmpORmw4UlEiLCJhenAiOiJzdnYtZGluc2lkZWYtOTRkNmRiNjQtMTdkMS00Yzc5LThjZjItM2FjNDdjZGE4ZTRhIiwiYXV0aF90aW1lIjoxNjU5NjA5MzExLCJyZWFsbSI6Ii9ub3JnZS5ubyIsInNjb3BlcyI6WyJvcGVuaWQiLCJzY29wZXMiLCJkaW5zaWRlIl0sImV4cCI6MTY1OTYzODExMSwidG9rZW5UeXBlIjoiSldUVG9rZW4iLCJpYXQiOjE2NTk2MDkzMTF9.CMXKgq26dm92o_vIkj00XUL0cF_BiWyPnQ9OtGAziJHrp9akKdTADbUin53GqIdZ8BpWF69XOZ9rvTVS1spbo25TN_OVHVagTnLM8HnOh4huQ4MIz5iQsRDlSh2__N0FHVz6LWNXNc5uVnG1toP-Ftc5Wbnb_Bf9NQmpHedJtgSbDMBd01J7xCeP8gErpZwYhc8j3VyTPwH0LL4mhckWOI1vJuIQHbZq3K4kXkGx9DxnYFse3S4lI0j9dhPe6LJYLW_s8OnUcf_lXAiMCiZXfQ8--sWXcsEnmeiRkU7sjJ8lDZIKW4HKvWrQPXDMD0YqTkYh6X_5g-N3PnqtpZpdHQ; TS0113d9ba=0170994429096af887abee068dcf7bc6d4ad684f5b04c82079248cb068b2e251c36c452c7d12976d85a13b24bf61838842fd8a6b454aa568eb3d4ee5fc34082e27b0eb0baaeb74221a2e3960fadb5033fe114a18f7a71a432728d82b138ca90a1544604af845bbb09b6b2dd69d51faa2c593b414e9b2040f2c2c07cc065385a62b287e3e254326d58abede5e43676851807a4a0d31; _ga=GA1.2.1568328085.1650614182; _ga_FQFH018WFW=GS1.1.1659609265.79.1.1659610805.0"
let push = new Push({
    user: "u3vvecqwuzrmi7a2pc3s7h5nry7suw",
    token: "aw3b45g3yzm36wpov6qxoq2msvqaxo",
})
console.log("Welcome to Vegvesen, lets find some available Schedule.");
const job =  nodeSchedule.scheduleJob('*/15 * * * * *', function () {
    try {
        trafficStations.forEach(trafficStation => {

            let URL = "https://forerett-adapter.atlas.vegvesen.no/provetimer?v=2&arbeidsflytId=886494472&klasse=B&trafikkstasjonId={stationId}"
                .replace("{stationId}", trafficStation.stationId);
            fetch(URL, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-GB,en;q=0.9",
                    "cookie": COOKIE,
                    "Referer": "https://www.vegvesen.no/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": null,
                "method": "GET"
            })
                .then(res => {
                    if(res.ok) {
                        return res.json();
                    } else {
                        throw "Invalid response from vegevasen. Response Status "+res.status
                    }                
                
                }).then(schedules => {                                                    
                    if (schedules.length == 0) {
                        console.log("No Schedule present at the moment for " + trafficStation.stationName)
                    } else {  
                        console.log("Response from vegvesen : " +JSON.stringify(schedules)); 

                        let pushSentThisIteration = 0;
                        for(let i = 0; i < schedules.length ; i++) {
                            if (sentNotifications.has(trafficStation.stationName + schedules[i].start)) {
                                console.log("Notifications already sent for school " + trafficStation.stationName + " for the time " +schedules[i].start );                        
                            } else {

                                   if(pushSentThisIteration >= 5){
                                       break;
                                   }                                    
                                    let msg = {
                                        message: schedules[i].start,
                                        title: trafficStation.stationName,
                                        sound: 'magic',
                                        priority: 1
                                    }
                                    var availableDate = new Date(schedules[i].start);
                                    var startDate = new Date("2022-09-05T06:00:00");
                                    var endDate = new Date("2022-09-09T18:00:00");
                                    if (availableDate > startDate && availableDate < endDate) {
                                        pushSentThisIteration++;
                                    try {
                                    push.send(msg, function (err, result) {
                                        if (err) {
                                            console.log("Unable to send notifications", err);
                                        } else {
                                            console.log("Sent Notification for school " + trafficStation.stationName + " for the time " +schedules[i].start);                                            
                                            sentNotifications.add(trafficStation.stationName + schedules[i].start);                                        
                                        }
                                    })}
                                     catch(err) {
                                            console.error(err)
                                     }

                                    } else {
                                        console.log("Exam date "+ availableDate +" not fitting in my required dates....")
                                    }
                                    
                            }

                        }                        
                    }
                })
                .catch(error => console.error(error));;
        })
    }
    catch(err) {
        console.error(err)
      }
})



var express = require("express");
var app = express();

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`App: listening on port ${port}`);
});