# Charity Events Management Website

A dynamic client–server website for browsing, searching and viewing charity
events. Built for **PROG2002 Web Development II — Assignment 2**.

## Technology Stack

- **Backend:** Node.js, Express, MySQL (`mysql2`)
- **Frontend:** HTML, CSS, JavaScript (DOM + `fetch` + Promises/`async-await`)
- No frontend framework (Angular/React/Vue) is used, as required.

## Project Structure

```
submission/
├── api/
│   ├── event_db.js               # MySQL connection
│   ├── server.js                 # Express server + all API routes
│   ├── package.json
│   └── charityevents_db.sql      # Schema + seed data (import this into MySQL)
├── clientside/
│   ├── index.html                # Home page
│   ├── search.html               # Search events page
│   ├── event.html                # Event detail page
│   ├── css/style.css
│   └── js/
│       ├── home.js
│       ├── search.js
│       └── event.js
├── report/
│   └── PROG2002_A2_Report.md
└── README.md
```

## Setup & Run

### 1. Database

1. Make sure MySQL is running locally.
2. Import the schema and seed data:

   ```bash
   mysql -u root -p < submission/api/charityevents_db.sql
   ```

   (If your root user has no password, omit `-p` and press Enter.)

### 2. API server

1. Install dependencies:

   ```bash
   cd submission/api
   npm install
   ```

2. Edit `event_db.js` if your MySQL credentials differ from the defaults
   (`root` with an empty password, `localhost`).

3. Start the server:

   ```bash
   npm start
   ```

   The API runs on <http://localhost:3000>.

### 3. Client site

Open `submission/clientside/index.html` directly in a browser (or serve the
folder with any static file server). The client calls the API at
`http://localhost:3000/api`.

> The API base URL is defined as a constant `API_BASE` in each of
> `js/home.js`, `js/search.js` and `js/event.js`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/events` | Active, upcoming/current events |
| GET | `/api/events/search` | Filter by `date`, `location`, `category_id` |
| GET | `/api/categories` | All event categories |
| GET | `/api/events/:id` | Full details for one event |

## Notes

- The **Register** button shows
  `This feature is currently under construction.` (as required).
- `POST` / `PUT` / `DELETE` are intentionally not implemented (Assessment 3).
- The seed data uses `NOW()`-relative dates, so the past/upcoming mix always
  works regardless of when the SQL is imported.
