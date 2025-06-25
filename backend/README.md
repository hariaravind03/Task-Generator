# Task Manager Backend Deployment

## Environment Variables
Copy `.env.example` to `.env` and fill in your production values:
```
DATABASE_URL=your_production_database_url
GOOGLE_AI_API_KEY=your_google_gemini_api_key
PORT=4000
FRONTEND_URL=https://your-frontend-url.com
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
```

## Production Start
```
npm install --production
npm run start:prod
```

## Using PM2 (Recommended for VPS/Cloud VM)
```
npm install -g pm2
pm run start:prod
# or
pm2 start server.cjs --name task-manager-backend
```

## Docker Deployment
```
docker build -t task-manager-backend .
docker run -d -p 4000:4000 --env-file .env task-manager-backend
```

## Heroku Deployment
- Ensure you have a `Procfile` with:
  ```
  web: npm run start:prod
  ```
- Set your environment variables in the Heroku dashboard or CLI.
- Deploy via Git or GitHub integration.

## Vercel/Render/Other Platforms
- Use the `start:prod` script as your start command.
- Set environment variables in the platform dashboard. 