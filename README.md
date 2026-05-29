# Launch Project Week 2: Spotify Project 
## Project Description
This project is a full-stack social music platform built with React, Express, Firebase, and the Spotify API. Users can log in with Spotify, view their top artists and songs, customize their public profile, discover other users, participate in forums, and message friends. The goal is to make Spotify feel more social by giving users a place to listen, share, and talk about music. 

## Table of Contents
1. [Installation](#installation)
2. [External setup](#external-setup)
3. [Resources](#resources)
4. [Major Components and Features and Feature Status](#major-components-and-features-and-feature-status)

## Installation 
1) Clone the repo

2) cd into /backend and run 'npm install'
3) cd into /frontend and run 'npm install'
## External setup
A Firebase project is required to set up the web app as an admin. 

In additional, you must register the Spotify Web API project with the app in order to get an access token for users to call the Spotify API.

-----------------

Your backend .env file should look something like this:
```
PORT=port
FIREBASE_API_KEY=api_key
FIREBASE_AUTH_DOMAIN=auth_domain
FIREBASE_PROJECT_ID=project_id
FIREBASE_STORAGE_BUCKET=storage_bucket
FIREBASE_MESSAGING_SENDER_ID=sender_id
FIREBASE_APP_ID=app_id
SPOTIFY_WEBAPI_ID=webapi_id
SPOTIFY_WEBAPI_SECRET=webapi_secret
SPOTIFY_WEBAPI_REDIRECT_URI=http://127.0.0.1:{PORT}/callback
```
------------------

Your frontend .env file should include VITE_API_URL to use as the base path for the API on the backend.

e.g
```
VITE_API_URL=http://127.0.0.1:5005
```

It is important that you use 127.0.0.1 and not localhost, as the access token cookie from Spotify will not be available
to the client with a localhost url. package.json is changed to use 'vite --host 127.0.0.1' to account for this.


## Resources
[Document Your Project (SWE 2026)](https://docs.google.com/document/d/1BTnxxlqRfn0yGVPjDbwhXV88thYsxN-jFWK-N3UuZUA/edit?tab=t.0)
[Spotify Project (SWE 2026)](https://docs.google.com/document/d/1G1j7hIby7OWzMTbx4_auER4fxZb3ikT-_5ZsOtzgpZA/edit?tab=t.0)
[Trello](https://trello.com/b/jMjfiavw/launch-project2)
[Figma](http://figma.com/design/ktIaklmYJd0PZtjGGAq7RD/Spotify-Project?t=sq1cnAQUdWrCc3qX-0)
[Firebase](https://console.firebase.google.com/u/0/project/spotify-project-b53ac/overview) 
[Presentation](https://canva.link/hgyapq03hq0gn3o)
## How to Use Project

Make sure both the frontend and backend are running.

To access Spotify features (e.g Top Artists), users will have to log in via Spotify. Afterwards, they will have access to all of the site's features including
the ability to view their Liked Songs, Top Artists (all time, last 6 months, and last month), and Top Songs (all time, last 6 months, last month).

User's can make forums, in which they can make discussion posts talking about their favorite artists, new songs, comparisons, etc. 

User's also have the ability to discover other users on the platform. A user can visit their profile and set their profile to
private in order to hide themselves from the discover feature. 

User's can also message other users and see all their messages with other users on the Inbox page.

### Major Components and Features and Feature Status


## Credits

Created by Mathias Kuchimpos, Michelle Jiang, Sunshine Huang, Vincent Chan, Graze Zhou
