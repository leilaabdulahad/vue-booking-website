# Booking Website

## Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)

### About the project
A full-stack booking website built with Vue 3, TypeScript, Express.js, MongoDB, and Clerk. Users can search and filter properties, book available properties, manage their bookings and favorites properties. 

### Features
* Property Search & Filtering:
Users can search for properties by country/city and filter results based on the number of guests and available dates.

* User Authentication:
Integrated with Clerk for seamless user sign-in/sign-out functionality.

* Booking System:
Users can book available properties. Dates that have already been booked for a specific property are marked as unavailable to prevent overlapping reservations.

* Favorites:
Signed-in users can add properties to their favorites list for easy access later.

* User Bookings:
Signed-in users can view all their booked properties on a dedicated page.

### Technologies
[![My Skills](https://skillicons.dev/icons?i=vue,css,ts,mongodb,nodejs,express)](https://skillicons.dev)


### Installation 

1. Clone the repo
   ```sh
   git clone https://github.com/leilaabdulahad/vue-booking-website.git
   ```
2. Install packages
   ```sh
   npm install
   ```
3. Create an `.env.local` file and fill in the necessary enviroment variables.
   .env in the client folder
   ```
   VITE_CLERK_PUBLISHABLE_KEY=
   MONGODB_URI=
   CLERK_SECRET_KEY=
   ```
   .env in the server folder
   ```
   MONGODB_URI=
   VITE_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   PORT=5000
   
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```
4. Redirect in the terminal to the client folder 
   ```sh
   npm run dev
   ```
5. Redirect in the terminal to the client folder
   ```sh
   npm run dev 
   ```