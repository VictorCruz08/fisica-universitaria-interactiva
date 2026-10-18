import { describe, it } from 'vitest';
import assert from 'node:assert/strict';
import {
  angulo, anguloEntre, anguloEntre3, arctanCalculadora, cruz, cuadrante, desdePolar,
  escala, fmt, magnitud, magnitud3, punto, punto3, resta, suma, v2, v3,
} from '../lib/vec';

/** Como toBeCloseTo de Jest: |a − b| < 10^(−d) / 2 */
const cerca = (a: number, b: number, d = 2) => assert.ok(Math.abs(a - b) < 10 ** -d / 2, `${a} ≉ ${b}`);

describe('suma y escala (1.7)', () => {
  it('suma cabeza-cola es conmutativa', () => {
    const a = v2(3, 1), b = v2(-1, 4);
    assert.deepEqual(suma(a, b), suma(b, a));
  });
  it('|A + B| ≤ A + B y ≥ |A − B|', () => {
    const a = v2(4, 0);
    for (let t = 0; t <= 180; t += 15) {
      const c = magnitud(suma(a, desdePolar(3, t)));
      assert.ok(c <= 7 + 1e-9);
      assert.ok(c >= 1 - 1e-9);
    }
  });
  it('resta es sumar el negativo', () => {
    const a = v2(2, 5), b = v2(4, -1);
    assert.deepEqual(resta(a, b), suma(a, escala(-1, b)));
  });
  it('dron 300 m E + 400 m N → 500 m', () => {
    cerca(magnitud(suma(v2(300, 0), v2(0, 400))), 500);
  });
});

describe('componentes y dirección (1.8)', () => {
  it('desdePolar en los cuatro cuadrantes', () => {
    const p = desdePolar(10, 30);
    cerca(p.x, 8.660, 3);
    cerca(p.y, 5, 6);
    assert.equal(cuadrante(desdePolar(1, 120)), 2);
    assert.equal(cuadrante(desdePolar(1, 210)), 3);
    assert.equal(cuadrante(desdePolar(1, -30)), 4);
  });
  it('atan2 corrige la ambigüedad de arctan', () => {
    const a = v2(-2, 2);
    cerca(arctanCalculadora(a), -45);
    cerca(angulo(a), 135);
    cerca(angulo(v2(2, -2)), 315);
    cerca(angulo(v2(-2, -2)), 225);
  });
  it('magnitud 3D: caja 2 × 3 × 6 → 7', () => {
    cerca(magnitud3(v3(2, 3, 6)), 7);
  });
});

describe('productos (1.10)', () => {
  it('producto punto: perpendiculares dan 0', () => {
    assert.equal(punto(v2(3, 0), v2(0, 5)), 0);
    cerca(anguloEntre(v2(1, 0), v2(-1, 1)), 135);
  });
  it('producto punto por componentes coincide con AB cos φ', () => {
    const a = desdePolar(4, 20), b = desdePolar(5, 80);
    cerca(punto(a, b), 4 * 5 * Math.cos((60 * Math.PI) / 180));
  });
  it('î × ĵ = k̂, ĵ × k̂ = î, k̂ × î = ĵ', () => {
    const i = v3(1, 0, 0), j = v3(0, 1, 0), k = v3(0, 0, 1);
    assert.deepEqual(cruz(i, j), k);
    assert.deepEqual(cruz(j, k), i);
    assert.deepEqual(cruz(k, i), j);
  });
  it('anticonmutatividad y perpendicularidad', () => {
    const a = v3(1, 2, -3), b = v3(4, 0, 2);
    const c = cruz(a, b), d = cruz(b, a);
    assert.equal(c.x + d.x + c.y + d.y + c.z + d.z, 0);
    cerca(punto3(c, a), 0);
    cerca(punto3(c, b), 0);
  });
  it('|A × B| = AB sen φ', () => {
    const a = v3(3, 0, 0), b = v3(2, 2, 0);
    const phi = anguloEntre3(a, b);
    cerca(magnitud3(cruz(a, b)), magnitud3(a) * magnitud3(b) * Math.sin((phi * Math.PI) / 180));
  });
});

describe('fmt', () => {
  it('no imprime -0', () => {
    assert.equal(fmt(-0.0001, 2), '0.00');
  });
});
