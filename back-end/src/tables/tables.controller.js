const service = require("./tables.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("../reservations/reservations.service");

async function tableExists(req, res, next) {
    const { tableId } = req.params;

    const table = await service.read(tableId);
    if (table) {
        res.locals.table = table;
        return next();
    }
    return next({ status: 404, message: `Table ${tableId} cannot be found.` });
}

async function getReservation(req, res, next, reservation_id) {
    const reservation = await reservationsService.read(reservation_id);
    if (!reservation) {
        return next({
            status: 404,
            message: `Reservation ${reservation_id} cannot be found.`
        });
    }
    return reservation;
    next();
}

async function validateSeat(request, response, next) {
    const { data: { reservation_id } = {} } = request.body;
    if (!reservation_id) {
        return next({
            status: 400,
            message: "No reservation_id was supplied",
        });
    }
    const reservation = await getReservation(request, response, next, reservation_id);
    if (reservation.people > response.locals.table.capacity) {
        return next({
            status: 400,
            message: `Table has insufficient capacity`
        });
    }
    if (reservation.status === "seated") {
        return next({
            status: 400,
            message: `Reservation is already seated`
        });
    }
    if (response.locals.table.reservation_id) {
        return next({
            status: 400,
            message: `Table is already occupied`
        });
    }
    response.locals.reservation = reservation;
    next();
}

async function read(req, res, next) {
    res.json({ data: await res.locals.table });
}

async function list(req, res, next) {
    res.json({ data: await service.list() });
}

async function update(req, res) {
    const updatedTable = req.body.data;
    updatedTable.table_id = req.params.tableId;
    const data = await service.update(updatedTable);
    res.json({ data });
}

async function seat(req, res) {
    const updatedTable = { reservation_id: req.body.data.reservation_id};
    updatedTable.table_id = req.params.tableId;
    reservationsService.update({reservation_id: res.locals.reservation.reservation_id, status: "seated"});
    const data = await service.update(updatedTable);
    res.json({ data });
}

async function create(req, res) {
    const result = service.create(req.body.data);
    res.status(201).json({ data: req.body.data });
}

async function unseat(req, res, next) {
    if (!res.locals.table.reservation_id) {
        return next({
            status: 400,
            message: `${res.locals.table.table_name} is not occupied`
        });
    }
    const updatedTable = { reservation_id: null };
    updatedTable.table_id = req.params.tableId;
    reservationsService.update({reservation_id: res.locals.table.reservation_id, status: "finished"});
    const data = await service.update(updatedTable);
    res.json({ data });
}

module.exports = {
    read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
    list: asyncErrorBoundary(list),
    update: [asyncErrorBoundary(tableExists), asyncErrorBoundary(update)],
    create: [service.validateBody, asyncErrorBoundary(create)],
    seat: [asyncErrorBoundary(tableExists), asyncErrorBoundary(validateSeat), asyncErrorBoundary(seat)],
    unseat: [asyncErrorBoundary(tableExists), asyncErrorBoundary(unseat)]
};
