import { Link, useHistory } from "react-router-dom";
import styles from './SignInPage.module.scss';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from "../../hooks/customHooks";
import { loginFetch } from "../../store/authSlice";


export const SignInPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const onSubmit = (data: any) => {
    try {
      dispatch(loginFetch(data));
    } catch(err) {
      console.error(err)
    } finally {
      history.push('/');
    }
  };

  return (
    <div className={styles.signInContainer}>
        <form className={styles.signInForm} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={styles.signInHeader}>Sign In</h2>
            <span className={styles.signInLabel}>Email address</span>
              <input type="email" placeholder="Email address" className={styles.signInInput}
              {...register('email', { 
                required: 'Email обязателен для заполнения', 
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Некорректный email'
                } })} />
                {errors.email && typeof errors.email.message === 'string' && errors.email.message}
            <span className={styles.signInLabel}>Password</span>
            <input type="password" placeholder="Password" className={styles.signInInput} 
            {...register('password', { 
              required: "Пароль обязателен для заполнения",
              minLength: {
                value: 6,
                message: 'Пароль должен быть не менее 6 символов'
              },
              maxLength: {
                value: 40,
                message: 'Пароль должен быть не более 40 символов'
              }
              })} />
            {errors.password && typeof errors.password.message === 'string' && errors.password.message}
            <button className={styles.signInLoginButton}>Login</button>
            <span className={styles.signInText}>
                Don't have an account? 
                <Link to="/sign-up">
                  <span className={styles.blueText}> Sign up</span>
                </Link>
            </span>
        </form>
    </div>
  )
};

