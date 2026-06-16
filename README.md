<<<<<<< HEAD
# Harvard CV Studio 🎓

**Harvard CV Studio** es una aplicación web interactiva diseñada para crear, estructurar y optimizar currículums (CV) siguiendo los estándares clásicos y profesionales de la Universidad de Harvard. Permite escribir en formato Markdown y exportar el resultado a un PDF perfectamente formateado y optimizado para sistemas de seguimiento de candidatos (ATS).

---

## ✨ Características Principales

*   **Editor Markdown en Tiempo Real:** Escribe o pega tu CV directamente usando una sintaxis sencilla y limpia.
*   **Ajustes de Estilo Clásico (Harvard):**
    *   **Tipografía:** Elige entre estilos tradicionales como *EB Garamond (Serif)*, *Georgia (Serif)*, *Inter (Sans-serif)* o *Arial (Sans)*.
    *   **Dimensiones Ajustables:** Control preciso sobre el tamaño de fuente, márgenes (en pulgadas), espaciado de línea y espacio entre secciones.
    *   **Cortes de Página Virtuales:** Indicadores dinámicos que muestran visualmente el fin de cada página (formato Letter) para evitar saltos de línea inoportunos en el PDF.
*   **Analizador ATS Integrado:**
    *   Evaluación en tiempo real del porcentaje de optimización ATS.
    *   Lista de verificación interactiva que valida datos de contacto, enlaces profesionales (LinkedIn), estructura lineal y presencia de secciones clave (Educación, Experiencia, Habilidades).
    *   Escáner de verbos de acción fuertes (ej. *Lideré, Diseñé, Automaticé*).
    *   Detección de elementos incompatibles (como tablas Markdown que dificultan la lectura de los ATS).
*   **Utilidades del Documento:**
    *   **Cargar MD:** Importa cualquier archivo de texto o Markdown `.md` desde tu dispositivo.
    *   **Guardar MD:** Exporta el contenido actual del editor a un archivo `.md` local.
    *   **Exportar a PDF:** Genera la hoja del CV lista para impresión o guardado digital.
    *   **Vista de Pantalla Completa:** Expande la previsualización ocultando el editor para un control visual detallado.

---

## 🛠️ Tecnologías Utilizadas

La aplicación está construida de manera liviana e independiente utilizando tecnologías web nativas:

*   **Estructura:** HTML5 semántico.
*   **Estilos:** CSS3 personalizado con variables dinámicas para el control de dimensiones.
*   **Lógica:** JavaScript vanilla (ES6).
*   **Librerías Externas (vía CDN):**
    *   [Marked.js](https://marked.js.org/) para el procesamiento del contenido Markdown a HTML.
    *   [Lucide Icons](https://lucide.dev/) para la iconografía interactiva de la interfaz.
    *   Google Fonts para la integración de la fuente clásica *EB Garamond* e *Inter*.

---

## 🚀 Cómo Iniciar el Proyecto

No se requieren instalaciones ni dependencias de servidor complejas. Puedes ejecutar el proyecto de forma local siguiendo estos pasos:

1.  Clona o descarga este repositorio en tu máquina local.
2.  Abre el archivo `index.html` directamente en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari).
3.  ¡Empieza a redactar tu currículum!

---

## 📁 Estructura de Archivos del Proyecto

```text
├── index.html               # Estructura principal de la app y plantilla por defecto
├── styles.css               # Estilos del dashboard y reglas de impresión para PDF
├── app.js                   # Lógica de renderizado, análisis ATS y controles interactivos
├── cv_designer_doodle.png   # Ilustración de la interfaz lateral
├── .gitignore               # Configuración para ignorar archivos personales y copias en Git
└── README.md                # Documentación del proyecto (este archivo)
```

---

## 📄 Licencia

Este proyecto es de código abierto. Siéntete libre de clonarlo, modificarlo y adaptarlo a tus necesidades.
=======
# harvard-cv-studio
Proyecto de creación de CV bajo formato markdown.
>>>>>>> 85b1a2cb98c510850a2d6d3102dfe657e8d6a272
