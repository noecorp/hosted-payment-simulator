### Deploy on Heroku
1. Clone this repository locally
2. Create a Heroku app with name `<app-name>`
3. Configure a gateway to work with OfficeR&D
    * add variable `SECRET` with the value provided in OfficeR&D
    * set Gateway Url in OfficeR&D to `https://<app-name>.herokuapp.com?amount={{ amount }}&reference={{ reference }}&transactionId={{ transactionId }}&signature={{ signature }}&redirectUrl={{ redirectUrl }}`
4. Add Heroku remote `heroku git:remote -a <app-name>`
5. Push to Heroku `git push heroku master`