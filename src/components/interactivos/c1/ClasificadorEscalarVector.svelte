<script lang="ts">
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { reducirMovimiento } from '../../../lib/movimiento';

  type Tipo = 'escalar' | 'vector';
  type Item = { id: number; nombre: string; ejemplo: string; tipo: Tipo; porque: string };

  const items: Item[] = [
    { id: 1, nombre: 'Masa', ejemplo: 'una mochila de 6 kg', tipo: 'escalar', porque: '6 kg no apunta hacia ningún lado.' },
    { id: 2, nombre: 'Velocidad', ejemplo: '80 km/h hacia el norte', tipo: 'vector', porque: 'Importa qué tan rápido y hacia dónde.' },
    { id: 3, nombre: 'Temperatura', ejemplo: '23 °C en el salón', tipo: 'escalar', porque: 'Un solo número la describe por completo.' },
    { id: 4, nombre: 'Fuerza', ejemplo: 'empujar una puerta', tipo: 'vector', porque: 'No es lo mismo empujar que jalar: la dirección cuenta.' },
    { id: 5, nombre: 'Tiempo', ejemplo: 'una clase de 50 min', tipo: 'escalar', porque: 'Una duración no tiene dirección en el espacio.' },
    { id: 6, nombre: 'Desplazamiento', ejemplo: '3 cuadras al este', tipo: 'vector', porque: '3 cuadras al este ≠ 3 cuadras al oeste.' },
    { id: 7, nombre: 'Rapidez', ejemplo: 'el velocímetro marca 60', tipo: 'escalar', porque: 'Es sólo el “qué tan rápido”, sin dirección.' },
    { id: 8, nombre: 'Densidad', ejemplo: 'agua: 1 g/cm³', tipo: 'escalar', porque: 'Un número con unidades, nada más.' },
  ];

  let ubicacion = $state<Record<number, Tipo | null>>(Object.fromEntries(items.map((i) => [i.id, null])));
  let elegido = $state<number | null>(null);

  const [enviar, recibir] = crossfade({
    duration: (d) => (reducirMovimiento() ? 0 : Math.sqrt(d * 260)),
    easing: cubicOut,
  });

  const en = (t: Tipo | null) => items.filter((i) => ubicacion[i.id] === t);
  const restantes = $derived(en(null));
  const terminado = $derived(restantes.length === 0);
  const errores = $derived(items.filter((i) => ubicacion[i.id] && ubicacion[i.id] !== i.tipo).length);

  function colocar(t: Tipo) {
    if (elegido === null) return;
    ubicacion[elegido] = t;
    elegido = null;
  }
  function devolver(id: number) {
    ubicacion[id] = null;
  }
  function reiniciar() {
    for (const i of items) ubicacion[i.id] = null;
    elegido = null;
  }
</script>

<div class="int clasif">
  <p class="instr">
    {#if elegido === null && !terminado}
      Toca una cantidad y luego la bandeja donde crees que va.
    {:else if elegido !== null}
      ¿<strong>{items.find((i) => i.id === elegido)?.nombre}</strong> es escalar o vectorial?
    {:else}
      {errores === 0 ? '¡Todas bien clasificadas!' : `Hay ${errores} en la bandeja equivocada (marcadas en rojo). Tócalas para regresarlas.`}
    {/if}
  </p>

  <div class="pozo" aria-label="Cantidades por clasificar">
    {#each restantes as it (it.id)}
      <button
        type="button"
        class="ficha"
        class:activa={elegido === it.id}
        onclick={() => (elegido = elegido === it.id ? null : it.id)}
        in:recibir={{ key: it.id }}
        out:enviar={{ key: it.id }}
        animate:flip={{ duration: 300 }}
      >
        <span class="nombre">{it.nombre}</span>
        <span class="ej">{it.ejemplo}</span>
      </button>
    {/each}
  </div>

  <div class="bandejas">
    {#each [['escalar', 'Escalares', 'sólo magnitud'], ['vector', 'Vectoriales', 'magnitud + dirección']] as [t, titulo, sub]}
      <div
        class="bandeja"
        class:lista={elegido !== null}
        role="button"
        tabindex={elegido !== null ? 0 : -1}
        aria-label={`Colocar en ${titulo}`}
        onclick={() => colocar(t as Tipo)}
        onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && colocar(t as Tipo)}
      >
        <div class="cab">
          {#if t === 'vector'}
            <svg viewBox="0 0 30 12" width="30" height="12" aria-hidden="true"><path d="M2 6 H24" stroke="var(--azul)" stroke-width="2.2" stroke-linecap="round" /><path d="M28 6 L21 2.2 V9.8 Z" fill="var(--azul)" /></svg>
          {:else}
            <svg viewBox="0 0 30 12" width="30" height="12" aria-hidden="true"><circle cx="15" cy="6" r="4" fill="var(--ocre)" /></svg>
          {/if}
          <strong>{titulo}</strong><span>{sub}</span>
        </div>
        <div class="contenido">
          {#each en(t as Tipo) as it (it.id)}
            {@const mal = it.tipo !== t}
            <button
              type="button"
              class="ficha chica"
              class:mal={terminado && mal}
              class:bien={terminado && !mal}
              onclick={(e) => {
                e.stopPropagation();
                devolver(it.id);
              }}
              in:recibir={{ key: it.id }}
              out:enviar={{ key: it.id }}
              animate:flip={{ duration: 300 }}
              title="Regresar"
            >
              <span class="nombre">{it.nombre}</span>
              {#if terminado}<span class="ej">{it.porque}</span>{/if}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="int-barra">
    <span>{items.length - restantes.length} de {items.length} clasificadas</span>
    <button type="button" class="boton empuje" onclick={reiniciar}>Reiniciar</button>
  </div>
</div>

<style>
  .clasif {
    padding-top: 1rem;
  }
  .instr {
    margin: 0 1.2rem 0.8rem;
    font-size: var(--t-sm);
    color: var(--tinta-2);
    min-height: 1.5em;
  }
  .pozo {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0 1.2rem 1rem;
    min-height: 3.6rem;
  }
  .ficha {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.05rem;
    padding: 0.5rem 0.85rem;
    border-radius: var(--radio);
    border: 1px solid var(--linea-fuerte);
    background: var(--fondo-elevado);
    cursor: pointer;
    text-align: left;
    transition:
      border-color var(--dur-1) var(--ease),
      box-shadow var(--dur-2) var(--ease-out),
      transform var(--dur-2) var(--ease-spring);
  }
  .ficha:hover {
    border-color: var(--tinta-3);
  }
  .ficha.activa {
    border-color: var(--azul);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--azul) 20%, transparent);
    transform: translateY(-2px);
  }
  .nombre {
    font-weight: 620;
    font-size: var(--t-sm);
  }
  .ej {
    font-size: var(--t-xs);
    color: var(--tinta-3);
  }
  .bandejas {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
    padding: 0 1.2rem 1.2rem;
  }
  .bandeja {
    border-radius: var(--radio);
    border: 1.5px dashed var(--linea-fuerte);
    padding: 0.7rem;
    min-height: 9rem;
    transition:
      border-color var(--dur-2) var(--ease),
      background var(--dur-2) var(--ease);
  }
  .bandeja.lista {
    cursor: pointer;
    border-color: var(--azul);
    background: color-mix(in srgb, var(--azul) 4%, transparent);
  }
  .cab {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.45rem;
    font-size: var(--t-sm);
    margin-bottom: 0.6rem;
  }
  .cab span {
    color: var(--tinta-3);
    font-size: var(--t-xs);
  }
  .contenido {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .ficha.chica {
    padding: 0.35rem 0.7rem;
  }
  .ficha.bien {
    border-color: var(--verde);
  }
  .ficha.mal {
    border-color: var(--rojo);
    background: color-mix(in srgb, var(--rojo) 8%, var(--fondo-elevado));
  }
  @media (max-width: 520px) {
    .bandejas {
      grid-template-columns: 1fr;
    }
  }
</style>
