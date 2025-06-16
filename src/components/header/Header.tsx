import { Layout } from "antd"
import { Link } from 'react-router-dom';
import styles from './Header.module.scss'

export const Header = () => {
    return (
        <Layout.Header style={{backgroundColor: '#fff', padding: '0'}}>
            <div className={styles.realworldBlog}>
                <Link to="/" className={styles.realworldBlogTitle}>Realworld blog</Link>
                <div className={styles.signInAndSignUp}>
                    <button className={styles.signIn}>Sign in</button>
                    <button className={styles.signUp}>Sign up</button>
                </div>
            </div>
        </Layout.Header>
    )
}
