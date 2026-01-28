const API_URL = 'http://localhost:3000/api/tareas';
const taskForm = document.getElementById('taskForm');
const tasksContainer = document.getElementById('tasksContainer');

//LECTURA (GET) ---
//obtener tareas
const fetchTasks = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al conectar con la API');
        
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error(error);
        tasksContainer.innerHTML = `<p style="color:red">Error al cargar tareas: ${error.message}</p>`;
    }
};

//PINTADO
const renderTasks = (tasks) => {
    tasksContainer.innerHTML = ''; // Limpiamos el contenedor

    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<p>No hay tareas pendientes. ¡Añade una!</p>';
        return;
    }

    tasks.forEach(task => {
        // Creamos el elemento article
        const card = document.createElement('article');
        card.className = `task-card status-${task.estado}`; // Clase dinámica según estado
        
        // Formatear fecha
        const fecha = new Date(task.fecha).toLocaleDateString();

        card.innerHTML = `
            <div class="task-header">
                <h3>${task.titulo}</h3>
                <span class="badge ${task.estado}">${task.estado}</span>
            </div>
            <p class="tech-tag">💻 ${task.tecnologia || 'General'}</p>
            <p style="font-size: 0.8rem; color: #64748b; margin-top: 5px;">📅 ${fecha}</p>
            
            <div class="card-actions">
                <button class="btn-toggle" onclick="toggleTask('${task._id}', '${task.estado}')">
                    ${task.estado === 'pending' ? '✅ Completar' : '↩️ Pendiente'}
                </button>
                <button class="btn-delete" onclick="deleteTask('${task._id}')">
                    🗑️ Borrar
                </button>
            </div>
        `;

        tasksContainer.appendChild(card);
    });
};

//CREACIÓN (POST)
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitamos que la página se recargue

    // Recogemos datos
    const nuevaTarea = {
        titulo: document.getElementById('titulo').value,
        tecnologia: document.getElementById('tecnologia').value,
        
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        });

        if (response.ok) {
            taskForm.reset(); // Limpiar formulario
            fetchTasks(); // Recargar lista
        } else {
            alert('Error al guardar la tarea');
        }
    } catch (error) {
        console.error(error);
    }
});

//ACTUALIZACIÓN (PUT)
window.toggleTask = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'done' : 'pending';

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: newStatus })
        });

        if (response.ok) {
            fetchTasks();
        }
    } catch (error) {
        console.error('Error actualizando:', error);
    }
};

//ELIMINACIÓN (DELETE)
window.deleteTask = async (id) => {
    if (!confirm('¿Estás seguro de querer borrar esta tarea?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchTasks();
        }
    } catch (error) {
        console.error('Error borrando:', error);
    }
};

// Inicializar
document.addEventListener('DOMContentLoaded', fetchTasks);