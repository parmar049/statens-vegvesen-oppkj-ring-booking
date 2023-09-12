** Welcome to Statens-Vegvesen-oppkjoring-booking Project **

To start with this project you have to follow below Steps

1. Login to Statens Vegvesen Website using your bankId. Open developer tool in your Browser. For Example in Chrome you can go > `More Tools -> Developer tool
2. You can see API calls in Network tab when you choose your test center to book driving test exam slot
3. Copy the cookie value from parameters and paste in file `index.js` for field `COOKIE`. Remember this is valid for 24 hours so next day you have to login and get new cookie
4. You can also add a list of traffic stations with id in the field `trafficStations` , you can get these lists in API parameters in Network tab itself.
5. Create an account in Pushover `https://pushover.net/` its free trial for 30 days. Install app on phone. From there copy API your userId and token and paste in field `user`, `token` in `index.js` file.
6. Change the date range for your booking dates in the fields `startDate` and `endDate`. For example, you are looking for exam date in mid of July to Mid of Aug then give that date range
7. If you want to change the frequency of API hits to get available slots you can change the time interval. Currently, it's 15 sec. `nodeSchedule.scheduleJob('*/15 * * * * *', function ()`
8. Once this is done you are ready to go. Make sure you have docker installed in your system.
9. Run these 2 commands > 1. `docker build` , 2. `docker run`
10. Now the application is running locally in your system as long as it's running. You can see logs in the docker console where the application is running.
