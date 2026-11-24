/**
 * Módulo de Carrito de Compras (SUT)
 * Unidad 3 — Desarrollo Dirigido por Pruebas (TDD)
 */

class Carrito {
  constructor() {
    this.items = [];
    this.descuento = 0;
  }

  _redondearMoneda(valor) {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
  }

  _validarCantidadEnteraPositiva(cantidad) {
    if (typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error('La cantidad debe ser un número entero positivo');
    }
  }

  _validarProducto(producto) {
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

    this._validarCantidadEnteraPositiva(cantidad);
  }

  agregarProducto(producto) {
    this._validarProducto(producto);

    const idNormalizado = producto.id.trim();
    const nombreNormalizado = producto.nombre.trim();
    const existente = this.items.find((item) => item.id === idNormalizado);

    if (existente) {
      existente.cantidad += producto.cantidad;
    } else {
      this.items.push({
        id: idNormalizado,
        nombre: nombreNormalizado,
        precio: producto.precio,
        cantidad: producto.cantidad,
      });
    }
  }

  calcularSubtotal() {
    const subtotalSinRedondear = this.items.reduce(
      (acumulado, item) => acumulado + item.precio * item.cantidad,
      0
    );
    return this._redondearMoneda(subtotalSinRedondear);
  }
}

module.exports = { Carrito };
