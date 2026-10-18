<script lang="ts">
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import Poligono from '../nucleo/Poligono.svelte';
  import Arco from '../nucleo/Arco.svelte';
  import { tex } from '../../../lib/katex';
  import { RAD, escala, fmt, rotar, suma, type Vec2 } from '../../../lib/vec';

  let alfa = $state(25);
  const W = 2.6;

  // Rampa que sube hacia la derecha; la caja se apoya en su superficie.
  const pie: Vec2 = { x: -3.2, y: -1.6 };
  const largo = 6.4;
  const u = $derived(rotar({ x: 1, y: 0 }, alfa)); // a lo largo de la rampa (eje x')
  const n = $derived(rotar({ x: 0, y: 1 }, alfa)); // perpendicular (eje y')
  const cima = $derived(suma(pie, escala(largo, u)));
  const esquina = $derived({ x: cima.x, y: pie.y });

  const c = $derived(suma(pie, escala(largo * 0.55, u))); // contacto de la caja
  const lado = 0.9;
  const caja = $derived([c, suma(c, escala(lado, u)), suma(suma(c, escala(lado, u)), escala(lado, n)), suma(c, escala(lado, n))]);
  const centro = $derived(suma(suma(c, escala(lado / 2, u)), escala(lado / 2, n)));

  const peso: Vec2 = { x: 0, y: -W };
  const Wx = $derived(-W * Math.sin(alfa * RAD));
  const Wy = $derived(-W * Math.cos(alfa * RAD));
</script>

<div class="int">
  <div class="int-lienzo">
    <Plano x={[-3.8, 3.8]} y={[-2.2, 3.4]} rejilla={false} ejes={false} titulo="Caja en una rampa con ejes inclinados" altoMax={380}>
      <Poligono puntos={[pie, cima, esquina]} relleno="var(--fondo-hundido)" borde="var(--linea-fuerte)" />
      <Arco centro={pie} desde={0} hasta={alfa} radio={46} color="var(--tinta-3)" />
      <Etiqueta en={pie} t={'\\alpha'} color="var(--tinta-2)" dx={60 * Math.cos((alfa / 2) * RAD)} dy={-60 * Math.sin((alfa / 2) * RAD)} tamano={14} />
      <Poligono puntos={caja} relleno="color-mix(in srgb, var(--arena) 55%, var(--fondo-elevado))" borde="var(--ocre)" />

      <!-- Ejes inclinados -->
      <Flecha desde={suma(centro, escala(-1.6, u))} hasta={suma(centro, escala(2.2, u))} color="var(--tinta-3)" grosor={1.2} punta={9} />
      <Flecha desde={suma(centro, escala(-1.4, n))} hasta={suma(centro, escala(2.0, n))} color="var(--tinta-3)" grosor={1.2} punta={9} />
      <Etiqueta en={suma(centro, escala(2.2, u))} t={"x'"} color="var(--tinta-2)" dx={10} dy={-12} tamano={15} />
      <Etiqueta en={suma(centro, escala(2.0, n))} t={"y'"} color="var(--tinta-2)" dx={14} tamano={15} />

      <!-- Componentes -->
      <Poligono puntos={[suma(centro, escala(Wx, u)), suma(centro, peso), suma(centro, escala(Wy, n))]} cerrado={false} borde="var(--tinta-3)" grosor={1} discontinuo />
      <Flecha desde={centro} hasta={suma(centro, escala(Wx, u))} color="var(--vec-x)" grosor={2.2} opacidad={0.7} />
      <Flecha desde={centro} hasta={suma(centro, escala(Wy, n))} color="var(--vec-y)" grosor={2.2} opacidad={0.7} />
      <Flecha desde={centro} hasta={suma(centro, peso)} color="var(--vec-d)" grosor={3} />
      <Etiqueta en={suma(centro, peso)} t={'\\vec{w}'} color="var(--vec-d)" dx={16} dy={6} />
    </Plano>
  </div>
  <div class="int-lectura">
    <span class="x">{@html tex(`w_{x'} = -w\\sin\\alpha = ${fmt(Wx / W, 2)}\\,w`)}</span>
    <span class="y">{@html tex(`w_{y'} = -w\\cos\\alpha = ${fmt(Wy / W, 2)}\\,w`)}</span>
    <span class="tenue">{@html tex(`\\sqrt{w_{x'}^2 + w_{y'}^2} = w \\;\\text{(siempre)}`)}</span>
  </div>
  <div class="int-barra">
    <label class="int-deslizador">
      <span>Inclinación {@html tex('\\alpha')}</span>
      <input type="range" min="0" max="50" step="1" bind:value={alfa} />
      <output>{alfa}°</output>
    </label>
  </div>
</div>

<style>
  .x :global(.katex) {
    color: var(--vec-x);
  }
  .y :global(.katex) {
    color: var(--vec-y);
  }
  .tenue {
    color: var(--tinta-3);
  }
</style>
