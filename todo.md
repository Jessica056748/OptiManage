# Notes

By convention, npm i is usually run at the root of the project, not in a sub-directory (here, backend). Not saying we should change it; just worth noting.

## Tasks

Should be prioritized given the time crunch we're in.

- ✅ Render what is shown in Opti-Svelte here, with SvelteKit
- ✅ Get authentication for manager logins to work
- ✅ Set the JWT cookie after authentication (cookie is not being set)
- ✅ Debug manager account creation
- Find more suitable light and dark (mainly dark, which only has two images) backgrounds with good contrast that fit the application's theme
- How will new manager users know what department they belong in? Is this a nullable field, so that it's not necessary to fill up when the manager account is created?
- Update state user information and redirect to homepage if they access the authentication (/) page when they're already authenticated.
- Finish home page
  ✅ Add calendar field
  - Populate calendar field with shift information 
  ✅ Style page
- Add account page
  - Add account modification buttons and integrate with backend
  - Style page
- Add pop-up component, to show whenever a calendar day is clicked, with options to edit
- Enable the user to logout on all pages
  ✅ update state
  - remove jwt
- Add any other missing pages (check HIPO/other diagrams)
- Get JWT tokens working between the front-end and back-end
  ✅ Store JWT handed by the server as cookies
  - Ensure JWT tokens are received by the server
- Add notification functionality
  - Figure out a way to add notifications to the context
  - Animate notifications
  - Automatically remove notifications after a short time
✅ Code the backend function that fetches all shifts for the current month
- ⚠️ Pending Security Fix: the backend error message should **not** specify which field - the email or password - failed during authentication; this would give potential attackers more information to work on. Simply state "invalid credentials" or something, but don't specify which credentials are incorrect.
- Load all user information upon authentication, and store in state

✅⚠️🎯

## Concerns or Questions

Is dbinfo.txt supposed to be the .env file? If so, should we write a note to convert it to .env and fill the values at the top of that file?
