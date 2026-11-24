import { describe, it, expect, beforeEach } from 'vitest';
import { Carrito } from '../src/carrito.js';

describe('Carrito de Compras - Suite TDD', () => {
  let carrito;

  beforeEach(() => {
    carrito = new Carrito();
  });

  describe('Estado Inicial', () => {
    it('debe instanciar un carrito vacío inicialmente', () => {
      expect(carrito.items).toEqual([]);
      expect(carrito.descuento).toBe(0);
    });
  });

  describe('Ciclo TDD 1: RF-01 (Agregar productos), RF-02 (Subtotal) y RF-05 (Validaciones al agregar)', () => {
    it('CP-01 (Normal): debe agregar un producto válido a un carrito vacío', () => {
      carrito.agregarProducto({
        id: 'P01',
        nombre: 'Teclado Mecánico',
        precio: 50,
        cantidad: 2,
      });

      expect(carrito.items).toHaveLength(1);
      expect(carrito.items[0]).toEqual({
        id: 'P01',
        nombre: 'Teclado Mecánico',
        precio: 50,
        cantidad: 2,
      });
    });

    it('CP-02 (Normal): debe acumular la cantidad si se agrega un producto cuyo ID ya existe', () => {
      carrito.agregarProducto({ id: 'P01', nombre: 'Teclado Mecánico', precio: 50, cantidad: 2 });
      carrito.agregarProducto({ id: 'P01', nombre: 'Teclado Mecánico', precio: 50, cantidad: 3 });

      expect(carrito.items).toHaveLength(1);
      expect(carrito.items[0].cantidad).toBe(5);
    });

    it('CP-03 (Borde): debe permitir cantidad mínima 1 y precio límite 0 (artículo promocional)', () => {
      carrito.agregarProducto({ id: 'P02', nombre: 'Sticker Regalo', precio: 0, cantidad: 1 });

      expect(carrito.items).toHaveLength(1);
      expect(carrito.items[0].precio).toBe(0);
      expect(carrito.items[0].cantidad).toBe(1);
    });

    it('CP-04 (Inválido): debe rechazar productos nulos, sin ID o con nombre vacío', () => {
      expect(() => carrito.agregarProducto(null)).toThrow('El producto debe ser un objeto válido');
      expect(() => carrito.agregarProducto({ id: '', nombre: 'Mouse', precio: 20, cantidad: 1 })).toThrow(
        'El ID del producto es obligatorio y debe ser válido'
      );
      expect(() => carrito.agregarProducto({ id: 'P03', nombre: '   ', precio: 20, cantidad: 1 })).toThrow(
        'El nombre del producto es obligatorio'
      );
    });

    it('CP-05 (Inválido): debe rechazar precios negativos o no numéricos', () => {
      expect(() =>
        carrito.agregarProducto({ id: 'P01', nombre: 'Mouse', precio: -10, cantidad: 1 })
      ).toThrow('El precio no puede ser negativo');

      expect(() =>
        carrito.agregarProducto({ id: 'P01', nombre: 'Mouse', precio: '20', cantidad: 1 })
      ).toThrow('El precio debe ser un número válido');

      expect(() =>
        carrito.agregarProducto({ id: 'P01', nombre: 'Mouse', precio: NaN, cantidad: 1 })
      ).toThrow('El precio debe ser un número válido');
    });

    it('CP-06 (Inválido): debe rechazar cantidades iguales a 0, negativas o decimales', () => {
      expect(() =>
        carrito.agregarProducto({ id: 'P01', nombre: 'Mouse', precio: 20, cantidad: 0 })
      ).toThrow('La cantidad debe ser un número entero positivo');

      expect(() =>
        carrito.agregarProducto({ id: 'P01', nombre: 'Mouse', precio: 20, cantidad: -3 })
      ).toThrow('La cantidad debe ser un número entero positivo');

      expect(() =>
        carrito.agregarProducto({ id: 'P01', nombre: 'Mouse', precio: 20, cantidad: 1.5 })
      ).toThrow('La cantidad debe ser un número entero positivo');
    });

    it('CP-07 (Normal): debe calcular el subtotal correctamente con múltiples productos', () => {
      carrito.agregarProducto({ id: 'P01', nombre: 'Teclado Mecánico', precio: 50, cantidad: 2 });
      carrito.agregarProducto({ id: 'P02', nombre: 'Mouse Gamer', precio: 25.5, cantidad: 1 });

      expect(carrito.calcularSubtotal()).toBe(125.5);
    });

    it('CP-08 (Borde): debe retornar subtotal 0 cuando el carrito está vacío', () => {
      expect(carrito.calcularSubtotal()).toBe(0);
    });

    it('CP-09 (Borde): debe redondear el subtotal a 2 decimales evitando errores IEEE 754 (19.99 * 3)', () => {
      carrito.agregarProducto({ id: 'P03', nombre: 'Cable HDMI', precio: 19.99, cantidad: 3 });

      expect(carrito.calcularSubtotal()).toBe(59.97);
    });
  });

  describe('Ciclo TDD 2: RF-02 (Total), RF-03 (Descuentos 0-100%) y RF-05 (Validaciones de descuento)', () => {
    it('CP-10 (Normal): debe aplicar un descuento válido (20%) y calcular el total correctamente', () => {
      carrito.agregarProducto({ id: 'P01', nombre: 'Monitor 24"', precio: 100, cantidad: 2 });
      carrito.aplicarDescuento(20);

      expect(carrito.descuento).toBe(20);
      expect(carrito.calcularSubtotal()).toBe(200);
      expect(carrito.calcularTotal()).toBe(160);
    });

    it('CP-11 (Borde): debe manejar descuentos en los límites 0% y 100% sin generar totales negativos', () => {
      carrito.agregarProducto({ id: 'P01', nombre: 'Silla Ergonómica', precio: 150, cantidad: 1 });

      carrito.aplicarDescuento(0);
      expect(carrito.calcularTotal()).toBe(150);

      carrito.aplicarDescuento(100);
      expect(carrito.calcularTotal()).toBe(0);
      expect(carrito.calcularTotal()).toBeGreaterThanOrEqual(0);
    });

    it('CP-12 (Borde): debe redondear a 2 decimales al aplicar un descuento decimal (12.5% sobre 99.99)', () => {
      carrito.agregarProducto({ id: 'P02', nombre: 'Audífonos Pro', precio: 99.99, cantidad: 1 });
      carrito.aplicarDescuento(12.5);

      expect(carrito.calcularTotal()).toBe(87.49);
    });

    it('CP-13 (Inválido): debe rechazar descuentos negativos, mayores a 100% o no numéricos', () => {
      expect(() => carrito.aplicarDescuento(-0.01)).toThrow('El descuento debe estar entre 0 y 100');
      expect(() => carrito.aplicarDescuento(-10)).toThrow('El descuento debe estar entre 0 y 100');
      expect(() => carrito.aplicarDescuento(100.01)).toThrow('El descuento debe estar entre 0 y 100');
      expect(() => carrito.aplicarDescuento(150)).toThrow('El descuento debe estar entre 0 y 100');
      expect(() => carrito.aplicarDescuento('20')).toThrow('El descuento debe ser un número válido');
      expect(() => carrito.aplicarDescuento(NaN)).toThrow('El descuento debe ser un número válido');
    });
  });
});
