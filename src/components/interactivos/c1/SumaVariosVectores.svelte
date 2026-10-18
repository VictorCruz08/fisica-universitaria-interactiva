<script lang="ts">
  import { Tween } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import { tex } from '../../../lib/katex';
  import { reducirMovimiento } from '../../../lib/movimiento';
  import { escala, suma, type Vec2 } from '../../../lib/vec';

  type Id = 'A' | 'B' | 'C';
  const vec: Record<Id, Vec2> = { A: { x: 3, y: 1 }, B: { x: -1, y: 2.5 }, C: { x: 2, y: -1.5 } };
  const color: Record<Id, string> = { A: 'var(--vec-a)', B: 'var(--vec-b)', C: 'var(--vec-d)' };
  const R = suma(suma(vec.A, vec.B), vec.C);

  const ordenes: Id[][] = [
    ['A', 'B', 'C'],
    ['B', 'C', 'A'],
    ['C', 'A', 'B'],
    ['A', 'C', 'B'],
  ];

  let orden = $state<Id[]>(ordenes[0]);
  let parcial = $state(false);

  const colas = (o: Id[]) => {
    const r = {} as Record<Id, Vec2>;
    let p: Vec2 = { x: 0, y: 0 };
    for (const id of o) {
      r[id] = p;
      p = suma(p, vec[id]);
    }
    return r;
  };

  const inicial = colas(ordenes[0]);
  const t = {
    A: new Tween(inicial.A, { easing: cubicInOut }),
    B: new Tween(inicial.B, { easing: cubicInOut }),
    C: new Tween(inicial.C, { easing: cubicInOut }),
  };

  function elegir(o: Id[]) {
    orden = o;
    const c = colas(o);
    const ms = reducirMovimiento() ? 0 : 750;
    (['A', 'B', 'C'] as Id[]).forEach((id, i) => t[id].set(c[id], { duration: ms, delay: ms ? i * 90 : 0 }));
  }

  const primeraSuma = $derived(suma(vec[orden[0]], vec[orden[1]]));
</script>

<div class="int">
  <div class="int-lienzo">
    <Plano x={[-2.5, 6.5]} y={[-1.2, 4.6]} rejilla={0.5} titulo="Tres vectores sumados en distintos órdenes; la resultante no cambia" altoMax={380}>
      <Flecha desde={{ x: 0, y: 0 }} hasta={R} color="var(--vec-r)" grosor={3.2} />
      <Etiqueta en={escala(0.5, R)} t={'\\vec{R}'} color="var(--vec-r)" dy={18} dx={6} fondo />
      {#if parcial}
        <Flecha desde={{ x: 0, y: 0 }} hasta={primeraSuma} color="var(--tinta-3)" discontinua grosor={2} />
        <Etiqueta
          en={escala(0.5, primeraSuma)}
          t={`\\vec{${orden[0]}}+\\vec{${orden[1]}}`}
          color="var(--tinta-2)"
          dx={-30}
          dy={-6}
          tamano={14}
          fondo
        />
      {/if}
      {#each ['A', 'B', 'C'] as const as id}
        <Flecha desde={t[id].current} hasta={suma(t[id].current, vec[id])} color={color[id]} />
        <Etiqueta en={suma(t[id].current, escala(0.5, vec[id]))} t={`\\vec{${id}}`} color={color[id]} dx={14} dy={-12} fondo />
      {/each}
    </Plano>
  </div>

  <div class="int-lectura">
    <span>{@html tex(`\\vec R = \\vec ${orden[0]} + \\vec ${orden[1]} + \\vec ${orden[2]}`)}</span>
  </div>

  <div class="int-barra">
    <div class="int-segmentado" role="group" aria-label="Orden de la suma">
      {#each ordenes as o}
        <button type="button" aria-pressed={orden.join('') === o.join('')} onclick={() => elegir(o)}>
          {o.join(' + ')}
        </button>
      {/each}
    </div>
    <button type="button" class="boton empuje" aria-pressed={parcial} onclick={() => (parcial = !parcial)}>Suma parcial</button>
  </div>
</div>
