import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteTask, updateTask } from '../features/tasks/taskSlice'
import { FaEdit, FaTrash } from 'react-icons/fa'

function TaskItem({ task }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(task.text)
    
    const dispatch = useDispatch()

    const handleDelete = () => {
        dispatch(deleteTask(task._id))
    }

    const handleUpdate = () => {
        if(!editText.trim()) {
            return
        }
        
        dispatch(updateTask({
            id: task._id,
            taskData: { text: editText }
        }))
        setIsEditing(false)
    }

    return (
        <div className={`task ${isEditing ? 'edit-mode' : ''}`}>
            {isEditing ? (
                <div className='form-group' style={{ padding: '0 15px' }}>
                    <input
                        type='text'
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className='form-control'
                    />
                    <div className='task-controls'>
                        <button 
                            className='btn btn-sm' 
                            onClick={handleUpdate}
                        >
                            Save
                        </button>
                        <button 
                            className='btn btn-sm' 
                            onClick={() => {
                                setIsEditing(false)
                                setEditText(task.text)
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className='task-text'>{task.text}</div>
                    <div className='task-controls'>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className='btn btn-sm'
                        >
                            <FaEdit />
                        </button>
                        <button 
                            onClick={handleDelete}
                            className='btn btn-sm'
                        >
                            <FaTrash />
                        </button>
                    </div>
                    <div className='task-date'>
                        {new Date(task.createdAt).toLocaleString('en-US')}
                    </div>
                </>
            )}
        </div>
    )
}

export default TaskItem