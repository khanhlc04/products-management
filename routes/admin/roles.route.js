const express = require('express');
const router = express.Router();

const validate = require('../../validates/admin/roles.validate')

const controller = require('../../controllers/admin/roles.controller');

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    validate.createPost,
    controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    validate.createPost,
    controller.editPatch);

router.get("/permissions", controller.permissions);

router.patch("/permissions", controller.permissionsPatch);

module.exports = router;