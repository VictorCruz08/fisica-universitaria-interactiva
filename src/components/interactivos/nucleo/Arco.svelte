<script lang="ts">
  import type { Vec2 } from '../../../lib/vec';
  import { RAD } from '../../../lib/vec';
  import { usarLienzo } from './contexto';

  interface Props {
    centro: Vec2;
    /** Ángulos en grados, medidos desde +x en sentido antihorario. */
    desde: number;
    hasta: number;
    /** Radio en píxeles. */
    radio?: number;
    color?: string;
    /** Dibuja una puntita al final para indicar el sentido. */
    sentido?: boolean;
    relleno?: boolean;
  }

  let { centro, desde, hasta, radio = 34, color = 'var(--ocre)', sentido = false, relleno = false }: Props = $props();
  const l = usarLienzo();

  const d = $derived.by(() => {
    const c = l.aPx(centro);
    // En pantalla y crece hacia abajo: el ángulo visual se invierte.
    const punto = (g: number) => ({ x: c.x + radio * Math.cos(g * RAD), y: c.y - radio * Math.sin(g * RAD) });
    const a = punto(desde);
    const b = punto(hasta);
    const barrido = hasta - desde;
    const grande = Math.abs(barrido) > 180 ? 1 : 0;
    const dir = barrido > 0 ? 0 : 1;
    const arco = `M${a.x},${a.y} A${radio},${radio} 0 ${grande} ${dir} ${b.x},${b.y}`;
    const area = `M${c.x},${c.y} L${a.x},${a.y} A${radio},${radio} 0 ${grande} ${dir} ${b.x},${b.y} Z`;
    let cabeza = '';
    if (sentido && Math.abs(barrido) > 8) {
      const t = (hasta * RAD) as number;
      const s = Math.sign(barrido);
      // tangente en pantalla
      const tx = -Math.sin(t) * s;
      const ty = -Math.cos(t) * s;
      const nx = Math.cos(t);
      const ny = -Math.sin(t);
      const k = 7;
      cabeza = `M${b.x + tx * 2},${b.y + ty * 2} L${b.x - tx * k + nx * k * 0.55},${b.y - ty * k + ny * k * 0.55} L${b.x - tx * k - nx * k * 0.55},${b.y - ty * k - ny * k * 0.55} Z`;
    }
    return { arco, area, cabeza };
  });
</script>

{#if relleno}<path d={d.area} fill={color} opacity="0.1" />{/if}
<path d={d.arco} fill="none" stroke={color} stroke-width="1.6" />
{#if d.cabeza}<path d={d.cabeza} fill={color} />{/if}
