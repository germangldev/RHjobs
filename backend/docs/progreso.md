# Bitácora de progreso

## 2025-08-29
- Hoy he comenzado a documentar el estado del proyecto: he creado/actualizado `README`, un primer **ADR** con mis decisiones de diseño y la plantilla de PR para explicar bien cada cambio.
- He definido un **plan de versiones (v1..v7)** para que se vea mi progreso por hitos, no solo por commits sueltos.
- Voy a etiquetar el estado actual como punto de partida antes de v1. 
- Próximo paso: cerrar **v1.0.0** con manejo uniforme de errores, **OpenAPI** y prefijo **`/api/v1`**.

## 2025-08-22
- Se configura **H2** correctamente y se resuelve un lío de configuración (propiedades duplicadas entre `application.properties` y `application.yml`). El problema era que Spring mezclaba ambas y el **driver H2** no se cargaba.
- La app arranca en `:8081` y la consola de H2 disponible en `/h2-console`. Esto permite moverse rápido mientras se prepara la migración ordenada a **PostgreSQL** con **Flyway**.
- 1 sola fuente para el datasource en dev, y activar `MODE=PostgreSQL` para facilitar la migración futura.

## 2025-08-19
- El **build** y los tests existentes han pasado en verde (según los logs). Aún no se ha escrito mi **baseline de tests** (controller/service/repo), así que esto será parte del **v3.0.0**.
- Confirmo que el proyecto se compila y arranca con **Java 17** y **Spring Boot 3.5.x** usando el **Maven Wrapper** (`mvnw`) para evitar problemas de PATH en Windows.

## 2025-08-15
- Se termina el **flujo de perfil**: `UsuarioService` con `getPerfil`, `actualizarNombre`, `cambiarPassword` (con `PasswordEncoder`) y `UsuarioController` que delega en el service.
- Se ha separado **DTOs** en `com.demo.dto` con validaciones (`@Valid`) en la entrada y se ha decidido no exponer entidades por API.
- He adoptado `@Transactional` en el service (lecturas con `readOnly=true`) para garantizar atomicidad(completar o rollback, no se puede quear en estado parcial) y simplificar persistencia (dirty checking), se detecta automaticamente si ha sido modificado un objeto de la BD...

## 2025-08-10
- Autenticación con **JWT (access + refresh)** integrada. Del token se saca el email con `Authentication.getName()` y no se aceptan emails por parámetros (se evitan suplantaciones).
- Pendiente de pulir: mapeo uniforme de errores, **OpenAPI**, CORS “limpio” y documentación de rutas públicas vs privadas.

