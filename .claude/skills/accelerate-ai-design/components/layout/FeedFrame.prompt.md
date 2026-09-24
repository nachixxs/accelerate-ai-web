Lienzo de carrusel/placa. Los hijos se posicionan `absolute` dentro del frame; los márgenes son 90px laterales y superior.

```jsx
<FeedFrame fondo="oscuro" index={1} total={5} scale={0.4}>
  <Glow tone="azul" corner="top-right" size={1100} />
  <Glow tone="cian" corner="top-right" size={820} />
  <div style={{position:"absolute", left:90, right:90, bottom:330}}>
    <h1 data-layer="hook" className="t-hook" style={{color:"var(--text-heading-light)", margin:0}}>…</h1>
  </div>
</FeedFrame>
```

No pongas nada en los últimos 120px. Usá `scale` para previsualizar; exportá a `scale={1}`.
