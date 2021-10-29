const router = require("express").Router({ mergeParams: true });
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

const corsConfig = cors({ methods: ["GET", "PUT"] });

router.route("/:movieId/theaters")
    .get(corsConfig, controller.getTheaters)
    .all(methodNotAllowed);

router.route("/:movieId/reviews")
    .get(corsConfig, controller.getReviews)
    .all(methodNotAllowed);

router.route("/:movieId")
    .get(corsConfig, controller.read)
    .all(methodNotAllowed);

router.route("/")
    .get(corsConfig, controller.list)
    .all(methodNotAllowed);

module.exports = router;
