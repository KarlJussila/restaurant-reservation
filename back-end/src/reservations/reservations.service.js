const knex = require("../db/connection");

function validateStatus(req, res, next) {
    const validStatus = ["booked", "seated", "finished", "cancelled"]
    const updatedReservation = req.body.data;
    if (!validStatus.includes(updatedReservation.status)) {
        return next({
            status: 400,
            message: `Invalid status: ${updatedReservation.status}`,
        });
    }
    next();
}

function validateBody(request, response, next) {
    const { data: { first_name, last_name, mobile_number, reservation_date, reservation_time, people, status } = {} } = request.body;
    if (!first_name) {
        return next({
            status: 400,
            message: "Reservation must include a first_name field",
        });
    }
    if (!last_name) {
        return next({
            status: 400,
            message: "Reservation must include a last_name field",
        });
    }
    if (!mobile_number) {
        return next({
            status: 400,
            message: "Reservation must include a mobile_number field",
        });
    }
    if (!reservation_date) {
        return next({
            status: 400,
            message: "Reservation must include a reservation_date field",
        });
    }
    if (!reservation_time) {
        return next({
            status: 400,
            message: "Reservation must include a reservation_time field",
        });
    }
    if (!people || typeof people !== "number") {
        return next({
            status: 400,
            message: "Reservation must include a number of people greater than 0",
        });
    }
    if (status && (status === "finished" || status === "seated")) {
        return next({
            status: 400,
            message: `Reservation cannot be created with a status of ${status}`,
        });
    }
    if (!Date.parse(reservation_date)) {
        return next({
            status: 400,
            message: "reservation_date must be a valid date",
        });
    }
    if (!Date.parse(`${reservation_date.split("T")[0]}T${reservation_time}`)) {
        return next({
            status: 400,
            message: "reservation_time must be a valid time",
        });
    }
    const date = new Date(`${reservation_date}T${reservation_time}`);
    if (date < new Date()) {
        return next({
            status: 400,
            message: "Reservation must be in the future",
        });
    }
    if (date.getDay() === 2) {
        return next({
            status: 400,
            message: "Restaurant is closed on Tuesdays",
        });
    }
    if (date < new Date(`${reservation_date}T10:30`)) {
        return next({
            status: 400,
            message: "Restaurant is closed before 10:30 AM",
        });
    }
    if (date > new Date(`${reservation_date}T21:30`)) {
        return next({
            status: 400,
            message: "Reservation cannot be after 9:30 PM",
        });
    }
    next();
}

async function read(reservationId) {
    const data = await knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .first();
    console.log(reservationId, data);
    if (!data) {
        console.log(await knex("reservations").select("*"));
    }
    return data;
}

async function listByPhoneNumber(mobile_number) {
    const data = await knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
    return data;
}

async function list(req, res) {
    let reservation_date = (new Date()).toISOString().split('T')[0];
    if (req.query.date) reservation_date = req.query.date;
    return knex("reservations")
        .select("*")
        .where({ reservation_date })
        .whereNot({ status: "finished" })
        .orderBy("reservation_time");
}

async function update(updatedReservation) {
    console.log("Updated:", updatedReservation);
    const updatedReservationResponse = await knex("reservations")
        .select("*")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*");

        return updatedReservationResponse[0];
}

async function create(newReservation) {
    const result = await knex('reservations').insert(newReservation);
    return result;
}

module.exports = {
    read,
    listByPhoneNumber,
    list,
    update,
    create,
    validateBody,
    validateStatus
};
