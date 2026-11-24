# Fase A — Diseño de Casos de Prueba y Reflexión Crítica Inicial

## 1. Análisis de Requisitos Funcionales y Contrato del Módulo (`src/carrito.js`)

Antes de iniciar la codificación bajo **Desarrollo Dirigido por Pruebas (TDD)**, cada requisito funcional se traduce en contratos verificables sobre la clase `Carrito`:

| Código | Requisito Funcional | Métodos Asociados en `Carrito` | Reglas de Negocio Acordadas |
| :--- | :--- | :--- | :--- |
| **RF-01** | Agregar productos con ID, nombre, precio y cantidad positiva. | `agregarProducto({ id, nombre, precio, cantidad })` | - `id` y `nombre` deben ser cadenas no vacías.<br>- `precio` debe ser numérico finito `>= 0`.<br>- `cantidad` debe ser un entero positivo (`> 0`).<br>- Si el `id` ya existe en el carrito, se acumula su `cantidad`. |
| **RF-02** | Calcular subtotal y total. | `calcularSubtotal()`<br>`calcularTotal()` | - `subtotal`: suma de `precio * cantidad` de todos los ítems.<br>- `total`: `subtotal * (1 - descuento / 100)`.<br>- Redondeo a 2 decimales para evitar errores de coma flotante IEEE 754. |
| **RF-03** | Descuento válido de `0` a `100 %` sin totales negativos. | `aplicarDescuento(porcentaje)`<br>`calcularTotal()` | - `porcentaje` numérico finito dentro del rango `[0, 100]`.<br>- Con `100 %` de descuento el total es `0` (nunca negativo). |
| **RF-04** | Actualizar cantidades y eliminar productos. | `actualizarCantidad(id, nuevaCantidad)`<br>`eliminarProducto(id)` | - `actualizarCantidad` reemplaza la cantidad de un producto existente por un entero positivo (`> 0`).<br>- `eliminarProducto` retira el producto por su `id`.<br>- Si el `id` no existe en el carrito, lanza un error explícito. |
| **RF-05** | Rechazar precios negativos, cantidades inválidas y descuentos fuera de rango con errores claros. | Todos los métodos mutadores | - Lanza excepciones `Error` con mensajes descriptivos y deterministas ante entradas fuera de dominio o tipos inválidos. |

---

## 2. Matriz de Casos de Prueba (Normales, de Borde e Inválidos)

Cada requisito funcional se desglosa en casos **Normales (N)**, **De Borde / Límite (B)** e **Inválidos / Error (I)**:

| ID Caso | Req. | Categoría | Descripción del Caso de Prueba | Entrada / Precondición | Resultado Esperado |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **CP-01** | RF-01 | Normal | Agregar un producto válido a un carrito vacío. | `{ id: 'P01', nombre: 'Teclado Mecánico', precio: 50, cantidad: 2 }` | `carrito.items` contiene 1 elemento con `cantidad: 2`. |
| **CP-02** | RF-01 | Normal | Agregar un producto cuyo `id` ya existe en el carrito. | Precondición: `P01` con `cantidad: 2`.<br>Entrada: `{ id: 'P01', nombre: 'Teclado Mecánico', precio: 50, cantidad: 3 }` | No duplica fila; acumula `cantidad: 5` en el ítem `P01`. |
| **CP-03** | RF-01 | Borde | Agregar un producto con cantidad mínima permitida (`1`) y precio límite inferior (`0`, artículo promocional). | `{ id: 'P02', nombre: 'Sticker Regalo', precio: 0, cantidad: 1 }` | Se agrega correctamente con `precio: 0` y `cantidad: 1`. |
| **CP-04** | RF-01 / RF-05 | Inválido | Intentar agregar un producto sin objeto, sin `id` o con `nombre` vacío. | `null`, `{ id: '', nombre: 'Mouse', precio: 20, cantidad: 1 }`, `{ id: 'P03', nombre: '   ', precio: 20, cantidad: 1 }` | Lanza `Error` indicando que el producto, ID o nombre es obligatorio. |
| **CP-05** | RF-01 / RF-05 | Inválido | Intentar agregar un producto con precio negativo o no numérico. | `{ id: 'P01', nombre: 'Mouse', precio: -10, cantidad: 1 }`, `precio: '20'` o `NaN` | Lanza `Error('El precio no puede ser negativo')` o `Error('El precio debe ser un número válido')`. |
| **CP-06** | RF-01 / RF-05 | Inválido | Intentar agregar un producto con cantidad `0`, negativa o decimal. | `cantidad: 0`, `cantidad: -3`, `cantidad: 1.5`, `cantidad: 'dos'` | Lanza `Error('La cantidad debe ser un número entero positivo')`. |
| **CP-07** | RF-02 | Normal | Calcular subtotal y total con múltiples productos sin descuento. | `P01` (`$50 x 2`) + `P02` (`$25.50 x 1`) | `calcularSubtotal() === 125.5` y `calcularTotal() === 125.5`. |
| **CP-08** | RF-02 | Borde | Calcular subtotal y total en un carrito vacío. | `new Carrito()` sin productos | `calcularSubtotal() === 0` y `calcularTotal() === 0`. |
| **CP-09** | RF-02 | Borde | Precisión decimal IEEE 754 en subtotal con centavos periódicos. | 3 unidades de `$19.99` (`19.99 * 3`) | `calcularSubtotal() === 59.97` (sin residuos `.000000000000006`). |
| **CP-10** | RF-03 | Normal | Aplicar un descuento porcentual intermedio válido (`20 %`). | Subtotal `$200`, `aplicarDescuento(20)` | `carrito.descuento === 20`, `calcularTotal() === 160`. |
| **CP-11** | RF-03 | Borde | Aplicar descuento límite inferior (`0 %`) y límite superior (`100 %`). | Subtotal `$150`, `aplicarDescuento(0)` y luego `aplicarDescuento(100)` | Con `0 %` el total es `150`; con `100 %` el total es `0` (nunca negativo). |
| **CP-12** | RF-03 | Borde | Aplicar descuento decimal (`12.5 %`) sobre subtotal con centavos. | Subtotal `$99.99`, `aplicarDescuento(12.5)` | `calcularTotal() === 87.49` (redondeado a 2 decimales, `>= 0`). |
| **CP-13** | RF-03 / RF-05 | Inválido | Intentar aplicar un descuento negativo (`-0.01 %`, `-10 %`) o mayor a `100 %` (`100.01 %`, `150 %`) o no numérico. | `aplicarDescuento(-5)`, `aplicarDescuento(120)`, `aplicarDescuento('10')` | Lanza `Error('El descuento debe estar entre 0 y 100')` o `Error('El descuento debe ser un número válido')`. |
| **CP-14** | RF-04 | Normal | Actualizar la cantidad de un producto existente en el carrito. | Precondición: `P01` con `cantidad: 2`.<br>Acción: `actualizarCantidad('P01', 5)` | `P01` pasa a tener `cantidad: 5` y el subtotal se recalcula. |
| **CP-15** | RF-04 | Normal | Eliminar un producto existente del carrito. | Precondición: `P01` y `P02` en carrito.<br>Acción: `eliminarProducto('P01')` | `P01` desaparece de `items`; solo permanece `P02`. |
| **CP-16** | RF-04 | Borde | Actualizar cantidad al valor entero positivo mínimo (`1`) y eliminar el último producto dejando el carrito vacío. | `actualizarCantidad('P01', 1)` y luego `eliminarProducto('P01')` | Primero `cantidad === 1`; tras eliminar, `items.length === 0` y `calcularTotal() === 0`. |
| **CP-17** | RF-04 / RF-05 | Inválido | Intentar actualizar la cantidad a `0`, negativa o decimal. | `actualizarCantidad('P01', 0)`, `actualizarCantidad('P01', -2)`, `actualizarCantidad('P01', 2.5)` | Lanza `Error('La cantidad debe ser un número entero positivo')`. |
| **CP-18** | RF-04 / RF-05 | Inválido | Intentar actualizar o eliminar un producto con `id` inexistente. | `actualizarCantidad('INEXISTENTE', 3)`, `eliminarProducto('INEXISTENTE')` | Lanza `Error('Producto no encontrado en el carrito')`. |

---

## 3. Reflexión Crítica — Fase A

### ¿Qué requisito se aclaró al escribir una prueba?

Al transformar los enunciados generales de los requisitos (`RF-01` a `RF-05`) en casos de prueba concretos antes de escribir código de producción, se identificaron y resolvieron **cuatro ambigüedades críticas de especificación**:

1. **Comportamiento ante productos repetidos (`RF-01`):** El enunciado *"Agregar productos con ID, nombre, precio y cantidad positiva"* no especificaba qué debía ocurrir si se invocaba `agregarProducto` con un `id` que ya estaba dentro del carrito. Al diseñar el caso **CP-02**, se aclaró que un carrito de compras real debe mantener la unicidad por `id` de producto y **acumular la cantidad** (`cantidadExistente + cantidadNueva`) en lugar de duplicar registros en el arreglo `items`, lo cual además simplifica las operaciones posteriores de `actualizarCantidad(id, nuevaCantidad)` y `eliminarProducto(id)` (`RF-04`).
2. **Frontera entre precio cero y precio negativo (`RF-01` vs. `RF-05`):** Mientras `RF-01` menciona *"precio y cantidad positiva"*, `RF-05` especifica *"Rechazar precios negativos, cantidades inválidas..."*. Al escribir el caso de borde **CP-03**, se distinguió explícitamente el dominio de ambos atributos: la **cantidad** debe ser estrictamente un entero positivo (`cantidad >= 1`, ya que no tiene sentido físico agregar `0` o `1.5` unidades discretas), mientras que el **precio** admite el valor límite `0` (`precio >= 0`, útil para artículos promocionales o bonificados) y rechaza estrictamente cualquier valor negativo (`precio < 0`) o no numérico (`NaN`, strings).
3. **Semántica de actualización a cero vs. eliminación (`RF-04` y `RF-05`):** Al diseñar **CP-16** y **CP-17**, se definió una frontera clara de responsabilidades entre `actualizarCantidad` y `eliminarProducto`: `actualizarCantidad(id, nuevaCantidad)` exige una cantidad entera positiva (`>= 1`) y rechaza `0` con un error claro, obligando al consumidor de la API a invocar explícitamente `eliminarProducto(id)` cuando desea retirar un ítem del carrito.
4. **Aritmética de punto flotante en subtotales y descuentos (`RF-02` y `RF-03`):** Al plantear los casos **CP-09** (`19.99 * 3`) y **CP-12** (descuento decimal `12.5 %`), quedó en evidencia que la multiplicación nativa en JavaScript produce artefactos binarios IEEE 754 (`59.970000000000006`). Especificar el resultado esperado exacto en la prueba permitió establecer desde el diseño que `calcularSubtotal()` y `calcularTotal()` deben normalizar sus salidas monetarias a 2 decimales y garantizar `total >= 0`.
