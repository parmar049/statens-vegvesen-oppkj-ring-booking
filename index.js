const fetch = require('node-fetch');
const Push = require('pushover-notifications')
const nodeSchedule = require('node-schedule');

let trafficStations = [//{ stationId: "081", stationName: "Risiloka" }
                      //{ stationId: "051", stationName: "Drobak" }
                      //{ stationId: "351", stationName: "Stavenger"},
                     { stationId: "061", stationName: "Billingstad"}
                        ];
let sentNotifications = new Set()
const COOKIE = "nmstat=a5fac614-6147-9816-b456-b43173fdf40b; SELVBETJENING-XSRF-TOKEN=e5e4223f59f89d063a6cd0c9af3838d0377f8092363719c8053195b99abe; SELVBETJENING-XSRF-TOKEN-HTTPONLY=e5e4223f59f89d063a6cd0c9af3838d0377f8092363719c8053195b99abe; TS01c05a7b=01165c59e7d8282b9ce8df95185f173c800c352ac92c641e27099c15d31f535b1a7e16c7cc3c50283c9b2f20aca99cabd8ce954d9b; amlbcookie=01; iPlanetDirectoryProOAM=cVKKM-IcCUnZCTPY37EK5IzYhG8.*AAJTSQACMDIAAlNLABx2eWkzVUIyNEdVeFJSWUtKeXE4YnhxTUJLNzQ9AAR0eXBlAANDVFMAAlMxAAIwMQ..*; TS0124c733=0191c03302672ad18f25081ea190e9efaf0bf7bc4a119ff259c679df6d14409ce825d7a0510b48fe4b4103f6f10ad81b63c8aa4136; TS012f4073=01709944295a5b3c73cd14cae0aae94dfe99db15ef28ad15a4a14ae85ce20a1c4c5efdabb801fa3bcab6604be994cd5155b40abf5844f7c00f5c896a7d64ca7c9ddf18526d11752d2686927cc6efb510c917ce0be5b6b9a3ebcf9dd57e617e4ce0ae3f653048388f4d30d6a4f59393744cdf0fcc5e7606ae5f8f63910366cf19eaeeaf772568b6c0ecf62febf792cd4ece014b42d8a59bf9dc542973cf1f9dca2d196e144734db71293b135d371c51b322b2e545bf992f800fb666c49578539bd56f825ea975912fcc72315bd28b56323199e6454e; SVVSecurityTokenIdporten=eyJ0eXAiOiJKV1QiLCJraWQiOiJITUNDTDd0ei93dWZja3ArcGVldUN0bmpyVms9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiUlc4Y19yZEpqUnQxdWdqY3JrZDk5dyIsInN1YiI6IjIxMDU4NTE2OTg1IiwiYXVkaXRUcmFja2luZ0lkIjoiYmQ1MDRiNDQtNmExZi00OWU4LTk5ZWQtN2ExZDMzYjM0NDRkLTE0MzI2Mzk4Iiwic3VibmFtZSI6IjIxMDU4NTE2OTg1IiwiaXNzIjoiaHR0cHM6Ly93d3cudmVndmVzZW4ubm86NDQzL29wZW5hbS9vYXV0aDIvcmVhbG1zL3Jvb3QvcmVhbG1zL25vcmdlLm5vIiwidG9rZW5OYW1lIjoiaWRfdG9rZW4iLCJzaWQiOiJGY1dUWUNuODlucmdERzBoMWVqVDFsKzRZVkRFTVBwaEFnRnRYalMwUjlvPSIsImF1ZCI6WyJmZmJkNWNkZC1lYjMzLTRjYjktYTAwZi04ODczYzI5NWMzZjAiLCJodHRwczovL3d3dy52ZWd2ZXNlbi5ubzo0NDMvb3BlbmFtL29hdXRoMi9yZWFsbXMvcm9vdC9yZWFsbXMvbm9yZ2Uubm8iXSwiY19oYXNoIjoiMUV4MGIzdVg0NkEzQlBncF92M2VIdyIsImFjciI6IkxldmVsNCIsInVpZCI6IjIxMDU4NTE2OTg1Iiwib3JnLmZvcmdlcm9jay5vcGVuaWRjb25uZWN0Lm9wcyI6Il9CZUFfMmU0OVE3Z2pkdGRZZU1vYmxUNWdocyIsInNfaGFzaCI6IlcyS3R1YnM0emt4ZFBSd0oxY2xnWkEiLCJhenAiOiJmZmJkNWNkZC1lYjMzLTRjYjktYTAwZi04ODczYzI5NWMzZjAiLCJhdXRoX3RpbWUiOjE2ODY1OTQxOTYsInJlYWxtIjoiL25vcmdlLm5vIiwic2NvcGVzIjpbImF1ZDp0b2tlbmVuZHBvaW50Iiwib3BlbmlkIiwic2NvcGVzIiwiZGluc2lkZSJdLCJleHAiOjE2ODY2MjI5OTYsInRva2VuVHlwZSI6IkpXVFRva2VuIiwiaWF0IjoxNjg2NTk0MTk2fQ.bLYlv11_Gtbh_1N-qidWpztZbdyCQIAuq6cX20ubCHyVwA1OF-2OYm-ClsGox6aQDa1a4d4XFkK10pem26tQvy7iTj_93SgKxPlSUYZEftw13WZncx_CISKmImlmkuKnavJZmKh-JAJ1xCFlAzU81KP7INI733Uf21T763E46w-uWpjbCfaDg2Dvso5p15tw3EtQRBwF18c_d1JowuhFe4is8ldQxx9rQgmsYG-GvXlAcgj2rejHJHEThqczLMMy1Q3qA63vHE4tzNPhz_G3kTWAONb_EesPrSc9KdfMiFLO3D2PTZGQ8Ljr9sWTymrcZl-5TAI3a3qpYyR_70DTrq3ouazHkXAFwH92Dc9tMPGAVI5p3lKnMJNJWbjIJfI-SaWBUh4twZr3U5qitWnblQbwTn-kxr6DsUgbfH4foz_I-L_RqCb3SXJxYvNuqI4o7zCF_x-P7Q6Eq1qlsyhl5sASDo9j4lkYe5AfN0iP4hWXWn1jNh-rn0kWQwqYrBZX; TS0113d9ba=01709944295900be950cf42d1a60ad4b8d73d9631a28ad15a4a14ae85ce20a1c4c5efdabb801fa3bcab6604be994cd5155b40abf5844f7c00f5c896a7d64ca7c9ddf18526d11752d2686927cc6efb510c917ce0be59c98218a5572cedc880fc58ebbfb7750c5723dbbe813fdd81b839118158bc1e13063fa61002563d9dceac7d39c2688fc90dc53d4f35ef6f5e085fbf3b9c4fad5; _hjid=f836e037-108f-43a3-8154-44f5392ffc7a; _hjSessionUser_332272=eyJpZCI6IjVkNGViNGVlLTMwMDEtNTc1Zi1hNzRiLTUyNDAzODEzZjJiMCIsImNyZWF0ZWQiOjE2ODY1OTQyMjM2ODYsImV4aXN0aW5nIjp0cnVlfQ==; _hjIncludedInSessionSample_332272=1; _hjSession_332272=eyJpZCI6IjUxMjc3NjA0LWM3MWUtNGQxMC1hMmI5LTFlYTIxODNmYjYxNiIsImNyZWF0ZWQiOjE2ODY1OTQyMjQxODksImluU2FtcGxlIjp0cnVlfQ==; _hjAbsoluteSessionInProgress=0"
let push = new Push({
    user: "uhbrwry5qzdk1qiz89qiuavssswmq1",
    token: "asqoy11w3v8v7rjs9wxj3m5gvhy12z",
})
console.log("Welcome to Vegvesen, lets find some available Schedule.");
const job =  nodeSchedule.scheduleJob('*/15 * * * * *', function () {
    try {
        trafficStations.forEach(trafficStation => {

            let URL = "https://backend-bestill-time-oppkjoring.atlas.vegvesen.no/provetimer?v=2&klasse=B&arbeidsflytId=984835084&trafikkstasjonId={stationId}"
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
                                    var startDate = new Date("2023-06-19T06:00:00");
                                    var endDate = new Date("2023-07-30T18:00:00");
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