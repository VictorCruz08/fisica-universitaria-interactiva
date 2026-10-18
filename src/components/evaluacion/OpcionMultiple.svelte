<script lang="ts">
  import { conMath } from '../../lib/katex';
  import { registrarRespuesta } from '../../lib/progreso';

  type Opcion = { texto: string; correcta?: boolean; explicacion: string };

  interface Props {
    /** Identificador estable, p. ej. "1.7-diferencia". Se usa para guardar progreso. */
    id: string;
    pregunta: string;
    opciones: Opcion[];
    /** Permite elegir varias respuestas (cuando puede haber más de una correcta). */
    multiple?: boolean;
    /** Explicación general que aparece al comprobar. */
    cierre?: string;
  }

  let { id, pregunta, opciones, multiple = false, cierre }: Props = $props();

  let elegidas = $state<Set<number>>(new Set());
  let comprobado = $state(false);

  const correctas = $derived(opciones.map((o, i) => (o.correcta ? i : -1)).filter((i) => i >= 0));
  const acierto = $derived(
    comprobado && correctas.length === elegidas.size && correctas.every((i) => elegidas.has(i)),
  );

  function alternar(i: number) {
    if (comprobado) return;
    const s = new Set(multiple ? elegidas : []);
    if (s.has(i)) s.delete(i);
    else s.add(i);
    elegidas = s;
  }

  function comprobar() {
    comprobado = true;
    registrarRespuesta(id, correctas.length === elegidas.size && correctas.every((i) => elegidas.has(i)));
  }

  function reintentar() {
    comprobado = false;
    elegidas = new Set();
  }

  const letra = (i: number) => String.fromCharCode(97 + i);
</script>

<div class="om">
  <p class="pregunta">{@html conMath(pregunta)}</p>
  {#if multiple}<p class="ayuda ui">Puede haber más de una respuesta correcta.</p>{/if}

  <ul role={multiple ? 'group' : 'radiogroup'} aria-label="Opciones">
    {#each opciones as o, i}
      {@const marcada = elegidas.has(i)}
      <li>
        <button
          type="button"
          role={multiple ? 'checkbox' : 'radio'}
          aria-checked={marcada}
          class="opcion"
          class:marcada
          class:bien={comprobado && o.correcta}
          class:mal={comprobado && marcada && !o.correcta}
          class:atenuada={comprobado && !marcada && !o.correcta}
          onclick={() => alternar(i)}
          disabled={comprobado}
        >
          <span class="letra ui">{letra(i)}</span>
          <span class="texto">{@html conMath(o.texto)}</span>
        </button>
        {#if comprobado && (marcada || o.correcta)}
          <p class="explicacion" class:bien={o.correcta}>{@html conMath(o.explicacion)}</p>
        {/if}
      </li>
    {/each}
  </ul>

  <div class="acciones">
    {#if !comprobado}
      <button type="button" class="boton primario" onclick={comprobar} disabled={elegidas.size === 0}>Comprobar</button>
    {:else}
      <p class="veredicto ui" class:bien={acierto} aria-live="polite">
        {acierto ? '¡Correcto!' : multiple ? 'Revisa las opciones marcadas.' : 'No exactamente.'}
      </p>
      <button type="button" class="boton" onclick={reintentar}>Intentar de nuevo</button>
    {/if}
  </div>
  {#if comprobado && cierre}
    <p class="cierre">{@html conMath(cierre)}</p>
  {/if}
</div>

<style>
  .om {
    font-size: 1.05rem;
  }
  .pregunta {
    margin: 0 0 0.4rem;
  }
  .ayuda {
    margin: 0 0 0.6rem;
    font-size: var(--t-xs);
    color: var(--tinta-3);
  }
  ul {
    list-style: none;
    margin: 0.6rem 0;
    padding: 0;
    display: grid;
    gap: 0.5rem;
  }
  .opcion {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.6rem 0.85rem;
    border-radius: var(--radio);
    border: 1px solid var(--linea-fuerte);
    background: var(--fondo-elevado);
    text-align: left;
    cursor: pointer;
    transition:
      border-color var(--dur-1) var(--ease),
      background var(--dur-1) var(--ease),
      opacity var(--dur-2) var(--ease),
      transform var(--dur-1) var(--ease);
  }
  .opcion:hover:not(:disabled) {
    border-color: var(--azul);
  }
  .opcion:active:not(:disabled) {
    transform: scale(0.99);
  }
  .opcion:disabled {
    cursor: default;
  }
  .letra {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    border: 1px solid var(--linea-fuerte);
    font-size: var(--t-xs);
    font-weight: 650;
    color: var(--tinta-2);
    transition: all var(--dur-2) var(--ease-out);
  }
  .marcada {
    border-color: var(--azul);
    background: color-mix(in srgb, var(--azul) 7%, var(--fondo-elevado));
  }
  .marcada .letra {
    background: var(--azul);
    border-color: var(--azul);
    color: #fff;
  }
  .opcion.bien {
    border-color: var(--verde);
    background: color-mix(in srgb, var(--verde) 9%, var(--fondo-elevado));
  }
  .opcion.bien .letra {
    background: var(--verde);
    border-color: var(--verde);
    color: #fff;
  }
  .opcion.mal {
    border-color: var(--rojo);
    background: color-mix(in srgb, var(--rojo) 8%, var(--fondo-elevado));
  }
  .opcion.mal .letra {
    background: var(--rojo);
    border-color: var(--rojo);
    color: #fff;
  }
  .atenuada {
    opacity: 0.5;
  }
  .explicacion {
    margin: 0.35rem 0 0.2rem 2.4rem;
    font-size: 0.96rem;
    line-height: 1.55;
    color: var(--tinta-2);
    border-left: 2px solid var(--rojo);
    padding-left: 0.75rem;
    animation: entra var(--dur-3) var(--ease-out);
  }
  .explicacion.bien {
    border-left-color: var(--verde);
  }
  .acciones {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }
  .boton:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .veredicto {
    margin: 0;
    font-weight: 650;
    font-size: var(--t-sm);
    color: var(--rojo);
  }
  .veredicto.bien {
    color: var(--verde);
  }
  .cierre {
    margin: 1rem 0 0;
    font-size: 0.98rem;
    color: var(--tinta-2);
    animation: entra var(--dur-3) var(--ease-out);
  }
  @keyframes entra {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
  }
</style>
