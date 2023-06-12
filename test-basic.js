let schedules = [{"oppmotested":"Risløkka trafikkstasjon","start":"2022-08-06T09:30:00","ferdig":"2022-08-06T10:45:00","sprakkode":"en","etterGebyrfrist":true,"trafikkstasjonId":"081"},{"oppmotested":"Risløkka trafikkstasjon","start":"2022-08-20T10:50:00","ferdig":"2022-08-20T12:05:00","sprakkode":"en","etterGebyrfrist":true,"trafikkstasjonId":"081"}];
trafficStation={};
trafficStation.stationName="Risiloka";
let sentNotifications = new Set();
const Push = require('pushover-notifications')
let push = new Push({
    user: "u3vvecqwuzrmi7a2pc3s7h5nry7suw",
    token: "aw3b45g3yzm36wpov6qxoq2msvqaxo",
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
        var availableDate = schedules[i].start;
        var startDate = new Date("2022-08-05T06:00:00");
        var endDate = new Date("2022-08-15T18:00:00");
        if (availableDate > startDate && availableDate < endDate) {
            push.send(msg, function (err, result) {
                if (err) {
                    console.log("Unable to send notifications", err);
                } else {
                    console.log(result)
                    sentNotifications.add(trafficStation.stationName + schedules[i].start)
                    console.log(sentNotifications.length);
                }
            })
        } else {
            console.log("Exam date not fitting in my required dates....")
        }
        
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
