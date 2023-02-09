//variables
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

//vaiables para paginacion
const registrosPorPagina = 40;

let totalPaginas;
//para el iterador
let iterador;

let paginaActual = 1;

 

window.onload = () =>{
    formulario.addEventListener('submit',validarFormulario);
}

//funciones
function validarFormulario(e){
    const busquedatxt = document.querySelector('.inText').value
    e.preventDefault();
    
    if(busquedatxt == '' || Number(busquedatxt)){
        mostrarMensaje('Error!! agrega un término de busqueda')
        return;
    }

    //buscar imagenes por medio de la api
    buscarImagenes();
    
}

function mostrarMensaje(mensaje){
    //para que no se repita mas alertas
    const existealert = document.querySelector('.error')
    if(!existealert){
        const alerta = document.createElement('div');
        alerta.textContent = mensaje;
        alerta.classList.add('error');
        formulario.appendChild(alerta);
        setTimeout(()=>{
            alerta.remove()
        },1000)
    }  
}

function buscarImagenes(){
    const termino = document.querySelector('.inText').value
    //los url y key se encuentran en la pagina de pixabay en el apartado de api
    key = '28702424-8932072b6e7006d02a55a2c21';
    url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&image_type=photo&page=${paginaActual}`;

    
    //fetch para usar esa url y los datos
    fetch(url,  {credentials: 'omit'})
        .then((resultado) =>{
            return resultado.json();
        })
        .then((datos)=>{
            //funcion paratomar los datos y mostrarlas en html
            totalPaginas = calcularPag(datos.totalHits)
            mostrarImg(datos.hits);
            console.log('Paginas:',totalPaginas)
        })
}
//funcion generadora de paginacion
//Para la formula de la paginacion usaremos la funcion 
//ParseInt(Math.ceil(500/30)) donde math.ceil redondea hacia
//arriba y 500 es las paginas totales y 30 representa los
//registros por paginas
function *crearPaginador(total){
    for(let i = 1; i <= total; i++){
        yield i;
        
    }
}

function calcularPag(total){
    return parseInt(Math.ceil(total/registrosPorPagina));
}

function mostrarImg(imagenes){
    console.log(imagenes)
    //limpiar html pero sin usar la funcion
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
    //iterar el arreglo de imagenes y construir el html

    imagenes.forEach((imagen) => {
        const {previewURL, likes, views , largeImageURL } = imagen;
        console.log(previewURL)

        resultado.innerHTML += `
            <div class = "cards ">
                <img src = '${previewURL}'>
                <div class= "texto">
                    <p>${likes} <span>Me gusta</span></p>
                    <p>${views} <span>Visitas</span></p>
                    <a href="${largeImageURL}" target = "_blank" rel = " noopener noreferrer">Ver imagen</a>
                </div>
            
            </div>
        `
    });
    //limpiar el paginador previo
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    imprimirPaginador();

}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    //con .next()se despierta el generador
    
    while(true){
        const { value, done} = iterador.next();
        if(done){
            return
        }else{
            //genera un boton por cada elemento en el generador
            const boton = document.createElement('a');
            boton.href = '#';
            boton.dataset.pagina = value;//value viene de la destructuracion y contiene el numero de paginas
            boton.textContent = value;
            boton.classList.add('paginaBtn');
            //al dar click al botn cambiara de pagina
            boton.onclick =(e) =>{
                
                paginaActual = value;
                //se vuelve a buscar las paginas
                buscarImagenes();
              }

            paginacionDiv.appendChild(boton);

        }
    }
}