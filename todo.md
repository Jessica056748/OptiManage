# Notes

By convention, npm i is usually run at the root of the project, not in a sub-directory (here, backend). I think we should change this.

The backend error message should **not** specify which field - the email or password - failed during authentication; this would give potential attackers more information to work on. Simply state "invalid credentials" or something, but don't specify which credentials are incorrect.

## Tasks

- Ensure the Vite dist directory (after npm build) can communicate with the backend
- Get authentication for manager logins to work
  - Check why 
- Add notification functionality
  - Figure out a way to add notifications to the context
  - Animate notifications
  - Automatically remove notifications after a short time

## Concerns or Questions

Is dbinfo.txt supposed to be the .env file? If so, should we write a note to convert it to .env and fill the values at the top of that file?
