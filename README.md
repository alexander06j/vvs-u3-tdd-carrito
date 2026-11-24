# Desarrollo Dirigido por Pruebas (TDD) — Carrito de Compras (`VVS Unidad 3`)

Proyecto base para la **Actividad de la Unidad 3 (Desarrollo Dirigido por Pruebas)** de la asignatura **Verificación y Validación de Software**. Implementa un módulo de carrito de compras en JavaScript aplicando el ciclo **Rojo–Verde–Refactor (TDD)** con **Vitest**, análisis de cobertura e integración continua mediante **GitHub Actions**.

---

## 1. Requisitos Funcionales (SUT: `src/carrito.js`)

| ID | Requisito |
| :--- | :--- |
| **RF-01** | Agregar productos con `ID`, `nombre`, `precio` y `cantidad` positiva. |
| **RF-02** | Calcular `subtotal` y `total`. |
| **RF-03** | Aplicar `descuento` válido de `0` a `100 %` sin totales negativos. |
| **RF-04** | Actualizar cantidades y eliminar productos del carrito. |
| **RF-05** | Rechazar precios negativos, cantidades inválidas y descuentos fuera de rango con errores claros. |

---

## 2. Estructura del Proyecto

```text
├── .github/
│   └── workflows/
│       └── ci.yml             # Workflow de Integración Continua (push y pull_request)
├── docs/                      # Documentación técnica, matriz de casos y reflexiones TDD
├── evidencias/                # Registros de ejecución de los ciclos RED, GREEN, REFACTOR y cobertura
├── src/
│   └── carrito.js             # Módulo del carrito de compras bajo prueba (SUT)
├── tests/
│   └── carrito.test.js        # Suite de pruebas unitarias automatizadas con Vitest
├── .gitignore                 # Exclusión de node_modules/, coverage/ y archivos temporales
├── package.json               # Configuración del proyecto y scripts npm test / coverage
├── vitest.config.js           # Configuración de Vitest y proveedor de cobertura v8
└── README.md                  # Guía de instalación, reproducción y documentación general
```

---

## 3. Instalación y Ejecución desde Cero

### Requisitos previos
- **Node.js:** `v18.x` o superior (validado en `v22.21.0`).
- **npm:** `v9.x` o superior.

### Instalar dependencias
```bash
npm install
```

### Ejecutar pruebas unitarias
```bash
npm test
```

### Ejecutar análisis de cobertura
```bash
npm run coverage
```
