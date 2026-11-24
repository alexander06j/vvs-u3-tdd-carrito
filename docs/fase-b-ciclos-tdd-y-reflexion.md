# Fase B — Evidencia de Tres Ciclos TDD (RED → GREEN → REFACTOR) y Reflexión Crítica B

## 1. Resumen de Trazabilidad de los Ciclos TDD

Durante la **Fase B** se ejecutaron tres ciclos completos y verificables de **Desarrollo Dirigido por Pruebas (TDD)**, registrando cada transición de estado (**RED → GREEN → REFACTOR**) tanto en archivos de evidencia dentro de `evidencias/` como en commits secuenciales en Git:

| Ciclo | Requisitos Cubiertos | Casos de Prueba | Etapa RED (Fallo Verificado) | Etapa GREEN (Código Mínimo) | Etapa REFACTOR (Mejora Interna) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **Ciclo 1** | `RF-01`, `RF-02` (subtotal), `RF-05` | `CP-01` a `CP-09` | **9 failed \| 1 passed**<br>Evidencia: `evidencias/ciclo1-red.txt`<br>Commit: `1cc11af` | **10 passed (10)**<br>Evidencia: `evidencias/ciclo1-green.txt`<br>Commit: `c43a8ac` | **10 passed (10)**<br>Extracción de `_validarProducto`, `_validarCantidadEnteraPositiva` y `_redondearMoneda`.<br>Evidencia: `evidencias/ciclo1-refactor.txt`<br>Commit: `7f6bf0e` |
| **Ciclo 2** | `RF-02` (total), `RF-03`, `RF-05` | `CP-10` a `CP-13` | **4 failed \| 10 passed**<br>Evidencia: `evidencias/ciclo2-red.txt`<br>Commit: `be2cf19` | **14 passed (14)**<br>Evidencia: `evidencias/ciclo2-green.txt`<br>Commit: `8f8a3d7` | **14 passed (14)**<br>Extracción de `_validarDescuento` y cálculo con `factorCobro = (100 - descuento) / 100`.<br>Evidencia: `evidencias/ciclo2-refactor.txt`<br>Commit: `d690d82` |
| **Ciclo 3** | `RF-04`, `RF-05` | `CP-14` a `CP-18` | **5 failed \| 14 passed**<br>Evidencia: `evidencias/ciclo3-red.txt`<br>Commit: `917fd98` | **19 passed (19)**<br>Evidencia: `evidencias/ciclo3-green.txt`<br>Commit: `852128e` | **19 passed (19)**<br>Unificación de búsqueda y validación de existencia en `_obtenerIndiceProducto(id)`.<br>Evidencia: `evidencias/ciclo3-refactor.txt` |

---

## 2. Detalle Técnico de Cada Ciclo

### Ciclo TDD 1 — Gestión de Productos y Cálculo de Subtotal (`RF-01`, `RF-02`, `RF-05`)
1. **RED (`evidencias/ciclo1-red.txt`):** Se escribieron 9 pruebas unitarias (`CP-01` a `CP-09`) verificando la inserción de productos válidos, acumulación de cantidades para un mismo `id`, casos de borde (`precio = 0`, `cantidad = 1`, carrito vacío, `19.99 * 3 = 59.97`) y rechazo de entradas inválidas. La ejecución falló con `TypeError: carrito.agregarProducto is not a function` y `TypeError: carrito.calcularSubtotal is not a function`.
2. **GREEN (`evidencias/ciclo1-green.txt`):** Se implementó la lógica mínima dentro de `agregarProducto` y un bucle `for` con `Number(suma.toFixed(2))` en `calcularSubtotal()`, logrando `10 passed (10)`.
3. **REFACTOR (`evidencias/ciclo1-refactor.txt`):** Se extrajeron los métodos auxiliares `_validarProducto`, `_validarCantidadEnteraPositiva` y `_redondearMoneda(valor)` (empleando `Math.round((valor + Number.EPSILON) * 100) / 100`), normalizando `id` y `nombre` con `.trim()` y reemplazando el bucle imperativo por `Array.prototype.reduce`. Todas las pruebas permanecieron en verde (`10 passed`).

### Ciclo TDD 2 — Aplicación de Descuentos y Cálculo de Total (`RF-02`, `RF-03`, `RF-05`)
1. **RED (`evidencias/ciclo2-red.txt`):** Se agregaron los casos `CP-10` a `CP-13` para probar descuentos del `20 %`, valores límite (`0 %` y `100 %`), descuento decimal (`12.5 %` sobre `$99.99`) y rechazo de descuentos fuera de `[0, 100]` o no numéricos. Vitest reportó `4 failed | 10 passed (14)`.
2. **GREEN (`evidencias/ciclo2-green.txt`):** Se implementaron `aplicarDescuento(porcentaje)` y `calcularTotal()` garantizando un piso de `0` con `Math.max(0, ...)`. Las 14 pruebas pasaron.
3. **REFACTOR (`evidencias/ciclo2-refactor.txt`):** Se extrajo `_validarDescuento(porcentaje)` y se refactorizó la fórmula del total usando `factorCobro = (100 - this.descuento) / 100` para minimizar errores de representación binaria al restar porcentajes decimales.

### Ciclo TDD 3 — Actualización de Cantidades y Eliminación de Productos (`RF-04`, `RF-05`)
1. **RED (`evidencias/ciclo3-red.txt`):** Se añadieron los casos `CP-14` a `CP-18` para probar `actualizarCantidad(id, nuevaCantidad)` y `eliminarProducto(id)` en escenarios normales, de borde (actualizar a `1` y vaciar el carrito eliminando el único ítem) e inválidos (`cantidad <= 0`, decimal o `id` inexistente). Vitest reportó `5 failed | 14 passed (19)`.
2. **GREEN (`evidencias/ciclo3-green.txt`):** Se codificaron ambos métodos utilizando `find` y `findIndex`, reutilizando `_validarCantidadEnteraPositiva(nuevaCantidad)` extraído en el Ciclo 1. Las 19 pruebas pasaron.
3. **REFACTOR (`evidencias/ciclo3-refactor.txt`):** Se detectó duplicación en la búsqueda del producto y el lanzamiento del error `'Producto no encontrado en el carrito'` entre `actualizarCantidad` y `eliminarProducto`. Se extrajo `_obtenerIndiceProducto(id)`, centralizando la validación de `id` y la búsqueda por índice.

---

## 3. Reflexión Crítica — Fase B

### ¿Qué decisión cambió después de observar un fallo?

Durante el desarrollo de los tres ciclos TDD, observar los fallos y el comportamiento concreto de las pruebas condujo a **tres cambios de decisión arquitectónica**:

1. **Sustitución de `toFixed(2)` por redondeo con `Number.EPSILON` (`_redondearMoneda`):** En la fase **GREEN** del Ciclo 1 se utilizó inicialmente `Number(suma.toFixed(2))` para superar `CP-09` (`19.99 * 3 = 59.97`). Sin embargo, al avanzar al Ciclo 2 y analizar `CP-12` (aplicar un descuento decimal de `12.5 %` sobre `$99.99`, cuyo producto exacto es `87.49125`, o valores intermedios terminados en `.xx5` como `1.005 * 100 = 100.49999999999999` en coma flotante IEEE 754), se observó que `toFixed(2)` puede truncar hacia abajo debido a la representación binaria inexacta. Esto motivó cambiar la decisión de implementación hacia un método dedicado `_redondearMoneda(valor)` basado en `Math.round((valor + Number.EPSILON) * 100) / 100` y calcular el factor de cobro como `(100 - this.descuento) / 100`.
2. **Orden de validación en `actualizarCantidad(id, nuevaCantidad)`:** Al observar los fallos de la etapa **RED** en `CP-17` y `CP-18` (Ciclo 3), se decidió validar primero la validez y existencia del `id` (`_obtenerIndiceProducto(id)`) antes de validar el dominio de `nuevaCantidad` (`_validarCantidadEnteraPositiva`). De este modo, si se intenta actualizar un producto inexistente, el sistema informa inmediatamente que el recurso no existe en el carrito antes de evaluar reglas sobre sus atributos.
3. **Normalización consistente de identificadores (`id.trim()`):** En el Ciclo 1 se decidió normalizar `producto.id.trim()` al insertar productos para impedir que un ID compuesto solo por espacios (`"   "`) pasara la validación (`CP-04`). Al llegar a la refactorización del Ciclo 3 (`_obtenerIndiceProducto(id)`), esta decisión obligó a aplicar la misma normalización `id.trim()` y validación de tipo en las búsquedas de `actualizarCantidad` y `eliminarProducto`, garantizando consistencia de extremo a extremo en todas las operaciones por `id`.
