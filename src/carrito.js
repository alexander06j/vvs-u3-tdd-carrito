/**
 * Módulo de Carrito de Compras (SUT)
 * Unidad 3 — Desarrollo Dirigido por Pruebas (TDD)
 */

class Carrito {
  constructor() {
    this.items = [];
    this.descuento = 0;
  }

  agregarProducto(producto) {
    if (!producto || typeof producto !== 'object') {
      throw new Error('El producto debe ser un objeto válido');
    }

    const { id, nombre, precio, cantidad } = producto;

    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error('El ID del producto es obligatorio y debe ser válido');
    }

    if (typeof nombre !== 'string' || nombre.trim() === '') {
      throw new Error('El nombre del producto es obligatorio');
    }

    if (typeof precio !== 'number' || !Number.isFinite(precio)) {
      throw new Error('El precio debe ser un número válido');
    }

    if (precio < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    if (typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error('La cantidad debe ser un número entero positivo');
    }

    const existente = this.items.find((item) => item.id === id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.items.push({ id, nombre, precio, cantidad });
    }
  }

  calcularSubtotal() {
    let suma = 0;
    for (const item of this.items) {
      suma += item.precio * item.cantidad;
    }
    return Number(suma.toFixed(2));
  }
}

module.exports = { Carrito };
