# Desarrollo Dirigido por Pruebas (TDD) — Carrito de Compras (`VVS Unidad 3`)

Implementación de un módulo de carrito de compras confiable y mantenible en **JavaScript (Node.js)** aplicando **Desarrollo Dirigido por Pruebas (TDD)** mediante el ciclo **Rojo–Verde–Refactor**, pruebas unitarias automatizadas y análisis de cobertura con **Vitest (`v8`)**, e integración continua con **GitHub Actions**.

---

## 1. Requisitos Funcionales Implementados (`src/carrito.js`)

| Código | Requisito Funcional | Métodos en `Carrito` | Casos de Prueba Asociados |
| :--- | :--- | :--- | :--- |
| **RF-01** | Agregar productos con `ID`, `nombre`, `precio` y `cantidad` positiva. | `agregarProducto(producto)` | `CP-01`, `CP-02`, `CP-03` |
| **RF-02** | Calcular `subtotal` y `total`. | `calcularSubtotal()`, `calcularTotal()` | `CP-07`, `CP-08`, `CP-09`, `CP-10` |
| **RF-03** | Descuento válido de `0` a `100 %` sin totales negativos. | `aplicarDescuento(porcentaje)`, `calcularTotal()` | `CP-10`, `CP-11`, `CP-12` |
| **RF-04** | Actualizar cantidades y eliminar productos. | `actualizarCantidad(id, nuevaCantidad)`, `eliminarProducto(id)` | `CP-14`, `CP-15`, `CP-16` |
| **RF-05** | Rechazar precios negativos, cantidades inválidas y descuentos fuera de rango con errores claros. | `_normalizarId`, `_validarProducto`, `_validarCantidadEnteraPositiva`, `_validarDescuento`, `_obtenerIndiceProducto` | `CP-04`, `CP-05`, `CP-06`, `CP-13`, `CP-17`, `CP-18`, `CP-19`, `CP-20`, `CP-21` |

---

## 2. Estructura del Repositorio

```text
├── .github/
│   └── workflows/
│       └── ci.yml                              # Workflow de GitHub Actions (push y pull_request)
├── docs/
│   ├── fase-a-matriz-casos.md                  # Matriz de casos (normales, borde, inválidos) y Reflexión A
│   ├── fase-b-ciclos-tdd-y-reflexion.md        # Trazabilidad de los 3 ciclos RED-GREEN-REFACTOR y Reflexión B
│   └── fase-c-cobertura-ci-y-reflexion.md      # Análisis de cobertura antes/después, refactor y Reflexión C
├── evidencias/
│   ├── ciclo1-red.txt                          # Salida Vitest Ciclo 1 - Etapa RED (9 failed | 1 passed)
│   ├── ciclo1-green.txt                        # Salida Vitest Ciclo 1 - Etapa GREEN (10 passed)
│   ├── ciclo1-refactor.txt                     # Salida Vitest Ciclo 1 - Etapa REFACTOR (10 passed)
│   ├── ciclo2-red.txt                          # Salida Vitest Ciclo 2 - Etapa RED (4 failed | 10 passed)
│   ├── ciclo2-green.txt                        # Salida Vitest Ciclo 2 - Etapa GREEN (14 passed)
│   ├── ciclo2-refactor.txt                     # Salida Vitest Ciclo 2 - Etapa REFACTOR (14 passed)
│   ├── ciclo3-red.txt                          # Salida Vitest Ciclo 3 - Etapa RED (5 failed | 14 passed)
│   ├── ciclo3-green.txt                        # Salida Vitest Ciclo 3 - Etapa GREEN (19 passed)
│   ├── ciclo3-refactor.txt                     # Salida Vitest Ciclo 3 - Etapa REFACTOR (19 passed)
│   ├── fase-c-cobertura-inicial.txt            # Reporte de cobertura inicial (97.97% Stmts / 97.56% Branch)
│   └── fase-c-cobertura-final.txt              # Reporte de cobertura final (100% Stmts, Branch, Funcs, Lines)
├── src/
│   └── carrito.js                              # Módulo del Carrito de Compras bajo prueba (SUT)
├── tests/
│   └── carrito.test.js                         # Suite de 22 pruebas unitarias automatizadas con Vitest
├── .gitignore                                  # Exclusión de node_modules/, coverage/ y archivos locales
├── package.json                                # Configuración del proyecto y scripts npm test / coverage
├── vitest.config.js                            # Configuración de Vitest y proveedor de cobertura v8
└── README.md                                   # Guía de instalación, reproducción y documentación general
```

---

## 3. Instalación y Reproducción desde Cero

### 3.1. Requisitos previos
- **Node.js:** `v18.x` o superior (probado en `v20.x` en GitHub Actions y `v22.x` local).
- **npm:** `v9.x` o superior.

### 3.2. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/alexander06j/vvs-u3-tdd-carrito.git
cd vvs-u3-tdd-carrito
npm install
```

### 3.3. Ejecutar la suite de pruebas unitarias
```bash
npm test
```

### 3.4. Ejecutar el análisis de cobertura de código (`v8`)
```bash
npm run coverage
```

Resultado esperado de cobertura:
```text
 % Coverage report from v8
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------|---------|----------|---------|---------|-------------------
All files   |     100 |      100 |     100 |     100 |                   
 carrito.js |     100 |      100 |     100 |     100 |                   
------------|---------|----------|---------|---------|-------------------
```

---

## 4. Resumen de Evolución TDD y Cobertura

1. **Fase A ([docs/fase-a-matriz-casos.md](docs/fase-a-matriz-casos.md)):** Definición del contrato de `Carrito`, matriz de casos normales, de borde e inválidos para `RF-01` a `RF-05` y *Reflexión Crítica A*.
2. **Fase B ([docs/fase-b-ciclos-tdd-y-reflexion.md](docs/fase-b-ciclos-tdd-y-reflexion.md)):** Ejecución de 3 ciclos completos **RED → GREEN → REFACTOR** con commits secuenciales y *Reflexión Crítica B*.
3. **Fase C ([docs/fase-c-cobertura-ci-y-reflexion.md](docs/fase-c-cobertura-ci-y-reflexion.md)):** Diagnóstico de ramas sin cobertura (`97.56 %` → `100 %`), ampliación de casos negativos (`CP-19` a `CP-21`), refactorización de `_normalizarId` y `_validarProducto`, pipeline de Integración Continua en GitHub Actions y *Reflexión Crítica C*.
