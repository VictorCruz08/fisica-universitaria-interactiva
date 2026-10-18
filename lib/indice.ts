/**
 * Índice del Volumen 1 (12.ª ed.). Sólo títulos y páginas del libro impreso,
 * para que el estudiante pueda cruzar con su ejemplar.
 * `slug` existe únicamente en las secciones ya publicadas: es la ruta de la
 * página (p. ej. '1/7' → /1/7/) y la del archivo en contenido/ (contenido/1/7.mdx).
 * `opcional` = secciones marcadas con * en el libro.
 */

export type SeccionIndice = {
  numero: string;
  titulo: string;
  pagina: number;
  opcional?: boolean;
  slug?: string;
};

export type CapituloIndice = { numero: number; titulo: string; pagina: number; secciones: SeccionIndice[] };
export type ParteIndice = { titulo: string; capitulos: CapituloIndice[] };
export type SeccionPublicada = SeccionIndice & { slug: string; capitulo: number; tituloCapitulo: string };

const s = (numero: string, titulo: string, pagina: number, extra: Partial<SeccionIndice> = {}): SeccionIndice => ({
  numero,
  titulo,
  pagina,
  ...extra,
});

export const indice: ParteIndice[] = [
  {
    titulo: 'Mecánica',
    capitulos: [
      {
        numero: 1,
        titulo: 'Unidades, cantidades físicas y vectores',
        pagina: 1,
        secciones: [
          s('1.1', 'La naturaleza de la física', 2),
          s('1.2', 'Cómo resolver problemas en física', 2),
          s('1.3', 'Estándares y unidades', 4),
          s('1.4', 'Consistencia y conversiones de unidades', 6),
          s('1.5', 'Incertidumbre y cifras significativas', 8),
          s('1.6', 'Estimaciones y órdenes de magnitud', 10),
          s('1.7', 'Vectores y suma de vectores', 11, { slug: '1/7' }),
          s('1.8', 'Componentes de vectores', 15, { slug: '1/8' }),
          s('1.9', 'Vectores unitarios', 20, { slug: '1/9' }),
          s('1.10', 'Producto de vectores', 21, { slug: '1/10' }),
        ],
      },
      {
        numero: 2,
        titulo: 'Movimiento en línea recta',
        pagina: 36,
        secciones: [
          s('2.1', 'Desplazamiento, tiempo y velocidad media', 37),
          s('2.2', 'Velocidad instantánea', 39),
          s('2.3', 'Aceleración media e instantánea', 43),
          s('2.4', 'Movimiento con aceleración constante', 47),
          s('2.5', 'Cuerpos en caída libre', 53),
          s('2.6', 'Velocidad y posición por integración', 57, { opcional: true }),
        ],
      },
      {
        numero: 3,
        titulo: 'Movimiento en dos o en tres dimensiones',
        pagina: 71,
        secciones: [
          s('3.1', 'Vectores de posición y velocidad', 72),
          s('3.2', 'El vector de aceleración', 74),
          s('3.3', 'Movimiento de proyectiles', 79),
          s('3.4', 'Movimiento en un círculo', 87),
          s('3.5', 'Velocidad relativa', 91),
        ],
      },
      {
        numero: 4,
        titulo: 'Leyes del movimiento de Newton',
        pagina: 107,
        secciones: [
          s('4.1', 'Fuerza e interacciones', 108),
          s('4.2', 'Primera ley de Newton', 111),
          s('4.3', 'Segunda ley de Newton', 115),
          s('4.4', 'Masa y peso', 120),
          s('4.5', 'Tercera ley de Newton', 123),
          s('4.6', 'Diagramas de cuerpo libre', 126),
        ],
      },
      {
        numero: 5,
        titulo: 'Aplicación de las leyes de Newton',
        pagina: 136,
        secciones: [
          s('5.1', 'Empleo de la primera ley de Newton: partículas en equilibrio', 136),
          s('5.2', 'Empleo de la segunda ley de Newton: dinámica de partículas', 142),
          s('5.3', 'Fuerzas de fricción', 149),
          s('5.4', 'Dinámica del movimiento circular', 158),
          s('5.5', 'Fuerzas fundamentales de la naturaleza', 163, { opcional: true }),
        ],
      },
      {
        numero: 6,
        titulo: 'Trabajo y energía cinética',
        pagina: 181,
        secciones: [
          s('6.1', 'Trabajo', 182),
          s('6.2', 'Energía cinética y el teorema trabajo-energía', 186),
          s('6.3', 'Trabajo y energía con fuerza variable', 192),
          s('6.4', 'Potencia', 199),
        ],
      },
      {
        numero: 7,
        titulo: 'Energía potencial y conservación de la energía',
        pagina: 213,
        secciones: [
          s('7.1', 'Energía potencial gravitacional', 214),
          s('7.2', 'Energía potencial elástica', 222),
          s('7.3', 'Fuerzas conservativas y no conservativas', 228),
          s('7.4', 'Fuerza y energía potencial', 232),
          s('7.5', 'Diagramas de energía', 235),
        ],
      },
      {
        numero: 8,
        titulo: 'Momento lineal, impulso y choques',
        pagina: 247,
        secciones: [
          s('8.1', 'Momento lineal e impulso', 247),
          s('8.2', 'Conservación del momento lineal', 253),
          s('8.3', 'Conservación del momento lineal y choques', 257),
          s('8.4', 'Choques elásticos', 262),
          s('8.5', 'Centro de masa', 266),
          s('8.6', 'Propulsión a reacción', 270, { opcional: true }),
        ],
      },
      {
        numero: 9,
        titulo: 'Rotación de cuerpos rígidos',
        pagina: 285,
        secciones: [
          s('9.1', 'Velocidad y aceleración angulares', 285),
          s('9.2', 'Rotación con aceleración angular constante', 290),
          s('9.3', 'Relación entre cinemática lineal y angular', 293),
          s('9.4', 'Energía en el movimiento rotacional', 296),
          s('9.5', 'Teorema de los ejes paralelos', 301),
          s('9.6', 'Cálculos de momento de inercia', 303, { opcional: true }),
        ],
      },
      {
        numero: 10,
        titulo: 'Dinámica del movimiento rotacional',
        pagina: 316,
        secciones: [
          s('10.1', 'Torca', 316),
          s('10.2', 'Torca y aceleración angular de un cuerpo rígido', 319),
          s('10.3', 'Rotación de un cuerpo rígido sobre un eje móvil', 323),
          s('10.4', 'Trabajo y potencia en movimiento rotacional', 329),
          s('10.5', 'Momento angular', 331),
          s('10.6', 'Conservación del momento angular', 333),
          s('10.7', 'Giróscopos y precesión', 337),
        ],
      },
      {
        numero: 11,
        titulo: 'Equilibrio y elasticidad',
        pagina: 354,
        secciones: [
          s('11.1', 'Condiciones del equilibrio', 355),
          s('11.2', 'Centro de gravedad', 355),
          s('11.3', 'Resolución de problemas de equilibrio de cuerpos rígidos', 358),
          s('11.4', 'Esfuerzo, deformación y módulos de elasticidad', 363),
          s('11.5', 'Elasticidad y plasticidad', 368),
        ],
      },
      {
        numero: 12,
        titulo: 'Gravitación',
        pagina: 383,
        secciones: [
          s('12.1', 'Ley de Newton de la gravitación', 383),
          s('12.2', 'Peso', 388),
          s('12.3', 'Energía potencial gravitacional', 390),
          s('12.4', 'Movimiento de satélites', 393),
          s('12.5', 'Las leyes de Kepler y el movimiento de los planetas', 396),
          s('12.6', 'Distribuciones esféricas de masa', 400, { opcional: true }),
          s('12.7', 'Peso aparente y rotación terrestre', 403, { opcional: true }),
          s('12.8', 'Agujeros negros', 405),
        ],
      },
      {
        numero: 13,
        titulo: 'Movimiento periódico',
        pagina: 419,
        secciones: [
          s('13.1', 'Descripción de la oscilación', 419),
          s('13.2', 'Movimiento armónico simple', 421),
          s('13.3', 'Energía en el movimiento armónico simple', 428),
          s('13.4', 'Aplicaciones del movimiento armónico simple', 432),
          s('13.5', 'El péndulo simple', 436),
          s('13.6', 'El péndulo físico', 438),
          s('13.7', 'Oscilaciones amortiguadas', 440),
          s('13.8', 'Oscilaciones forzadas y resonancia', 442),
        ],
      },
      {
        numero: 14,
        titulo: 'Mecánica de fluidos',
        pagina: 456,
        secciones: [
          s('14.1', 'Densidad', 456),
          s('14.2', 'Presión en un fluido', 458),
          s('14.3', 'Flotación', 463),
          s('14.4', 'Flujo de fluido', 466),
          s('14.5', 'Ecuación de Bernoulli', 468),
          s('14.6', 'Viscosidad y turbulencia', 472, { opcional: true }),
        ],
      },
    ],
  },
  {
    titulo: 'Ondas y acústica',
    capitulos: [
      {
        numero: 15,
        titulo: 'Ondas mecánicas',
        pagina: 487,
        secciones: [
          s('15.1', 'Tipos de ondas mecánicas', 488),
          s('15.2', 'Ondas periódicas', 489),
          s('15.3', 'Descripción matemática de una onda', 492),
          s('15.4', 'Rapidez de una onda transversal', 498),
          s('15.5', 'Energía del movimiento ondulatorio', 502),
          s('15.6', 'Interferencia de ondas, condiciones de frontera y superposición', 505),
          s('15.7', 'Ondas estacionarias en una cuerda', 507),
          s('15.8', 'Modos normales de una cuerda', 511),
        ],
      },
      {
        numero: 16,
        titulo: 'Sonido y el oído',
        pagina: 527,
        secciones: [
          s('16.1', 'Ondas sonoras', 527),
          s('16.2', 'Rapidez de las ondas sonoras', 532),
          s('16.3', 'Intensidad del sonido', 537),
          s('16.4', 'Ondas sonoras estacionarias y modos normales', 541),
          s('16.5', 'Resonancia', 546),
          s('16.6', 'Interferencia de ondas', 548),
          s('16.7', 'Pulsos', 550),
          s('16.8', 'El efecto Doppler', 552),
          s('16.9', 'Ondas de choque', 558, { opcional: true }),
        ],
      },
    ],
  },
  {
    titulo: 'Termodinámica',
    capitulos: [
      {
        numero: 17,
        titulo: 'Temperatura y calor',
        pagina: 570,
        secciones: [
          s('17.1', 'Temperatura y equilibrio térmico', 571),
          s('17.2', 'Termómetros y escalas de temperatura', 572),
          s('17.3', 'Termómetros de gas y la escala Kelvin', 574),
          s('17.4', 'Expansión térmica', 576),
          s('17.5', 'Cantidad de calor', 582),
          s('17.6', 'Calorimetría y cambios de fase', 586),
          s('17.7', 'Mecanismos de transferencia de calor', 591),
        ],
      },
      {
        numero: 18,
        titulo: 'Propiedades térmicas de la materia',
        pagina: 610,
        secciones: [
          s('18.1', 'Ecuaciones de estado', 611),
          s('18.2', 'Propiedades moleculares de la materia', 617),
          s('18.3', 'Modelo cinético-molecular del gas ideal', 619),
          s('18.4', 'Capacidades caloríficas', 626),
          s('18.5', 'Rapideces moleculares', 629, { opcional: true }),
          s('18.6', 'Fases de la materia', 631),
        ],
      },
      {
        numero: 19,
        titulo: 'La primera ley de la termodinámica',
        pagina: 646,
        secciones: [
          s('19.1', 'Sistemas termodinámicos', 646),
          s('19.2', 'Trabajo realizado al cambiar el volumen', 647),
          s('19.3', 'Trayectoria entre estados termodinámicos', 650),
          s('19.4', 'Energía interna y la primera ley de la termodinámica', 651),
          s('19.5', 'Tipos de procesos termodinámicos', 656),
          s('19.6', 'Energía interna de un gas ideal', 658),
          s('19.7', 'Capacidad calorífica del gas ideal', 659),
          s('19.8', 'Proceso adiabático para el gas ideal', 662),
        ],
      },
      {
        numero: 20,
        titulo: 'La segunda ley de la termodinámica',
        pagina: 673,
        secciones: [
          s('20.1', 'Dirección de los procesos termodinámicos', 673),
          s('20.2', 'Máquinas térmicas', 675),
          s('20.3', 'Motores de combustión interna', 678),
          s('20.4', 'Refrigeradores', 680),
          s('20.5', 'La segunda ley de la termodinámica', 682),
          s('20.6', 'El ciclo de Carnot', 684),
          s('20.7', 'Entropía', 690),
          s('20.8', 'Interpretación microscópica de la entropía', 697, { opcional: true }),
        ],
      },
    ],
  },
];

/** Secciones publicadas, en orden de lectura. */
export const seccionesPublicadas = (): SeccionPublicada[] =>
  indice.flatMap((p) =>
    p.capitulos.flatMap((c) =>
      c.secciones
        .filter((x): x is SeccionIndice & { slug: string } => Boolean(x.slug))
        .map((x) => ({ ...x, capitulo: c.numero, tituloCapitulo: c.titulo })),
    ),
  );
