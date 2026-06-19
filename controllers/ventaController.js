const db = require("../config/db");


// Crear venta
const createVenta = (req, res) => {


  const { usuario_id, productos } = req.body;



  // Validar que existan productos

  if (!productos || productos.length === 0) {

    return res.status(400).json({

      message: "No hay productos para comprar"

    });

  }





  const total = productos.reduce(

    (acc, item) =>
      acc + Number(item.price),

    0

  );






  // Crear venta

  db.query(

    "INSERT INTO ventas (usuario_id, total) VALUES (?, ?)",

    [usuario_id, total],

    (err, ventaResult) => {



      if (err) {

        return res.status(500).json(err);

      }




      const ventaId = ventaResult.insertId;





      // Crear detalles

      const detalles = productos.map(

        (producto) => [

          ventaId,

          producto.id,

          1,

          producto.price

        ]

      );






      db.query(

        `INSERT INTO detalle_ventas
        (venta_id, juego_id, cantidad, precio)
        VALUES ?`,

        [detalles],

        (err) => {



          if (err) {

            return res.status(500).json(err);

          }





          // 🔥 DESCONTAR STOCK

          productos.forEach((producto) => {



            db.query(

              `
              UPDATE juegos
              SET stock = stock - 1
              WHERE id = ?
              AND stock > 0
              `,

              [producto.id],


              (err) => {


                if (err) {

                  console.error(
                    "Error descontando stock:",
                    err
                  );

                }


              }

            );


          });







          res.status(201).json({

            message:
            "Compra realizada correctamente"


          });



        }

      );



    }

  );

};






// Historial de compras

const getVentasByUser = (req, res) => {


  const { usuarioId } = req.params;



  db.query(

    `
    SELECT

      v.id AS venta_id,

      v.total,

      v.fecha,

      j.titulo AS title,

      j.imagen AS image,

      dv.cantidad,

      dv.precio


    FROM ventas v


    INNER JOIN detalle_ventas dv
    ON v.id = dv.venta_id


    INNER JOIN juegos j
    ON j.id = dv.juego_id


    WHERE v.usuario_id = ?


    ORDER BY v.fecha DESC

    `,


    [usuarioId],


    (err, results) => {


      if (err) {

        return res.status(500).json(err);

      }


      res.json(results);


    }


  );


};


module.exports = {

  createVenta,

  getVentasByUser

};