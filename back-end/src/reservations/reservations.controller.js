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
    res.json({ data: await service.list(req, res) });
}

async function update(req, res) {
  res.json({ data: await service.update(req.body) });
}

module.exports = {
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    list,
    getTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(getTheaters)],
    getReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(getReviews)]
};
