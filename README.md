# Backend A1

## Setup Instructions
* Clone the repository
* To build and run the app as an image on a docker container, run `docker build -t fable-a1 .`, followed by `docker run -p 3000:3000 fable-a1` to run the application on port 3000.
* To run the application directly on your machine, run `npm install` followed by `npm run start`. The default port is 3000.
* Create a .env file for the Firebase bucket instance URL, and optionally for the port.

## Running The Test
The `bombarder.sh` script has the configurations and instruction to hit the endpoint of the application. Adjust the parameters as per your machine. The default configuration was set up for a 2021 MacBook Pro (M1 Pro Silicon, 8 Cores). This hits the endpoint at about 13k requests per second.

Run the bash script and view the results when finished. Use the command associated with your shell.

## Brief Working
The app listens for incoming requests with the log event. It JSON-stringifies it and creates an object and pushes into a buffer. Every 10 seconds a cron job checks if this primary buffer has contents and proceeds to flush it onto a blob and uploads it to Firebase. There is also an emergency flusher that does the same flush operation when the current blob gets bigger than 10MB. 

## Libraries and Dependencies
* Node.js/Express (for setting up REST endpoints)
* Bash Scripts (for the load test and other tooling)
* Firebase (blob storage)

A lot of assumptions were presumed in the making and I would be discussing those in person.