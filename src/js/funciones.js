const {ipcRenderer} = require('electron');

function leerArchivo(){
    ipcRenderer.send('leerArchivo','true');
}

ipcRenderer.on('ObtenerNombre',(event,data)=>{
    $('#txtPath').text(data);
});

ipcRenderer.on('ObtencionDatos',(event,data)=>{
    console.log(data);
    procesoFillGrafica(data);
    procesoInformacion(data);
    procesoFillTabla(data);
});

function procesoFillGrafica(data){
    var nombres = getNombres(data);
    var calificaciones = getCalificaciones(data);
    fillGrafica(nombres,calificaciones);
}

function getCalificaciones(data){
    var calificaciones = new Array();
    for(var x=0;x < Object.keys(data).length;x++){
        calificaciones.push(data[x]["Calificacion"]);
    }
    return calificaciones;
}
function getNombres(data){
    var nombres = new Array();
    for(var x=0;x < Object.keys(data).length;x++){
        var item = `${data[x]['Nombres']} ${data[x]['Apellido Paterno']} ${data[x]['Apellido Materno']}`;
        nombres.push(item);
    }
    return nombres;
}

function fillGrafica(nombres,calificaciones){
    var Chart = require('chart.js');
    var canvas = document.getElementById('cvGrafica').getContext('2d');
    var grafica = new Chart(canvas,{
        type: 'bar',
        data: {
            labels: nombres,
            datasets:[{
                label: 'Calificación',
                data: calificaciones,
                backgroundColor: '#ff0000',
                borderColor: '#ffffff',
                borderWidth:1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
        }
    });

}

function procesoInformacion(data){
    $('#divInfo').toggle();
    var clima = getClima();
    var calificaciones = getCalificaciones(data);
    var nombres = getNombres(data);
    var promedio = obtenerPromedio(calificaciones);
    desplegarPromedio(promedio);
    var peorCalificacion = obtenerPeorCalificacion(calificaciones,nombres);
    desplegarPeorCalificacion(peorCalificacion);
    var mejorCalificacion = obtenerMejorCalificacion(calificaciones,nombres);
    desplegarMejorCalificacion(mejorCalificacion);
}

function getClima(){
    $.ajax({
        type:'GET',
        url:"http://dataservice.accuweather.com/alarms/v1/1day/245727?apikey=1fwDuveJ6IVbgoByx5xi8hWBh3J3PhjS",
        success: function(results){
            console.log(results);
        }
    });
}

function desplegarPromedio(promedio){
    $('#txtPromedio').text(promedio);
}

function obtenerPromedio(data){
    var tamaño = data.length;
    var suma = 0;
    for (var i = 0; i < data.length; i++) {
        var item = parseFloat(data[i]);
        suma = suma + item;
    }
    let resultado = (suma/tamaño);
    return resultado;
}

function obtenerPeorCalificacion(data, nombres){
    var peorCalificacion = 0.0;
    var nombrePeorCalificacion ="";
    for(var i=0;i < data.length;i++){
        let item = parseFloat(data[i]);
        if(peorCalificacion == 0.0){
            peorCalificacion = item;
            nombrePeorCalificacion = nombres[i];
        }else{
            if(item < peorCalificacion){
                peorCalificacion = item;
                nombrePeorCalificacion = nombres[i];
            }
        }
    }
    return nombrePeorCalificacion;
}
function desplegarPeorCalificacion(peorCalificacion){
    $('#txtPeorCalificacion').text(peorCalificacion);
}

function obtenerMejorCalificacion(data, nombres){
    var mejorCalificacion = 0.0;
    var nombreMejorCalificacion ="";
    for(var i=0;i< data.length;i++){
        let item = parseFloat(data[i]);
        if(mejorCalificacion == 0.0){
            mejorCalificacion = item;
            nombreMejorCalificacion = nombres[i];
        }else{
            if(item > mejorCalificacion){
                mejorCalificacion = item;
                nombreMejorCalificacion = nombres[i];
            }
        }
    }
    return nombreMejorCalificacion;
}

function desplegarMejorCalificacion(mejorCalificacion){
    $('#txtMejorCalificacion').text(mejorCalificacion);
}

function procesoFillTabla(data){
    var tabla = $('#tabla tbody');
    for (let i = 0; i < Object.keys(data).length; i++) {
        var numfila = `<th scope="row">${i+1}</th>`;
        var nombres = `<th>${data[i]['Nombres']}</th>`;
        var apellidoMaterno = `<th>${data[i]['Apellido Materno']}</th>`;
        var apellidoPaterno = `<th>${data[i]['Apellido Paterno']}</th>`;
        var fechaNacimiento = `<th>${data[i]['Fecha de Nacimiento']}</th>`;
        var grado = `<th>${data[i]['Grado']}</th>`;
        var grupo = `<th>${data[i]['Grupo']}</th>`;
        var calificacion = `<th>${data[i]['Calificacion']}</th>`;
        var claveUsuario = `<th>${getClave(data[i])}</th>`;
        var suma = numfila+nombres+apellidoMaterno+apellidoPaterno+fechaNacimiento+grado+grupo+calificacion+claveUsuario;
        var fila = `<tr>${suma}</tr>`;
        tabla.append(fila);
    }
    $('#divTabla').toggle();
}

function getClave(data){
    var nombre = data['Nombres'].substring(0,2);
    var apellido = data['Apellido Materno'].substring((data['Apellido Materno'].length - 2)
                                                      ,data['Apellido Materno'].length);
    var letras = getLetras(nombre,apellido);
    console.log(letras);
    if(typeof data['Fecha de Nacimiento'] == "string"){
        var nacimiento = data['Fecha de Nacimiento'].substring(6,data['Fecha de Nacimiento'].length);
        var actualYear = new Date().getFullYear();
        var edad = parseInt(actualYear) - parseInt(nacimiento);
        return (letras+edad)
    }else{
        return "";
    }
}

function getLetras(nombre,apellido){
    var letraNombre1 =  getLetraAbecedario(nombre.substring(0,1));
    var letraNombre2 = getLetraAbecedario(nombre.substring(1,2));
    var letraAp1 = getLetraAbecedario(apellido.substring(0,1));
    var letraAp2 = getLetraAbecedario(apellido.substring(1,2));
    return (letraNombre1+letraNombre2+letraAp1+letraAp2);
}

function getLetraAbecedario(data){
    var abecedario = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    var lugar = 0;
    for (let i = 0; i < abecedario.length; i++) {
        if(data.toUpperCase() == abecedario[i]){
            lugar = i;
            if((lugar - 3 )>=0){
                return abecedario[lugar-3];
            }else{
                if((lugar-3) == -1){
                    return abecedario[abecedario.length -1];
                }else{
                    if((lugar-3) == -2){
                        return abecedario[abecedario.length-2];
                    }else{
                        if((lugar - 3) == -3){
                            return abecedario[abecedario.length-3];
                        }else{
                            if((lugar -3) == 0){
                                return abecedario[0];
                            }
                        }
                    }
                }
            }
        }
    }
}