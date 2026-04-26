# Qaryz Frontend

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

The web app listens on `http://localhost:3000` by default.

## Docker

```bash
docker build -t qaryz-frontend .
```

For Vercel, set the project root directory to `frontend` and add the variables from `.env.example`.
