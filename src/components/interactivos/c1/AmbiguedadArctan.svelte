<script lang="ts">
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import Manija from '../nucleo/Manija.svelte';
  import Arco from '../nucleo/Arco.svelte';
  import { tex } from '../../../lib/katex';
  import { angulo, arctanCalculadora, cuadrante, desdePolar, fmt, type Vec2 } from '../../../lib/vec';

  let A = $state<Vec2>({ x: -3, y: 2 });
  const O = { x: 0, y: 0 };
  const limitar = (p: Vec2): Vec2 => ({ x: Math.max(-4.5, Math.min(4.5, p.x)), y: Math.max(-3, Math.min(3, p.y)) });

  const valido = $derived(Math.abs(A.x) > 1e-9);
  const calc = $derived(valido ? arctanCalculadora(A) : NaN);
  const real = $derived(angulo(A));
  const realFirmado = $derived(real > 180 ? real - 360 : real);
  const corregir = $derived(valido && Math.abs(calc - realFirmado) > 1);
  const q = $derived(cuadrante(A));
  const romanos = ['sobre un eje', 'I', 'II', 'III', 'IV'];
</script>

<div class="int">
  <div class="int-lienzo">
    <Plano x={[-5, 5]} y={[-3.4, 3.4]} rejilla={0.5} titulo="Comparación entre lo que da la calculadora y la dirección real del vector" altoMax={380}>
      {#if valido}
        <!-- La recta con esa tangente tiene dos sentidos posibles -->
        <Flecha desde={O} hasta={desdePolar(4.2, calc)} color="var(--tinta-3)" grosor={1.6} discontinua opacidad={corregir ? 1 : 0} />
        <Etiqueta en={desdePolar(4.2, calc)} t={'\\text{calculadora}'} color="var(--tinta-2)" dx={calc > 0 ? 10 : 10} dy={calc > 0 ? -16 : 16} tamano={13} opacidad={corregir ? 1 : 0} fondo />
        {#if corregir}
          <Arco centro={O} desde={calc} hasta={realFirmado} radio={52} color="var(--rojo)" sentido />
        {/if}
      {/if}
      <Arco centro={O} desde={0} hasta={real} radio={28} color="var(--ocre)" />
      <Flecha desde={O} hasta={A} color="var(--vec-a)" grosor={3} />
      <Etiqueta en={A} t={'\\vec{A}'} color="var(--vec-a)" dx={A.x >= 0 ? 18 : -18} dy={A.y >= 0 ? -14 : 14} />
      <Manija bind:pos={A} color="var(--vec-a)" paso={0.5} restringir={limitar} nombre="punta del vector A" />
    </Plano>
  </div>
  <div class="int-lectura">
    <span>{@html tex(`A_x = ${fmt(A.x, 1)},\\; A_y = ${fmt(A.y, 1)}`)}</span>
    {#if valido}
      <span>{@html tex(`\\arctan\\frac{A_y}{A_x} = \\arctan(${fmt(A.y / A.x, 2)}) = ${fmt(calc, 1)}^\\circ`)}</span>
    {:else}
      <span>{@html tex('A_x = 0:\\ \\text{la tangente no está definida}')}</span>
    {/if}
  </div>
  <p class="veredicto" class:mal={corregir} aria-live="polite">
    {#if !valido}
      El vector es vertical: {@html tex(A.y >= 0 ? '\\theta = 90^\\circ' : '\\theta = 270^\\circ')}.
    {:else if corregir}
      El dibujo está en el cuadrante <strong>{romanos[q]}</strong>, pero la calculadora apunta al opuesto. Hay que sumar
      {@html tex('180^\\circ')}: {@html tex(`\\theta = ${fmt(calc, 1)}^\\circ + 180^\\circ = ${fmt(calc + 180, 1)}^\\circ`)}.
    {:else}
      Aquí la calculadora acierta: el vector está en el cuadrante <strong>{romanos[q]}</strong> y
      {@html tex(`\\theta = ${fmt(realFirmado, 1)}^\\circ`)}.
    {/if}
  </p>
  <div class="int-barra">
    <span class="nota">Prueba con un vector en el cuadrante II o III.</span>
  </div>
</div>

<style>
  .veredicto {
    margin: 0;
    padding: 0 1.2rem 1rem;
    font-family: var(--fuente-texto);
    font-size: 1.02rem;
    color: var(--tinta-2);
    min-height: 3.2em;
  }
  .veredicto.mal strong {
    color: var(--rojo);
  }
  .nota {
    color: var(--tinta-3);
    font-size: var(--t-xs);
  }
</style>
