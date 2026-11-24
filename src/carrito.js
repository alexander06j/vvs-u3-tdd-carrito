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

  _normalizarId(id) {
    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error('El ID del producto es obligatorio y debe ser válido');
    }
    return id.trim();
  }

  _validarCantidadEnteraPositiva(cantidad) {
    if (typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error('La cantidad debe ser un número entero positivo');
    }
  }

  _validarDescuento(porcentaje) {
    if (typeof porcentaje !== 'number' || !Number.isFinite(porcentaje)) {
      throw new Error('El descuento debe ser un número válido');
    }

    if (porcentaje < 0 || porcentaje > 100) {
      throw new Error('El descuento debe estar entre 0 y 100');
    }
  }

  _obtenerIndiceProducto(id) {
    const idNormalizado = this._normalizarId(id);
    const indice = this.items.findIndex((producto) => producto.id === idNormalizado);
    if (indice === -1) {
      throw new Error('Producto no encontrado en el carrito');
    }

    return indice;
  }

  _validarProducto(producto) {
    if (!producto || typeof producto !== 'object' || Array.isArray(producto)) {
      throw new Error('El producto debe ser un objeto válido');
    }

    const { id, nombre, precio, cantidad } = producto;
    const idNormalizado = this._normalizarId(id);

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

    return {
      id: idNormalizado,
      nombre: nombre.trim(),
      precio,
      cantidad,
    };
  }

  agregarProducto(producto) {
    const productoValidado = this._validarProducto(producto);
    const existente = this.items.find((item) => item.id === productoValidado.id);

    if (existente) {
      existente.cantidad += productoValidado.cantidad;
    } else {
      this.items.push(productoValidado);
    }
  }

  calcularSubtotal() {
    const subtotalSinRedondear = this.items.reduce(
      (acumulado, item) => acumulado + item.precio * item.cantidad,
      0
    );
    return this._redondearMoneda(subtotalSinRedondear);
  }

  aplicarDescuento(porcentaje) {
    this._validarDescuento(porcentaje);
    this.descuento = porcentaje;
  }

  calcularTotal() {
    const subtotal = this.calcularSubtotal();
    const factorCobro = (100 - this.descuento) / 100;
    return this._redondearMoneda(subtotal * factorCobro);
  }

  actualizarCantidad(id, nuevaCantidad) {
    const indice = this._obtenerIndiceProducto(id);
    this._validarCantidadEnteraPositiva(nuevaCantidad);
    this.items[indice].cantidad = nuevaCantidad;
  }

  eliminarProducto(id) {
    const indice = this._obtenerIndiceProducto(id);
    this.items.splice(indice, 1);
  }
}

module.exports = { Carrito };
