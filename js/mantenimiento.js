document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        cargarAutor(id);
    }

    document.getElementById('form-autor').addEventListener('submit', guardarAutor);
    document.getElementById('btn-cancelar').addEventListener('click', () => window.location.href = 'index.html');
    document.querySelector('.popup-close').addEventListener('click', cerrarPopup);
    document.getElementById('overlay').addEventListener('click', cerrarPopup);
});

function mostrarPopup(mensaje) {
    document.getElementById('popup-message').textContent = mensaje;
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function cerrarPopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

async function cargarAutor(id) {
    try {
        const response = await fetch(`http://localhost:8087/authors/authors/getId/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const autor = await response.json();
        document.getElementById('autor-id').value = autor.id;
        document.getElementById('firstName').value = autor.firstName;
        document.getElementById('lastName').value = autor.lastName;
    } catch (error) {
        console.error('Error al cargar autor:', error);
        mostrarPopup('Error al cargar los datos del autor. Por favor, intente de nuevo más tarde.');
    }
}

async function guardarAutor(event) {
    event.preventDefault();
    
    const autor = {
        id: parseInt(document.getElementById('autor-id').value),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value
    };

    try {
        const response = await fetch('http://localhost:8087/authors/authors/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(autor)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        mostrarPopup('Autor guardado exitosamente');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        console.error('Error al guardar autor:', error);
        mostrarPopup('Error al guardar el autor. Por favor, verifique los datos e intente de nuevo.');
    }
}