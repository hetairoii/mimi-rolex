const uploadFiles = require("../middleware/store")

module.exports = app => {
    const tudor = require('../controllers/tudorController')
    var router = require("express").Router()

    router.get("/tudor/admin/get-all", tudor.getAll)
    router.patch("/tudor/admin/update-watch/:id", uploadFiles.any(), tudor.updateTudorWatch)
    router.patch("/tudor/admin/update-status/:id", uploadFiles.any(), tudor.updateTudorStatus)
    router.post("/tudor/verify", uploadFiles.any(), tudor.verifyTudor)
    router.post("/tudor/add-watch", uploadFiles.any(), tudor.createTudor)

    app.use('/api', router)

}