# Restaurant Reservation System

This is an application for managing reservations and tables at a restaurant.

Live Demo: https://restaurant-reservation-frontend-eight.vercel.app

## Features
* Create new reservations
* View reservations for a specific date
* Create new tables
* Seat reservations at specific tables
* Mark tables as finished to free them up for other reservations and remove the currently seated reservation from the dashboard
* Search for reservations by phone number
* Edit upcoming reservations
* Cancel reservations to remove them from the dashboard

### Dashboard
![dashboard](https://github.com/KarlJussila/restaurant-reservation/blob/main/images/dashboard.png)

### New Reservation
![new reservation](https://github.com/KarlJussila/restaurant-reservation/blob/main/images/new_reservation.png)

### New Table
![new reservation](https://github.com/KarlJussila/restaurant-reservation/blob/main/images/new_table.png)

### Edit Reservation
![edit reservation](https://github.com/KarlJussila/restaurant-reservation/blob/main/images/edit_reservation.png)

### Seating Reservation
![seating reservation](https://github.com/KarlJussila/restaurant-reservation/blob/main/images/seat.png)

### Search by phone number
![searching](https://github.com/KarlJussila/restaurant-reservation/blob/main/images/search.png)

## Backend API Routes
### PUT /reservations/:reservationId/status
Updates the status of a reservation

Example Body: ```{ data: {status: "seated"} }```

### GET /reservations/:reservationId
Gets a reservation by its id

### PUT /reservations/:reservationId
Updates the reservation with the given id

Example Body: ```{ data: { people: 5 } }```

### GET /reservations?date=<YYYY-MM-DD>
Gets reservations for the provided date

### POST /reservations
Creates a new reservation

Example Body:
```
{
    data: {
        "first_name": "Rick",
        "last_name": "Sanchez",
        "mobile_number": "202-555-0164",
        "reservation_date": "2020-12-31",
        "reservation_time": "20:00:00",
        "people": 6
    }
}
```

### PUT /tables/:tableId/seat
Seats a reservation at the table

Example Body: ```{ data: { reservation_id: 1 } }```

### DELETE /tables/:tableId/seat
Sets the table's reservation to null

### GET /tables/:tableId
Gets a table by its id

### PUT /tables/:tableId
Updates the table with the given id

Example Body: ```{ data: { capacity: 5 } }```

### GET /tables
Gets a list of all tables

### POST /tables
Creates a new reservation

Example Body:
```
{
    data: {
        "table_name": "#1",
        "capacity": "6"
    }
}
```

## Technology Used
* React
* Bootstrap
* Express
* PostgreSQL
* Knex

## Installation
1. Fork and clone this repository.
2. Run cp ./back-end/.env.sample ./back-end/.env.
3. Update the ./back-end/.env file with the connection URL's to a PostgreSQL database instance.
4. Run cp ./front-end/.env.sample ./front-end/.env.
5. You should not need to make changes to the ./front-end/.env file unless you want to connect to a backend at a location other than http://localhost:5000.
6. Run npm install to install project dependencies.
7. Run npm run start:dev to start the server in development mode.
