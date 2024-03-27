const uploadCloudinaryHelper = require("../../helpers/uploadCloudinary.helper");

module.exports.uploadSingle = async (req, res, next) => {
    if(req.file){
        const result = await uploadCloudinaryHelper(req.file.buffer);
        req.body[req.file.fieldname] = result;
    }
    next();
}