# [GeoDaily](https://geodaily.online/login)
A Google Street View location guessing game, inspired by [geoguessr](https://www.geoguessr.com/). Compete with friends or strangers to earn the highest score! A new challenge is generated every day at midnight GMT.

A live demo of the application can be found [here.](https://geodaily.online/login)

## The tech stack used
- **React** - HTML, JavaScript, CSS
- **Node.js** and **Express**
- **PostgreSQL** (Prisma ORM)
- Google maps JavaScript API
## Deployment
- **Docker** - Dockerfile's were used to build the images for both the frontend and backend components. An **NGINX** instance was deployed and used to serve the static build files for the frontend.
- Fly.io - Deploying to Fly.io was as simple as building my docker images using their remote builder. Once the container was built, it was deployed.
- **AWS lambda** - Used in conjunction with Amazon EventBridge to automatically run the script that generates the new daily challenge.
## Highlights
- Generating the daily challenge
	- [API Endpoint](https://github.com/ehartley38/dailyGeoProject/blob/89d3f7a85fb0cc0ff80d1225f95a1244496e2f28/server/src/controllers/challenges.ts#L157-L238)
	- [Generate a valid Street View location](https://github.com/ehartley38/dailyGeoProject/blob/89d3f7a85fb0cc0ff80d1225f95a1244496e2f28/server/src/utils/getValidStreetView.ts#L44-L68)
	
