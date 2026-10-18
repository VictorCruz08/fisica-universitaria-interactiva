<script lang="ts">
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import Manija from '../nucleo/Manija.svelte';
  import Arco from '../nucleo/Arco.svelte';
  import Poligono from '../nucleo/Poligono.svelte';
  import { tex } from '../../../lib/katex';
  import { angulo, anguloEntre, escala, fmt, magnitud, punto, type Vec2 } from '../../../lib/vec';

  let A = $state<Vec2>({ x: 3.5, y: 1 });
  let B = $state<Vec2>({ x: 1.5, y: 2.5 });
  const O = { x: 0, y: 0 };

  const mA = $derived(magnitud(A));
  const mB = $derived(magnitud(B));
  const phi = $derived(anguloEntre(A, B));
  const pAB = $derived(punto(A, B));
  const uA = $derived(mA > 0 ? escala(1 / mA, A) : { x: 1, y: 0 });
  const proy = $derived(mA > 0 ? pAB / mA : 0); // B cos φ
  const pie = $derived(escala(proy, uA));
  const signo = $derived(Math.abs(pAB) < 0.05 ? 'cero' : pAB > 0 ? 'positivo' : 'negativo');
  const color = $derived(signo === 'cero' ? 'var(--tinta-3)' : signo === 'positivo' ? 'var(--verde)' : 'var(--rojo)');

  // Arco de φ: desde la dirección de A hasta la de B por el camino corto
  const tA = $derived(angulo(A));
  const tB = $derived(angulo(B));
  const delta = $derived(((tB - tA + 540) % 360) - 180);

  const limitar = (p: Vec2): Vec2 => ({ x: Math.max(-4.5, Math.min(4.5, p.x)), y: Math.max(-3, Math.min(3, p.y)) });
  const maximo = $derived(mA * mB || 1);
</script>

<div class="int">
  <div class="int-lienzo">
    <Plano x={[-5, 5]} y={[-3.4, 3.4]} rejilla={0.5} ejes={false} titulo="Producto escalar como proyección de B sobre la dirección de A" altoMax={380}>
      <Poligono puntos={[escala(-6, uA), escala(6, uA)]} cerrado={false} borde="var(--linea-fuerte)" grosor={1} discontinuo />
      <Poligono puntos={[B, pie]} cerrado={false} borde="var(--tinta-3)" grosor={1} discontinuo />
      <Poligono puntos={[O, pie]} cerrado={false} borde={color} grosor={7} opacidad={0.45} />
      {#if mA > 0.3 && mB > 0.3}
        <Arco centro={O} desde={tA} hasta={tA + delta} radio={30} color="var(--ocre)" relleno />
        <Etiqueta en={O} t={'\\phi'} color="var(--ocre)" dx={46 * Math.cos(((tA + delta / 2) * Math.PI) / 180)} dy={-46 * Math.sin(((tA + delta / 2) * Math.PI) / 180)} tamano={15} />
      {/if}
      <Flecha desde={O} hasta={A} color="var(--vec-a)" />
      <Flecha desde={O} hasta={B} color="var(--vec-b)" />
      <Etiqueta en={A} t={'\\vec{A}'} color="var(--vec-a)" dx={A.x >= 0 ? 18 : -18} dy={-12} />
      <Etiqueta en={B} t={'\\vec{B}'} color="var(--vec-b)" dx={B.x >= 0 ? 18 : -18} dy={-12} />
      {#if Math.abs(proy) > 0.8}
        <Etiqueta en={escala(0.5, pie)} t={'B\\cos\\phi'} color={color} dx={14 * uA.y} dy={18} tamano={14} fondo />
      {/if}
      <Manija bind:pos={A} color="var(--vec-a)" restringir={limitar} nombre="punta de A" />
      <Manija bind:pos={B} color="var(--vec-b)" restringir={limitar} nombre="punta de B" />
    </Plano>
  </div>

  <div class="int-lectura">
    <span>{@html tex(`A = ${fmt(mA, 2)},\\; B = ${fmt(mB, 2)},\\; \\phi = ${fmt(phi, 1)}^\\circ`)}</span>
    <span class="res" style:--c={color}>{@html tex(`\\vec A\\cdot\\vec B = AB\\cos\\phi = ${fmt(pAB, 2)}`)}</span>
  </div>

  <div class="medidor" aria-hidden="true">
    <span class="ext">{@html tex('-AB')}</span>
    <div class="pista">
      <div class="cero"></div>
      <div
        class="relleno"
        style:background={color}
        style:left={pAB >= 0 ? '50%' : `${50 + (50 * pAB) / maximo}%`}
        style:width={`${(50 * Math.abs(pAB)) / maximo}%`}
      ></div>
    </div>
    <span class="ext">{@html tex('+AB')}</span>
  </div>

  <div class="int-barra">
    <span class="nota">
      El producto es <strong style:color>{signo}</strong><!--
      -->
      {#if signo === 'positivo'}: φ &lt; 90°, la “sombra” de B cae a favor de A.{/if}
      {#if signo === 'negativo'}: φ &gt; 90°, la “sombra” cae en contra de A.{/if}
      {#if signo === 'cero'}: φ = 90°, los vectores son perpendiculares.{/if}
    </span>
  </div>
</div>

<style>
  .res :global(.katex) {
    color: var(--c);
  }
  .nota {
    color: var(--tinta-2);
    font-size: var(--t-sm);
  }
  .medidor {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0 1.2rem 1rem;
  }
  .ext {
    font-size: 0.9rem;
    color: var(--tinta-3);
  }
  .pista {
    position: relative;
    flex: 1;
    height: 8px;
    border-radius: 4px;
    background: var(--fondo-hundido);
    overflow: hidden;
  }
  .cero {
    position: absolute;
    left: 50%;
    top: -2px;
    bottom: -2px;
    width: 1.5px;
    background: var(--tinta-3);
  }
  .relleno {
    position: absolute;
    top: 0;
    bottom: 0;
    border-radius: 4px;
    transition: background var(--dur-2) var(--ease);
  }
</style>
