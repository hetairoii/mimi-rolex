const db = require("../models");
const Store = db.store;
const User = db.user.User;
const Op = db.Sequelize.Op;

const fs = require("fs");
//const storagePath = 'https://mimijoyeria.com/storage'
const storagePath = 'https://localhost:3000/storage'

exports.createTudor = (req, res) => {
    // Validate request
    const files = req.files
    const body = req.body

    if (!files) {
        res.status(404).send({
            message: "El formulario para insertar el reloj Tudor no ha sido recibido"
        })

    } else {

        for (let i = 0; i < 5; i++) {
            fs.rename(`${storagePath}/${files[i].filename}`, `${storagePath}/${req.body.serie}-${i + 1}.webp`,
                (error) => {
                    if (error) {
                        console.log(error);
                        return
                    }
                });
        }

        // Create object
        const watchmakingObject = {
            serie: body.serie,
            nombre: body.nombre,
            titulo: body.titulo,
            descripcion: body.descripcion,
            contenidoTabla: body.contenidoTabla,
            coleccion: body.coleccion,
            precio: body.precio,
            cantidadImagenes: 5,
            cantidad: 999,
            disponible: 1,
            tudorCollectionId: body.tudorCollectionId
        }


        Store.Watchmaking.create(watchmakingObject).then(() => {
            res.status(201).send("Reloj creado correctamente")
        }).catch(err => {
            res.send(err.message)
        })


    }

};