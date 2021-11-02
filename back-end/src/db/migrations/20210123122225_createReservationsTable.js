exports.up = function (knex) {
    const newTable = knex.raw(`
        create table "reservations" (
            "reservation_id" serial primary key,
            "first_name" varchar(255),
            "last_name" varchar(255),
            "mobile_number" varchar(255),
            "reservation_date" date,
            "reservation_time" time,
            "people" integer,
            "status" varchar(255) default 'booked',
            "created_at" timestamptz not null default CURRENT_TIMESTAMP,
            "updated_at" timestamptz not null default CURRENT_TIMESTAMP
        )
    `);
    return newTable;

  //   return knex.schema.createTable("reservations", (table) => {
  //       table.increments("reservation_id").primary();
  //       table.string("first_name");
  //       table.string("last_name");
  //       table.string("mobile_number");
  //       table.date("reservation_date");
  //       table.time("reservation_time");
  //       table.integer("people");
  //       table.string("status");
  //       table.timestamps(true, true);
  // });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};
