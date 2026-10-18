<script lang="ts">
  import { conMath } from '../../lib/katex';

  interface Props {
    pregunta: string;
    /** Respuesta modelo que se revela cuando el estudiante decide. */
    respuesta: string;
    /** Pista opcional antes de revelar. */
    pista?: string;
  }

  let { pregunta, respuesta, pista }: Props = $props();
  const uid = $props.id();
  let verPista = $state(false);
  let revelada = $state(false);
  let notas = $state('');
</script>

<div class="reflexion">
  <div class="cabeza ui">
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <path
        d="M10 2.5a5.5 5.5 0 0 0-3.2 10V15h6.4v-2.5A5.5 5.5 0 0 0 10 2.5Z"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <path d="M7.8 17.5h4.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
    <span>Para reflexionar</span>
  </div>
  <p class="pregunta">{@html conMath(pregunta)}</p>

  <label class="sr-only" for={`notas-${uid}`}>Tus ideas (opcional)</label>
  <textarea
    id={`notas-${uid}`}
    rows="2"
    placeholder="Escribe tu idea antes de ver la respuesta (opcional)…"
    bind:value={notas}
  ></textarea>

  <div class="acciones">
    {#if pista && !verPista && !revelada}
      <button type="button" class="boton" onclick={() => (verPista = true)}>Pista</button>
    {/if}
    {#if !revelada}
      <button type="button" class="boton primario" onclick={() => (revelada = true)}>Ver una respuesta</button>
    {/if}
  </div>
  {#if verPista && !revelada && pista}
    <p class="pista">{@html conMath(pista)}</p>
  {/if}
  {#if revelada}
    <p class="respuesta">{@html conMath(respuesta)}</p>
  {/if}
</div>

<style>
  .reflexion {
    margin: 2.6rem 0;
    padding: 1.3rem 1.5rem;
    border-radius: var(--radio-l);
    border: 1px dashed var(--linea-fuerte);
  }
  .cabeza {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--magenta);
    font-size: var(--t-xs);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .pregunta {
    margin: 0.5rem 0 0.8rem;
  }
  textarea {
    width: 100%;
    resize: vertical;
    padding: 0.6rem 0.8rem;
    border-radius: var(--radio);
    border: 1px solid var(--linea-fuerte);
    background: var(--fondo-elevado);
    color: var(--tinta);
    font-family: var(--fuente-texto);
    font-size: 1rem;
  }
  .acciones {
    display: flex;
    gap: 0.6rem;
    margin-top: 0.7rem;
  }
  .pista,
  .respuesta {
    margin: 0.9rem 0 0;
    padding-left: 0.85rem;
    border-left: 2px solid var(--ocre);
    color: var(--tinta-2);
    animation: entra var(--dur-3) var(--ease-out);
  }
  .respuesta {
    border-left-color: var(--magenta);
  }
  @keyframes entra {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
  }
</style>
