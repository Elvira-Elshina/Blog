import styles from './EditProfilePage.module.scss';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/customHooks';
import { useAuth } from '../../hooks/useAuth';
import { updateProfileFetch } from '../../store/authSlice';
import { useEffect } from 'react';
import { notification } from 'antd';

export const EditProfilePage = () => {
    const { userData } = useAuth();
    const { isLoading, error } = useAppSelector((state) => state.loginSliceReducer);
    const dispatch = useAppDispatch();
    
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    useEffect(() => {
        if (userData.user) {
            setValue('username', userData.user.username || '');
            setValue('email', userData.user.email || '');
            setValue('avatar', userData.user.image || '');
        }
    }, [userData.user, setValue]);

    const onSubmit = async (data: any) => {
        try {
            const updateData: any = {
                username: data.username,
                email: data.email,
                image: data.avatar || null
            };
            
            if (data.password) {
                updateData.password = data.password;
            }
            
            await dispatch(updateProfileFetch(updateData)).unwrap();
            
            notification.success({
                message: 'Сохранено'
            })
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    return (
        <div className={styles.editProfileContainer}>
            <form className={styles.editProfileForm} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={styles.editProfileHeader}>Edit Profile</h2>
                
                {error && (
                    <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '10px' }}>
                        {error}
                    </div>
                )}
                
                <span className={styles.editProfileLabel}>Username</span>
                <input 
                    type="text" 
                    placeholder="Username" 
                    className={styles.editProfileInput}
                    {...register('username', { 
                        required: 'Username обязателен для заполнения',
                        minLength: {
                            value: 3,
                            message: 'Имя должно быть не менее 3 символов'
                        },
                        maxLength: {
                            value: 20,
                            message: 'Имя должно быть не более 20 символов'
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9]+$/,
                            message: 'Имя должно содержать только латинские буквы и цифры'
                        }
                    })}
                />
                {errors.username && typeof errors.username.message === 'string' && (
                    <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                        {errors.username.message}
                    </div>
                )}
                
                <span className={styles.editProfileLabel}>Email address</span>
                <input 
                    type="email" 
                    placeholder="Email address" 
                    className={styles.editProfileInput}
                    {...register('email', { 
                        required: 'Email обязателен для заполнения', 
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Некорректный email'
                        }
                    })}
                />
                {errors.email && typeof errors.email.message === 'string' && (
                    <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                        {errors.email.message}
                    </div>
                )}
                
                <span className={styles.editProfileLabel}>New password</span>
                <input 
                    type="password" 
                    placeholder="New password" 
                    className={styles.editProfileInput}
                    {...register('password', { 
                        minLength: {
                            value: 6,
                            message: 'Пароль должен быть не менее 6 символов'
                        },
                        maxLength: {
                            value: 40,
                            message: 'Пароль должен быть не более 40 символов'
                        }
                    })}
                />
                {errors.password && typeof errors.password.message === 'string' && (
                    <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                        {errors.password.message}
                    </div>
                )}
                
                <span className={styles.editProfileLabel}>Avatar image (url)</span>
                <input 
                    type="url" 
                    placeholder="Avatar image" 
                    className={styles.editProfileInput}
                    {...register('avatar', { 
                        pattern: {
                            value: /^https?:\/\/.+/,
                            message: 'URL должен начинаться с http:// или https://'
                        }
                    })}
                />
                {errors.avatar && typeof errors.avatar.message === 'string' && (
                    <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                        {errors.avatar.message}
                    </div>
                )}
                
                <button 
                    className={styles.editProfileSaveButton} 
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    )
}