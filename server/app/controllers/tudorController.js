const db = require("../models");
const Store = db.store;
const User = db.user.User;
const Op = db.Sequelize.Op;

const fs = require("fs");
//const storagePath = 'https://mimijoyeria.com/storage'
const storagePath = 'https://localhost:3000/storage'

async function getAllWatches() {
    const watches = await Store.Watchmaking.findAll();
    return watches.map(watch => ({
        serie: watch.serie,
        nombre: watch.nombre,
        precio: watch.precio,
        disponible: watch.disponible
    }));
}

exports.getAll = async (req, res) => {
    try {
        const relojes = await getAllWatches();
        res.status(200).json({ relojes });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

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

exports.verifyTudor = async (req, res) => {
    const activados = req.body.activados;
    const allWatches = await getAllWatches();

    let toActivate = [];
    let toDesactivate = [];

    const inBD = allWatches.map(watch => watch.serie);

    const porAgregar = activados.filter(serie => !inBD.includes(serie));

    for (const watch of allWatches) {
        const nuevoDisponible = activados.includes(watch.serie) ? 1 : 0;
        if (watch.disponible !== nuevoDisponible) {
            await Store.Watchmaking.update(
                { disponible: nuevoDisponible },
                { where: { serie: watch.serie } }
            );
        }
        if (nuevoDisponible === 1) {
            toActivate.push(watch.serie);
        } else {
            toDesactivate.push(watch.serie);
        }
    }

    res.status(200).json({
        activados: toActivate,
        desactivados: toDesactivate,
        por_agregar: porAgregar
    });

};

exports.updateTudorWatch = (req, res) => {
    const id = parseInt(req.params.id);
    const body = req.body;

    const updatedFields = {
        nombre: body.nombre,
        serie: body.serie,
        precio: body.precio
    };

    Store.Watchmaking.update(updatedFields, {
        where: { id: id }
    }).then(([affectedRows]) => {
        if (affectedRows === 0) {
            res.status(404).send("No se encontró el reloj o los datos son iguales.");
        } else {
            res.status(200).send("Reloj actualizado correctamente");
        }
    }).catch(err => {
        res.status(500).send(err.message);
    });
}

exports.updateTudorStatus = (req, res) => {
    const id = parseInt(req.params.id);
    const body = req.body;

    const updatedFields = {
        disponible: body.disponible
    };

    Store.Watchmaking.update(updatedFields, {
        where: { id: id }
    }).then(([affectedRows]) => {
        if (affectedRows === 0) {
            res.status(404).send("No se encontró el reloj o los datos son iguales.");
        } else {
            res.status(200).send("Reloj actualizado correctamente");
        }
    }).catch(err => {
        res.status(500).send(err.message);
    });
}