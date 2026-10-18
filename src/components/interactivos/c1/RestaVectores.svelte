<script lang="ts">
  import { Tween } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import { conMath, tex } from '../../../lib/katex';
  import { reducirMovimiento } from '../../../lib/movimiento';
  import { escala, rotar, suma, type Vec2 } from '../../../lib/vec';

  const A: Vec2 = { x: 4, y: 1.5 };
  const B: Vec2 = { x: 1.5, y: 3 };
  const origen: Vec2 = { x: 0, y: 0 };

  // Fases: 0 = A y B cola con cola · 1 = B se invierte · 2 = −B viaja a la punta de A · 3 = aparece A − B
  let fase = $state(0);
  const giro = new Tween(0, { easing: cubicInOut });
  const viaje = new Tween(0, { easing: cubicInOut });
  const brillo = new Tween(0, { easing: cubicInOut });

  const ms = (n: number) => (reducirMovimiento() ? 0 : n);

  async function reproducir() {
    if (fase === 3) reiniciar(true);
    fase = 1;
    await giro.set(180, { duration: ms(900) });
    fase = 2;
    await viaje.set(1, { duration: ms(900) });
    fase = 3;
    await brillo.set(1, { duration: ms(600) });
  }

  function reiniciar(instantaneo = false) {
    const o = { duration: instantaneo ? 0 : ms(500) };
    fase = 0;
    giro.set(0, o);
    viaje.set(0, o);
    brillo.set(0, o);
  }

  const vB = $derived(rotar(B, giro.current));
  const colaB = $derived(escala(viaje.current, A));
  const D = $derived(suma(A, escala(-1, B)));

  const textos = [
    'Queremos restar $\\vec B$ de $\\vec A$.',
    'Primero obtenemos $-\\vec B$: misma magnitud, dirección opuesta.',
    'Colocamos la cola de $-\\vec B$ en la punta de $\\vec A$.',
    'La diferencia $\\vec A - \\vec B$ va de la cola de $\\vec A$ a la punta de $-\\vec B$.',
  ];
</script>

<div class="int">
  <div class="int-lienzo">
    <Plano x={[-1.5, 6.5]} y={[-2.8, 4]} rejilla={0.5} titulo="Animación de la resta A menos B como A más menos B" altoMax={360}>
      {#if brillo.current > 0.01}
        <Flecha desde={origen} hasta={D} color="var(--vec-r)" grosor={3.2} opacidad={brillo.current} />
        <Etiqueta en={escala(0.5, D)} t={'\\vec{A}-\\vec{B}'} color="var(--vec-r)" dx={-34} dy={10} opacidad={brillo.current} fondo />
        <Flecha desde={B} hasta={A} color="var(--vec-r)" discontinua grosor={2} opacidad={0.5 * brillo.current} />
        <Flecha desde={origen} hasta={B} color="var(--vec-b)" opacidad={0.3 * brillo.current} grosor={2} />
      {/if}
      <Flecha desde={origen} hasta={A} color="var(--vec-a)" />
      <Etiqueta en={escala(0.5, A)} t={'\\vec{A}'} color="var(--vec-a)" dy={16} dx={10} fondo />
      <Flecha desde={colaB} hasta={suma(colaB, vB)} color="var(--vec-b)" />
      <Etiqueta
        en={suma(colaB, escala(0.5, vB))}
        t={giro.current > 90 ? '-\\vec{B}' : '\\vec{B}'}
        color="var(--vec-b)"
        dx={-18}
        dy={-4}
        fondo
      />
    </Plano>
  </div>
  <p class="explica" aria-live="polite">{@html conMath(textos[fase])}</p>
  <div class="int-lectura">
    <span>{@html tex('\\vec A - \\vec B = \\vec A + (-\\vec B)')}</span>
  </div>
  <div class="int-barra">
    <button type="button" class="boton primario" onclick={reproducir} disabled={fase === 1 || fase === 2}>
      {fase === 3 ? 'Repetir' : 'Reproducir'}
    </button>
    <button type="button" class="boton" onclick={() => reiniciar()}>Reiniciar</button>
    {#if fase === 3}<span class="empuje nota">La flecha punteada muestra el atajo: “punta con punta”.</span>{/if}
  </div>
</div>

<style>
  .explica {
    margin: 0;
    padding: 0 1.2rem 0.4rem;
    font-family: var(--fuente-texto);
    font-size: 1.02rem;
    color: var(--tinta-2);
    min-height: 2em;
  }
  .nota {
    color: var(--tinta-3);
    font-size: var(--t-xs);
  }
  .boton:disabled {
    opacity: 0.45;
  }
</style>
