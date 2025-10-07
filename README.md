# Huella Feliz — Deploy-ready (Vite + Vercel serverless)

This project is prepared to be deployed on Vercel. It includes:
- Vite React frontend (simple store UI)
- Serverless function at `/api/create-checkout-session` for Stripe Checkout
- Assets and README

## Quick Local
1. Install dependencies:
   ```
   npm install
   ```
2. Run dev:
   ```
   npm run dev
   ```

## Vercel Deploy (one-click steps you should do)
1. Create a GitHub repo and push this project.
2. Sign in to Vercel and create a new project -> Import Git Repository.
3. Set the root directory to the repository root.
4. In Vercel project settings -> Environment Variables, add:
   - `STRIPE_SECRET_KEY` = your Stripe secret key
   - `FRONTEND_URL` = https://your-domain.vercel.app (or your custom domain)
5. Deploy. Vercel will build the Vite app and serve the serverless function under `/api`.

## Notes
- Replace placeholder images in /assets with real product photos.
- Replace demo products in src/HuellaFelizStore.jsx with your real catalog or connect to a CMS.
- Make sure to verify and validate prices & stock on the server before creating Stripe sessions.