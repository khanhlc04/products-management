const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/my-account.controller');

const multer  = require('multer');

const storageMulter = require("../../helpers/storage-multer.helper");

const upload = multer({ storage: storageMulter() });

router.get("/", controller.index);

router.get("/edit", controller.edit);

router.patch(
    "/edit",
    upload.single("avatar"),
    controller.editPatch
);

module.exports = router;