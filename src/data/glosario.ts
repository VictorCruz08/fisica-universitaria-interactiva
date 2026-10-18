/**
 * Glosario: definiciones breves y originales. Alimenta los tooltips de
 * <Termino> y la página /glosario. Clave = id en minúsculas, sin acentos.
 * `seccion` indica dónde se introduce el término.
 */

export type EntradaGlosario = {
  termino: string;
  definicion: string;
  seccion: string;
};

export const glosario: Record<string, EntradaGlosario> = {
  escalar: {
    termino: 'Cantidad escalar',
    definicion: 'Cantidad que queda descrita por completo con un número y su unidad: masa, tiempo, temperatura.',
    seccion: '1.7',
  },
  vector: {
    termino: 'Cantidad vectorial',
    definicion: 'Cantidad que necesita una magnitud y una dirección en el espacio para describirse: desplazamiento, velocidad, fuerza.',
    seccion: '1.7',
  },
  magnitud: {
    termino: 'Magnitud',
    definicion: 'El “qué tanto” de un vector: su tamaño, sin importar hacia dónde apunta. Siempre es un número positivo (o cero).',
    seccion: '1.7',
  },
  desplazamiento: {
    termino: 'Desplazamiento',
    definicion: 'Cambio de posición de un punto: la flecha recta que va de la posición inicial a la final, sin importar el camino recorrido.',
    seccion: '1.7',
  },
  trayectoria: {
    termino: 'Trayectoria',
    definicion: 'El camino que realmente sigue un objeto al moverse. Puede ser curvo aunque el desplazamiento sea recto.',
    seccion: '1.7',
  },
  particula: {
    termino: 'Partícula',
    definicion: 'Modelo de un objeto tan pequeño (comparado con las distancias del problema) que lo tratamos como un punto.',
    seccion: '1.7',
  },
  paralelos: {
    termino: 'Vectores paralelos',
    definicion: 'Vectores que apuntan en la misma dirección, aunque tengan distinta magnitud.',
    seccion: '1.7',
  },
  antiparalelos: {
    termino: 'Vectores antiparalelos',
    definicion: 'Vectores que apuntan en direcciones opuestas, tengan o no la misma magnitud.',
    seccion: '1.7',
  },
  negativo: {
    termino: 'Negativo de un vector',
    definicion: 'Vector con la misma magnitud que el original pero dirección opuesta. Se escribe con un signo menos delante.',
    seccion: '1.7',
  },
  resultante: {
    termino: 'Resultante (suma vectorial)',
    definicion: 'El único vector que produce el mismo efecto que varios vectores combinados; va de la cola del primero a la punta del último.',
    seccion: '1.7',
  },
  conmutativa: {
    termino: 'Ley conmutativa',
    definicion: 'Propiedad de una operación en la que el orden no altera el resultado: A + B = B + A.',
    seccion: '1.7',
  },
  asociativa: {
    termino: 'Ley asociativa',
    definicion: 'Propiedad que permite agrupar los términos como se quiera: (A + B) + C = A + (B + C).',
    seccion: '1.7',
  },
  'valor-absoluto': {
    termino: 'Valor absoluto',
    definicion: 'El tamaño de un número sin su signo: |−3| = 3 y |3| = 3.',
    seccion: '1.7',
  },
  escala: {
    termino: 'Escala de un diagrama',
    definicion: 'Equivalencia entre la longitud dibujada y la cantidad real, como en un mapa: 1 cm del dibujo = 5 km reales.',
    seccion: '1.7',
  },
  pitagoras: {
    termino: 'Teorema de Pitágoras',
    definicion: 'En un triángulo rectángulo, el cuadrado de la hipotenusa es la suma de los cuadrados de los catetos: c² = a² + b².',
    seccion: '1.7',
  },
  hipotenusa: {
    termino: 'Hipotenusa',
    definicion: 'El lado más largo de un triángulo rectángulo, opuesto al ángulo de 90°.',
    seccion: '1.7',
  },
  catetos: {
    termino: 'Catetos',
    definicion: 'Los dos lados de un triángulo rectángulo que forman el ángulo de 90°.',
    seccion: '1.7',
  },
  cartesiano: {
    termino: 'Sistema cartesiano',
    definicion: 'Ejes de coordenadas perpendiculares entre sí (x, y y, en 3D, z) que se cruzan en un punto llamado origen.',
    seccion: '1.8',
  },
  origen: {
    termino: 'Origen',
    definicion: 'Punto donde se cruzan los ejes de coordenadas; ahí todas las coordenadas valen cero.',
    seccion: '1.8',
  },
  'vectores-componentes': {
    termino: 'Vectores componentes',
    definicion: 'Dos (o tres) vectores, cada uno paralelo a un eje, cuya suma reconstruye el vector original.',
    seccion: '1.8',
  },
  componentes: {
    termino: 'Componentes',
    definicion: 'Los números Aₓ, A_y (y A_z) que dicen cuánto avanza un vector a lo largo de cada eje. Pueden ser negativos. No son vectores.',
    seccion: '1.8',
  },
  cuadrante: {
    termino: 'Cuadrante',
    definicion: 'Cada una de las cuatro regiones en que los ejes x y y dividen el plano. Se numeran I a IV en sentido antihorario desde arriba a la derecha.',
    seccion: '1.8',
  },
  seno: {
    termino: 'Seno y coseno',
    definicion: 'En un triángulo rectángulo: sen θ = cateto opuesto / hipotenusa y cos θ = cateto adyacente / hipotenusa.',
    seccion: '1.8',
  },
  tangente: {
    termino: 'Tangente',
    definicion: 'En un triángulo rectángulo: tan θ = cateto opuesto / cateto adyacente. También es sen θ / cos θ.',
    seccion: '1.8',
  },
  arctan: {
    termino: 'Arco tangente (arctan)',
    definicion: 'Función inversa de la tangente: responde “¿qué ángulo tiene esta tangente?”. En calculadoras aparece como tan⁻¹.',
    seccion: '1.8',
  },
  radian: {
    termino: 'Radián',
    definicion: 'Otra unidad para medir ángulos: una vuelta completa son 2π rad = 360°. Revisa que tu calculadora esté en grados (DEG).',
    seccion: '1.8',
  },
  unitario: {
    termino: 'Vector unitario',
    definicion: 'Vector de magnitud exactamente 1 y sin unidades; sólo sirve para señalar una dirección. Se marca con un “sombrero”: î.',
    seccion: '1.9',
  },
  'producto-escalar': {
    termino: 'Producto escalar (punto)',
    definicion: 'Operación entre dos vectores que da un número: A·B = AB cos φ. Mide cuánto apunta un vector en la dirección del otro.',
    seccion: '1.10',
  },
  proyeccion: {
    termino: 'Proyección',
    definicion: 'La “sombra” de un vector sobre la dirección de otro, como la que deja un palo inclinado bajo una luz que cae perpendicular.',
    seccion: '1.10',
  },
  perpendicular: {
    termino: 'Perpendicular',
    definicion: 'Que forma un ángulo de 90° con otra línea o plano.',
    seccion: '1.10',
  },
  'producto-vectorial': {
    termino: 'Producto vectorial (cruz)',
    definicion: 'Operación entre dos vectores que da otro vector, perpendicular a ambos, de magnitud AB sen φ.',
    seccion: '1.10',
  },
  'mano-derecha': {
    termino: 'Regla de la mano derecha',
    definicion: 'Convención para elegir la dirección de A × B: curva los dedos de A hacia B y el pulgar señala el resultado.',
    seccion: '1.10',
  },
  anticonmutativo: {
    termino: 'Anticonmutativo',
    definicion: 'Cambiar el orden invierte el signo del resultado: B × A = −(A × B).',
    seccion: '1.10',
  },
  determinante: {
    termino: 'Determinante',
    definicion: 'Número que se calcula a partir de un arreglo cuadrado de números con una regla fija de productos cruzados; aquí sirve como mnemotecnia.',
    seccion: '1.10',
  },
  'sistema-derecho': {
    termino: 'Sistema derecho',
    definicion: 'Orientación de los ejes en la que î × ĵ = k̂. Es la que usan casi todos los libros, incluido éste.',
    seccion: '1.10',
  },
  trabajo: {
    termino: 'Trabajo (física)',
    definicion: 'Cantidad escalar W = F·s que mide cuánto contribuye una fuerza al movimiento a lo largo de un desplazamiento. Se estudia en el cap. 6.',
    seccion: '1.10',
  },
  torca: {
    termino: 'Torca (torque)',
    definicion: 'Medida de qué tanto una fuerza tiende a hacer girar un objeto; se define con un producto vectorial. Se estudia en el cap. 10.',
    seccion: '1.10',
  },
};
