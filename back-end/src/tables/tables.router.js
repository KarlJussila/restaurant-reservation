const router = require("express").Router({ mergeParams: true });
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

const corsConfig = cors({ methods: ["GET", "PUT", "POST", "DELETE"] });

router.route("/:tableId/seat")
    .put(corsConfig, controller.seat)
    .delete(corsConfig, controller.unseat)
    .all(methodNotAllowed);

router.route("/:tableId")
    .get(corsConfig, controller.read)
    .put(corsConfig, controller.update)
    .all(methodNotAllowed);

router.route("/")
    .get(corsConfig, controller.list)
    .post(corsConfig, controller.create)
    .all(methodNotAllowed);

module.exports = router;
