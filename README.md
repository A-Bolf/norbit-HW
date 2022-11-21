## Setup

install packages

```bash
cd ./norbit_backend
npm install
cd ../norbit_frontend
npm install
```

set up psql databse

```bash
psql
CREATE DATABASE norbit;
\q
psql norbit < ./norbit_backend/norbit.sql
```

Input your sql credentials in "norbit_backend/index.js"

## Usage

start mock_boat service before backend or frontend

```bash
./mock_boat
npm start

../norbit_backend
npm start

../norbit_frontend
npm start
```

## Known Issues

Backend server doesn't start without mock_boat service running

Recorded replays aren't saved to the database thus they don't persist on backend restart
