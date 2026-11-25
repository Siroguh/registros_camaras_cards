# CI, hooks y Pullfrog

## Comprobaciones

`pnpm install` instala Husky y Gitleaks 8.30.1, con descarga verificada por SHA-256
para Linux x86_64/aarch64. `pnpm check` ejecuta Oxfmt, Oxlint, TypeScript, Vite y
la comprobación sintáctica del bundle distribuido. El bundle publicado y `dist/`
quedan fuera del formateador y del linter de fuentes.

- Pre-commit: Gitleaks sobre cambios preparados y `lint-staged --hide-unstaged`
  con Oxfmt/Oxlint, preservando los cambios sin preparar.
- Pre-push: `pnpm check`.
- CI: instalación con lockfile congelado, Gitleaks sobre el historial completo,
  `pnpm check` y validación HACS. No ejecuta tests.
- Las validaciones se ejecutan en PR, `main`, tags y manualmente. La validación
  HACS no solicita inclusión en el catálogo. Las releases conservan su flujo
  actual de publicación del bundle.

## Instalación y flujo de Git

Instala primero los workflows en `main`, verifica CI y una revisión real de
Pullfrog, y aplica la protección **al final**. No se requieren revisores ni checks
que todavía no estén disponibles.

Configura [Pullfrog](https://pullfrog.com/console/Siroguh/registros_camaras_cards):
verifica la instalación y activa las revisiones automáticas, revisiones tras cada
push, aprobación de PRs y checks de ejecución/veredicto. Auto-merge permanece
desactivado. La conexión del proveedor puede heredarse de la cuenta `Siroguh`;
las claves solo pertenecen a secretos de GitHub/Pullfrog.

Después de verificarlo, usa ramas de trabajo y PRs. La protección de `main` exige
`check`, `hacs`, una aprobación vigente, aprobación del último push por otra
identidad y conversaciones resueltas. Descarta aprobaciones antiguas y se aplica
a administradores; no permite force-push ni borrar `main`.

```bash
gh api --method PUT repos/Siroguh/registros_camaras_cards/branches/main/protection \
  --input .github/branch-protection.json
```

Lee la configuración remota antes de reaplicar el archivo para conservar reglas
añadidas posteriormente. Un check `pullfrog` correcto no equivale a una revisión
aprobatoria. El veredicto `pullfrog-approval` se publica, pero la configuración
base exige la revisión de GitHub y los checks de CI.
