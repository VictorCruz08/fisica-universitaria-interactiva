<script lang="ts">
  import type { Vec2, Vec3 } from '../../../lib/vec';
  import { usarLienzo } from './contexto';

  interface Props {
    puntos: (Vec2 | Vec3)[];
    relleno?: string;
    borde?: string;
    grosor?: number;
    opacidad?: number;
    cerrado?: boolean;
    discontinuo?: boolean;
    /** Radio de esquinas en px (sólo para rectángulos de 4 puntos alineados). */
    redondeo?: number;
  }

  let {
    puntos,
    relleno = 'none',
    borde = 'none',
    grosor = 1.5,
    opacidad = 1,
    cerrado = true,
    discontinuo = false,
  }: Props = $props();

  const l = usarLienzo();
  const d = $derived(
    puntos
      .map((p, i) => {
        const q = l.aPx(p);
        return `${i === 0 ? 'M' : 'L'}${q.x.toFixed(2)},${q.y.toFixed(2)}`;
      })
      .join(' ') + (cerrado ? ' Z' : ''),
  );
</script>

<path
  {d}
  fill={relleno}
  stroke={borde}
  stroke-width={grosor}
  stroke-linejoin="round"
  stroke-linecap="round"
  stroke-dasharray={discontinuo ? '5 5' : undefined}
  opacity={opacidad}
/>
