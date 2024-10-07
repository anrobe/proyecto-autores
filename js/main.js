document.addEventListener('DOMContentLoaded', () => {
    cargarAutores();
    
    document.getElementById('btn-buscar').addEventListener('click', buscarAutor);
    document.querySelector('.popup-close').addEventListener('click', cerrarPopup);
    document.getElementById('overlay').addEventListener('click', cerrarPopup);
});

function mostrarPopup(mensaje, esConfirmacion = false, callback = null) {
    const popupMessage = document.getElementById('popup-message');
    const popupButtons = document.getElementById('popup-buttons');
    
    popupMessage.textContent = mensaje;
    
    if (esConfirmacion) {
        popupButtons.innerHTML = `
            <button id="btn-confirmar">Confirmar</button>
            <button id="btn-cancelar">Cancelar</button>
        `;
        document.getElementById('btn-confirmar').addEventListener('click', () => {
            cerrarPopup();
            if (callback) callback(true);
        });
        document.getElementById('btn-cancelar').addEventListener('click', () => {
            cerrarPopup();
            if (callback) callback(false);
        });
        popupButtons.style.display = 'block';
    } else {
        popupButtons.style.display = 'none';
    }

    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function cerrarPopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

async function cargarAutores() {
    try {
        const response = await fetch('http://localhost:8087/authors/authors/getAll');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const autores = await response.json();
        mostrarAutores(autores);
    } catch (error) {
        console.error('Error al cargar autores:', error);
        mostrarPopup('Error al cargar los autores. Por favor, intente de nuevo más tarde.');
    }
}

function mostrarAutores(autores) {
    const tabla = document.getElementById('tabla-autores').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    
    autores.forEach(autor => {
        const fila = tabla.insertRow();
        fila.insertCell(0).textContent = autor.id;
        fila.insertCell(1).textContent = autor.firstName;
        fila.insertCell(2).textContent = autor.lastName;
        
        const celdaAcciones = fila.insertCell(3);
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => editarAutor(autor.id);
        
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => confirmarEliminarAutor(autor.id);
        
        celdaAcciones.appendChild(btnEditar);
        celdaAcciones.appendChild(btnEliminar);
    });
}

async function buscarAutor() {
    const id = document.getElementById('buscar-id').value;
    if (id) {
        try {
            const response = await fetch(`http://localhost:8087/authors/authors/getId/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const autor = await response.json();
            mostrarAutores([autor]);
        } catch (error) {
            console.error('Error al buscar autor:', error);
            mostrarPopup('Error al buscar el autor. Por favor, verifique el ID e intente de nuevo.');
        }
    } else {
        cargarAutores();
    }
}

function editarAutor(id) {
    window.location.href = `mantenimiento.html?id=${id}`;
}

function confirmarEliminarAutor(id) {
    mostrarPopup('¿Está seguro de que desea eliminar este autor?', true, (confirmado) => {
        if (confirmado) {
            eliminarAutor(id);
        }
    });
}

async function eliminarAutor(id) {
    try {
        const response = await fetch(`http://localhost:8087/authors/authors/delete/${id}`, { 
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        mostrarPopup('Autor eliminado exitosamente');
        cargarAutores();
    } catch (error) {
        console.error('Error al eliminar autor:', error);
        mostrarPopup('Error al eliminar el autor. Por favor, intente de nuevo más tarde.');
    }
}