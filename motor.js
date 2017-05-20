
/* Creamos la base de datos (o la abrimos si ya existe). Le asignamos un nombre, la versión, una descripción y el tamaño máximo que tendrá. */
var bbdd = openDatabase('Colegio', '1.0', 'BBDD M06 UF3 PAC2', 2 * 1024 * 1024 );

/* Se ejecuta una transacción para crear la tabla e introducir unos registros iniciales. Al ser una transacción, no se realizará ninguna sentencia si no se cumplen todas. Si ocurre algún error, 
nos lo muestra la función error_log */
bbdd.transaction(function(tx) {
    /* Creamos la tabla si no existe. Tendrá 5 campos. El id será primary key y auto asignable e incremental. Al insertar el id manualmente, nos aseguramos que estos registros solo se 
    introduciran en la bbdd cuando la creemos (también se introduciría el que faltase si se borra uno de estos registros).*/
    tx.executeSql("CREATE TABLE IF NOT EXISTS centro (id INTEGER PRIMARY KEY autoincrement, asignatura TEXT(100), profesor TEXT(50), curso TEXT(50), fecha DATE)");   
    
    tx.executeSql("INSERT INTO centro VALUES (1,'Sistemas Informáticos','Xavier Baldor','1516-2S','2016-02-29')");
    tx.executeSql("INSERT INTO centro VALUES (2,'Bases de Datos','Albert Guardia','1516-2S','2016-02-29')");
    tx.executeSql("INSERT INTO centro VALUES (3,'Programación','Marc Casanovas','1516-2S','2016-02-29')");
    tx.executeSql("INSERT INTO centro VALUES (4,'Empresa e Iniciativa Emprendedora','Merce Jordana','1516-S','2016-02-29')");
    tx.executeSql("INSERT INTO centro VALUES (5,'Formación y Orientación Laboral','Pilar Bayona','1617-1S','2016-09-30')");
    tx.executeSql("INSERT INTO centro VALUES (6,'Lenguajes de Marcas','Adrián Torres','1617-1S','2016-09-30')");
    tx.executeSql("INSERT INTO centro VALUES (7,'Bases de Datos 2','Alberto Oliva','1617-1S','2016-09-30')");
    tx.executeSql("INSERT INTO centro VALUES (8,'Programación Orientada a Objetos','Ana González','1617-1S','2016-09-30')");
    tx.executeSql("INSERT INTO centro VALUES (9,'Desarrollo Web Entorno Servidor','Xavier Baldor','1617-1S','2016-09-30')");
    tx.executeSql("INSERT INTO centro VALUES (10,'Entornos de Desarrollo','Ana González','1617-1S','2016-09-30')");
    tx.executeSql("INSERT INTO centro VALUES (11,'Desarrollo Web Entorno Cliente','Adrián Torres','1617-1S','2016-09-30')");
    tx.executeSql("INSERT INTO centro VALUES (12,'Despliegue de Aplicaciones Web','Alberto Oliva','1617-1S','2016-09-30')");
    tx.executeSql("INSERT INTO centro VALUES (13,'Diseño de Interfaces Web','Xavier Baldor','1617-1S','2016-09-30')");
    /* Dejo estas sentencias comentadas ya que vienen bien para hacer pruebas. Son para borrar los registros o la tabla creada */
    //tx.executeSql("DELETE FROM centro");
    //tx.executeSql("DROP TABLE centro");
}, error_log);


/*  Función que nos mostrará los errores contenidos en las distintas transacciones*/
function error_log(error){
    console.log(error.message);
}


/* Función que se ejecuta al cargar la página listadoCentros.html. Nos conforma la tabla con los datos de la bbdd. Primero hacemos una consulta para recuperar los datos que se guarda en un array. En la variable lon almacenamos la cantidad de filas que usaremos para recorrer la información obtenida en la consulta con el bucle for. En la variable salida vamos concatenando todo el código html que luego se añadirá
al div tabla_centro para mostrar la tabla creada */
function mostrarTabla(){
    
    bbdd.transaction(function(tx){
        tx.executeSql("SELECT * FROM centro", [], function(tx, results){
            //Número de filas devueltas en la consulta
            var lon = results.rows.length;
            //Empezamos a rellenar la variable con el código
            var salida = '<table>';
            //Le concatenamos la fila de cabecera
            salida += '<tr><th>ID</th><th>ASIGNATURA</th><th>PROFESOR</th><th>CURSO</th><th>FECHA</th></tr>';
            //Ejecutamos el bucle. En cada vuelta, concatenamos la información para una fila. Creamos la celda y le añadimos el valor de la variable de cada campo correspondiente a la fila que estamos leyendo
            for(var i=0; i<lon; i++){
                var centro = results.rows.item(i);
                salida = salida +'<tr>';
                salida += '<td>' +centro.id+ '</td>';
                salida += '<td>' +centro.asignatura+ '</td>';
                salida += '<td>' +centro.profesor+ '</td>';
                salida += '<td>' +centro.curso+ '</td>';
                salida += '<td>' +centro.fecha+ '</td>';
                salida += '</tr>';  
            }
            //Concatenamos el final de la tabla
            salida = salida +'</table><br><br><br>';
            //La escribimos en el div correspondiente
            document.getElementById('tabla_centro').innerHTML = salida;
        });
        
    }, error_log);
    
}


/* Al hacer clic en Añadir(en el formulario de añadir registro) tomamos los datos de los campos y los añadimos a la bbdd */
function anadirRegistro(){
    bbdd.transaction(function(tx){
        //Tomamos los valores de cada campo y los asignamos en variables
        var asignatura = document.getElementById('asignatura').value;
        var profesor = document.getElementById('profesor').value;
        var curso = document.getElementById('curso').value;
        var fecha = document.getElementById('fecha').value;
        //Variable mensaje. Mostrará los mensajes de error de validación
        var mensaje = 'mensaje';
        //Variable booleana que usaremos para mostrar si los datos se han introducido correctamente
        var valido = true;
        /* Si se cumplen los máximos de longitud establecidos en la bbdd se insertan los datos en la bbdd siempre, aunque tenga errores de validación  */
        if(asignatura.length<=100 && profesor.length<=50 && profesor.length<=50){
            tx.executeSql('INSERT INTO centro (asignatura, profesor, curso, fecha) VALUES(?,?,?,?)', [asignatura, profesor, curso, fecha]);
        }
        /*Comprobamos cada campo con su correspondiente método. Es meramente informativo ya que el registro se guardará siempre. Si todos son correctos avisamos de que el registro se ha introducido correctamente
        y redirigimos a la página del listado. Si alguno no se cumple la variable valido pasará a ser false*/
        if(comprobarAsignatura(asignatura, mensaje)==true){
            if(comprobarProfesor(profesor, mensaje)==true){
                if(comprobarCurso(curso, mensaje)==true){
                    
                    alert("Registro insertado correctamente.");
                    window.location="listadoCentros.html";
                
                }else{valido=false;}
            }else{valido=false;}
        }else{valido=false;}
        
        //Si la variable valido es false se muestra una alerta avisando de que los datos son incorrectos (aunque guardemos el registro). 
        if(valido==false){
            alert("Datos incorrectos.");
        }
    //mostramos errores si los hubiera
    }, error_log);
}
         

/* Al pulsar en modificar Registro realizamos el mismo procedimiento que anteriormente. Resgistramos siempre el cambio realizado, pero comprobamos si es correcto o no y se lo avisamos al usuario. Si todo es 
correcto, volvemos a actualizar los datos y redirigimos a la página listado para ver los cambios*/
function modificarRegistro(){
    bbdd.transaction(function(tx){
       
           
            var id = document.getElementById('idM').value;
            var asignatura = document.getElementById('asignaturaM').value;
            var profesor = document.getElementById('profesorM').value;
            var curso = document.getElementById('cursoM').value;
            var fecha = document.getElementById('fechaM').value;
            var mensaje = 'mensaje2';
            var valido = true;
            if(asignatura.length<=100 && profesor.length<=50 && profesor.length<=50){
                tx.executeSql('UPDATE centro SET asignatura = ?, profesor = ?, curso = ?, fecha = ? WHERE id = ?', [asignatura, profesor, curso, fecha, id]);
            }
            if(comprobarAsignatura(asignatura, mensaje)==true){
                if(comprobarProfesor(profesor, mensaje)==true){
                    if(comprobarCurso(curso, mensaje)==true){
                    
                        var confirmacion = confirm("¿Realmente quieres editar el registro?");
                        if(confirmacion == true){
                        tx.executeSql('UPDATE centro SET asignatura = ?, profesor = ?, curso = ?, fecha = ? WHERE id = ?', [asignatura, profesor, curso, fecha, id]);
                        alert("Registro modificado correctamente.");
                        window.location="listadoCentros.html";
                    }
                    
                }else{valido=false;}
            }else{valido=false;}
        }else{valido=false;}
        
        if(valido==false){
            alert("Datos incorrectos.");
        }
        
    }, error_log);
}


/* Al seleccionar un registro para eliminar, mostramos un mensaje de confirmación. */
function eliminarRegistro(){

    bbdd.transaction(function(tx){
        //Mensaje de confirmación
        var confirmacion = confirm("¿Realmente quieres eliminar el registro?");
        /* Si lo acepta, borramos el registro del que tenga el id que recuperamos del formulario, ejecutamos la consulta para eliminarlo y redirigimos a la página del listado */
        if(confirmacion == true){
            var id = document.getElementById('idE').value;
            tx.executeSql('DELETE FROM centro WHERE id = ?', [id]);
            alert("Registro eliminado correctamente");
            window.location="listadoCentros.html";
        //Si no acepta, redirigimos a la página de Alta/Edición por si quiere realizar otra acción    
        }else{
            window.location="altaCentros.html";
        }
    }, error_log);
}
   

/* En la página de edición, solo se muestra un select para elegir la acción a realizar. Según la opción escogida se muestra uno o otro div. Lo conseguimos mediante la propiedad css display de cada div */
function elegirOpcion(sel) {
      //Si elige la opcion de añadir registro mostramos el div "nuevo" y ocultamos el resto
      if (sel.value == "nuevoRegistro"){
           divC = document.getElementById("nuevo");
           divC.style.display = "";
           divT = document.getElementById("edita");
           divT.style.display = "none";
           divT = document.getElementById("elimina");
           divT.style.display = "none";
          
      //Si elige la opción de modificar registro se muestra el div "edita" y ocultamos el resto. Ejecutamos la función selMod que conformará el selector de registros para modificarlo posteriormente
      }else if (sel.value == "editaRegistro"){
           divC = document.getElementById("nuevo");
           divC.style.display = "none";
           divT = document.getElementById("edita");
           divT.style.display = "";
           divT = document.getElementById("elimina");
           divT.style.display = "none";
           selMod();
      //Si elige la opción de eliminar registro se muestra el div "elimina" y ocultamos el resto. Ejecutamos la función selElim que conformará el selector de registros para eliminarlo posteriormente
      }else if (sel.value == "eliminaRegistro"){
          divC = document.getElementById("nuevo");
           divC.style.display = "none";
           divT = document.getElementById("edita");
           divT.style.display = "none";
           divT = document.getElementById("elimina");
           divT.style.display = "";
           selElim();
      //En cualquier otro caso (al acceder a la página por ejemplo) quedarán ocultos los 3 divs
      }else{
          divC = document.getElementById("nuevo");
           divC.style.display = "none";
           divT = document.getElementById("edita");
           divT.style.display = "none";
           divT = document.getElementById("elimina");
           divT.style.display = "none";
      }
}


/* Al seleccionar la opción de modificar se llama a esta función. Esta hace una consulta a la bbdd con todos los registros y conforma un selector con todas las opciones disponibles. En cada opción del 
selector veremos toda la información del registro para facilitar su selección. */
function selMod(){
    
    bbdd.transaction(function(tx){
        //Realizamos la consulta a la bbdd
        tx.executeSql("SELECT * FROM centro", [], function(tx, results){
            var lon = results.rows.length;
            //Empezamos a completar el código en la variable salida
            var salida = '<select name="sel_mod" onChange="confMod(this)"><option value="">Elige el registro...</option>';
            for(var i=0; i<lon; i++){
                var centro = results.rows.item(i);
                salida = salida +'<option value="'+centro.id+'">';
                salida += centro.id+ ' - ' +centro.asignatura+ ' - '+centro.profesor+ ' - ' +centro.curso+ ' - ' +centro.fecha;
                salida += '</option>';
            }
            salida = salida +'</select>';
            salida += '<br><div id="conf_mod"></div>';
            //Escribimos el código de salida en el div opcMod
            document.getElementById('opcMod').innerHTML = salida;
        });
    }, error_log);
}


/* Una vez mostrado el selector anterior, se crea el formulario para editar el registro. A medida que elija registros a eliminar, dinámicamente se irán rellenando los valores de los campos, mostrando
los valores del registro seleccionado para una fácil modificación. Se añaden los botones de limpiar y de modificar*/
function confMod(sel){
        //Variable que recoge el valor actual del selector anterior y realiza la consulta a la bbdd. El valor será el id del registro seleccionado
        var idSel = sel.value;
        bbdd.transaction(function(tx){
        tx.executeSql("SELECT * FROM centro WHERE id='"+idSel+"'", [], function(tx, results){
            var lon = results.rows.length;
            var salida = '<br><form method="post" action="" name="form_mod"><table style="text-align:left">';
            for(var i=0; i<lon; i++){
                var centro = results.rows.item(i);
                salida = salida +'<tr><td>ID</td><td><input type="text" readonly id="idM" value="'+centro.id+'" size="5"></td></tr>';
                salida += '<tr><td>ASIGNATURA</td><td><input type="text" id="asignaturaM" value="'+centro.asignatura+'" size="27"></td></tr>';
                salida += '<tr><td>PROFESOR</td><td><input type="text" id="profesorM" value="'+centro.profesor+'" size="24"></td></tr>';
                salida += '<tr><td>CURSO</td><td><input type="text" id="cursoM" value="'+centro.curso+'" size="21"></td></tr>';
                salida += '<tr><td>FECHA</td><td><input type="date" id="fechaM" value="'+centro.fecha+'"></td></tr>';
            }
            salida += '<tr><td colspan="2" id="mensaje2"></td></tr>';
            salida += '<tr style="text-align:center";><td><input type="reset" value="Limpiar"></td><td><input type="button" value="Modificar" onclick="modificarRegistro()"></td></tr>'
            salida += '</table></form>';
            salida += '<br><br><div id="conf_mod"></div>';
            document.getElementById('conf_mod').innerHTML = salida;
        });
    }, error_log);
    
}


/* Al seleccionar la opción de eliminar se llama a esta función. Esta hace una consulta a la bbdd con todos los registros y conforma un selector con todas las opciones disponibles. En cada opción del 
selector veremos toda la información del registro para facilitar su selección. */
function selElim(){
    
    bbdd.transaction(function(tx){
        //Realizamos la consulta a la bbdd
        tx.executeSql("SELECT * FROM centro", [], function(tx, results){
            var lon = results.rows.length;
            //Empezamos a completar el código en la variable salida
            var salida = '<select name="sel_elim" onChange="confElim(this)"><option value="">Elige el registro...</option>';
            for(var i=0; i<lon; i++){
                var centro = results.rows.item(i);
                salida = salida +'<option value="'+centro.id+'">';
                salida += centro.id+ ' - ' +centro.asignatura+ ' - ' +centro.profesor+ ' - ' +centro.curso+ ' - ' +centro.fecha;
                salida += '</option>';
            }
            salida = salida +'</select>';
            salida += '<br><div id="conf_elim"></div>';
            //Escribimos el código de salida en el div opcElim
            document.getElementById('opcElim').innerHTML = salida;
        });
        
    }, error_log);
}

/* Una vez mostrado el selector anterior, se crea una pantalla informativa con los datos del registro seleccionado para eliminar. Este irá cambiando dinámicamente según seleccionemos uno u otro registro. 
Pedimos una primera confirmación sobre la eliminación mediante los botones SI o NO. Si pulsa NO, será redirigido a la página de alta por si quiere realizar otra acción. Si pulsa si, llamamos a la función 
eliminarRegistro() que volverá a pedir confirmación y eliminará el registro de la bbdd*/
function confElim(sel){
    
        var idSel = sel.value;
    
        bbdd.transaction(function(tx){
        tx.executeSql("SELECT * FROM centro WHERE id='"+idSel+"'", [], function(tx, results){
            
            var lon = results.rows.length;
            var salida = '';
            for(var i=0; i<lon; i++){
                var centro = results.rows.item(i);
                salida = salida +'<br>Has elegido eliminar el registro:<br><br>';
                salida += '<input type="hidden" id="idE" value="'+centro.id+'">'; 
                salida += 'ID: ' +centro.id+'<br><br>';
                salida += 'ASIGNATURA: ' +centro.asignatura+'<br><br>';
                salida += 'PROFESOR: ' +centro.profesor+'<br><br>';
                salida += 'CURSO: ' +centro.curso+'<br><br>';
                salida += 'FECHA: ' +centro.fecha+'<br><br>';
                salida += '¿Es correcto?<br><br>';
            }
            salida += '<tr><td><input type="button" onclick="window.location=\'altaCentros.html\'" value="NO" style="width:50px;">&nbsp;&nbsp;</td>';
            salida += '<td>&nbsp;&nbsp;<input type="button" value="SI" onclick="eliminarRegistro()" style="width:50px;"><td></tr>';
            salida += '</table></form><br>';
            salida += '<br><div id="conf_mod"></div>';
            document.getElementById('opcElim2').innerHTML = salida;
        });
        
    }, error_log);
    
}


/* Funciones para validar los campos. Se hace una validación poco restrictiva. Solo comprobamos que contenga caracteres permitidos y la longitud de la cadena total.*/

/* Función para comprobar la asignatura. Comparamos el valor de esta con el patrón establecido. Si es correcto borramos el mensaje de error si lo hubiera y retornamos true. Si es falso rellenamos el mensaje
de error con el texto que queremos mostrar para que luego lo inserte la función correspondiente y retornamos false */
function comprobarAsignatura(cadena, mensaje){
    var patron=/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜàèìòùÀ\-ÈÌÒÙçÇºª\s]{2,100}$/;
    if(cadena.match(patron)){
        document.getElementById(mensaje).innerHTML = '';
        return true;
    }else{
        document.getElementById(mensaje).innerHTML = 'El nombre de la asignatura debe tener entre 2 y 100 caracteres';
        return false;
    }
}


/* Función para comprobar el profesor. Comparamos el valor de esta con el patrón establecido. Si es correcto borramos el mensaje de error si lo hubiera y retornamos true. Si es falso rellenamos el mensaje
de error con el texto que queremos mostrar para que luego lo inserte la función correspondiente y retornamos false */
function comprobarProfesor(cadena, mensaje){
    var patron=/^[a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜàèìòùÀ\-ÈÌÒÙçÇºª\s]{2,50}$/;
    if(cadena.match(patron)){
        document.getElementById(mensaje).innerHTML = '';
        return true;
    }else{
        document.getElementById(mensaje).innerHTML = 'El nombre del profesor debe tener entre 2 y 50 caracteres';
        return false;
    }
}


/* Función para comprobar el curso. Comparamos el valor de esta con el patrón establecido. Si es correcto borramos el mensaje de error si lo hubiera y retornamos true. Si es falso rellenamos el mensaje
de error con el texto que queremos mostrar para que luego lo inserte la función correspondiente y retornamos false */
function comprobarCurso(cadena, mensaje){
    var patron=/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜàèìòùÀ\-ÈÌÒÙçÇºª\s]{2,50}$/;
    if(cadena.match(patron)){
        document.getElementById(mensaje).innerHTML = '';
        return true;
    }else{
        document.getElementById(mensaje).innerHTML = 'El nombre del curso debe tener entre 1 y 50 caracteres';
        return false;
    }
}