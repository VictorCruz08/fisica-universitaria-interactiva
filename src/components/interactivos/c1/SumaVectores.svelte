<script lang="ts">
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import Manija from '../nucleo/Manija.svelte';
  import Poligono from '../nucleo/Poligono.svelte';
  import { tex } from '../../../lib/katex';
  import { reducirMovimiento } from '../../../lib/movimiento';
  import { escala, fmt, magnitud, resta, suma, type Vec2 } from '../../../lib/vec';

  let A = $state<Vec2>({ x: 3, y: 1 });
  let B = $state<Vec2>({ x: 1, y: 2.5 });
  let conmutar = $state(false);

  const C = $derived(suma(A, B));
  const mA = $derived(magnitud(A));
  const mB = $derived(magnitud(B));
  const mC = $derived(magnitud(C));
  const minimo = $derived(Math.abs(mA - mB));
  const maximo = $derived(mA + mB);

  // La ruta alternativa (B primero) aparece con una transición suave.
  const alterna = new Tween(0, { duration: 600, easing: cubicOut });
  $effect(() => {
    alterna.set(conmutar ? 1 : 0, { duration: reducirMovimiento() ? 0 : 600 });
  });

  const limitar = (p: Vec2): Vec2 => ({ x: Math.max(-5.5, Math.min(6.5, p.x)), y: Math.max(-2.5, Math.min(5.5, p.y)) });
  const origen = { x: 0, y: 0 };

  // Posición del marcador en la recta numérica [0, max]
  const pct = (v: number) => `${(100 * v) / Math.max(maximo, 0.001)}%`;
</script>

<div class="int">
  <div class="int-lienzo">
    <Plano x={[-6, 7]} y={[-3, 6]} rejilla={0.5} titulo="Suma de dos vectores por el método cabeza-cola" altoMax={420}>
      {#if alterna.current > 0.01}
        <Poligono puntos={[origen, A, C, B]} relleno="var(--vec-r)" opacidad={0.06 * alterna.current} />
        <Flecha desde={origen} hasta={escala(alterna.current, B)} color="var(--vec-b)" discontinua opacidad={0.75 * alterna.current} />
        <Flecha desde={B} hasta={suma(B, escala(alterna.current, A))} color="var(--vec-a)" discontinua opacidad={0.75 * alterna.current} />
      {/if}

      <Flecha desde={origen} hasta={C} color="var(--vec-r)" grosor={3.2} />
      <Flecha desde={origen} hasta={A} color="var(--vec-a)" />
      <Flecha desde={A} hasta={C} color="var(--vec-b)" />

      <Etiqueta en={escala(0.5, A)} t={'\\vec{A}'} color="var(--vec-a)" dy={16} dx={8} fondo />
      <Etiqueta en={suma(A, escala(0.5, B))} t={'\\vec{B}'} color="var(--vec-b)" dx={18} fondo />
      <Etiqueta en={escala(0.5, C)} t={'\\vec{C}'} color="var(--vec-r)" dx={-18} dy={-12} fondo />

      <Manija bind:pos={A} color="var(--vec-a)" restringir={limitar} nombre="punta de A" />
      <Manija pos={C} color="var(--vec-b)" restringir={limitar} nombre="punta de B" onmover={(p) => (B = resta(p, A))} />
    </Plano>
  </div>

  <div class="int-lectura">
    <span>{@html tex(`A = ${fmt(mA, 2)}`)}</span>
    <span>{@html tex(`B = ${fmt(mB, 2)}`)}</span>
    <span class="r">{@html tex(`C = |\\vec A + \\vec B| = ${fmt(mC, 2)}`)}</span>
    <span class="tenue">{@html tex(`A + B = ${fmt(maximo, 2)}`)}</span>
  </div>

  <div class="recta" aria-hidden="true">
    <div class="pista">
      <div class="intervalo" style:left={pct(minimo)} style:width={`calc(${pct(maximo)} - ${pct(minimo)})`}></div>
      <div class="marcador" style:left={pct(mC)}><span>C</span></div>
    </div>
    <div class="extremos">
      <span>{@html tex(`|A-B| = ${fmt(minimo, 2)}`)}</span>
      <span>{@html tex(`A+B = ${fmt(maximo, 2)}`)}</span>
    </div>
  </div>

  <div class="int-barra">
    <button type="button" class="boton" aria-pressed={conmutar} onclick={() => (conmutar = !conmutar)}>
      {conmutar ? 'Ocultar' : 'Mostrar'} B + A
    </button>
    <span class="empuje nota">Arrastra las puntas de A y de B</span>
  </div>
</div>

<style>
  .r :global(.katex) {
    color: var(--verde);
  }
  .tenue {
    color: var(--tinta-3);
  }
  .nota {
    color: var(--tinta-3);
    font-size: var(--t-xs);
  }
  .recta {
    padding: 0.2rem 1.4rem 1rem;
  }
  .pista {
    position: relative;
    height: 6px;
    border-radius: 3px;
    background: var(--fondo-hundido);
    margin: 1.2rem 0 0.4rem;
  }
  .intervalo {
    position: absolute;
    top: 0;
    bottom: 0;
    border-radius: 3px;
    background: color-mix(in srgb, var(--verde) 30%, transparent);
  }
  .marcador {
    position: absolute;
    top: 50%;
    width: 14px;
    height: 14px;
    margin: -7px 0 0 -7px;
    border-radius: 50%;
    background: var(--verde);
    box-shadow: 0 0 0 3px var(--fondo-elevado);
  }
  .marcador span {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--fuente-texto);
    font-style: italic;
    font-size: var(--t-sm);
    color: var(--verde);
  }
  .extremos {
    display: flex;
    justify-content: space-between;
    font-size: 0.92rem;
    color: var(--tinta-3);
  }
</style>
