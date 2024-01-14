# TavelMate

***Travel Mate*** is an application to help travelers plan their road trips effortlessly and efficiently by providing a centralized platform to create a map based itinerary where details can be added if desired. 

It also allows more than one person to plan collaboratively and to share their trips and itineraries with others. 

It helps the user keep all the bookings related to travel in one place. 

# Prerequisites
In order to set up the application , you need following
1. Google Maps API key.
	Please refer to [this](https://developers.google.com/maps/documentation/javascript/cloud-setup) article on how to create a google cloud account, and refer [here](https://developers.google.com/maps/documentation/javascript/get-api-key) for instructions on obtaining a *API key* for Google Maps API.
2. Node JS.
	Please download and install Node JS as per instructions [here](https://nodejs.org/).
3. My SQL Database.
	Please download and install MY SQL as per instructions [here](https://www.sqlshack.com/how-to-install-mysql-database-server-8-0-19-on-windows-10/). 
4. Send Grid API Key *[Optional]* 
	Optionally you can get a API key as per instruction found [here](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs).

# Build Instructions
In order to use this application, you need to clone it locally. The application works assuming you have My SQL installed, a web browser.
1. Clone the repository
	Open a terminal and window and change to a empty directory and run following commands to clone the repository.
	```
	$ git clone https://github.com/ThiliniPD/TravelMate.git
	$ cd TravelMate
	```
2. Configure the backend `./backend/.env.production`.
	Replace the `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `SENDGRID_API_KEY` with the respective configurations you got when setting up prerequisites. 
	
	The `DB_HOST` is the IP/DNS of the data base server, which is `localhost` if the database is installed on the local machine where application is deployed. 
	
	Make sure a database schema is created that matches the `DB_NAME` in the database.
3. Configure the frontend `./frontend/config.js`
   Replace the `GOOGLE_API_KEY` with the API key from google you got when setting up prerequisites.  
4. Install node modules
	```
	$ cd frontend
	$ npm install
	$ npm run build
	$ cd ../backend
	$ npm install 
	$ npm run prod
	```
5. You are now able to use the application, open your browser and navigate to http://localhost:8000/
