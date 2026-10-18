<script lang="ts">
  import type { Vec2 } from '../../../lib/vec';
  import { usarLienzo } from './contexto';

  interface Props {
    /** Posición en coordenadas del mundo (bindable). */
    pos: Vec2;
    color?: string;
    /** Paso de ajuste a la rejilla (0 = libre). También es el paso con flechas del teclado. */
    paso?: number;
    /** Restricción opcional, p. ej. limitar al área visible o a una magnitud. */
    restringir?: (p: Vec2) => Vec2;
    /** Nombre accesible, p. ej. "punta del vector A". */
    nombre: string;
    onmover?: (p: Vec2) => void;
  }

  let { pos = $bindable(), color = 'var(--vec-a)', paso = 0.5, restringir, nombre, onmover }: Props = $props();
  const l = usarLienzo();
  const p = $derived(l.aPx(pos));
  let arrastrando = $state(false);

  const ajustar = (v: Vec2): Vec2 => {
    const s = paso > 0 ? { x: Math.round(v.x / paso) * paso, y: Math.round(v.y / paso) * paso } : v;
    const r = restringir ? restringir(s) : s;
    return { x: Number(r.x.toFixed(4)), y: Number(r.y.toFixed(4)) };
  };

  const fijar = (v: Vec2) => {
    pos = ajustar(v);
    onmover?.(pos);
  };

  function bajar(ev: PointerEvent) {
    arrastrando = true;
    (ev.currentTarget as Element).setPointerCapture(ev.pointerId);
    ev.preventDefault();
  }
  function mover(ev: PointerEvent) {
    if (arrastrando) fijar(l.aMundo(ev));
  }
  function subir() {
    arrastrando = false;
  }
  function teclado(ev: KeyboardEvent) {
    const d = paso > 0 ? paso : 0.1;
    const mapa: Record<string, Vec2> = {
      ArrowRight: { x: d, y: 0 },
      ArrowLeft: { x: -d, y: 0 },
      ArrowUp: { x: 0, y: d },
      ArrowDown: { x: 0, y: -d },
    };
    const m = mapa[ev.key];
    if (!m) return;
    ev.preventDefault();
    fijar({ x: pos.x + m.x, y: pos.y + m.y });
  }
</script>

<g
  class="manija"
  class:arrastrando
  role="slider"
  tabindex="0"
  aria-label={`${nombre}: arrastra o usa las flechas del teclado`}
  aria-valuetext={`x = ${pos.x}, y = ${pos.y}`}
  aria-valuenow={pos.x}
  onpointerdown={bajar}
  onpointermove={mover}
  onpointerup={subir}
  onpointercancel={subir}
  onkeydown={teclado}
>
  <circle class="zona" cx={p.x} cy={p.y} r="22" />
  <circle class="halo" cx={p.x} cy={p.y} r="13" fill={color} />
  <circle class="punto" cx={p.x} cy={p.y} r="6.5" fill="var(--fondo-elevado)" stroke={color} />
</g>

<style>
  .manija {
    cursor: grab;
    outline: none;
  }
  .manija.arrastrando {
    cursor: grabbing;
  }
  .zona {
    fill: transparent;
  }
  .halo {
    opacity: 0;
    transition:
      opacity var(--dur-1) var(--ease),
      r var(--dur-2) var(--ease-spring);
  }
  .manija:hover .halo,
  .manija:focus-visible .halo {
    opacity: 0.16;
  }
  .manija.arrastrando .halo {
    opacity: 0.22;
    r: 17px;
  }
  .punto {
    stroke-width: 2.6;
    transition: r var(--dur-2) var(--ease-spring);
  }
  .manija:focus-visible .punto {
    stroke-width: 3.5;
  }
</style>
