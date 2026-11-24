import { describe, it, expect } from 'vitest';
import { Carrito } from '../src/carrito.js';

describe('Carrito de Compras - Suite Base TDD', () => {
  it('debe instanciar un carrito vacío inicialmente', () => {
    const carrito = new Carrito();
    expect(carrito.items).toEqual([]);
    expect(carrito.descuento).toBe(0);
  });
});
