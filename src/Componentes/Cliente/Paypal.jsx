// src/components/PaypalPayment.js
import React, { useEffect, useRef } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PaypalPayment = () => {
  const paypalRef = useRef();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=AewQ0cTngQ4ksEMKHcFfKu3GulC2BCXfxqqDsLp7zcmKn4UA-D3lAF4fW2pQ4_nYCZ4ELKzfoJeHI5Hr&currency=MXN";
    script.addEventListener("load", () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: "" // 💲 Precio del producto en MXN
                },
                description: ""
              }]
            });
          },
          onApprove: async (data, actions) => {
            const details = await actions.order.capture();
            alert(`✅ Pago realizado por: ${details.payer.name.given_name}`);
            console.log("Detalles del pago:", details);
            // Aquí puedes guardar los datos en tu base de datos
          },
          onError: (err) => {
            console.error("❌ Error en el pago:", err);
            alert("Ocurrió un error con el pago");
          }
        }).render(paypalRef.current);
      }
    });
    document.body.appendChild(script);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 4
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Realiza tu pago con PayPal
        </Typography>
        <div ref={paypalRef} />
      </Paper>
    </Box>
  );
};

export default PaypalPayment;
