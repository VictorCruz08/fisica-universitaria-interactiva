<script lang="ts">
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import Poligono from '../nucleo/Poligono.svelte';
  import Punto from '../nucleo/Punto.svelte';
  import { tex } from '../../../lib/katex';
  import { animar } from '../../../lib/movimiento';
  import { fmt, magnitud, type Vec2 } from '../../../lib/vec';

  // Una cuadra = 100 m. Ruta por las calles desde casa hasta la panadería.
  const ida: Vec2[] = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 3, y: 3 },
    { x: 4, y: 3 },
  ];
  const ruta = [...ida, ...ida.slice(0, -1).reverse()];

  const tramos = ruta.slice(1).map((p, i) => magnitud({ x: p.x - ruta[i].x, y: p.y - ruta[i].y }));
  const largoIda = tramos.slice(0, ida.length - 1).reduce((a, b) => a + b, 0);
  const largoTotal = tramos.reduce((a, b) => a + b, 0);

  let s = $state(0); // distancia recorrida, en cuadras
  let cancelar: (() => void) | null = null;

  const posicion = (dist: number): Vec2 => {
    let resto = dist;
    for (let i = 0; i < tramos.length; i++) {
      if (resto <= tramos[i] || i === tramos.length - 1) {
        const t = tramos[i] === 0 ? 0 : Math.min(1, resto / tramos[i]);
        return { x: ruta[i].x + (ruta[i + 1].x - ruta[i].x) * t, y: ruta[i].y + (ruta[i + 1].y - ruta[i].y) * t };
      }
      resto -= tramos[i];
    }
    return ruta[ruta.length - 1];
  };

  const p = $derived(posicion(s));
  const recorrido = $derived.by(() => {
    const pts: Vec2[] = [ruta[0]];
    let acum = 0;
    for (let i = 0; i < tramos.length && acum + tramos[i] <= s + 1e-9; i++) {
      acum += tramos[i];
      pts.push(ruta[i + 1]);
    }
    pts.push(p);
    return pts;
  });
  const desp = $derived(magnitud(p));

  function ir(hasta: number) {
    cancelar?.();
    const inicio = s;
    const ms = Math.abs(hasta - inicio) * 520;
    cancelar = animar(ms, (t) => (s = inicio + (hasta - inicio) * t), (t) => t);
  }

  const manzanas: Vec2[][] = [];
  for (let i = -1; i < 5; i++)
    for (let j = -1; j < 4; j++) {
      const m = 0.12;
      manzanas.push([
        { x: i + m, y: j + m },
        { x: i + 1 - m, y: j + m },
        { x: i + 1 - m, y: j + 1 - m },
        { x: i + m, y: j + 1 - m },
      ]);
    }
</script>

<div class="int">
  <div class="int-lienzo">
    <Plano x={[-0.7, 4.9]} y={[-0.7, 3.7]} rejilla={false} ejes={false} titulo="Mapa de un barrio: ruta por las calles de casa a la panadería" altoMax={380}>
      {#snippet fondo()}
        {#each manzanas as m}
          <Poligono puntos={m} relleno="var(--fondo-hundido)" />
        {/each}
      {/snippet}

      <Poligono puntos={ida} cerrado={false} borde="var(--linea-fuerte)" grosor={5} />
      <Poligono puntos={recorrido} cerrado={false} borde="var(--ocre)" grosor={5} />
      <Flecha desde={{ x: 0, y: 0 }} hasta={p} color="var(--vec-a)" grosor={3} />

      <Etiqueta en={{ x: 0, y: 0 }} t={'\\text{casa}'} dy={20} dx={-6} tamano={14} color="var(--tinta-2)" />
      <Etiqueta en={{ x: 4, y: 3 }} t={'\\text{panadería}'} dy={-20} tamano={14} color="var(--tinta-2)" />
      {#if desp > 0.6}
        <Etiqueta en={{ x: p.x / 2, y: p.y / 2 }} t={'\\vec{d}'} color="var(--vec-a)" dx={-16} dy={-12} fondo />
      {/if}
      <Punto en={{ x: 0, y: 0 }} radio={5} color="var(--tinta-2)" />
      <Punto en={{ x: 4, y: 3 }} radio={5} color="var(--tinta-2)" />
      <Punto en={p} radio={7} color="var(--ocre)" />
    </Plano>
  </div>

  <div class="int-lectura">
    <span class="dato ocre">{@html tex(`\\text{distancia recorrida} = ${fmt(s * 100, 0)}\\ \\text{m}`)}</span>
    <span class="dato azul">{@html tex(`|\\vec d\\,| = ${fmt(desp * 100, 0)}\\ \\text{m}`)}</span>
  </div>

  <div class="int-barra">
    <button type="button" class="boton primario" onclick={() => ir(largoIda)} disabled={s >= largoIda - 1e-6 && s <= largoIda + 1e-6}>
      Caminar a la panadería
    </button>
    <button type="button" class="boton" onclick={() => ir(largoTotal)} disabled={s < largoIda - 1e-6 || s >= largoTotal - 1e-6}>
      Regresar a casa
    </button>
    <button type="button" class="boton empuje" onclick={() => { cancelar?.(); s = 0; }}>Reiniciar</button>
  </div>
</div>

<style>
  .dato.ocre :global(.katex) {
    color: var(--ocre);
  }
  .dato.azul :global(.katex) {
    color: var(--azul);
  }
  .boton:disabled {
    opacity: 0.4;
    cursor: default;
  }
</style>
