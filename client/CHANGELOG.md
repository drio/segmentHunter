# Changelog

### 0.4

- Complete rewrite of state handling (using observables).

### 0.3.2

- Fixes bug related to strava token handling

### 0.3.1

- Migration to typescript

### 0.3.0

- heavy redesign of the controls
- only pass local segments to the map
- Adds segment list to the controls
- Zoom to a concrete segment from the list

### 0.2.1

- fix mobile styles for errors
- add admin helper to clean all local storage and cookies
- save to local storage the current location
- if location is not available default to the world
- let the user set the location

### 0.2.0

- Release alpha version to production
- use open weather data as weather backend
- implements login/logout screens
- style changes

### 0.1.2

- Improve error handling messages
- Use local segments if you can otherwise go global
- Dynamic error component
- Change logic to load segments and set map coordinates.
  Now, we load all the segments but use the current location to set the map.

### 0.1.1

- Mobile friendly

### 0.0.12

This release of Teleport contains a bug fix.

- Adds logic to load right bbox in viewport and segments falling within it
- Better UI styling for errors and loading states
- Iterate over styles for slider
