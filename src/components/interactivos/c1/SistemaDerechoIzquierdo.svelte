<script lang="ts">
  import Escena3D from '../nucleo/Escena3D.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import { tex } from '../../../lib/katex';

  let izquierdo = $state(false);
  const O = { x: 0, y: 0, z: 0 };
  // k̂ apunta a lo largo del eje z dibujado; la regla de la mano derecha siempre da "arriba".
  const k = $derived({ x: 0, y: 0, z: izquierdo ? -1.6 : 1.6 });
</script>

<div class="int">
  <div class="int-lienzo">
    <Escena3D titulo="Sistema de coordenadas derecho o izquierdo" tamano={2.6} alto={320} zInvertido={izquierdo}>
      <Flecha desde={O} hasta={{ x: 1.6, y: 0, z: 0 }} color="var(--vec-x)" grosor={3} />
      <Flecha desde={O} hasta={{ x: 0, y: 1.6, z: 0 }} color="var(--vec-y)" grosor={3} />
      <Flecha desde={O} hasta={k} color="var(--vec-z)" grosor={3} />
      <Flecha desde={{ x: 0.12, y: 0.12, z: 0 }} hasta={{ x: 0.12, y: 0.12, z: 2.1 }} color="var(--ocre)" grosor={2} discontinua />
      <Etiqueta en={{ x: 1.6, y: 0, z: 0 }} t={'\\hat\\imath'} color="var(--vec-x)" dx={-12} dy={12} />
      <Etiqueta en={{ x: 0, y: 1.6, z: 0 }} t={'\\hat\\jmath'} color="var(--vec-y)" dy={14} />
      <Etiqueta en={k} t={'\\hat k'} color="var(--vec-z)" dx={-16} />
      <Etiqueta en={{ x: 0.12, y: 0.12, z: 2.1 }} t={'\\text{mano derecha: }\\hat\\imath\\times\\hat\\jmath'} color="var(--ocre)" dx={92} tamano={13} fondo />
    </Escena3D>
  </div>
  <div class="int-lectura">
    <span class="res">{@html tex(izquierdo ? '\\hat\\imath\\times\\hat\\jmath = -\\hat k' : '\\hat\\imath\\times\\hat\\jmath = \\hat k')}</span>
    <span class="tenue">{izquierdo ? 'Sistema izquierdo: no lo usaremos.' : 'Sistema derecho: el que usa el libro.'}</span>
  </div>
  <div class="int-barra">
    <div class="int-segmentado" role="group" aria-label="Tipo de sistema">
      <button type="button" aria-pressed={!izquierdo} onclick={() => (izquierdo = false)}>Derecho</button>
      <button type="button" aria-pressed={izquierdo} onclick={() => (izquierdo = true)}>Izquierdo (z invertido)</button>
    </div>
  </div>
</div>

<style>
  .res {
    font-size: 1.1rem;
  }
  .tenue {
    color: var(--tinta-3);
  }
</style>
