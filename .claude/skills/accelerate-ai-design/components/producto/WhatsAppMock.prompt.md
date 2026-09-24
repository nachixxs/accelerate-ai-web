Mock de producto. Es el layout C (PRODUCTO) y funciona sobre fondo claro u oscuro.

```jsx
<WhatsAppMock
  width={760}
  mensajes={[
    { from: "recibida", text: "Hola, ¿tienen turno para el jueves?", hora: "9:38" },
    { from: "enviada", text: "Sí: jueves 10:30 o 16:00. ¿Cuál te va?", hora: "9:38" },
  ]}
  chip={<Chip tone="acento" icon="zap" montado style={{position:"absolute", top:-30, left:-40}}>Respuesta en 4 s</Chip>}
/>
```

La última burbuja ya sangra el borde por defecto. Montá el chip sobre el borde **opuesto**.
