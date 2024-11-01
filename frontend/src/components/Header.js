import {FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { toast } from 'react-toastify'  // For error notifications

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)

    const logoutFn = () => {
        try {
            dispatch(logout())
            dispatch(reset())
            navigate('/')
            toast.success('Logged out successfully')
        } catch (error) {
            toast.error('Logout failed')
        }
    }

    return (
        <header className='header'>
            <div className='logo'>
                <Link to='/'>Task Creator</Link>
            </div>
            <ul>
                {user ? (
                    <li>
                        <button className='btn' onClick={logoutFn}>
                            <FaSignOutAlt /> Logout
                        </button>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link to='/login'>
                                <FaSignInAlt /> Login
                            </Link>
                        </li>
                        <li>
                            <Link to='/register'>
                                <FaUser /> Register
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </header>
    )
}

export default Header