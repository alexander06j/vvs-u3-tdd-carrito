# Fase C — Análisis de Cobertura, Refactorización, Integración Continua y Reflexión Crítica C

## 1. Configuración de Scripts y Análisis Inicial de Cobertura (`v8`)

En `package.json` y `vitest.config.js` se configuraron los comandos `npm test` (`vitest run`) y `npm run coverage` (`vitest run --coverage` con proveedor `@vitest/coverage-v8`).

Al ejecutar el análisis de cobertura inmediatamente después de finalizar los 3 ciclos de la **Fase B** (`19 tests passed`), se obtuvo el siguiente reporte inicial (`evidencias/fase-c-cobertura-inicial.txt`):

```text
 % Coverage report from v8
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------|---------|----------|---------|---------|-------------------
All files   |   97.97 |    97.56 |     100 |   97.97 |                   
 carrito.js |   97.97 |    97.56 |     100 |   97.97 | 34-35             
------------|---------|----------|---------|---------|-------------------
```

### Diagnóstico de Ramas sin Cobertura
1. **Líneas `34-35` en `_obtenerIndiceProducto(id)`:** La validación `if (typeof id !== 'string' || id.trim() === '')` dentro de `_obtenerIndiceProducto(id)` nunca había tomado su rama verdadera (`throw new Error('El ID del producto es obligatorio y debe ser válido')`), porque los casos `CP-14` a `CP-18` del Ciclo 3 habían probado IDs existentes (`'P01'`) e inexistentes (`'INEXISTENTE'`), pero no habían probado pasar un `id` vacío (`''`), con espacios (`'   '`) o de tipo inválido (`null`, `123`) a `actualizarCantidad` o `eliminarProducto`.
2. **Duplicación en la validación de `id` y objetos no planos:** Se identificó además que la validación de `id` estaba duplicada entre `_obtenerIndiceProducto(id)` y `_validarProducto(producto)`, y que `typeof [] === 'object'` en JavaScript permitiría que un arreglo pasara la primera guardia de `_validarProducto` antes de fallar por falta de propiedad `id`.

---

## 2. Ampliación de Casos Negativos y Refactorización Manteniendo Pruebas en Verde

### 2.1. Ampliación de Casos Negativos (`CP-19` a `CP-21` en `tests/carrito.test.js`)
- **`CP-19 (Inválido)`:** Verifica que `actualizarCantidad` y `eliminarProducto` rechacen `id` vacío (`''`), compuesto por espacios (`'   '`) o no string (`null`, `123`).
- **`CP-20 (Inválido)`:** Verifica el rechazo de arreglos (`[]`) o primitivos pasados como producto a `agregarProducto`, así como valores no finitos (`Infinity`, `-Infinity`) en `precio`, `cantidad` y `aplicarDescuento`.
- **`CP-21 (Inválido / Invarianza de Estado)`:** Comprueba que tras múltiples intentos fallidos de mutación (`agregarProducto` con precio negativo, `actualizarCantidad` con `0`, `aplicarDescuento` con `150 %`), el estado previo del carrito (`items`, `descuento`, `subtotal` y `total`) permanece íntegro sin corrupción parcial.

### 2.2. Refactorización en `src/carrito.js`
- Se extrajo el método `_normalizarId(id)` para centralizar la validación y limpieza (`.trim()`) de identificadores tanto al agregar productos (`_validarProducto`) como al buscarlos por índice (`_obtenerIndiceProducto`).
- Se refactorizó `_validarProducto(producto)` para rechazar explícitamente arreglos (`Array.isArray(producto)`) y retornar el objeto normalizado `{ id, nombre, precio, cantidad }`, simplificando el cuerpo de `agregarProducto(producto)`.

### 2.3. Cobertura Final Verificada (`evidencias/fase-c-cobertura-final.txt`)

```text
 % Coverage report from v8
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------|---------|----------|---------|---------|-------------------
All files   |     100 |      100 |     100 |     100 |                   
 carrito.js |     100 |      100 |     100 |     100 |                   
------------|---------|----------|---------|---------|-------------------
```

| Métrica | Antes (Fin Fase B) | Después (Fase C) | Variación |
| :--- | :---: | :---: | :---: |
| **Pruebas Ejecutadas** | 19 passed | **22 passed** | +3 suites negativas |
| **% Statements (Sentencias)** | 97.97 % | **100.00 %** | +2.03 % |
| **% Branch (Ramas)** | 97.56 % | **100.00 %** | +2.44 % |
| **% Functions (Funciones)** | 100.00 % | **100.00 %** | = |
| **% Lines (Líneas)** | 97.97 % | **100.00 %** | +2.03 % |

---

## 3. Integración Continua con GitHub Actions (`.github/workflows/ci.yml`)

El flujo de Integración Continua en `.github/workflows/ci.yml` se dispara automáticamente ante cada evento `push` y `pull_request` sobre las ramas `main` y `master`, ejecutando en un entorno limpio `ubuntu-latest` con Node.js 20:
1. `actions/checkout@v4`: Descarga del código fuente.
2. `actions/setup-node@v4`: Configuración de Node.js `v20` con caché de `npm`.
3. `npm ci`: Instalación reproducible y determinista desde `package-lock.json`.
4. `npm test`: Ejecución de las 22 pruebas unitarias en Vitest.
5. `npm run coverage`: Verificación del reporte de cobertura `v8`.

---

## 4. Reflexión Crítica — Fase C

### ¿Qué limitaciones tiene la cobertura y qué mejora priorizaría?

1. **Limitaciones del porcentaje de cobertura de código:**
   - **Cobertura del 100 % no equivale a ausencia de defectos (Falacia de suficiencia):** Haber alcanzado `100 %` en sentencias, ramas, funciones y líneas en `src/carrito.js` demuestra que todo el código escrito fue *ejecutado* al menos una vez por las pruebas, pero no garantiza que todos los requisitos implícitos o escenarios del dominio hayan sido implementados (por ejemplo, qué ocurre si se vuelve a agregar un producto con el mismo `id` pero con un `precio` distinto al que tenía originalmente en el carrito).
   - **Cobertura de ejecución vs. calidad de las aserciones:** Un analizador como `v8` mide qué líneas se recorren, pero no evalúa si los `expect(...)` verifican realmente todas las invariantes del estado. Una prueba sin aserciones o con aserciones débiles inflaría la cobertura sin detectar regresiones lógicas.
   - **Insensibilidad a errores combinatorios y de mutación:** La cobertura de ramas evalúa cada condición booleana (`true`/`false`), pero no prueba necesariamente todas las combinaciones de estado a lo largo del ciclo de vida del objeto ni verifica si pequeños cambios aritméticos (por ejemplo, cambiar `>=` por `>`) serían detectados por la suite.

2. **Mejoras técnicas priorizadas para la evolución del módulo:**
   - **Prioridad 1 — Pruebas de Mutación (*Mutation Testing* con StrykerJS) y Pruebas Basadas en Propiedades (*Property-Based Testing* con `fast-check`):** Incorporar `fast-check` para generar miles de combinaciones aleatorias de precios decimales, cantidades y descuentos en `[0, 100]`, verificando automáticamente invariantes matemáticas (`0 <= calcularTotal() <= calcularSubtotal()`), y usar *Stryker* para medir el *Mutation Score* real de la suite de pruebas.
   - **Prioridad 2 — Regla de negocio explícita ante discrepancia de precio en `id` duplicado:** Actualmente, `agregarProducto` acumula la cantidad cuando el `id` ya existe (`CP-02`). Como mejora funcional prioritaria, se debería validar mediante un nuevo ciclo TDD que, si un producto existente se vuelve a agregar con un `precio` diferente al registrado, el método lance un error de inconsistencia de catálogo o actualice explícitamente según política de negocio, además de encapsular `#items` y `#descuento` como campos privados de ES2022 para impedir mutaciones externas directas fuera de la API de `Carrito`.
