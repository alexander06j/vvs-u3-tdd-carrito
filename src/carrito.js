/**
 * Módulo de Carrito de Compras (SUT)
 * Unidad 3 — Desarrollo Dirigido por Pruebas (TDD)
 *
 * Requisitos a implementar incrementalmente mediante ciclos RED -> GREEN -> REFACTOR:
 * - RF-01: Agregar productos con ID, nombre, precio y cantidad positiva.
 * - RF-02: Calcular subtotal y total.
 * - RF-03: Descuento válido de 0 a 100 % sin totales negativos.
 * - RF-04: Actualizar cantidades y eliminar productos.
 * - RF-05: Rechazar precios negativos, cantidades inválidas y descuentos fuera de rango con errores claros.
 */

class Carrito {
  constructor() {
    this.items = [];
    this.descuento = 0;
  }
}

module.exports = { Carrito };
