const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/setting.controller');

const multer  = require('multer');

const storageMulter = require("../../helpers/storage-multer.helper");

const upload = multer({ storage: storageMulter() });

router.get("/general", controller.general);

router.patch(
    "/general",
    upload.single("logo"),
    controller.generalPatch
);
  
module.exports = router;