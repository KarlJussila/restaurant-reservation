const knex = require("../db/connection");

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

async function readByPhoneNumber(phoneNumber) {
    const data = await knex("reservations").select(
        "reservation_id as id",
        "first_name",
        "last_name",
        "mobile_number",
        "reservation_date",
        "reservation_time",
        "people",
        "status"
    ).where({ mobile_number: phoneNumber }).first();
    console.log(data);
    return data;
}

async function list(req, res) {
    const reservation_date = (new Date()).toISOString().split('T')[0];
    if (req.query.date) reservation_date = req.query.date;
    return knex("reservations")
        .select("*")
        .where({ reservation_date });
}

async function update(updatedReservation) {
    const updatedReservationResponse = await knex("reservations")
        .select("*")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*");

        return updatedReservationResponse[0];
}

module.exports = {
    read,
    readByPhoneNumber,
    list,
    update
};
