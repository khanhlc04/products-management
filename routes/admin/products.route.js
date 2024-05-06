const express = require("express");
const router = express.Router();

const validate = require('../../validates/admin/products.validate');

const multer  = require('multer');

// const storageMulter = require("../../helpers/storage-multer.helper");

// const upload = multer({ storage: storageMulter() });

const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

const controller = require('../../controllers/admin/products.controller');

router.get('/', controller.index);

router.patch(
    '/change-status/:status/:id',
    controller.changeStatus
);

router.patch('/change-multi', controller.changeMulti);

router.patch('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);

router.post(
    '/create',
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.createPost
);

router.get('/edit/:id', controller.edit);

router.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.editPatch
)

router.get(
    '/detail/:id',
    controller.detail
)

module.exports = router;