const knex = require("../db/connection");

function validateBody(request, response, next) {
    const { data: { table_name, capacity } = {} } = request.body;
    if (!table_name || table_name.length <= 1) {
        return next({
            status: 400,
            message: "table_name field must have at least two characters",
        });
    }
    if (typeof capacity !== "number" || capacity < 1) {
        return next({
            status: 400,
            message: "Table must have a capacity of at least one",
        });
    }
    next();
}

async function read(tableId) {
    const data = await knex("tables").select("*")
        .where({ table_id: tableId }).first();
    console.log(data);
    return data;
}

async function list() {
    return knex("tables").select("*").orderBy("table_name");
}

async function update(updatedTable) {
    const updatedTableResponse = await knex("tables")
        .select("*")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*");

        return updatedTableResponse[0];
}

async function create(newTable) {
    const result = await knex('tables').insert(newTable);
    return result;
}

module.exports = {
    read,
    list,
    update,
    create,
    validateBody
};
