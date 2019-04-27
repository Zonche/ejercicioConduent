const {ipcRenderer} = require('electron');

function leerArchivo(){
    ipcRenderer.send('leerArchivo','true');
}

ipcRenderer.on('ObtenerNombre',(event,data)=>{
    $('#txtPath').text(data);
});

ipcRenderer.on('ObtencionDatos',(event,data)=>{
    procesoFillGrafica(data);
    procesoInformacion(data);
});

function procesoFillGrafica(data){
    var nombres = getNombres(data);
    var calificaciones = getCalificaciones(data);
    fillGrafica(nombres,calificaciones);
}

function serializacion(data){
    return JSON.parse(data.d);
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
    var calificaciones = getCalificaciones(data);
    var nombres = getNombres(data);
    var promedio = obtenerPromedio(calificaciones);
    desplegarPromedio(promedio);
    var peorCalificacion = obtenerPeorCalificacion(calificaciones,nombres);
    desplegarPeorCalificacion(peorCalificacion);
    var mejorCalificacion = obtenerMejorCalificacion(calificaciones,nombres);
    desplegarMejorCalificacion(mejorCalificacion);
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