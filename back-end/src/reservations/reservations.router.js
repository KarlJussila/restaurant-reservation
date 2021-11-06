const router = require("express").Router({ mergeParams: true });
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

const corsConfig = cors({ methods: ["GET", "PUT", "POST"] });

router.route("/:reservationId/status")
    .put(corsConfig, controller.updateStatus)
    .all(methodNotAllowed);

router.route("/:reservationId")
    .get(corsConfig, controller.read)
    .put(corsConfig, controller.update)
    .all(methodNotAllowed);

router.route("/")
    .get(corsConfig, controller.list)
    .post(corsConfig, controller.create)
    .all(methodNotAllowed);

module.exports = router;
