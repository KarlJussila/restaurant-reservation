exports.up = function (knex) {
    const newTable = knex.raw(`
        create table "tables" (
            "table_id" serial primary key,
            "table_name" varchar(255),
            "capacity" integer,
            "reservation_id" INTEGER REFERENCES reservations(reservation_id),
            "created_at" timestamptz not null default CURRENT_TIMESTAMP,
            "updated_at" timestamptz not null default CURRENT_TIMESTAMP
        )
    `)

    return newTable;

    // return knex.schema.createTable("tables", (table) => {
    //     table.increments("table_id").primary();
    //     table.string("table_name");
    //     table.integer("capacity");
    //     table.integer("reservation_id")
    //         .references("reservation_id")
    //         .inTable("reservations");
    //     table.timestamps(true, true);
    // });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tables");
};
