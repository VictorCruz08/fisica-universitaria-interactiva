<script lang="ts">
  import { tex } from '../../../lib/katex';

  type U = 'i' | 'j' | 'k';
  const nombres: Record<U, string> = { i: '\\hat\\imath', j: '\\hat\\jmath', k: '\\hat k' };
  const orden: U[] = ['i', 'j', 'k'];

  // Posiciones en el círculo (sentido horario: î → ĵ → k̂ → î)
  const R = 78;
  const C = { x: 120, y: 112 };
  const ang: Record<U, number> = { i: -90, j: 30, k: 150 };
  const pos = (u: U) => ({ x: C.x + R * Math.cos((ang[u] * Math.PI) / 180), y: C.y + R * Math.sin((ang[u] * Math.PI) / 180) });

  let primero = $state<U | null>('i');
  let segundo = $state<U | null>('j');

  const resultado = $derived.by(() => {
    if (!primero || !segundo) return null;
    if (primero === segundo) return { tex: '\\mathbf{0}', signo: 0 as const, tercero: null };
    const i = orden.indexOf(primero);
    const j = orden.indexOf(segundo);
    const tercero = orden.find((u) => u !== primero && u !== segundo)!;
    const aFavor = (i + 1) % 3 === j;
    return { tex: `${aFavor ? '' : '-'}${nombres[tercero]}`, signo: aFavor ? 1 : -1, tercero };
  });

  function elegir(u: U) {
    if (!primero || (primero && segundo)) {
      primero = u;
      segundo = null;
    } else {
      segundo = u;
    }
  }

  // Arco recorrido del primero al segundo (por el camino corto de 120°)
  const arco = $derived.by(() => {
    if (!primero || !segundo || primero === segundo) return '';
    const a = pos(primero);
    const b = pos(segundo);
    const horario = resultado?.signo === 1;
    return `M${a.x},${a.y} A${R},${R} 0 0 ${horario ? 1 : 0} ${b.x},${b.y}`;
  });

  // Flechas fijas del ciclo
  const flechasCiclo = orden.map((u, n) => {
    const a = ang[u] + 22;
    const b = ang[orden[(n + 1) % 3]] - 22;
    const p = (g: number) => ({ x: C.x + R * Math.cos((g * Math.PI) / 180), y: C.y + R * Math.sin((g * Math.PI) / 180) });
    const s = p(a);
    const e = p(b);
    const t = ((b - 6) * Math.PI) / 180;
    const tip = e;
    const back = { x: C.x + R * Math.cos(t), y: C.y + R * Math.sin(t) };
    const dx = tip.x - back.x;
    const dy = tip.y - back.y;
    const L = Math.hypot(dx, dy);
    const ux = dx / L;
    const uy = dy / L;
    const k = 8;
    const cabeza = `M${tip.x},${tip.y} L${tip.x - ux * k - uy * k * 0.5},${tip.y - uy * k + ux * k * 0.5} L${tip.x - ux * k + uy * k * 0.5},${tip.y - uy * k - ux * k * 0.5} Z`;
    return { d: `M${s.x},${s.y} A${R},${R} 0 0 1 ${e.x},${e.y}`, cabeza };
  });
</script>

<div class="int">
  <div class="dos">
    <svg viewBox="0 0 240 230" role="img" aria-label="Ciclo i, j, k para productos cruz de vectores unitarios">
      {#each flechasCiclo as f}
        <path d={f.d} class="ciclo" />
        <path d={f.cabeza} class="cabeza" />
      {/each}
      {#if arco}
        {#key arco}
          <path d={arco} class="recorrido" class:contra={resultado?.signo === -1} pathLength="1" />
        {/key}
      {/if}
      {#each orden as u}
        {@const p = pos(u)}
        <g
          class="nodo"
          class:p1={primero === u}
          class:p2={segundo === u}
          class:res={resultado?.tercero === u}
          role="button"
          tabindex="0"
          aria-label={`Elegir ${u}`}
          onclick={() => elegir(u)}
          onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && elegir(u)}
        >
          <circle cx={p.x} cy={p.y} r="24" />
          <foreignObject x={p.x - 24} y={p.y - 24} width="48" height="48">
            <div class="et">{@html tex(nombres[u])}</div>
          </foreignObject>
        </g>
      {/each}
    </svg>

    <div class="lado">
      <p class="instr">Toca dos vectores unitarios, en orden.</p>
      <p class="ecu" aria-live="polite">
        {#if primero && segundo && resultado}
          {@html tex(`${nombres[primero]} \\times ${nombres[segundo]} = ${resultado.tex}`, true)}
        {:else if primero}
          {@html tex(`${nombres[primero]} \\times \\;?`, true)}
        {/if}
      </p>
      <p class="expl">
        {#if resultado?.signo === 1}
          A favor de las flechas del ciclo: el resultado es el tercer vector, con signo <strong>+</strong>.
        {:else if resultado?.signo === -1}
          En contra de las flechas: el resultado es el tercer vector con signo <strong>−</strong>.
        {:else if resultado?.signo === 0}
          Un vector cruzado consigo mismo da el vector cero (son paralelos).
        {/if}
      </p>
    </div>
  </div>
</div>

<style>
  .dos {
    display: grid;
    grid-template-columns: minmax(0, 15rem) 1fr;
    gap: 1.5rem;
    align-items: center;
    padding: 1.2rem 1.4rem;
  }
  svg {
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .ciclo {
    fill: none;
    stroke: var(--linea-fuerte);
    stroke-width: 1.6;
  }
  .cabeza {
    fill: var(--tinta-3);
  }
  .recorrido {
    fill: none;
    stroke: var(--verde);
    stroke-width: 4;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: trazo 650ms var(--ease-out) forwards;
  }
  .recorrido.contra {
    stroke: var(--rojo);
  }
  @keyframes trazo {
    to {
      stroke-dashoffset: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .recorrido {
      animation: none;
      stroke-dashoffset: 0;
    }
  }
  .nodo {
    cursor: pointer;
    outline: none;
  }
  .nodo circle {
    fill: var(--fondo-elevado);
    stroke: var(--linea-fuerte);
    stroke-width: 1.5;
    transition:
      fill var(--dur-2) var(--ease),
      stroke var(--dur-2) var(--ease);
  }
  .nodo:hover circle,
  .nodo:focus-visible circle {
    stroke: var(--azul);
  }
  .nodo.p1 circle {
    stroke: var(--vec-a);
    stroke-width: 3;
  }
  .nodo.p2 circle {
    stroke: var(--vec-b);
    stroke-width: 3;
  }
  .nodo.res circle {
    fill: color-mix(in srgb, var(--verde) 16%, var(--fondo-elevado));
  }
  .et {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    pointer-events: none;
  }
  .instr {
    margin: 0;
    font-size: var(--t-sm);
    color: var(--tinta-3);
  }
  .ecu {
    margin: 0.2rem 0;
    min-height: 3.4rem;
    font-size: 1.15rem;
  }
  .expl {
    margin: 0;
    font-family: var(--fuente-texto);
    font-size: 1rem;
    color: var(--tinta-2);
    min-height: 3em;
  }
  @media (max-width: 560px) {
    .dos {
      grid-template-columns: 1fr;
      justify-items: center;
    }
    svg {
      max-width: 15rem;
    }
  }
</style>
