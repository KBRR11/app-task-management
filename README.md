# Task Management App

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-badge-id/deploy-status)](https://app.netlify.com/sites/your-netlify-site/deploys)

Una aplicación de gestión de tareas desarrollada con Angular 17 que permite a los usuarios administrar sus tareas personales de manera eficiente.

## 🌟 Características

- ✅ Autenticación simplificada con correo electrónico
- ✅ Creación, edición y eliminación de tareas
- ✅ Marcado de tareas como completadas o pendientes
- ✅ Filtrado por estado de tareas (completadas/pendientes)
- ✅ Búsqueda de tareas por título y descripción
- ✅ Diseño responsive para funcionar en cualquier dispositivo
- ✅ Estructura organizada con componentes standalone (Angular 17)
- ✅ CI/CD automatizado con GitHub Actions a Netlify

## 🛠️ Tecnologías

- **Frontend**:
  - Angular 17 (Componentes Standalone)
  - Angular Material
  - RxJS
  - SCSS
- **Backend**:
  - Express con TypeScript
  - Firebase Cloud Functions
  - Firestore Database
- **Despliegue**:
  - Netlify (Frontend)
  - Firebase Functions (Backend)
  - GitHub Actions (CI/CD)

## 🚀 Demostración

Visita la aplicación desplegada en [https://merry-cocada-8d6255.netlify.app/](https://merry-cocada-8d6255.netlify.app/)

## 🔧 Requisitos Previos

- Node.js (versión 18 o superior)
- npm (versión 9 o superior)
- Angular CLI (versión 17 o superior)

## 📥 Instalación

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

## 📁 Estructura del Proyecto

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

## 🏗️ Arquitectura

- **Componentes Standalone**: Utilizando la nueva arquitectura de Angular 17
- **Lazy Loading**: Carga diferida de módulos de características
- **Interceptor HTTP**: Gestión automática de tokens de autenticación
- **Route Guards**: Protección de rutas privadas
- **Servicios**: Separación clara de responsabilidades
- **Interfaces tipadas**: Definición de modelos con TypeScript

## 🔄 Flujo de CI/CD

Este proyecto utiliza GitHub Actions para implementar un pipeline de integración y despliegue continuo:

1. **Activación**: El workflow se activa con cada push a la rama `master`
2. **Construcción**: Instala dependencias y compila la aplicación
3. **Despliegue**: Utiliza Netlify CLI para desplegar automáticamente a producción

El archivo de configuración se encuentra en `.github/workflows/deploy.yml`.

```yaml
name: Deploy to Netlify

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build Angular app
        run: npm run build

      - name: Install Netlify CLI
        run: npm install -g netlify-cli

      - name: Deploy to Netlify
        run: netlify deploy --prod --dir=dist/task-mannagement-app/browser --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH_TOKEN
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

Para configurar el despliegue, necesitas añadir los siguientes secrets en tu repositorio de GitHub:
- `NETLIFY_AUTH_TOKEN`: Tu token de autenticación de Netlify
- `NETLIFY_SITE_ID`: El ID de tu sitio en Netlify



## 📦 Construcción

Para construir la aplicación para producción:

```bash
ng build --configuration production
```

Los archivos generados estarán en la carpeta `dist/task-management-app/browser` y serán automáticamente desplegados a Netlify por el pipeline de CI/CD cuando se fusionen cambios en la rama principal.


## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

Desarrollado por Keny Ramírez como parte de un challenge técnico.

