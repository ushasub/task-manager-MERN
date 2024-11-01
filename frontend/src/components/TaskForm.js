import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { createTask } from '../features/tasks/taskSlice'

function TaskForm() {
    const [text, setText] = useState('')

    const dispatch = useDispatch()

    /*const onSubmit = e => {
        e.preventDefault()

        if (!text) {
            return
        }

        dispatch(createTask({ text }))
        setText('')
    }*/
    const onSubmit = e => {
        e.preventDefault()
        if (!text.trim()) {
            toast.error('Please enter a task', {
                position: "top-right",
                autoClose: 3000
            })
            return
        }
        dispatch(createTask({ text }))
        setText('')
    }

    return (
        <section className='form'>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <input
                        type='text'
                        name='text'
                        id='text'
                        value={text}
                        placeholder='Enter your task'
                        onChange={(e) => setText(e.target.value)}
                        className='form-control'
                    />
                </div>
                <div className='form-group'>
                    <button className='btn btn-block' type='submit'>
                        Add Task
                    </button>
                </div>
            </form>
        </section>
    )
}

export default TaskForm