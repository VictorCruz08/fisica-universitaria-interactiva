<script lang="ts">
  import { Tween } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import { tex } from '../../../lib/katex';
  import { reducirMovimiento } from '../../../lib/movimiento';
  import { fmt } from '../../../lib/vec';

  let ax = $state(3);
  let ay = $state(2);

  const sx = new Tween(1, { easing: cubicInOut });
  const sy = new Tween(1, { easing: cubicInOut });
  const vA = new Tween(0, { easing: cubicInOut });
  let construido = $state(false);
  let animando = $state(false);
  const ms = (n: number) => (reducirMovimiento() ? 0 : n);

  async function construir() {
    animando = true;
    construido = false;
    await Promise.all([sx.set(1, { duration: 0 }), sy.set(1, { duration: 0 }), vA.set(0, { duration: 0 })]);
    await sx.set(ax, { duration: ms(900) });
    await sy.set(ay, { duration: ms(900), delay: ms(150) });
    await vA.set(1, { duration: ms(600) });
    construido = true;
    animando = false;
  }

  // Si el usuario mueve los deslizadores después de construir, todo sigue en vivo.
  $effect(() => {
    if (construido) {
      sx.set(ax, { duration: 0 });
      sy.set(ay, { duration: 0 });
    }
  });

  const num = (v: number) => (Number.isInteger(v) ? String(v) : fmt(v, 1));
  const expr = $derived.by(() => {
    const y = ay < 0 ? `- ${num(-ay)}` : `+ ${num(ay)}`;
    return `\\vec A = ${num(ax)}\\,\\hat\\imath ${y}\\,\\hat\\jmath`;
  });
</script>

<div class="int">
  <div class="int-lienzo">
    <Plano x={[-4.6, 4.6]} y={[-3.4, 3.4]} rejilla={0.5} marcas={1} titulo="Construcción de un vector a partir de los vectores unitarios i y j" altoMax={380}>
      <!-- Vector componente x: î estirado -->
      <Flecha desde={{ x: 0, y: 0 }} hasta={{ x: sx.current, y: 0 }} color="var(--vec-x)" grosor={3} opacidad={animando || construido ? 0.8 : 0} />
      <!-- Vector componente y: ĵ estirado, colocado en la punta del anterior -->
      <Flecha
        desde={{ x: sx.current, y: 0 }}
        hasta={{ x: sx.current, y: sy.current }}
        color="var(--vec-y)"
        grosor={3}
        opacidad={animando || construido ? 0.8 : 0}
      />
      <Flecha desde={{ x: 0, y: 0 }} hasta={{ x: ax, y: ay }} color="var(--vec-a)" grosor={3.2} opacidad={vA.current} />
      <Etiqueta en={{ x: ax, y: ay }} t={'\\vec{A}'} color="var(--vec-a)" dx={ax >= 0 ? 18 : -18} dy={ay >= 0 ? -14 : 14} opacidad={vA.current} />
      {#if (animando || construido) && Math.abs(sx.current) > 1.2}
        <Etiqueta en={{ x: sx.current / 2, y: 0 }} t={`${num(Math.round(sx.current * 2) / 2)}\\,\\hat\\imath`} color="var(--vec-x)" dy={ay >= 0 ? 16 : -16} tamano={15} fondo />
      {/if}
      {#if (animando || construido) && Math.abs(sy.current) > 1.2}
        <Etiqueta en={{ x: sx.current, y: sy.current / 2 }} t={`${num(Math.round(sy.current * 2) / 2)}\\,\\hat\\jmath`} color="var(--vec-y)" dx={ax >= 0 ? 26 : -26} tamano={15} fondo />
      {/if}

      <!-- Los vectores unitarios: magnitud 1, sólo dirección -->
      <Flecha desde={{ x: 0, y: 0 }} hasta={{ x: 1, y: 0 }} color="var(--tinta)" grosor={3.4} punta={11} />
      <Flecha desde={{ x: 0, y: 0 }} hasta={{ x: 0, y: 1 }} color="var(--tinta)" grosor={3.4} punta={11} />
      <Etiqueta en={{ x: 0.5, y: 0 }} t={'\\hat\\imath'} dy={-14} tamano={17} />
      <Etiqueta en={{ x: 0, y: 0.5 }} t={'\\hat\\jmath'} dx={-14} tamano={17} />
    </Plano>
  </div>
  <div class="int-lectura">
    <span class="expr">{@html tex(expr)}</span>
  </div>
  <div class="int-barra deslizadores">
    <label class="int-deslizador"><span class="x">{@html tex('A_x')}</span><input type="range" min="-4" max="4" step="0.5" bind:value={ax} disabled={animando} /><output>{num(ax)}</output></label>
    <label class="int-deslizador"><span class="y">{@html tex('A_y')}</span><input type="range" min="-3" max="3" step="0.5" bind:value={ay} disabled={animando} /><output>{num(ay)}</output></label>
    <button type="button" class="boton primario" onclick={construir} disabled={animando}>{construido ? 'Repetir' : 'Construir'}</button>
  </div>
</div>

<style>
  .expr {
    font-size: 1.12rem;
  }
  .x :global(.katex) {
    color: var(--vec-x);
  }
  .y :global(.katex) {
    color: var(--vec-y);
  }
  .boton:disabled {
    opacity: 0.45;
  }
</style>
