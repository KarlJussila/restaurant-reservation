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
    return next({ status: 404, message: `Table cannot be found.` });
}

async function validateSeat(request, response, next) {
    const { data: { reservation_id } = {} } = request.body;
    if (!reservation_id) {
        return next({
            status: 400,
            message: "No reservation id was supplied",
        });
    }
    const reservation = await reservationsService.read(reservation_id);
    if (!reservation) {
        return next({
            status: 404,
            message: `Reservation cannot be found.`
        });
    }
    if (reservation.people > response.locals.table.capacity) {
        return next({
            status: 400,
            message: `Table has insufficient capacity`
        });
    }
    if (response.locals.table.reservation_id) {
        return next({
            status: 400,
            message: `Table is already occupied`
        });
    }
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

async function create(req, res) {
    const result = service.create(req.body.data);
    res.status(201).json({ message: "Created" });
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
    const data = await service.update(updatedTable);
    res.json({ data });
}

module.exports = {
    read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
    list: asyncErrorBoundary(list),
    update: [asyncErrorBoundary(tableExists), asyncErrorBoundary(update)],
    create: [service.validateBody, asyncErrorBoundary(create)],
    seat: [asyncErrorBoundary(tableExists), asyncErrorBoundary(validateSeat), asyncErrorBoundary(update)],
    unseat: [asyncErrorBoundary(tableExists), asyncErrorBoundary(unseat)]
};
