import { useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/customHooks';
import { fetchArticle } from '../../store/blogAppSlice';
import { deleteArticle, favoriteArticle, unfavoriteArticle } from '../../services/fetchData';
import { Button, Layout, Spin, Tag, Popconfirm, type PopconfirmProps, notification } from 'antd';
import Markdown from 'react-markdown';
import styles from './ArticlePage.module.scss';
import { ErrorIndicator } from '../../components/ErrorIndicator/ErrorIndicator';
import moment from 'moment';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';

export const ArticlePage = () => {
    const { slug } = useParams<{ slug: string }>();
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { currentArticle, isLoading } = useAppSelector(state => state.articleSliceReducer);
    const currentUser = localStorage.getItem('userData');
    const username = currentUser ? JSON.parse(currentUser).user.username : null;
    const isAuthenticated = !!localStorage.getItem('authToken');

    const handleDeleteConfirm: PopconfirmProps['onConfirm'] = async () => {
        if (slug) {
            try {
                await dispatch(deleteArticle(slug)).unwrap();
                notification.success({
                    message: 'Статья успешно удалена',
                });
                history.push('/');
            } catch (error) {
                notification.error({
                    message: 'Ошибка при удалении статьи',
                });
            }
        }
    };
      
    const handleDeleteCancel: PopconfirmProps['onCancel'] = () => {
        console.log('cancel');
    };

    const handleFavorite = async () => {
        if (!isAuthenticated) {
            notification.warning({
                message: 'Необходима авторизация',
                description: 'Войдите в систему, чтобы лайкать статьи',
            });
            return;
        }

        if (!currentArticle) return;

        try {
            if (currentArticle.favorited) {
                await dispatch(unfavoriteArticle(currentArticle.slug)).unwrap();
                notification.success({
                    message: 'Статья убрана из избранного',
                });
            } else {
                await dispatch(favoriteArticle(currentArticle.slug)).unwrap();
                notification.success({
                    message: 'Статья добавлена в избранное',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Ошибка при изменении статуса избранного',
            });
        }
    };
    
    useEffect(() => {
        if (slug) {
            dispatch(fetchArticle(slug));
        }
    }, [slug, dispatch]);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" />
            </div>
        );
    }

    if (!currentArticle) {
        return <ErrorIndicator error="Статья не найдена" />;
    }

    return (
        <Layout.Content className={styles.articleContainer}>
            <div className={styles.articlePage}>
                <div className={styles.articleHeader}>
                    <div>
                        <div className={styles.articleHeaderLikeBlog}>
                            <h2 className={styles.articleCardTitle}>{currentArticle.title}</h2>
                            <div className={styles.likeContainer}>
                                <Button
                                    type="text"
                                    icon={currentArticle.favorited ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                                    onClick={handleFavorite}
                                    disabled={!isAuthenticated}
                                    className={styles.likeButton}
                                />
                                <span className={styles.likeCount}>{currentArticle.favoritesCount}</span>
                            </div>
                        </div>
                        <div className={styles.articleTags}>
                            {currentArticle.tagList.map((tag: string) => (
                                <Tag key={tag} style={{color: '#00000080'}}>{tag}</Tag>
                            ))}
                        </div>
                        <div className={styles.articleDescription}>
                            <div className={styles.articleDescription}>
                                <Markdown>
                                    {currentArticle.description}
                                </Markdown>
                            </div>
                        </div>
                        </div>
                        <div className={styles.articleMetaContainer}>
                            <div className={styles.articleMeta}>
                                <div className={styles.authorInfo}>
                                    <div className={styles.authorName}>{currentArticle.author.username}</div>
                                    <div className={styles.articleDate}>
                                        {moment(currentArticle.createdAt).format('MMMM D, YYYY')}
                                    </div>
                                </div>
                                <img src={currentArticle.author.image} className={styles.authorImage} />
                            </div>
                            {username === currentArticle.author.username && (
                                <div className={styles.articleActions}>
                                    <Button className={styles.editButton}>
                                        <Link to={`/articles/${currentArticle.slug}/edit`}>Edit</Link>
                                    </Button>
                                    <Popconfirm 
                                        title="Are you sure to delete this article?" 
                                        onConfirm={handleDeleteConfirm} 
                                        onCancel={handleDeleteCancel}
                                        okText="Yes"
                                        cancelText="No"
                                        placement="right"
                                    >
                                        <Button className={styles.deleteButton}>Delete</Button>
                                    </Popconfirm>
                                </div>
                            )}
                        </div>
                    
                </div>
                <div className={styles.articleContent}>
                    <Markdown>
                        {currentArticle.body}
                    </Markdown>
                </div>
                
            </div>
        </Layout.Content>
    );
};
