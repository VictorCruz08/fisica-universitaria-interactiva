<script lang="ts">
  import { tex } from '../../../lib/katex';

  const ejes = ['x', 'y', 'z'] as const;
  const gorro: Record<string, string> = { x: '\\hat\\imath', y: '\\hat\\jmath', z: '\\hat k' };

  // Ejemplo numérico opcional
  const A = { x: 2, y: -1, z: 3 };
  const B = { x: 1, y: 4, z: 2 };

  let simplificado = $state(false);
  let numerico = $state(false);

  const valor = (f: (typeof ejes)[number], c: (typeof ejes)[number]) => A[f] * B[c];
  const total = A.x * B.x + A.y * B.y + A.z * B.z;
  const par = (v: number) => (v < 0 ? `(${v})` : String(v));
</script>

<div class="int">
  <div class="cuerpo">
    <p class="arriba">
      {#if numerico}
        {@html tex('\\vec A\\cdot\\vec B = (2\\hat\\imath - \\hat\\jmath + 3\\hat k)\\cdot(\\hat\\imath + 4\\hat\\jmath + 2\\hat k)', true)}
      {:else}
        {@html tex('\\vec A\\cdot\\vec B = (A_x\\hat\\imath + A_y\\hat\\jmath + A_z\\hat k)\\cdot(B_x\\hat\\imath + B_y\\hat\\jmath + B_z\\hat k)', true)}
      {/if}
    </p>
    <div class="rejilla" role="table" aria-label="Los nueve términos del producto">
      {#each ejes as f, i}
        {#each ejes as c, j}
          {@const diag = f === c}
          <div class="celda" class:diag class:nula={simplificado && !diag} class:una={simplificado && diag} style:--retraso={`${(i * 3 + j) * 45}ms`} role="cell">
            <span class="termino">
              {#if numerico}
                {@html tex(`${par(A[f])}\\cdot${par(B[c])}\\,(${gorro[f]}\\cdot${gorro[c]})`)}
              {:else}
                {@html tex(`A_${f}B_${c}\\,(${gorro[f]}\\cdot${gorro[c]})`)}
              {/if}
            </span>
            <span class="val">
              {#if simplificado}
                {@html tex(diag ? (numerico ? String(valor(f, c)) : `A_${f}B_${c}`) : '0')}
              {/if}
            </span>
          </div>
        {/each}
      {/each}
    </div>
    <p class="abajo" class:visible={simplificado} aria-live="polite">
      {#if simplificado}
        {#if numerico}
          {@html tex(`\\vec A\\cdot\\vec B = 2 + (-4) + 6 = ${total}`, true)}
        {:else}
          {@html tex('\\vec A\\cdot\\vec B = A_xB_x + A_yB_y + A_zB_z', true)}
        {/if}
      {/if}
    </p>
  </div>
  <div class="int-barra">
    <button type="button" class="boton primario" onclick={() => (simplificado = !simplificado)}>
      {simplificado ? 'Ver los nueve términos' : 'Aplicar î·î = 1 e î·ĵ = 0'}
    </button>
    <div class="int-segmentado empuje" role="group" aria-label="Tipo de ejemplo">
      <button type="button" aria-pressed={!numerico} onclick={() => (numerico = false)}>Símbolos</button>
      <button type="button" aria-pressed={numerico} onclick={() => (numerico = true)}>Números</button>
    </div>
  </div>
</div>

<style>
  .cuerpo {
    padding: 0.6rem 1.2rem 0.4rem;
    overflow-x: auto;
  }
  .arriba,
  .abajo {
    margin: 0;
    font-family: var(--fuente-texto);
  }
  .abajo {
    min-height: 3.6rem;
    opacity: 0;
    transform: translateY(6px);
    transition:
      opacity var(--dur-3) var(--ease-out) 380ms,
      transform var(--dur-3) var(--ease-out) 380ms;
  }
  .abajo.visible {
    opacity: 1;
    transform: none;
  }
  .rejilla {
    display: grid;
    grid-template-columns: repeat(3, minmax(9.5rem, 1fr));
    gap: 0.45rem;
    min-width: 30rem;
  }
  .celda {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    padding: 0.6rem 0.4rem;
    border-radius: var(--radio);
    border: 1px solid var(--linea);
    background: var(--fondo);
    transition:
      opacity var(--dur-3) var(--ease-out) var(--retraso),
      transform var(--dur-3) var(--ease-out) var(--retraso),
      background var(--dur-3) var(--ease) var(--retraso),
      border-color var(--dur-3) var(--ease) var(--retraso);
  }
  .termino {
    font-size: 0.95rem;
  }
  .val {
    min-height: 1.6rem;
    font-size: 1.05rem;
  }
  .celda.nula {
    opacity: 0.32;
    transform: scale(0.96);
  }
  .celda.nula .termino {
    text-decoration: line-through;
    text-decoration-color: var(--rojo);
  }
  .celda.una {
    border-color: var(--verde);
    background: color-mix(in srgb, var(--verde) 9%, var(--fondo-elevado));
  }
  .celda.una .val :global(.katex) {
    color: var(--verde);
  }
</style>
