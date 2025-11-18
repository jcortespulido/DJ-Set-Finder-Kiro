# Requirements Document

## Introduction

Set Finder es una aplicación web de pantalla completa diseñada para explorar, analizar y descubrir tracklists de sets de DJ. La aplicación proporciona un panel de control visualmente atractivo con temática de neón oscuro que permite a los usuarios navegar entre diferentes vistas, explorar colecciones de sets y analizar tracklists detalladas con información técnica de cada canción.

## Glossary

- **Set**: Una sesión de DJ completa con su tracklist asociada
- **Tracklist**: Lista ordenada de canciones reproducidas en un set
- **BPM**: Beats Per Minute (tempo de una canción)
- **Camelot Key**: Sistema de notación armónica para mezclar canciones (ej. "8A", "10B")
- **Energy Level**: Clasificación de la intensidad de una canción (Intro, Groove, Peak, Buildup, Anthem, Cierre)
- **Sistema**: La aplicación web Set Finder
- **Usuario**: Persona que utiliza la aplicación para explorar sets de DJ
- **Vista Home**: Pantalla principal que muestra los últimos sets añadidos
- **Vista Explorar**: Pantalla con tabla completa y búsqueda de todos los sets
- **Vista Detalle**: Pantalla que muestra la tracklist completa de un set específico
- **Navegación Global**: Barra de navegación superior fija con pestañas Home y Explorar
- **Tarjeta de Set**: Componente visual que muestra información resumida de un set
- **Tema de Neón**: Esquema de colores dinámico específico de cada set

## Requirements

### Requirement 1: Estructura de Datos de Sets

**User Story:** Como usuario, quiero que cada set tenga información completa y estructurada, para poder entender el contexto y características del set antes de explorar su tracklist.

#### Acceptance Criteria

1. WHEN el Sistema almacena un set, THE Sistema SHALL incluir los campos artist, event, stage, date, location, source (con name y url), youtubeUrl, description, bpmRange, mainGenre, duration, unidentifiedTracks, totalTracks y theme
2. WHEN el Sistema almacena un set, THE Sistema SHALL incluir un objeto theme con los campos primary, secondary, border, headerBG, camelot y divider para definir los colores de neón específicos
3. WHEN el Sistema almacena un set, THE Sistema SHALL permitir que el campo youtubeUrl sea nulo si no existe enlace directo
4. WHEN el Sistema almacena una tracklist, THE Sistema SHALL incluir un array de objetos con los campos title, artist, startTime, bpm, energy, genre, tone y notes (opcional)
5. WHEN el Sistema almacena información de source, THE Sistema SHALL incluir tanto el nombre de la fuente como la URL de referencia

### Requirement 2: Navegación Global

**User Story:** Como usuario, quiero una navegación clara y siempre visible, para poder moverme fácilmente entre las diferentes secciones de la aplicación.

#### Acceptance Criteria

1. THE Sistema SHALL mostrar un encabezado de navegación fijo en la parte superior con fondo oscuro (#130f25)
2. THE Sistema SHALL incluir dos pestañas en la navegación: "Home" con icono de casa y "Explorar" con icono de cuadrícula
3. WHEN el Usuario hace clic en una pestaña, THE Sistema SHALL resaltar visualmente la pestaña activa con color neón cian y borde inferior
4. WHEN el Usuario está en la Vista Detalle y hace clic en "Home" o "Explorar", THE Sistema SHALL regresar a la vista correspondiente
5. THE Sistema SHALL mantener el encabezado de navegación visible durante el scroll (sticky positioning)

### Requirement 3: Vista Home

**User Story:** Como usuario, quiero ver una pantalla de inicio atractiva con los sets más recientes, para descubrir rápidamente nuevo contenido sin necesidad de buscar.

#### Acceptance Criteria

1. WHEN el Usuario accede a la aplicación, THE Sistema SHALL mostrar la Vista Home por defecto
2. THE Sistema SHALL mostrar el título "SET FINDER" con estilo de neón cian prominente y de gran tamaño
3. THE Sistema SHALL mostrar un párrafo de introducción debajo del título con tamaño de letra reducido (text-sm)
4. THE Sistema SHALL mostrar el subtítulo "Últimos Sets Añadidos" después de la introducción
5. THE Sistema SHALL mostrar una cuadrícula de 4 columnas en escritorio con los 4 sets más recientemente añadidos
6. WHEN el Usuario hace clic en una tarjeta de set, THE Sistema SHALL navegar a la Vista Detalle de ese set
7. THE Sistema SHALL NOT incluir barra de búsqueda en la Vista Home

### Requirement 4: Tarjetas de Set

**User Story:** Como usuario, quiero ver información resumida y visualmente atractiva de cada set, para decidir rápidamente cuál explorar en detalle.

#### Acceptance Criteria

1. THE Sistema SHALL mostrar en cada tarjeta el nombre del artista con su color neón específico
2. THE Sistema SHALL mostrar en cada tarjeta el evento, stage, fecha y ubicación
3. THE Sistema SHALL mostrar en cada tarjeta la descripción del set limitada a 3 líneas
4. THE Sistema SHALL mostrar en cada tarjeta las métricas de totalTracks y duration
5. WHEN el Usuario pasa el cursor sobre una tarjeta, THE Sistema SHALL aplicar efecto hover con borde neón y elevación
6. WHEN el Usuario hace clic en una tarjeta, THE Sistema SHALL navegar a la Vista Detalle del set correspondiente

### Requirement 5: Vista Explorar

**User Story:** Como usuario, quiero explorar todos los sets disponibles con capacidad de búsqueda, para encontrar sets específicos por artista, evento o ubicación.

#### Acceptance Criteria

1. WHEN el Usuario hace clic en la pestaña "Explorar", THE Sistema SHALL mostrar la Vista Explorar
2. THE Sistema SHALL mostrar el título "SET FINDER" y subtítulo "Explora el Directorio Completo"
3. THE Sistema SHALL incluir una barra de búsqueda centrada en la Vista Explorar
4. WHEN el Usuario escribe en la barra de búsqueda, THE Sistema SHALL filtrar la tabla en tiempo real buscando en los campos artist, event, location y date
5. THE Sistema SHALL mostrar una tabla con todos los sets con columnas: Artista, Evento, Fecha y Lugar
6. THE Sistema SHALL ocultar las columnas Fecha y Lugar en pantallas móviles
7. THE Sistema SHALL mantener el encabezado de la tabla fijo (sticky) durante el scroll vertical
8. WHEN el Usuario hace clic en una fila de la tabla, THE Sistema SHALL navegar a la Vista Detalle del set correspondiente

### Requirement 6: Vista Detalle - Encabezado del Set

**User Story:** Como usuario, quiero ver información completa y contextual del set seleccionado, para entender el evento y características antes de explorar la tracklist.

#### Acceptance Criteria

1. WHEN el Usuario selecciona un set, THE Sistema SHALL aplicar los colores del campo theme del set a toda la Vista Detalle
2. THE Sistema SHALL mostrar un encabezado fijo (sticky) en la parte superior de la Vista Detalle
3. THE Sistema SHALL mostrar en el encabezado el artist con su color theme.primary, event, stage y description
4. THE Sistema SHALL mostrar un panel de estadísticas con Duración, Rango BPM, Género, Tracks (total) y NF (unidentifiedTracks)
5. WHEN el set tiene youtubeUrl, THE Sistema SHALL mostrar un icono de YouTube que enlaza directamente al video
6. WHEN el set NO tiene youtubeUrl, THE Sistema SHALL mostrar un icono de YouTube que realiza búsqueda en Google con "site:youtube.com {artist} {event}"
7. THE Sistema SHALL mostrar la fuente del tracklist con enlace a la URL original

### Requirement 7: Vista Detalle - Tabla de Tracklist

**User Story:** Como usuario, quiero ver la tracklist completa con información técnica detallada de cada canción, para analizar la progresión del set y características musicales.

#### Acceptance Criteria

1. THE Sistema SHALL mostrar una tabla scrollable debajo del encabezado fijo con la tracklist completa
2. THE Sistema SHALL mantener el encabezado de la tabla fijo (sticky) durante el scroll
3. THE Sistema SHALL mostrar columnas: Inicio (startTime), Canción (title y artist), BPM, Género, Tono (tone), Energía (energy) y Notas
4. THE Sistema SHALL colorear la celda Tono usando el color theme.camelot del set
5. WHEN el energy es "Peak", THE Sistema SHALL colorear la celda Energía en rojo
6. WHEN el energy es "Groove", THE Sistema SHALL colorear la celda Energía en amarillo
7. WHEN el energy es "Intro", THE Sistema SHALL colorear la celda Energía en verde
8. WHEN el energy es "Cierre", THE Sistema SHALL colorear la celda Energía en azul
9. WHEN el energy es "Buildup", THE Sistema SHALL colorear la celda Energía en naranja
10. WHEN el energy es "Anthem", THE Sistema SHALL colorear la celda Energía en cian
11. THE Sistema SHALL ocultar las columnas BPM y Notas en pantallas móviles

### Requirement 8: Funcionalidad de Escuchar

**User Story:** Como usuario, quiero poder buscar y escuchar cada canción en plataformas de streaming, para reproducir las canciones que me interesan del set.

#### Acceptance Criteria

1. THE Sistema SHALL incluir una columna "Escuchar" como última columna de la tabla de tracklist
2. THE Sistema SHALL mostrar dos iconos separados en cada fila: icono de Spotify e icono de SoundCloud
3. WHEN el Usuario hace clic en el icono de Spotify, THE Sistema SHALL abrir una nueva pestaña con búsqueda en Google "site:spotify.com {track title} {track artist}"
4. WHEN el Usuario hace clic en el icono de SoundCloud, THE Sistema SHALL abrir una nueva pestaña con búsqueda en Google "site:soundcloud.com {track title} {track artist}"
5. WHEN el Usuario pasa el cursor sobre el icono de Spotify, THE Sistema SHALL cambiar el color a verde Spotify (#1DB954) y aplicar efecto de escala
6. WHEN el Usuario pasa el cursor sobre el icono de SoundCloud, THE Sistema SHALL cambiar el color a naranja SoundCloud (#ff5500) y aplicar efecto de escala

### Requirement 9: Diseño Visual y Temática

**User Story:** Como usuario, quiero una interfaz visualmente atractiva con temática de neón oscuro, para tener una experiencia inmersiva y moderna al explorar sets.

#### Acceptance Criteria

1. THE Sistema SHALL usar un fondo de color azul-negro muy oscuro (#0d0a1d) para todo el viewport
2. THE Sistema SHALL ocupar todo el viewport del navegador sin márgenes externos
3. THE Sistema SHALL aplicar efectos de text-shadow a los elementos con colores neón para crear efecto de brillo
4. THE Sistema SHALL usar la fuente Inter con diferentes pesos (400, 600, 800, 900)
5. THE Sistema SHALL aplicar transiciones suaves (0.3s - 0.5s) en cambios de color, bordes y sombras
6. THE Sistema SHALL usar bordes y divisores con transparencia para mantener la estética oscura
7. THE Sistema SHALL aplicar efectos hover en elementos interactivos con cambios de color y elevación

### Requirement 10: Progressive Web App (PWA)

**User Story:** Como usuario, quiero que la aplicación funcione como una app nativa, para poder instalarla en mi dispositivo y usarla offline.

#### Acceptance Criteria

1. THE Sistema SHALL implementar un service worker para caching de assets y datos
2. THE Sistema SHALL incluir un Web App Manifest válido con nombre, iconos y configuración de display standalone
3. THE Sistema SHALL proporcionar iconos de app en tamaños: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384 y 512x512 píxeles
4. WHEN el Usuario visita la aplicación en un navegador compatible, THE Sistema SHALL mostrar un prompt de instalación
5. WHEN el Usuario instala la aplicación, THE Sistema SHALL funcionar en modo standalone sin barra de navegación del navegador
6. WHEN el Usuario pierde conexión a internet, THE Sistema SHALL mostrar un banner indicando "Sin conexión - Mostrando contenido en caché"
7. WHEN el Usuario está offline, THE Sistema SHALL permitir navegar por sets previamente visitados usando cache
8. WHEN el Usuario está offline y autenticado, THE Sistema SHALL permitir marcar/desmarcar favoritos y sincronizarlos cuando recupere conexión
9. THE Sistema SHALL cachear assets estáticos (CSS, JS, fuentes) indefinidamente con estrategia CacheFirst
10. THE Sistema SHALL cachear respuestas de API con estrategia StaleWhileRevalidate con expiración de 24 horas
11. THE Sistema SHALL obtener un score de Lighthouse PWA mayor a 90
12. THE Sistema SHALL funcionar correctamente cuando se instala en Android, iOS, Windows y macOS

### Requirement 11: Responsividad

**User Story:** Como usuario móvil, quiero que la aplicación se adapte perfectamente a cualquier tamaño de pantalla, para tener una experiencia óptima en cualquier dispositivo.

#### Acceptance Criteria

1. THE Sistema SHALL usar un enfoque Mobile First para el diseño responsive
2. WHEN el ancho de pantalla es menor a 640px, THE Sistema SHALL mostrar la cuadrícula de tarjetas en 1 columna
3. WHEN el ancho de pantalla está entre 640px y 767px, THE Sistema SHALL mostrar la cuadrícula de tarjetas en 2 columnas
4. WHEN el ancho de pantalla está entre 768px y 1023px, THE Sistema SHALL mostrar la cuadrícula de tarjetas en 3 columnas
5. WHEN el ancho de pantalla es mayor a 1024px, THE Sistema SHALL mostrar la cuadrícula de tarjetas en 4 columnas
6. WHEN el ancho de pantalla es menor a 768px, THE Sistema SHALL ocultar las columnas Fecha y Lugar en la Vista Explorar
7. WHEN el ancho de pantalla es menor a 768px, THE Sistema SHALL ocultar las columnas BPM, Notas y Género en la Vista Detalle
8. WHEN el ancho de pantalla es menor a 768px, THE Sistema SHALL reducir el tamaño del título principal a 2.5rem
9. THE Sistema SHALL asegurar que todos los elementos táctiles tengan un tamaño mínimo de 44x44 píxeles
10. THE Sistema SHALL prevenir el zoom automático en inputs en dispositivos iOS usando font-size mínimo de 16px
11. THE Sistema SHALL mostrar modales en pantalla completa en dispositivos móviles
12. THE Sistema SHALL mantener la funcionalidad completa de navegación y búsqueda en todos los tamaños de pantalla

### Requirement 12: Autenticación de Usuarios

**User Story:** Como usuario, quiero poder crear una cuenta y autenticarme, para acceder a funcionalidades personalizadas como guardar favoritos.

#### Acceptance Criteria

1. THE Sistema SHALL proporcionar un formulario de registro con campos email, password y name
2. WHEN el Usuario se registra con datos válidos, THE Sistema SHALL crear una cuenta con password hasheado usando bcrypt
3. THE Sistema SHALL validar que el email tenga formato válido antes de crear la cuenta
4. THE Sistema SHALL validar que el password tenga mínimo 8 caracteres
5. WHEN el Usuario intenta registrarse con un email ya existente, THE Sistema SHALL mostrar error "El email ya está registrado"
6. THE Sistema SHALL proporcionar un formulario de login con campos email y password
7. WHEN el Usuario hace login con credenciales correctas, THE Sistema SHALL generar un JWT token válido por 1 hora
8. WHEN el Usuario hace login exitosamente, THE Sistema SHALL almacenar el token en localStorage
9. WHEN el Usuario cierra sesión, THE Sistema SHALL eliminar el token de localStorage y limpiar el estado de autenticación
10. WHEN el token expira, THE Sistema SHALL hacer logout automático y redirigir al Usuario a la página principal

### Requirement 13: Sistema de Favoritos

**User Story:** Como usuario autenticado, quiero poder marcar sets como favoritos, para acceder rápidamente a mis sets preferidos.

#### Acceptance Criteria

1. WHEN el Usuario está autenticado, THE Sistema SHALL mostrar un botón de favorito (icono de corazón) en cada tarjeta de set
2. WHEN el Usuario está autenticado, THE Sistema SHALL mostrar un botón de favorito en el encabezado de la Vista Detalle
3. WHEN el Usuario hace clic en el botón de favorito de un set no favorito, THE Sistema SHALL añadir el set a la lista de favoritos del Usuario
4. WHEN el Usuario hace clic en el botón de favorito de un set favorito, THE Sistema SHALL eliminar el set de la lista de favoritos del Usuario
5. THE Sistema SHALL mostrar el icono de corazón relleno en color rojo/rosa para sets favoritos
6. THE Sistema SHALL mostrar el icono de corazón outline en color gris para sets no favoritos
7. WHEN el Usuario está autenticado, THE Sistema SHALL mostrar una pestaña "Mis Favoritos" en la navegación global
8. WHEN el Usuario hace clic en "Mis Favoritos", THE Sistema SHALL mostrar una cuadrícula con todos los sets marcados como favoritos
9. WHEN el Usuario no tiene favoritos, THE Sistema SHALL mostrar el mensaje "Aún no tienes sets favoritos. ¡Explora y marca tus favoritos!"
10. THE Sistema SHALL actualizar el contador favoriteCount del set cuando un Usuario añade o elimina un favorito
11. WHEN el Usuario no está autenticado, THE Sistema SHALL NOT mostrar botones de favorito

### Requirement 14: Panel de Administración

**User Story:** Como administrador, quiero poder gestionar sets y usuarios desde un panel de administración, para mantener el contenido de la aplicación actualizado.

#### Acceptance Criteria

1. WHEN el Usuario autenticado tiene rol "admin", THE Sistema SHALL mostrar una pestaña "Admin" en la navegación global
2. WHEN el Usuario autenticado NO tiene rol "admin", THE Sistema SHALL NOT mostrar la pestaña "Admin"
3. THE Sistema SHALL mostrar una tabla con todos los sets existentes en el panel de administración
4. THE Sistema SHALL proporcionar botones "Crear", "Editar" y "Eliminar" para gestionar sets
5. WHEN el Administrador hace clic en "Crear", THE Sistema SHALL mostrar un formulario modal con todos los campos requeridos para un set
6. WHEN el Administrador hace clic en "Editar", THE Sistema SHALL mostrar un formulario modal pre-llenado con los datos del set
7. WHEN el Administrador hace clic en "Eliminar", THE Sistema SHALL mostrar una confirmación antes de eliminar el set
8. WHEN el Administrador confirma la eliminación, THE Sistema SHALL eliminar el set de la base de datos y de los favoritos de todos los usuarios
9. THE Sistema SHALL proporcionar una sección de gestión de usuarios en el panel de administración
10. THE Sistema SHALL mostrar una tabla con todos los usuarios registrados incluyendo email, nombre, rol, fecha de registro y número de favoritos
11. WHEN el Administrador cambia el rol de un usuario, THE Sistema SHALL actualizar el rol en la base de datos
12. WHEN el Administrador elimina un usuario, THE Sistema SHALL mostrar confirmación y eliminar el usuario y sus favoritos

### Requirement 15: Extracción de Tracklist con IA

**User Story:** Como administrador, quiero poder extraer automáticamente tracklists desde URLs de YouTube o SoundCloud usando IA, para agilizar la creación de sets sin entrada manual.

#### Acceptance Criteria

1. THE Sistema SHALL proporcionar una sección "Extractor IA" en el panel de administración
2. THE Sistema SHALL incluir un campo de entrada para URL de YouTube o SoundCloud
3. WHEN el Administrador ingresa una URL válida y hace clic en "Extraer Tracklist", THE Sistema SHALL crear un trabajo de extracción con status "processing"
4. THE Sistema SHALL enviar la información del video/audio a la API de IA (OpenAI GPT-4 o Claude)
5. THE Sistema SHALL incluir en el prompt: título del video, descripción, duración y plataforma
6. THE Sistema SHALL solicitar a la IA que extraiga: artista, evento, stage, fecha, ubicación, género, BPM range, descripción, tracklist completa y tema de colores sugerido
7. WHEN la IA responde, THE Sistema SHALL validar que la respuesta cumpla con el schema esperado
8. WHEN la validación es exitosa, THE Sistema SHALL actualizar el trabajo de extracción con status "completed" y almacenar el resultado
9. WHEN la validación falla, THE Sistema SHALL actualizar el trabajo con status "failed" y almacenar el mensaje de error
10. THE Sistema SHALL mostrar un indicador de loading durante el proceso de extracción
11. WHEN la extracción se completa, THE Sistema SHALL mostrar un preview editable del resultado
12. THE Sistema SHALL permitir al Administrador editar cualquier campo del resultado antes de guardar
13. WHEN el Administrador confirma el resultado, THE Sistema SHALL crear el set en la base de datos con los datos extraídos
14. WHEN la extracción toma más de 2 minutos, THE Sistema SHALL cancelar el proceso y marcar el trabajo como "failed" con error "Timeout"
15. THE Sistema SHALL manejar rate limits de la API de IA con reintentos exponenciales (máximo 3 intentos)

### Requirement 16: Persistencia de Datos

**User Story:** Como administrador, quiero que todos los sets se almacenen en una base de datos, para que los datos persistan y puedan ser gestionados de forma centralizada.

#### Acceptance Criteria

1. THE Sistema SHALL utilizar MongoDB como base de datos para almacenar sets, usuarios y trabajos de extracción
2. THE Sistema SHALL crear un índice único en el campo email de la colección Users
3. THE Sistema SHALL crear índices de texto en los campos artist y event de la colección Sets para búsqueda eficiente
4. WHEN el Sistema inicia, THE Sistema SHALL conectarse a MongoDB Atlas o instancia local
5. WHEN la conexión a la base de datos falla, THE Sistema SHALL registrar el error y reintentar la conexión
6. THE Sistema SHALL validar todos los datos antes de insertarlos en la base de datos usando schemas de Mongoose
7. THE Sistema SHALL almacenar passwords hasheados usando bcrypt con salt rounds de 10
8. THE Sistema SHALL almacenar referencias entre colecciones usando ObjectId de MongoDB
9. WHEN un Usuario es eliminado, THE Sistema SHALL eliminar todas sus referencias en favoritos de sets
10. THE Sistema SHALL mantener un campo favoriteCount denormalizado en cada set para optimizar queries de ordenamiento por popularidad
