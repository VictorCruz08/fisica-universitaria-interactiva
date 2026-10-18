<script lang="ts">
  import { Tween } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import Manija from '../nucleo/Manija.svelte';
  import { conMath } from '../../../lib/katex';
  import { reducirMovimiento } from '../../../lib/movimiento';
  import { escala, rotar, suma, type Vec2 } from '../../../lib/vec';

  type Modo = 'igual' | 'doble' | 'negativo' | 'anti';
  const modos: { id: Modo; nombre: string; giro: number; k: number; etiqueta: string; texto: string }[] = [
    { id: 'igual', nombre: 'Igual', giro: 0, k: 1, etiqueta: "\\vec{A}\\,'", texto: 'Misma magnitud y misma dirección: $\\vec A\\,\' = \\vec A$, aunque empiece en otro punto.' },
    { id: 'doble', nombre: 'Paralelo', giro: 0, k: 2, etiqueta: '\\vec{B}', texto: 'Misma dirección pero distinta magnitud: son **paralelos**, pero no iguales.' },
    { id: 'negativo', nombre: 'Negativo', giro: 180, k: 1, etiqueta: '-\\vec{A}', texto: 'Misma magnitud, dirección opuesta: es el **negativo** de $\\vec A$.' },
    { id: 'anti', nombre: 'Antiparalelo', giro: 180, k: 0.5, etiqueta: '\\vec{C}', texto: 'Dirección opuesta y otra magnitud: **antiparalelo**, pero no es $-\\vec A$.' },
  ];

  const A: Vec2 = { x: 3, y: 2 };
  const origenA: Vec2 = { x: -4.5, y: -1.5 };

  let modo = $state<Modo>('igual');
  let cola = $state<Vec2>({ x: 1, y: -1 });
  const opciones = () => ({ duration: reducirMovimiento() ? 0 : 700, easing: cubicInOut });
  const giro = new Tween(0, opciones());
  const k = new Tween(1, opciones());

  const actual = $derived(modos.find((m) => m.id === modo)!);
  const copia = $derived(rotar(escala(k.current, A), giro.current));

  function elegir(m: Modo) {
    modo = m;
    const d = modos.find((x) => x.id === m)!;
    giro.set(d.giro, opciones());
    k.set(d.k, opciones());
  }

  const limitar = (p: Vec2): Vec2 => ({ x: Math.max(-5, Math.min(5.5, p.x)), y: Math.max(-3.2, Math.min(3.2, p.y)) });
</script>

<div class="int">
  <div class="int-lienzo">
    <Plano x={[-6, 6.5]} y={[-3.6, 3.8]} rejilla={0.5} ejes={false} titulo="Un vector A y una copia que se puede mover, invertir o estirar" altoMax={380}>
      <Flecha desde={origenA} hasta={suma(origenA, A)} color="var(--vec-a)" />
      <Etiqueta en={suma(origenA, escala(0.5, A))} t={'\\vec{A}'} color="var(--vec-a)" dx={-14} dy={-14} />

      <Flecha desde={cola} hasta={suma(cola, copia)} color="var(--vec-b)" />
      <Etiqueta en={suma(cola, escala(0.5, copia))} t={actual.etiqueta} color="var(--vec-b)" dx={16} dy={-16} fondo />
      <Manija bind:pos={cola} color="var(--vec-b)" paso={0.5} restringir={limitar} nombre="cola de la copia" />
    </Plano>
  </div>
  <p class="explica" aria-live="polite">{@html conMath(actual.texto)}</p>
  <div class="int-barra">
    <div class="int-segmentado" role="group" aria-label="Relación con A">
      {#each modos as m}
        <button type="button" aria-pressed={modo === m.id} onclick={() => elegir(m.id)}>{m.nombre}</button>
      {/each}
    </div>
    <span class="empuje nota">Arrastra el punto para mover la copia</span>
  </div>
</div>

<style>
  .explica {
    margin: 0;
    padding: 0 1.2rem 1rem;
    font-family: var(--fuente-texto);
    font-size: 1.02rem;
    color: var(--tinta-2);
    min-height: 3.2em;
  }
  .nota {
    color: var(--tinta-3);
    font-size: var(--t-xs);
  }
</style>
