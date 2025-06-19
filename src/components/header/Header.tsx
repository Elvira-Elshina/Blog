import { Layout } from "antd"
import { Link } from 'react-router-dom';
import styles from './Header.module.scss'
import { useAppDispatch } from '../../hooks/customHooks';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../store/authSlice';

export const Header = () => {
    const { userData, isAuthenticated } = useAuth();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Layout.Header style={{backgroundColor: '#fff', padding: '0'}}>
            <div className={styles.realworldBlog}>
                <Link to="/" className={styles.realworldBlogTitle}>Realworld blog</Link>
                <div className={styles.signInAndSignUp}>
                    {!isAuthenticated ? 
                        <>
                            <button className={styles.signIn}>
                                <Link to="/sign-in">Sign in</Link>
                            </button>
                            <button className={styles.signUp}>
                                <Link to="/sign-up">Sign up</Link>
                            </button>
                        </>
                    :
                        <div className={styles.authContainer}>
                            <button className={styles.createArticle}>
                                Create article
                            </button>
                            <div className={styles.userInfo}>
                                <Link to='/profile'>
                                    <span className={styles.userName}>
                                        {userData.user?.username || 'User'}
                                    </span>
                                    <img 
                                        src={userData.user?.image || 'src/assets/images/Rectangle1.png'} 
                                        alt="user"
                                        className={styles.userLogo} />
                                </Link>
                            </div>
                            <button className={styles.logOut} onClick={handleLogout}>Log Out</button>
                        </div>
                    }
                </div>
            </div>
        </Layout.Header>
    )
}
