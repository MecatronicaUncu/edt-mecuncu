EDT-Mecuncu
===========

Calendario Semanal

Descripción
=================

El calendario está hecho usando como base a [Polymer](https://www.polymer-project.org/) para lograr un elemento
_independiente_. Esto quiere decir, poder instalarlo en un sitio web sin mayores dificultades, usando por ejemplo
[Bower](bower.io).

La parte de front-end está "bastante" desarrollada (las comillas porque podríamos cambiarla en cualquier momento, pero como para
probar la parte back-end está bien creo).

Instalación (de desarrollo)
================

 - Instalar [NodeJS](nodejs.org/)
 - Instalar [Ruby](https://www.ruby-lang.org/es/downloads/)
 - En la terminal:
  - ```gem install sass```
  - ```gem install compass```
 - Agregar [Sass](sass-lang.com/) y [Compass](compass-style.org/) al PATH
 - En la terminal:
  - ```npm install -g yo```
  - ```git clone https://github.com/MecatronicaUncu/EDT-Mecuncu.git```
  - ```npm install```
  - ```bower install```
  - ```grunt rm app/styles/edt-mecuncu.css && grunt serve --allow-remote```
		
Uso
=================

Por el momento los datos están incluidos como variables en el elemento de Polymer](https://www.polymer-project.org/).
La estructura de los datos es la siguiente:

```javascript
				data = 	[ {dia1}, {dia2}, ... ];

                day = 	{ day:'Lunes',
                  		  times: [	{time1}, {time2}, ... ]}

			    time = 	{	ti:'12h30',
                          	tf:'13h48',
                          	place:'Aula 6',
                          	person:'Andrés Manelli',
                          	type:'Curso'
                         }
```

Es decir, un array de dias. Cada día tiene sus horarios en un array dentro del campo _times_ y una referencia del dia en _day_.
Los horarios se escriben en ese formato: _XXhXX_. Los nombres por cómo está hecho el código hasta ahora conviene que sean _Nombre Apellido_
porque toma la primer letra del nombre y el apellido luego para mostrar en las celdas horarias (eso está hecho por si se necesitara el nombre completo
y para resumir en la presentación).

Algo bueno del formato [JSON](http://json.org/) es que es muy fácil hacer una personalización del código de colores según el tipo de actividad.
A la función _timeplot_ se le pasa el [JSON](http://json.org/) de horarios más un [JSON](http://json.org/) de configuración:

```javascript
				config = {	types:	{
								Clase: {
									color:'#B1C3F9'
								},
								{
									...
								}
							},
							limits:	{
								start:'08h00',
								end:'22h00'
							}
						 }
```

De esta manera los colores responden a esos tipos de actividad, que hay que respetar en el [JSON](http://json.org/) de horarios (pero definidos por uno mismo!).
La franja horaria también es personalizable cambiando esos valores de _limits_. Todavía no hay mucho checkeo de errores por el tema de superposición (Agregar fila?) 
o de que un horario es superior o inferios a los límites.

Detalles
===========

 - Si se abre desde el celu, la página responde mostrando los horarios en una columna, en vez de en filas.
 - Si pasan el mouse sobre las celdas horarias que son "demasiado" pequeñas para mostrar el contenido, hay un tooltip que lo muestra.
 - Desde el celu el tooltip lo ven clickeando sobre la celda.
