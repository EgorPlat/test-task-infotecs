import { useEffect, useRef, useState } from 'react';
import { ResizeData, Task } from '../../interfaces';
import { InithialTasks } from '../../mock';
import './TodoList.css';

export const TodoList = () => {

    /* В целом можно было сделать лучше, разбив дополнительно данный компонент на несколько, но для упращения
    задачи и во избежание лазания по папкам оставляю так
    */
    const editTitleRef = useRef<HTMLInputElement>(null); // поле для подстановки имени таски
    const editStatusRef = useRef<HTMLSelectElement>(null); // поле для подстановки статуса таски
    const [tasks, setTasks] = useState<Task[]>(InithialTasks); // массив тасок
    const [selectedTask, setSelectedTask] = useState<Task | null>(null); // выбранная таска

    const ref = useRef<HTMLDivElement>(null);
    const [resizeData, setResizeData] = useState<ResizeData>({ inithialPos: 0, inithialSize: 0 });

    const handleInitial = (event: any) => {
        // получаем начальную информациюю о размере и позиции блока со списком тасков
        if (ref.current) {
            setResizeData({ inithialPos: +event.clientX, inithialSize: +ref.current.offsetWidth });   
        }
    };
    const handleResize = (event: any) => {
        // обрабатываем событие драга получая позицию мыши когда драг начался и кончился, увеличивая ширину блока на эту разницу
        if (ref.current) {
            ref.current.style.width = `${resizeData.inithialSize + event.clientX - resizeData.inithialPos}px`;
        }
    };
    const handleSaveTask = () => {
        // логика сохранения обновленной информации о выбранном таске
        if (editStatusRef.current && editTitleRef.current && selectedTask) {
            const updatedTask: Task = {
                status: editStatusRef.current.value,
                name: editTitleRef.current.value,
                id: selectedTask.id
            }
            const updatedTasks = tasks.map((task: Task) => {
                if (task.id === updatedTask.id) {
                    return updatedTask;
                }
                else {
                    return task;
                }
            })
            setTasks(updatedTasks);
        }
    };
    const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
        // получаем данные из формы для добавления таска
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const name = formData.get('name');
        const status = formData.get('status');
        if (name && status) {
            const newTask: Task = {
                id: Math.floor(Math.random()*1000), // так делать нельзя, но для упращения задачи и демонстрации решил оставить
                name: String(name),
                status: String(status)
            }
            setTasks(tasks => [...tasks, newTask]);
        }
    };

    const handleDeleteTask = () => {
        // логика удаления таски по айдишнику
        setTasks(tasks => tasks.filter(el => el.id !== selectedTask?.id));
        setSelectedTask(null);
    };

    useEffect(() => {
        // Здесь мы подставляем данные в нужные поля в момент выбора таски для редактирования
        if (editTitleRef.current && editStatusRef.current && selectedTask) {
            editTitleRef.current.defaultValue = selectedTask.name;
            if (selectedTask.status === 'plan') editStatusRef.current.selectedIndex = 0;
            if (selectedTask.status === 'finished') editStatusRef.current.selectedIndex = 1;
            if (selectedTask.status === 'progress') editStatusRef.current.selectedIndex = 2;
        }
    }, [selectedTask]);
    
    return (
        <div className="todoList">
            <div className='todoList_tasks' ref={ref}>
                <div 
                    className='resisable'
                    draggable
                    onDragStart={handleInitial} 
                    onDrag={handleResize}
                >
                    {`>`}
                </div>
                {
                    tasks.map(task => (
                        <div 
                            className='task'
                            style={{ color: `${task.status === "plan" ? "gray" : task.status === "progress" ? 'orange' : 'green'}` }}
                        >
                            <div className='taskTitle'>{ task.name }</div>
                            <input type='radio' name="selectTask" onChange={() => setSelectedTask(task)}/>
                        </div>
                    ))
                }
            </div>
            <div className='todoList_manage'>
                <div className='edit'>
                    Редактирование
                    {
                        selectedTask &&
                        <div className='editForm'>
                            <div className='titles'>
                                <label>Название</label>
                                <label>Статус</label>
                            </div>
                            <div className='content'>
                                <input type="text" id='taskTitle' ref={editTitleRef} />
                                <select ref={editStatusRef}>
                                    <option value="plan">Ожидает</option>
                                    <option value="finished">Выполнено</option>
                                    <option value="progress">В процессе</option>
                                </select>
                            </div>
                            <button onClick={handleSaveTask}>Сохранить</button>
                            <button onClick={handleDeleteTask}>Удалить</button>
                        </div>
                    }
                </div>
                <div className='add'>
                    Добавление
                    <form className='addForm' onSubmit={handleAddTask}>
                        <div className='titles'>
                            <label>Название</label>
                            <label>Статус</label>
                        </div>
                        <div className='content'>
                            <input type="text" id='taskTitle' name='name' />
                            <select name='status'>
                                <option value="plan">Ожидает</option>
                                <option value="finished">Выполнено</option>
                                <option value="progress">В процессе</option>
                            </select>
                        </div>
                        <button type="submit">Добавить</button>
                    </form>
                </div>
            </div>
        </div>
    )
}