const SettingGeneral = require("../../model/settings-general.model");
const systemConfig = require("../../config/system");

module.exports.general = async(req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});
    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    })
}

module.exports.generalPatch = async(req, res) => {
    try {
        if(req.file){
            req.body.logo = `/uploads/${req.file.filename}`;
        }
    
        const settingGeneral = await SettingGeneral.findOne({});
    
        if(!settingGeneral){
            const record = new SettingGeneral(req.body);
            await record.save();
        } else {
            await SettingGeneral.updateOne({
                _id: settingGeneral.id
            }, req.body);
        }
    
        req.flash("success", "Cập nhật setting thành công!");
    
        res.redirect(`/${systemConfig.prefixAdmin}/dashboard`); 
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
}