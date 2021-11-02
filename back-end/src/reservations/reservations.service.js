const knex = require("../db/connection");

function validateBody(request, response, next) {
    const { data: { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = {} } = request.body;
    if (!first_name) {
        return next({
            status: 400,
            message: "Reservation must include a first name",
        });
    }
    if (!last_name) {
        return next({
            status: 400,
            message: "Reservation must include a last name",
        });
    }
    if (!mobile_number) {
        return next({
            status: 400,
            message: "Reservation must include a mobile number",
        });
    }
    if (!reservation_date) {
        return next({
            status: 400,
            message: "Reservation must include a date",
        });
    }
    if (!reservation_time) {
        return next({
            status: 400,
            message: "Reservation must include a time",
        });
    }
    const date = new Date(`${reservation_date}T${reservation_time}`);
    if (date < new Date()) {
        return next({
            status: 400,
            message: "Reservation must be in the future",
        });
    }
    if (date.getDay() === 1) {
        return next({
            status: 400,
            message: "Restaurant is closed on Tuesdays",
        });
    }
    const time = parseInt(reservation_time.split(":").join(""));
    if (time < 103000) {
        return next({
            status: 400,
            message: "Restaurant is closed before 10:30 AM",
        });
    }
    if (time > 213000) {
        return next({
            status: 400,
            message: "Reservation cannot be after 9:30 PM",
        });
    }
    if (!people) {
        return next({
            status: 400,
            message: "Reservation must include a number of people greater than 0",
        });
    }
    next();
}

async function read(reservationId) {
    const data = await knex("reservations").select(
        "reservation_id as id",
        "first_name",
        "last_name",
        "mobile_number",
        "reservation_date",
        "reservation_time",
        "people",
        "status"
    ).where({ reservation_id: reservationId }).first();
    console.log(data);
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
        .orderBy("reservation_time");
}

async function update(updatedReservation) {
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
    validateBody
};
