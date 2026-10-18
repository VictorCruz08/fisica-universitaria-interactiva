<script lang="ts">
  import { Tween } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import Escena3D from '../nucleo/Escena3D.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import Poligono from '../nucleo/Poligono.svelte';
  import { tex } from '../../../lib/katex';
  import { reducirMovimiento } from '../../../lib/movimiento';
  import { RAD, fmt, type Vec3 } from '../../../lib/vec';

  let a = $state(3);
  let b = $state(2.5);
  let phi = $state(60);
  let invertido = $state(false);

  // Los dos vectores en el plano xy; A sobre el eje x.
  const A = $derived<Vec3>({ x: a, y: 0, z: 0 });
  const B = $derived<Vec3>({ x: b * Math.cos(phi * RAD), y: b * Math.sin(phi * RAD), z: 0 });
  const magC = $derived(a * b * Math.sin(phi * RAD));

  const signo = new Tween(1, { easing: cubicInOut });
  $effect(() => {
    signo.set(invertido ? -1 : 1, { duration: reducirMovimiento() ? 0 : 800 });
  });

  // C se dibuja a escala reducida para que quepa en la escena.
  const kC = 0.3;
  const C = $derived<Vec3>({ x: 0, y: 0, z: signo.current * magC * kC });

  // Flecha curva que indica el giro "del primero hacia el segundo"
  const giro = $derived.by(() => {
    const r = 1.1;
    const desde = invertido ? phi : 0;
    const hasta = invertido ? 0 : phi;
    const pts: Vec3[] = [];
    const n = 24;
    for (let i = 0; i <= n; i++) {
      const t = (desde + ((hasta - desde) * i) / n) * RAD;
      pts.push({ x: r * Math.cos(t), y: r * Math.sin(t), z: 0 });
    }
    return pts;
  });

  const primero = $derived(invertido ? 'B' : 'A');
  const segundo = $derived(invertido ? 'A' : 'B');
</script>

<div class="int">
  <div class="int-lienzo">
    <Escena3D titulo="Producto vectorial: vector perpendicular al plano de A y B" tamano={3.1} alto={400} elevacion={30} azimut={-38}>
      <Poligono
        puntos={[{ x: 0, y: 0, z: 0 }, A, { x: A.x + B.x, y: A.y + B.y, z: 0 }, B]}
        relleno="var(--vec-r)"
        borde="var(--vec-r)"
        grosor={1}
        opacidad={0.16}
      />
      <Poligono puntos={giro} cerrado={false} borde="var(--ocre)" grosor={2} />
      {#if giro.length > 2 && phi > 12}
        <Flecha desde={giro[giro.length - 3]} hasta={giro[giro.length - 1]} color="var(--ocre)" grosor={2} punta={10} />
      {/if}
      <Flecha desde={{ x: 0, y: 0, z: 0 }} hasta={A} color="var(--vec-a)" grosor={3} />
      <Flecha desde={{ x: 0, y: 0, z: 0 }} hasta={B} color="var(--vec-b)" grosor={3} />
      <Flecha desde={{ x: 0, y: 0, z: 0 }} hasta={C} color="var(--vec-r)" grosor={3.4} />
      <Etiqueta en={A} t={'\\vec{A}'} color="var(--vec-a)" dx={10} dy={16} />
      <Etiqueta en={B} t={'\\vec{B}'} color="var(--vec-b)" dx={16} dy={-8} />
      {#if Math.abs(C.z) > 0.3}
        <Etiqueta en={C} t={invertido ? '\\vec{B}\\times\\vec{A}' : '\\vec{A}\\times\\vec{B}'} color="var(--vec-r)" dx={44} dy={C.z > 0 ? -6 : 6} fondo />
      {/if}
    </Escena3D>
  </div>
  <div class="int-lectura">
    <span>{@html tex(`|\\vec ${primero}\\times\\vec ${segundo}| = AB\\sin\\phi = ${fmt(magC, 2)}`)}</span>
    <span class="tenue">{@html tex('= \\text{área del paralelogramo}')}</span>
  </div>
  <p class="regla">
    Curva los dedos de la mano derecha desde {@html tex(`\\vec ${primero}`)} hacia {@html tex(`\\vec ${segundo}`)} (flecha ocre):
    el pulgar apunta {invertido ? 'hacia abajo' : 'hacia arriba'}, en la dirección de {@html tex(`\\vec ${primero}\\times\\vec ${segundo}`)}.
  </p>
  <div class="int-barra deslizadores">
    <label class="int-deslizador"><span>{@html tex('\\phi')}</span><input type="range" min="0" max="180" step="5" bind:value={phi} /><output>{phi}°</output></label>
    <label class="int-deslizador"><span>{@html tex('A')}</span><input type="range" min="1" max="3.5" step="0.5" bind:value={a} /><output>{a}</output></label>
    <label class="int-deslizador"><span>{@html tex('B')}</span><input type="range" min="1" max="3.5" step="0.5" bind:value={b} /><output>{b}</output></label>
    <div class="int-segmentado" role="group" aria-label="Orden de los factores">
      <button type="button" aria-pressed={!invertido} onclick={() => (invertido = false)}>A × B</button>
      <button type="button" aria-pressed={invertido} onclick={() => (invertido = true)}>B × A</button>
    </div>
  </div>
</div>

<style>
  .tenue {
    color: var(--tinta-3);
  }
  .regla {
    margin: 0;
    padding: 0 1.2rem 1rem;
    font-family: var(--fuente-texto);
    font-size: 1rem;
    color: var(--tinta-2);
  }
</style>
