const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reservationExists(req, res, next) {
    const { reservationId } = req.params;

    const reservation = await service.read(reservationId);
    if (reservation) {
        res.locals.reservation = reservation;
        return next();
    }
    return next({ status: 404, message: `Reservation ${reservationId} cannot be found.` });
}

async function reservationNotFinished(req, res, next) {
    if (res.locals.reservation.status === "finished") {
        return next({
            status: 400,
            message: `Reservation is already finished and cannot be updated`
        });
    }
    next();
}

async function read(req, res, next) {
    res.json({ data: await res.locals.reservation });
}

async function list(req, res, next) {
    const { mobile_number } = req.query;
    if (mobile_number) {
        return res.json({ data: await service.listByPhoneNumber(mobile_number) })
    }
    res.json({ data: await service.list(req, res) });
}

async function update(req, res) {
    const updatedReservation = req.body.data;
    updatedReservation.reservation_id = req.params.reservationId;
    const data = await service.update(updatedReservation);
    res.json({ data });
}

async function updateStatus(req, res) {
    const updatedReservation = { status: req.body.data.status };
    updatedReservation.reservation_id = req.params.reservationId;
    const data = await service.update(updatedReservation);
    res.json({ data });
}

async function create(req, res) {
    const newReservation = req.body.data;
    const result = await service.create(newReservation);
    newReservation.reservation_id = result[0];
    res.status(201).json({ data: req.body.data });
}

module.exports = {
    read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
    list: asyncErrorBoundary(list),
    update: [service.validateBody, asyncErrorBoundary(reservationExists), asyncErrorBoundary(update)],
    updateStatus: [asyncErrorBoundary(reservationExists), service.validateStatus, reservationNotFinished, asyncErrorBoundary(updateStatus)],
    create: [service.validateBody, asyncErrorBoundary(create)]
};
