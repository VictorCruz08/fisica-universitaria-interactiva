import { describe, expect, it } from 'vitest';
import {
  angulo, anguloEntre, anguloEntre3, arctanCalculadora, cruz, cuadrante, desdePolar,
  escala, fmt, magnitud, magnitud3, punto, punto3, resta, suma, v2, v3,
} from './vec';

describe('suma y escala (1.7)', () => {
  it('suma cabeza-cola es conmutativa', () => {
    const a = v2(3, 1), b = v2(-1, 4);
    expect(suma(a, b)).toEqual(suma(b, a));
  });
  it('|A + B| ≤ A + B y ≥ |A − B|', () => {
    const a = v2(4, 0);
    for (let t = 0; t <= 180; t += 15) {
      const c = magnitud(suma(a, desdePolar(3, t)));
      expect(c).toBeLessThanOrEqual(7 + 1e-9);
      expect(c).toBeGreaterThanOrEqual(1 - 1e-9);
    }
  });
  it('resta es sumar el negativo', () => {
    const a = v2(2, 5), b = v2(4, -1);
    expect(resta(a, b)).toEqual(suma(a, escala(-1, b)));
  });
  it('dron 300 m E + 400 m N → 500 m', () => {
    expect(magnitud(suma(v2(300, 0), v2(0, 400)))).toBeCloseTo(500);
  });
});

describe('componentes y dirección (1.8)', () => {
  it('desdePolar en los cuatro cuadrantes', () => {
    const p = desdePolar(10, 30);
    expect(p.x).toBeCloseTo(8.660, 3);
    expect(p.y).toBeCloseTo(5, 6);
    expect(cuadrante(desdePolar(1, 120))).toBe(2);
    expect(cuadrante(desdePolar(1, 210))).toBe(3);
    expect(cuadrante(desdePolar(1, -30))).toBe(4);
  });
  it('atan2 corrige la ambigüedad de arctan', () => {
    const a = v2(-2, 2);
    expect(arctanCalculadora(a)).toBeCloseTo(-45);
    expect(angulo(a)).toBeCloseTo(135);
    expect(angulo(v2(2, -2))).toBeCloseTo(315);
    expect(angulo(v2(-2, -2))).toBeCloseTo(225);
  });
  it('magnitud 3D: caja 2 × 3 × 6 → 7', () => {
    expect(magnitud3(v3(2, 3, 6))).toBeCloseTo(7);
  });
});

describe('productos (1.10)', () => {
  it('producto punto: perpendiculares dan 0', () => {
    expect(punto(v2(3, 0), v2(0, 5))).toBe(0);
    expect(anguloEntre(v2(1, 0), v2(-1, 1))).toBeCloseTo(135);
  });
  it('producto punto por componentes coincide con AB cos φ', () => {
    const a = desdePolar(4, 20), b = desdePolar(5, 80);
    expect(punto(a, b)).toBeCloseTo(4 * 5 * Math.cos((60 * Math.PI) / 180));
  });
  it('î × ĵ = k̂, ĵ × k̂ = î, k̂ × î = ĵ', () => {
    const i = v3(1, 0, 0), j = v3(0, 1, 0), k = v3(0, 0, 1);
    expect(cruz(i, j)).toEqual(k);
    expect(cruz(j, k)).toEqual(i);
    expect(cruz(k, i)).toEqual(j);
  });
  it('anticonmutatividad y perpendicularidad', () => {
    const a = v3(1, 2, -3), b = v3(4, 0, 2);
    const c = cruz(a, b), d = cruz(b, a);
    expect(c.x + d.x + c.y + d.y + c.z + d.z).toBe(0);
    expect(punto3(c, a)).toBeCloseTo(0);
    expect(punto3(c, b)).toBeCloseTo(0);
  });
  it('|A × B| = AB sen φ', () => {
    const a = v3(3, 0, 0), b = v3(2, 2, 0);
    const phi = anguloEntre3(a, b);
    expect(magnitud3(cruz(a, b))).toBeCloseTo(magnitud3(a) * magnitud3(b) * Math.sin((phi * Math.PI) / 180));
  });
});

describe('fmt', () => {
  it('no imprime -0', () => {
    expect(fmt(-0.0001, 2)).toBe('0.00');
  });
});
