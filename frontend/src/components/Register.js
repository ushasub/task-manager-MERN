import { useEffect, useState } from "react"
import { FaUser } from 'react-icons/fa'
import { useSelector, useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { register, reset } from '../features/auth/authSlice'
import Spinner from './Spinner'

// This code does not auto login the user after registration
// Check out the code in Task-MERN-Auto-Login-After-Registration
// Changes are affected in three .js files
// userController.js, Register.js (this file) and Login.js
const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    })

    const { name, email, password, password2 } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const { isLoading, isError, isSuccess, message } = useSelector(state => state.auth)
    // The first useEffect code will be used if auto login after registration
    // Commented here for reference
    // Also uncomment the following, and comment the one above the block of comments
    // const { user, isLoading, isError, isSuccess, message } = useSelector(state => state.auth)
    /*useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            toast.success('Registration successful!')
            navigate('/')
        }

        return () => {
            dispatch(reset())
        }
    }, [user, isError, isSuccess, message, navigate, dispatch])*/

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        // Modified success handling
        if (isSuccess) {
            toast.success('Registration successful! Please login.')
            navigate('/login')  // Redirect to login instead of dashboard
        }

        dispatch(reset())
    }, [isError, isSuccess, message, navigate, dispatch])

    const onChange = e => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    /*const onSubmit = e => {
        e.preventDefault()

        // Enhanced validation
        if (!name || !email || !password) {
            toast.error('Please fill in all fields')
            return
        }

        if (password !== password2) {
            toast.error('Passwords do not match!')
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        const userData = { name, email, password }
        dispatch(register(userData))
    }*/
   
    const onSubmit = e => {
        e.preventDefault()
        if (password !== password2) {
            toast.error('Passwords do not match!', {
                position: "top-right",
                autoClose: 3000
            })
        } else if (password.length < 6) {
            toast.error('Password must be at least 6 characters', {
                position: "top-right",
                autoClose: 3000
            })
        } else {
            const userData = { name, email, password }
            dispatch(register(userData))
        }
    }   
    
    if (isLoading) {
        return <Spinner />
    }

    return (
        <>
            <section className="heading">
                <h1><FaUser /> Register</h1>
                <p>Please create an account</p>
            </section>
            <section className="form">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="name"
                            name="name" 
                            value={name} 
                            placeholder="Enter your name"
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email"
                            name="email" 
                            value={email}
                            placeholder="Enter your email" 
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password"
                            name="password" 
                            value={password} 
                            placeholder="Enter your password"
                            onChange={onChange}
                            required
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password2"
                            name="password2" 
                            value={password2} 
                            placeholder="Confirm your password"
                            onChange={onChange}
                            required
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-block">
                            Submit
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Register