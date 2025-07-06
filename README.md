# Vélez Frontend Challenge

**Página de Detalle de Producto** con búsqueda por IA y carrito de compras.

## 📖 Descripción

Este proyecto es una prueba técnica para un rol de Analista Frontend, consistente en una Página de Detalle de Producto (PDP) con un diseño único y moderno, que consume una API pública y permite:

* Visualizar detalles completos de un producto: imágenes, marca, referencía, tallas, colores y precio.
* Navegar por productos relacionados en un carrusel.
* Añadir productos al carrito con persistencia en LocalStorage (Zustand).
* Chatbot IA flotante que filtra productos según la consulta del usuario.
* Animaciones sutiles (Framer Motion) y tema oscuro con Tailwind CSS.
* Splash screen animado al cargar la aplicación.

## 🚀 Tecnologías

* **Vite** 🧪
* **React** + **TypeScript**
* **Tailwind CSS** para estilos
* **Zustand** para estado global y persistencia
* **Framer Motion** para animaciones
* **Axios** para llamadas al backend
* **OpenAI** (o tu servicio local) para IA conversacional

## 📦 Instalación y ejecución

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/velez-frontend.git
   cd velez-frontend
   ```

2. Instala dependencias:

   ```bash
   npm install
   # o yarn install
   ```

3. Crea un archivo de entorno basado en `env.example`. Abre .env y reemplaza las variables con tus valores reales:

   ```bash
   cp env.example .env
   ```
  
4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   # o yarn dev
   ```

Abre tu navegador en `http://localhost:5173`.

## ⚙️ Scripts disponibles

* `npm run dev` — Inicia en modo desarrollo.
* `npm run build` — Genera la versión de producción.
* `npm run preview` — Previsualiza el build de producción.

## 📁 Estructura de carpetas

```
src/
├─ api/          # Llamadas al backend y lógica de filtrado
├─ components/   # Componentes UI (Header, Footer, ProductCard, ChatBot...)
├─ pages/        # Páginas principales (LandingPage, ProductPage, CheckoutPage)
├─ stores/       # Zustand stores (cart, chat)
├─ hooks/        # Custom React hooks
├─ utils/        # Funciones utilitarias (formatPrice, parseJson)
└─ assets/       # SVGs, imágenes
```

## 📐 Buenas prácticas incluidas

* Tipado estricto con TypeScript.
* Gestión de estado y persistencia con Zustand.
* Animaciones accesibles y sutiles con Framer Motion.
* Diseño responsivo y tema oscuro con Tailwind CSS.
* Manejo de errores en fetch, login automático y reintentos.

## 🚧 Despliegue

Puedes ver esta pagina desplegada en Vercel en el siguiente link: https://analista-frontend.vercel.app/

## 📝 Consideraciones finales

* La IA filtra localmente usando definiciones de tipo, sin exponer datos.
* El splash screen ofrece una experiencia de bienvenida.

¡Gracias por revisar este proyecto! Cualquier duda, abre un issue o contáctame en jesusosoriojimenez@outlook.com 🚀
