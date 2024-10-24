import { useState, useEffect } from 'react';
import styles from './App.module.css';
import axios from 'axios';

const DueniosCrud = ( ) => {
    const [duenios, setDuenios] = useState([]);
    const [form, setForm] = useState({ nombre: '', email: '' });
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Obtener todos los dueños
    const traerDuenios = async () => {
        try {
            const response = await axios.get('ec2-54-81-46-157.compute-1.amazonaws.com:8080/duenio/traer');
            setDuenios(response.data);
        } catch (error) {
            console.error('Error al traer dueños:', error);
        }
    };

    // Crear un nuevo dueño
    const crearDuenio = async () => {
        try {
            await axios.post('ec2-54-81-46-157.compute-1.amazonaws.com:8080/duenio/crear', form);
            setForm({ nombre: '', email: '' });
            await traerDuenios(); // Actualiza la lista
        } catch (error) {
            console.error('Error al crear dueño:', error);
        }
    };

    // Borrar un dueño por ID
    const borrarDuenio = async (id) => {
        try {
            await axios.delete(`ec2-54-81-46-157.compute-1.amazonaws.com:8080/duenio/borrar/${id}`);
            await traerDuenios(); // Actualiza la lista
        } catch (error) {
            console.error('Error al borrar dueño:', error);
        }
    };

    // Editar un dueño
    const editarDuenio = async () => {
        try {
            await axios.put(`ec2-54-81-46-157.compute-1.amazonaws.com:8080/duenio/editar`, { id: editingId, ...form });
            setEditMode(false);
            setForm({ nombre: '', email: '' });
            setEditingId(null);
            await traerDuenios(); // Actualiza la lista
        } catch (error) {
            console.error('Error al editar dueño:', error);
        }
    };

    // Cargar los dueños cuando el componente se monte
    useEffect(() => {
        traerDuenios();
    }, []);

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            editarDuenio();
        } else {
            crearDuenio();
        }
    };

    // Establecer modo de edición
    const handleEdit = (duenio) => {
        setEditMode(true);
        setEditingId(duenio.id);
        setForm({ nombre: duenio.nombre, email: duenio.email });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Gestión de Dueños</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>
                    {editMode ? 'Editar Dueño' : 'Crear Dueño'}
                </button>
            </form>

            <ul className={styles.ul}>
                {duenios && Array.isArray(duenios) && duenios.map((duenio) => (
                    <li key={duenio.id} className={styles.li}>
                        <span>{duenio.nombre} - {duenio.email}</span>
                        <div>
                            <button onClick={() => handleEdit(duenio)} className={styles.editButton}>
                                Editar
                            </button>
                            <button onClick={() => borrarDuenio(duenio.id)} className={styles.deleteButton}>
                                Borrar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DueniosCrud;
