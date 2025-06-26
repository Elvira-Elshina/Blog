import { Link, useHistory } from 'react-router-dom';
import styles from './SignUpPage.module.scss';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/customHooks';
import { registrationFetch } from '../../store/authSlice';


export const SignUpPage = () => {
    const { register,
        handleSubmit,
        watch,
        formState: { errors }
      } = useForm({
        mode: 'onBlur',
      });
      
      const password = watch('password');

      const dispatch = useAppDispatch();
      const history = useHistory();
  
    const onSubmit = (data: any) => {
      try {
        dispatch(registrationFetch(data));
      } catch(err) {
        console.error(err)
      } finally {
        history.push('/sign-in')
      }

    };

   
    const { isLoading, error } = useAppSelector((state) => state.authSliceReducer);
    return (
        <div className={styles.signUpContainer}>
        <form className={styles.signUpForm} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={styles.signUpHeader}>Create new account</h2>
            <span className={styles.signUpLabel}>Username</span>
            <input type="text" placeholder="Username" className={styles.signUpInput} 
            {...register('username', { required: 'Username обязателен для заполнения',
                minLength: {
                    value: 3,
                    message: 'Имя должно быть не менее 3 символов'
                  },
                  maxLength: {
                    value: 20,
                    message: 'Имя должно быть не более 20 символов'
                  },

                  validate: {
                    noSpaces: (value) => {
                    if (value.includes(' ')) {
                      return 'Имя не должно содержать пробелы';
                    }
                    if (!/^[a-zA-Z0-9]+$/.test(value)) {
                      return 'Имя должно содержать только латинские буквы и цифры';
                    }
                    return true;
                  }
                },
             })}
            />
            <span style={{color: 'red'}}>{errors.username && typeof errors.username.message === 'string' && errors.username.message}</span>
            <span className={styles.signUpLabel}>Email address</span>
            <input placeholder="Email address" className={styles.signUpInput} 
            {...register('email', { 
              validate: {
                noSpaces: (value) => {
                  if (value.includes(' ')) {
                    return 'Email не должен содержать пробелы';
                  }
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return 'Некорректный email';
                  }
                  return true;
                },
              },
                required: 'Email обязателен для заполнения',                
              })}
            />
            <span style={{color: 'red'}}>{errors.email && typeof errors.email.message === 'string' && errors.email.message}</span>
            <span className={styles.signUpLabel}>Password</span>
            <input type="password" placeholder="Password" className={styles.signUpInput} 
            {...register('password', { 
                required: "Пароль обязателен для заполнения",
                minLength: {
                    value: 6,
                    message: 'Пароль должен быть не менее 6 символов'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Пароль должен быть не более 40 символов'
                  },
                  validate: {
                    noSpaces: (value) => {
                      if (value.includes(' ')) {
                        return 'Пароль не должен содержать пробелы';
                      }
                      return true;
                    },
                    noLeadingOrTrailingSpaces: (value) => {
                      if (value.startsWith(' ') || value.endsWith(' ')) {
                        return 'Пароль не должен начинаться или заканчиваться пробелами';
                      }
                      return true;
                    }
                  }
            })}
            />
            <span style={{color: 'red'}}>{errors.password && typeof errors.password.message === 'string' && errors.password.message}</span>
            <span className={styles.signUpLabel}>Repeat Password</span>
            <input type="password" placeholder="Password" className={styles.signUpInput} {...register('repeatPassword', {
                required: "Пароль обязателен для повторения",
                minLength: { 
                    value: 6, 
                    message: 'Пароль должен быть не менее 6 символов' },
                maxLength: { 
                    value: 40, 
                    message: 'Пароль должен быть не более 40 символов' },
                validate: (value) => value === password || 'Пароли не совпадают',
            })}/>
            <span style={{color: 'red'}}>{errors.repeatPassword && typeof errors.repeatPassword.message === 'string' && errors.repeatPassword.message}</span>
            <label className={styles.signUpAgree}>
                <input type='checkbox' 
                {...register('agree', {
                    required: 'Вы должны согласиться с обработкой персональных данных'
                })}
                />
                I agree to the processing of my personal information
            </label>
            <span style={{color: 'red'}}>{errors.agree && typeof errors.agree.message === 'string' && errors.agree.message}</span>
            {error && <div style={{color: 'red'}}>{error}</div>}
            <button className={styles.signUpCreateButton} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </button>
            <span className={styles.signUpText}>
                Already have an account? 
                <Link to="/sign-in">
                  <span className={styles.blueText}> Sign in</span>
                </Link>
            </span>
        </form>
    </div>
    )
}