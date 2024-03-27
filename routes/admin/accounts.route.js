const express = require('express');
const router = express.Router();

const multer  = require('multer');

const storageMulter = require("../../helpers/storage-multer.helper");

const upload = multer({ storage: storageMulter() });


const controller = require('../../controllers/admin/accounts.controller');

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("avatar"),
    controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single("avatar"),
    controller.editPatch
);

module.exports = router;