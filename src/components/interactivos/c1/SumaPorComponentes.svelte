<script lang="ts">
  import { Tween } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import Manija from '../nucleo/Manija.svelte';
  import { tex } from '../../../lib/katex';
  import { reducirMovimiento } from '../../../lib/movimiento';
  import { angulo, fmt, magnitud, resta, suma, type Vec2 } from '../../../lib/vec';

  let A = $state<Vec2>({ x: 3, y: 1 });
  let B = $state<Vec2>({ x: -1, y: 2 });
  const C = $derived(suma(A, B));
  const O = { x: 0, y: 0 };

  // 0: vectores · 1: componentes en escalera · 2: componentes sobre los ejes · 3: resultante
  let fase = $state(0);
  const aparece = new Tween(0, { easing: cubicInOut });
  const desliza = new Tween(0, { easing: cubicInOut });
  const resultante = new Tween(0, { easing: cubicInOut });
  const ms = (n: number) => (reducirMovimiento() ? 0 : n);

  async function reproducir() {
    if (fase === 3) await reiniciar(true);
    fase = 1;
    await aparece.set(1, { duration: ms(700) });
    fase = 2;
    await desliza.set(1, { duration: ms(1100), delay: ms(250) });
    fase = 3;
    await resultante.set(1, { duration: ms(700) });
  }
  async function reiniciar(rapido = false) {
    fase = 0;
    const o = { duration: rapido ? 0 : ms(400) };
    await Promise.all([aparece.set(0, o), desliza.set(0, o), resultante.set(0, o)]);
  }

  const mezcla = (p: Vec2, q: Vec2, t: number): Vec2 => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });
  const t = $derived(desliza.current);

  // Colas de cada componente: en escalera (t = 0) o apiladas en los ejes (t = 1)
  const colaAy = $derived(mezcla({ x: A.x, y: 0 }, O, t));
  const colaBx = $derived(mezcla(A, { x: A.x, y: 0 }, t));
  const colaBy = $derived(mezcla({ x: C.x, y: A.y }, { x: 0, y: A.y }, t));

  const limitar = (p: Vec2): Vec2 => ({ x: Math.max(-4.5, Math.min(5.5, p.x)), y: Math.max(-2.5, Math.min(4.5, p.y)) });
  const ocupado = $derived(fase === 1 || fase === 2);
</script>

<div class="int">
  <div class="int-lienzo">
    <Plano x={[-5, 6]} y={[-3, 5]} rejilla={0.5} marcas={1} titulo="Suma de dos vectores por componentes" altoMax={420}>
      {#if resultante.current > 0.01}
        <Flecha desde={{ x: C.x, y: 0 }} hasta={C} color="var(--tinta-3)" grosor={1} discontinua opacidad={resultante.current} punta={0} />
        <Flecha desde={{ x: 0, y: C.y }} hasta={C} color="var(--tinta-3)" grosor={1} discontinua opacidad={resultante.current} punta={0} />
        <Flecha desde={O} hasta={C} color="var(--vec-r)" grosor={3.2} opacidad={resultante.current} />
        <Etiqueta en={C} t={'\\vec{R}'} color="var(--vec-r)" dx={C.x >= 0 ? 18 : -18} dy={-14} opacidad={resultante.current} />
      {/if}

      <Flecha desde={O} hasta={A} color="var(--vec-a)" opacidad={1 - 0.7 * aparece.current} />
      <Flecha desde={A} hasta={C} color="var(--vec-b)" opacidad={1 - 0.7 * aparece.current} />
      <Etiqueta en={{ x: A.x / 2, y: A.y / 2 }} t={'\\vec{A}'} color="var(--vec-a)" dx={-10} dy={-16} opacidad={1 - 0.7 * aparece.current} />
      <Etiqueta en={suma(A, { x: B.x / 2, y: B.y / 2 })} t={'\\vec{B}'} color="var(--vec-b)" dx={16} dy={-6} opacidad={1 - 0.7 * aparece.current} />

      {#if aparece.current > 0.01}
        <g style:opacity={aparece.current}>
          <Flecha desde={O} hasta={{ x: A.x, y: 0 }} color="var(--vec-a)" grosor={4} punta={10} />
          <Flecha desde={colaAy} hasta={suma(colaAy, { x: 0, y: A.y })} color="var(--vec-a)" grosor={4} punta={10} />
          <Flecha desde={colaBx} hasta={suma(colaBx, { x: B.x, y: 0 })} color="var(--vec-b)" grosor={4} punta={10} />
          <Flecha desde={colaBy} hasta={suma(colaBy, { x: 0, y: B.y })} color="var(--vec-b)" grosor={4} punta={10} />
        </g>
      {/if}

      {#if fase === 0}
        <Manija bind:pos={A} color="var(--vec-a)" restringir={limitar} nombre="punta de A" />
        <Manija pos={C} color="var(--vec-b)" restringir={limitar} nombre="punta de B" onmover={(p) => (B = resta(p, A))} />
      {/if}
    </Plano>
  </div>

  <div class="tabla-wrap">
    <table>
      <thead>
        <tr><th></th><th>Componente x</th><th>Componente y</th></tr>
      </thead>
      <tbody>
        <tr class="a"><td>{@html tex('\\vec A')}</td><td>{fmt(A.x, 1)}</td><td>{fmt(A.y, 1)}</td></tr>
        <tr class="b"><td>{@html tex('\\vec B')}</td><td>{fmt(B.x, 1)}</td><td>{fmt(B.y, 1)}</td></tr>
        <tr class="r" class:visible={fase >= 2}>
          <td>{@html tex('\\vec R')}</td>
          <td>{@html tex(`R_x = ${fmt(C.x, 1)}`)}</td>
          <td>{@html tex(`R_y = ${fmt(C.y, 1)}`)}</td>
        </tr>
      </tbody>
    </table>
    {#if fase === 3}
      <p class="final">
        {@html tex(`R = \\sqrt{R_x^2 + R_y^2} = ${fmt(magnitud(C), 2)}, \\quad \\theta = ${fmt(angulo(C), 1)}^\\circ`)}
      </p>
    {/if}
  </div>

  <div class="int-barra">
    <button type="button" class="boton primario" onclick={reproducir} disabled={ocupado}>
      {fase === 3 ? 'Repetir' : 'Sumar por componentes'}
    </button>
    {#if fase === 3}
      <button type="button" class="boton" onclick={() => reiniciar()}>Editar vectores</button>
    {/if}
    {#if fase === 0}<span class="empuje nota">Primero acomoda A y B a tu gusto</span>{/if}
  </div>
</div>

<style>
  .tabla-wrap {
    padding: 0 1.2rem 1rem;
    overflow-x: auto;
  }
  table {
    border-collapse: collapse;
    font-size: var(--t-sm);
    font-variant-numeric: tabular-nums;
    min-width: 20rem;
  }
  th,
  td {
    padding: 0.35rem 1rem 0.35rem 0;
    text-align: left;
    border-bottom: 1px solid var(--linea);
  }
  th {
    color: var(--tinta-3);
    font-weight: 600;
  }
  .a td:first-child :global(.katex) {
    color: var(--vec-a);
  }
  .b td:first-child :global(.katex) {
    color: var(--vec-b);
  }
  .r {
    opacity: 0;
    transition: opacity var(--dur-3) var(--ease);
  }
  .r.visible {
    opacity: 1;
  }
  .r td :global(.katex) {
    color: var(--vec-r);
  }
  .final {
    margin: 0.8rem 0 0;
    font-size: 1.05rem;
  }
  .nota {
    color: var(--tinta-3);
    font-size: var(--t-xs);
  }
  .boton:disabled {
    opacity: 0.45;
  }
</style>
