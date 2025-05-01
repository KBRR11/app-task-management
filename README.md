# Task Management App Frontend

Frontend para una aplicación de gestión de tareas desarrollada con Angular 17 que permite a los usuarios administrar sus tareas personales.

## Características

- ✅ Autenticación simplificada con correo electrónico
- ✅ Creación, edición y eliminación de tareas
- ✅ Marcado de tareas como completadas o pendientes
- ✅ Filtrado por estado de tareas (completadas/pendientes)
- ✅ Búsqueda de tareas por título y descripción
- ✅ Diseño responsive para funcionar en cualquier dispositivo
- ✅ Estructura organizada con componentes standalone (Angular 17)

## Tecnologías

- **Framework**: Angular 17
- **UI Components**: Angular Material
- **CSS**: SCSS
- **HTTP Client**: Angular HttpClient

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (versión 9 o superior)
- Angular CLI (versión 17 o superior)

## Instalación

1. Clona este repositorio:
```bash
git clone https://github.com/tu-usuario/task-management-app.git
cd task-management-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
ng serve
```

4. Abre tu navegador en `http://localhost:4200`

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                # Módulo core (servicios, interceptores)
│   │   ├── auth/            # Servicios de autenticación
│   │   └── services/        # Servicios de la aplicación
│   ├── features/            # Módulos de características
│   │   ├── auth/            # Característica de autenticación
│   │   └── tasks/           # Característica de tareas
│   ├── shared/              # Componentes y pipes compartidos
│   ├── models/              # Interfaces y tipos
│   └── app.component.ts     # Componente raíz (standalone)
├── assets/                  # Recursos estáticos
└── environments/            # Configuración de entornos
```

## Características de Arquitectura

- **Componentes Standalone**: Utilizando la nueva arquitectura de Angular 17
- **Lazy Loading**: Carga diferida de módulos de características
- **Interceptor HTTP**: Gestión automática de tokens de autenticación
- **Route Guards**: Protección de rutas privadas
- **Servicios**: Separación clara de responsabilidades
- **Interfaces tipadas**: Definición de modelos con TypeScript

## Componentes Principales

- **Login**: Pantalla de inicio de sesión con email
- **Task List**: Lista de tareas con filtros y búsqueda
- **Task Form**: Formulario para crear/editar tareas
- **Confirm Dialog**: Diálogo de confirmación para acciones importantes

## Despliegue

Para construir la aplicación para producción:

```bash
ng build --configuration production
```

Los archivos generados estarán en la carpeta `dist/task-management-app` y pueden ser desplegados en cualquier servicio de hosting.


## Créditos

Desarrollado por Keny Ramírez como parte de un challenge técnico.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.