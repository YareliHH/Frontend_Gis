/*asi lo tengo

router.post('/comprar', verifyToken, async (req, res) => {
  const { productos, total, metodoPago, direccionEnvio } = req.body;
  const usuario_id = req.usuario.id;

  if (!productos || productos.length === 0) {
    return res.status(400).json({ message: 'El carrito está vacío' });
  }

  const estadoVenta = (metodoPago == 4 || metodoPago == 3) ? 'pendiente' : 'pagado';

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Insertar la venta
    const [ventaResult] = await connection.query(
      INSERT INTO ventas (usuario_id, total, metodo_pago_id, direccion_envio, estado) VALUES (?, ?, ?, ?, ?),
      [usuario_id, total, metodoPago, direccionEnvio || null, estadoVenta]
    );
    const venta_id = ventaResult.insertId;

    // Insertar productos en detalle_ventas
    const valoresProductos = productos.map(p => [
      venta_id,
      p.producto_id || null,
      p.variante_id || null,
      p.cantidad,
      p.precio_venta
    ]);
    await connection.query(
      INSERT INTO detalle_ventas (venta_id, producto_id, variante_id, cantidad, precio_unitario) VALUES ?,
      [valoresProductos]
    );

    // Eliminar carrito del usuario
    await connection.query(
      DELETE FROM productos_carrito WHERE usuario_id = ?,
      [usuario_id]
    );

    // Registrar historial de ventas
    await connection.query(
      INSERT INTO ventas_historial (venta_id, estado_anterior, estado_nuevo, cambio_por) VALUES (?, ?, ?, ?),
      [venta_id, 'N/A', estadoVenta, 'Sistema']
    );

    // Confirmar transacción
    await connection.commit();

    // Si es Mercado Pago, crear preferencia y responder con init_point
    if (metodoPago == 4) {
      const preference = {
        items: productos.map(p => ({
          title: p.nombre || 'Producto',
          quantity: p.cantidad,
          unit_price: p.precio_venta,
          currency_id: 'MXN'
        })),
        back_urls: {
          success: 'https://api-libreria.vercel.app/api/verificar-pago',
          failure: 'https://api-libreria.vercel.app/api/verificar-pago',
          pending: 'https://api-libreria.vercel.app/api/verificar-pago'
        },
        auto_return: 'approved',
        external_reference: venta_id.toString()
      };

      try {
        const response = await mercadopago.preferences.create(preference);
        connection.release();
        return res.json({
          message: 'Compra registrada, redirige a Mercado Pago',
          init_point: response.body.init_point
        });
      } catch (error) {
        console.error('Error creando preferencia Mercado Pago:', error);
        await connection.rollback();
        connection.release();
        return res.status(500).json({ message: 'Error creando preferencia de pago' });
      }
    }

    // Si es pago en efectivo (3)
    if (metodoPago == 3) {
      connection.release();
      return res.json({
        message: 'Compra registrada con pago en efectivo, pendiente por confirmar',
        redirect: '/pago-pendiente'
      });
    }

    // Para otros métodos de pago
    connection.release();
    return res.json({ message: 'Compra realizada con éxito' });

  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
        connection.release();
      } catch (rollbackError) {
        console.error('Error al hacer rollback:', rollbackError);
      }
    }
    console.error('Error en la compra:', error);
    return res.status(500).json({ message: 'Error al procesar la compra' });
  }
});*/