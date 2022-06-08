let schedules = [{"oppmotested":"Risløkka trafikkstasjon","start":"2022-06-08T09:30:00","ferdig":"2022-06-08T10:45:00","sprakkode":"en","etterGebyrfrist":true,"trafikkstasjonId":"081"},{"oppmotested":"Risløkka trafikkstasjon","start":"2022-06-08T10:50:00","ferdig":"2022-06-08T12:05:00","sprakkode":"en","etterGebyrfrist":true,"trafikkstasjonId":"081"}];
trafficStation={};
trafficStation.stationName="Risiloka";
let sentNotifications = new Set();
const Push = require('pushover-notifications')
let push = new Push({
    user: "u4bkf6n3jpcjbfe8ds83ftmaf63fch",
    token: "aqf4ox53ovkuqaxte1aeztt9qv8quc",
})

for(let i=0 ; i<schedules.length ; i++ ) {
    if (sentNotifications.has(trafficStation.stationName + schedules[i].start)) {
        console.log("Notifications already sent");
    } else {
        let msg = {
            message: schedules[i].start,
            title: trafficStation.stationName,
            sound: 'magic',
            priority: 1
        }
        push.send(msg, function (err, result) {
            if (err) {
                console.log("Unable to send notifications", err);
            } else {
                console.log(result)
                sentNotifications.add(trafficStation.stationName + schedules[i].start)
                console.log(sentNotifications.length);
            }
        })
    }
}


console.log(sentNotifications.length);
schedules.forEach(schedule => {
    if (sentNotifications.has(trafficStation.stationName + schedule.start)) {
        console.log("Notifications already sent");
    } else {
        let msg = {
            message: schedule.start,
            title: trafficStation.stationName,
            sound: 'magic',
            priority: 1
        }
        push.send(msg, function (err, result) {
            if (err) {
                console.log("Unable to send notifications", err);
            } else {
                sentNotifications.add(trafficStation.stationName + schedule.start)
            }
        })
    }
})
