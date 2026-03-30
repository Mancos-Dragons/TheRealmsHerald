🏰 The Realm's Herald: Manual de Herramientas de la Suite

Este documento detalla las aplicaciones que componen el ecosistema de The Realm's Herald. Cada herramienta está diseñada como un módulo ES6 independiente bajo una arquitectura Data-Driven.

1. La Voz del Conejo (Prensa)

Descripción detallada: Editor de gacetas y periódicos diegéticos. Permite al DM crear contenido que los jugadores recibirán físicamente o digitalmente para enterarse de los eventos del mundo. Utiliza un sistema de maquetación drag & drop con estética de papel antiguo.
Funcionalidades:

Plantillas de periódicos, panfletos y boletines oficiales.

Inserción de noticias generadas automáticamente por otros módulos.

Exportación a PDF de alta calidad con texturas de pergamino.

Sistema de "Nivel de Censura" que altera el tono del texto.

2. Susurros de Taberna (Rumores)

Descripción detallada: Generador procedimental de hilos narrativos. Crea rumores basados en la ubicación, la época y los eventos actuales de la campaña para dar profundidad a las interacciones en tabernas y mercados.
Funcionalidades:

Generación de rumores verdaderos, falsos y a medias.

Clasificación por temática (política, magia, tesoros, local).

Conexión con el módulo de NPCs para asignar quién conoce qué secreto.

3. La Voz del Pueblo (Opinión Pública)

Descripción detallada: Rastreador dinámico de reputación. Gestiona cómo ven los distintos estratos sociales o regiones a los jugadores basándose en sus acciones pasadas.
Funcionalidades:

Medidores de Fama e Infamia.

Modificadores automáticos de precios en tiendas según reputación.

Triggers de eventos (ej. si la infamia es alta, aparecen carteles de "Se Busca").

4. Caras en la Multitud (NPCs Reactivos)

Descripción detallada: Motor de creación de personajes no jugadores con "memoria de eventos". No solo genera stats, sino motivaciones y relaciones con los jugadores.
Funcionalidades:

Generación instantánea de personalidad, rasgos físicos y secretos.

Registro de interacciones previas (el NPC recuerda si los jugadores le ayudaron o insultaron).

Generador de nombres basado en etnia/cultura del mundo.

5. Crónicas del Tiempo (Línea de Tiempo)

Descripción detallada: Una cronología interactiva que gestiona el paso de los días, meses y años en el calendario del mundo. Permite marcar eventos históricos y futuros.
Funcionalidades:

Calendario personalizable (meses, lunas y festividades).

"Modo Historia" para visualizar la progresión de la campaña.

Sincronización con el "Diario del Bardo" para auto-rellenar fechas.

6. Escriba Real (Documentos y Decretos)

Descripción detallada: Generador de props visuales. Crea decretos reales, cartas selladas, contratos y carteles de recompensa con un acabado profesional y tipografías clásicas.
Funcionalidades:

Editor de sellos de cera personalizados.

Generador de firmas automáticas.

Plantillas de "Wanted Posters" que extraen la imagen y datos del módulo de NPCs.

7. Círculos de Poder (Facciones)

Descripción detallada: Matriz diplomática para gestionar la política del reino. Visualiza las alianzas, rivalidades y la influencia de las distintas organizaciones (gremios, cultos, casas nobles).
Funcionalidades:

Mapa de relaciones (quién odia a quién).

Medidor de recursos y poder militar/económico por facción.

Simulación de "Turno de Facción" para eventos que ocurren fuera de cámara.

8. El Oráculo Mecánico (Traductor Narrativo)

Descripción detallada: Herramienta que traduce estadísticas numéricas de D&D (o cualquier sistema) a descripciones literarias fluidas para el DM.
Funcionalidades:

Conversor de "Daño de Ataque" a descripciones de heridas.

Traductor de "Dificultad de Clase" a percepción visual del entorno.

Generador de adjetivos para descripciones de combate épico.

9. Susurros Oscuros (Gestor de Secretos)

Descripción detallada: Un repositorio confidencial donde el DM guarda información que los jugadores aún no conocen. Utiliza "Triggers" para avisar cuando un secreto puede ser revelado.
Funcionalidades:

Asociación de secretos a NPCs, Objetos o Lugares.

Sistema de "Desbloqueo por Habilidad" (ej. si un jugador saca >15 en Percepción).

Historial de revelaciones para evitar redundancias.

10. Diario del Bardo (Resúmenes de Sesión)

Descripción detallada: Generador de resúmenes de sesión escritos desde una perspectiva diegética (como si un bardo o cronista contara la historia).
Funcionalidades:

Extracción de puntos clave de la sesión.

Tono ajustable (heroico, cómico, trágico, cínico).

Archivo de "Sagas" para consultar qué pasó hace meses.

11. Entropía Arcana (Modo Caos)

Descripción detallada: Herramienta de improvisación para momentos donde los jugadores se salen del guion. Genera eventos aleatorios disruptivos que mantienen la narrativa viva.
Funcionalidades:

Tablas de azar complejas (clima arcano, encuentros sociales, accidentes).

Botón de "Pánico" que genera una complicación inmediata lógica.

Integración con el motor de dados (Dice.js).

12. Efecto Mariposa (Consecuencias)

Descripción detallada: Un árbol de decisiones que rastrea las consecuencias a largo plazo de los actos de los jugadores.
Funcionalidades:

Visualización de ramificaciones narrativas.

Sistema de "Ecos": una acción en el nivel 1 tiene una consecuencia en el nivel 10.

Alertas de "Conflicto de Intereses" entre facciones por decisiones del grupo.

13. El Cartógrafo (Visor de Mapas)

Descripción detallada: Proyector de mapas tácticos y de mundo con capacidad de capas (Fog of War) y marcadores interactivos.
Funcionalidades:

Soporte para imágenes de alta resolución con zoom suave.

Capas de información (Nombres de lugares, clima, territorios de facciones).

Integración con el EventBus para mostrar la ubicación actual del grupo.

14. Forja de Encuentros (Generador de Combate)

Descripción detallada: Generador dinámico de encuentros balanceados. No solo elige monstruos, sino que diseña el escenario, los objetivos tácticos y la motivación del enemigo.
Funcionalidades:

Cálculo automático de dificultad (CR/XP) según el nivel del grupo.

Generador de "Acontecimientos de Terreno" (ej. el suelo se rompe en el turno 3).

Tácticas sugeridas para el DM (comportamiento de la IA del enemigo).

15. Tesoros de Leyenda (Creador de Ítems)

Descripción detallada: Editor de fichas de objetos mágicos y equipo. Crea tarjetas visuales que los jugadores pueden "coleccionar" en su inventario.
Funcionalidades:

Generador de historia y procedencia del objeto (quién lo forjó).

Sistema de "Propiedades Ocultas" que se revelan al identificarlos.

Exportación en formato tarjeta (estilo TCG) con arte y stats.

16. El Laboratorio (Zona de Pruebas)

Descripción detallada: Espacio modular para que el DM experimente con nuevas mecánicas, reglas de la casa o aplicaciones en fase beta.
Funcionalidades:

Consola de comandos para modificar el estado global de la app.

Importador/Exportador de esquemas JSON personalizados.

Logs de depuración para probar interconexiones entre módulos.

🌐 Funcionalidades Globales del Sistema (Core)

Estas funcionalidades no son herramientas aisladas, sino servicios transversales que orquestan la coherencia de toda la aplicación.

A. Gestión de Campañas y Estados (Campaign Manager)

Descripción: Motor de persistencia que permite manejar múltiples campañas independientes. Cada campaña guarda su propio estado de mundo, NPCs, reputación y progreso cronológico.
Capacidades:

Snapshots de Campaña: Guardado de estados en momentos específicos de la narrativa.

Carga Dinámica: Al cambiar de campaña, el DataService limpia la memoria y carga el nuevo set de datos JSON.

Portabilidad: Exportación/Importación de la campaña completa en un único archivo comprimido para respaldos o compartir con otros DMs.

B. Registro de Hechos (Action & Event Log)

Descripción: Un sistema de auditoría narrativa que registra automáticamente "acciones definitivas". Este log sirve como la base de datos de eventos para módulos como el Diario del Bardo o las Crónicas del Tiempo.
Capacidades:

Auto-Logging: Cada vez que una herramienta realiza una acción de "salida" (ej. Exportar PDF en Newspaper, Finalizar Encuentro en Forja, Revelar Secreto), se genera una entrada con timestamp diegético.

Categorización de Impacto: Las acciones se marcan como "Menor", "Mayor" o "Crítica" (Butterfly Effect).

Trazabilidad: Permite al DM ver qué acción disparó un cambio en la opinión pública o una reacción de facción.

C. Sincronización Inter-Módulos (Live State Sync)

Descripción: Utiliza el EventBus para asegurar que un cambio en una herramienta se refleje inmediatamente en las demás sin necesidad de recargar la aplicación.
Capacidades:

Reacción en Cadena: Un cambio de fecha en Crónicas del Tiempo puede disparar eventos de "caducidad" en Susurros de Taberna (rumores viejos desaparecen).

Notificaciones Internas: Sistema de avisos visuales discretos cuando una herramienta tiene nueva información disponible basada en acciones de otra (ej. "Nueva noticia sugerida en La Voz del Conejo basada en tu último encuentro").