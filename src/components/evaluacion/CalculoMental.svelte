<script lang="ts">
  import { conMath } from '../../lib/katex';
  import { registrarRespuesta } from '../../lib/progreso';

  type Reto = {
    pregunta: string;
    respuesta: number;
    /** Tolerancia absoluta aceptada (por defecto 2 % de la respuesta, mínimo 0.05). */
    tolerancia?: number;
    unidad?: string;
    pista?: string;
    /** Cómo se hace de cabeza. */
    truco: string;
  };

  interface Props {
    id: string;
    retos: Reto[];
  }

  let { id, retos }: Props = $props();

  let indice = $state(0);
  let entrada = $state('');
  let estado = $state<'pendiente' | 'bien' | 'mal'>('pendiente');
  let verPista = $state(false);

  const reto = $derived(retos[indice]);

  // Sin <form>: si alguien pulsa antes de que la isla se hidrate, no se recarga la página.
  function comprobar() {
    const valor = Number(entrada.replace(',', '.').trim());
    if (!Number.isFinite(valor) || entrada.trim() === '') return;
    const tol = reto.tolerancia ?? Math.max(0.05, Math.abs(reto.respuesta) * 0.02);
    estado = Math.abs(valor - reto.respuesta) <= tol ? 'bien' : 'mal';
    registrarRespuesta(`${id}-${indice}`, estado === 'bien');
  }

  function siguiente() {
    indice = (indice + 1) % retos.length;
    entrada = '';
    estado = 'pendiente';
    verPista = false;
  }
</script>

<div class="cm">
  <div class="cabeza ui">
    <span class="titulo">
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <rect x="3.5" y="2.5" width="13" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.6" />
        <path d="M7 6.5h6M7 10h1.5M11.5 10H13M7 13.5h1.5M11.5 13.5H13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
      Cálculo mental · sin calculadora
    </span>
    <span class="contador">{indice + 1} / {retos.length}</span>
  </div>

  {#key indice}
    <p class="pregunta">{@html conMath(reto.pregunta)}</p>
  {/key}

  <div class="fila">
    <label class="sr-only" for={`cm-${id}`}>Tu respuesta</label>
    <input
      id={`cm-${id}`}
      type="text"
      inputmode="decimal"
      autocomplete="off"
      placeholder="Tu respuesta"
      bind:value={entrada}
      class:bien={estado === 'bien'}
      class:mal={estado === 'mal'}
      disabled={estado === 'bien'}
      onkeydown={(e) => e.key === 'Enter' && comprobar()}
    />
    {#if reto.unidad}<span class="unidad ui">{reto.unidad}</span>{/if}
    {#if estado !== 'bien'}
      <button type="button" class="boton primario" onclick={comprobar}>Comprobar</button>
    {/if}
  </div>

  <div aria-live="polite">
    {#if estado === 'mal'}
      <p class="mensaje mal ui">Todavía no. Inténtalo otra vez{reto.pista ? ' o pide una pista' : ''}.</p>
    {/if}
    {#if estado === 'bien'}
      <p class="mensaje bien ui">¡Exacto!</p>
      <p class="truco">{@html conMath(reto.truco)}</p>
    {/if}
    {#if verPista && reto.pista && estado !== 'bien'}
      <p class="truco">{@html conMath(reto.pista)}</p>
    {/if}
  </div>

  <div class="acciones">
    {#if reto.pista && !verPista && estado !== 'bien'}
      <button type="button" class="boton" onclick={() => (verPista = true)}>Pista</button>
    {/if}
    {#if estado === 'mal'}
      <button type="button" class="boton" onclick={() => (estado = 'bien')}>Ver respuesta</button>
    {/if}
    {#if estado === 'bien' && retos.length > 1}
      <button type="button" class="boton" onclick={siguiente}>
        {indice + 1 < retos.length ? 'Siguiente' : 'Volver al primero'}
      </button>
    {/if}
  </div>
  {#if estado === 'bien'}
    <p class="valor ui">Respuesta: {reto.respuesta} {reto.unidad ?? ''}</p>
  {/if}
</div>

<style>
  .cm {
    margin: 2.6rem 0;
    padding: 1.3rem 1.5rem;
    border-radius: var(--radio-l);
    background: var(--fondo-hundido);
    border: 1px solid var(--linea);
  }
  .cabeza {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--verde);
    font-size: var(--t-xs);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .titulo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .contador {
    color: var(--tinta-3);
    font-variant-numeric: tabular-nums;
  }
  .pregunta {
    margin: 0.6rem 0 0.9rem;
    animation: entra var(--dur-3) var(--ease-out);
  }
  .fila {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  input {
    width: 9rem;
    padding: 0.5rem 0.8rem;
    border-radius: var(--radio);
    border: 1px solid var(--linea-fuerte);
    background: var(--fondo-elevado);
    color: var(--tinta);
    font-family: var(--fuente-ui);
    font-size: 1rem;
    font-variant-numeric: tabular-nums;
    transition: border-color var(--dur-1) var(--ease);
  }
  input.bien {
    border-color: var(--verde);
  }
  input.mal {
    border-color: var(--rojo);
    animation: sacude 360ms var(--ease);
  }
  .unidad {
    color: var(--tinta-2);
    font-size: var(--t-sm);
  }
  .mensaje {
    margin: 0.7rem 0 0;
    font-size: var(--t-sm);
    font-weight: 650;
  }
  .mensaje.bien {
    color: var(--verde);
  }
  .mensaje.mal {
    color: var(--rojo);
  }
  .truco {
    margin: 0.5rem 0 0;
    padding-left: 0.85rem;
    border-left: 2px solid var(--verde);
    color: var(--tinta-2);
    font-size: 0.98rem;
    animation: entra var(--dur-3) var(--ease-out);
  }
  .valor {
    margin: 0.6rem 0 0;
    font-size: var(--t-xs);
    color: var(--tinta-3);
  }
  .acciones {
    display: flex;
    gap: 0.6rem;
    margin-top: 0.7rem;
  }
  @keyframes entra {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
  }
  @keyframes sacude {
    25% {
      transform: translateX(-4px);
    }
    75% {
      transform: translateX(4px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    input.mal {
      animation: none;
    }
  }
</style>
