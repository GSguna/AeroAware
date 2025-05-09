# AeroAware
Aero Aware was created to aid users in their travel planning by predicting future flight prices. Our project, Aero Aware, is designed to help users make an informed decision on their travel plans by reducing the stress of spending countless hours on figuring out the best time to travel based on their financial constraints.

# How to Run the Contents of this Repository

## Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Backend

This is a Flask and Python based backend application that provides a secure API to connect to the backend predictive model. 

### Optional (set up virtual environment)

First, open a terminal:

```
cd Backend
python3 -m venv venv
source venv/bin/activate
pip install [all the listed dependencies: python, flask, pydantic, Joblib, Pandas, Xgboost, Libomp, Flask_cors]
# or (if using mac)
sudo pip install [all the listed dependencies: python, flask, pydantic, Joblib, Pandas, Xgboost, Libomp, Flask_cors]
flask --app api --debug run
```

The backend will run on [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Learn More

To learn more about Flask, take a look at the following resources:

- [Flask Documentation](https://flask.palletsprojects.com/en/stable/#) - learn about Flask and Flask Installation.
- [Learn Flask](https://flask.palletsprojects.com/en/stable/tutorial/) - an official Flask tutorial.

You can check out [the Flask GitHub repository](https://github.com/pallets/flask) - you can donate and make contributions!
