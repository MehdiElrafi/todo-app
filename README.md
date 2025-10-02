# README

# 📝 Todo App — Full Stack Application

A full-stack **Todo Management App** built with:

- 🧠 **Back-end:** Ruby on Rails (API-only)
- 🎨 **Front-end:** React.js (Vite or CRA)
- ☁️ **Deployments:** Rails API on **Render**, React app on **Vercel**

🔧 Project Installation

1️ Back-end (Ruby on Rails)

```bash
cd back-end
# Install postgres & ruby 3.4.4 & rails 8
gem install bundler
bundle install
```

2️ Front-end (Vite / Node.js)

```bash
cd front-end
# Install Node.js >= 20.19 and npm
npm install
```

3 Add front-end and back-end envs

```bash
back-end env variable: FRONT_END_URL
front-end env variable: API_BASE_URL
```

Note:
To run the front-end in development mode (npm run dev) —
create a .env file inside the front-end folder and add:

```bash
APP_PORT=5173  # use any port you want
```
