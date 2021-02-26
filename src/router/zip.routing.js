const express = require("express");
const router = express.Router();
const _zipController = require("../controller/zip.controller");

router.get("/", _zipController.getZip);
router.post("/", _zipController.createZip);

module.exports = router;
