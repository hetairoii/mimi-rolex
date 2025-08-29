const uploadFiles = require("../middleware/store")
const existenceMiddleware = require("../middleware/verifyExistence")


module.exports = app => {
    const tudor = require('../controllers/tudorController')
    var router = require("express").Router()

    //Relojeria
    //router.get("/relojeria-slider", store.findRSlider)
    //router.get("/relojeria-tudor", store.findRMain)
    //router.put("/relojeria/:id",uploadFiles.any(), store.findR)
    //router.get("/relojeria/producto/:id", store.findDetailR)
    router.post("/tudor/add-watch", uploadFiles.any(), tudor.createTudor)

    app.use('/api', router)

}