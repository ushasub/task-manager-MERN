import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import TaskForm from './TaskForm'
import TaskItem from './TaskItem'
import Spinner from './Spinner'
import { getTasks, reset } from '../features/tasks/taskSlice'
import { logout } from '../features/auth/authSlice'  // Add this import

function Dashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
    const { tasks, isLoading, isError, message } = useSelector(
        (state) => state.tasks
    )

    useEffect(() => {
        if (isError) {
            dispatch(logout())
            navigate('/login')
            return
        }

        if (!user) {
            navigate('/login')
            return
        }

        dispatch(getTasks())

        return () => {
            dispatch(reset())
        }
    }, [user, isError, message, navigate, dispatch])

    if (isLoading) {
        return <Spinner />
    }

    return (
        <>
            <section className="heading">
                <h1>Welcome {user && user.name}</h1>
                <p>Tasks Dashboard</p>
            </section>

            <TaskForm />

            <section className="content">
                {tasks.length > 0 ? (
                    <div className="tasks">
                        {tasks.map((task) => (
                            <TaskItem key={task._id} task={task} />
                        ))}
                    </div>
                ) : (
                    <h3>You have not set any tasks</h3>
                )}
            </section>
        </>
    )
}

export default Dashboard