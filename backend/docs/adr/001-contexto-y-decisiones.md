# ADR 0001 – Contexto y decisiones iniciales

## Contexto
Estoy construyendo un monolito con Spring Boot 3 y Java 17. Uso JWT y en desarrollo H2.

## Decisiones
1) Mantener el controller delgado y la lógica en el **Service**.
2) Usar **DTOs** con Bean Validation en la **entrada** (no expongo entidades).
3) Identificar al usuario por `Authentication.getName()` (email del token).
4) Anotar servicios con **@Transactional** (lecturas readOnly, escrituras con commit).
5) Preparar el **versionado** `/api/v1` para cambios futuros.

## Consecuencias
- Contrato claro y documentable con OpenAPI.
- Código más fácil de probar y mantener.
- Transacciones coherentes y sin efectos parciales.
- Migración a Postgres/Flyway más directa.
