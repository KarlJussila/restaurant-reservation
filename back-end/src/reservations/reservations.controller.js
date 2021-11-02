const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reservationExists(req, res, next) {
    const { reservationId } = req.params;

    const reservation = await service.read(reservationId);
    if (reservation) {
        res.locals.reservation = reservation;
        return next();
    }
    return next({ status: 404, message: `Reservation cannot be found.` });
}

async function read(req, res, next) {
    res.json({ data: await res.locals.reservation });
}

async function list(req, res, next) {
    const { mobile_phone } = req.query;
    if (mobile_phone) {
        return res.json({ data: await service.listByPhoneNumber(mobile_phone) })
    }
    res.json({ data: await service.list(req, res) });
}

async function update(req, res) {
    const updatedReservation = req.body.data;
    updatedReservation.reservation_id = req.params.reservationId;
    const data = await service.update(updatedReservation);
    res.json({ data });
}

async function create(req, res) {
    const result = service.create(req.body.data);
    res.status(201).json({ message: "Created" });
}

module.exports = {
    read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
    list: asyncErrorBoundary(list),
    update: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(update)],
    create: [service.validateBody, asyncErrorBoundary(create)]
};
