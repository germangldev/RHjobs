# Changelog

## [Unreleased]
- **v1.0.0** (próximo): RestExceptionHandler (errores JSON consistentes), OpenAPI con springdoc, prefijo `/api/v1`.

## [pre-v1-estado-2025-08-29] – 2025-08-29
### Añadido
- Documentación base: `README` (foto actual, levantar servicio), `docs/adr/0001-contexto-y-decisiones.md`, `docs/progreso.md`.
- Plantilla de Pull Request en `.github/PULL_REQUEST_TEMPLATE.md`.
- Roadmap de versiones (v1..v7) en el README.

### Decisiones
- Etiquetar estado como punto de partida antes de v1.
- Enfocar v1 en UX de API (errores uniformes + OpenAPI + versionado).

### Estado técnico
- JWT operativo (access + refresh), endpoints de perfil funcionales, **H2** en desarrollo.
