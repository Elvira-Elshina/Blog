import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/customHooks';
import { favoriteArticle, unfavoriteArticle } from '../../services/fetchData';
import { Button } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import styles from './ArticleCard.module.scss';
import { Tag } from 'antd';
import moment from 'moment';

interface ArticleCardProps {
    values: {
        slug: string;
        title: string;
        description: string;
        body: string;
        tagList: string[];
        createdAt: string;
        favoritesCount: number;
        favorited: boolean;
        author: {
            username: string;
            image: string;
        };
    };
}

export const ArticleCard = ({ values }: ArticleCardProps) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = !!localStorage.getItem('authToken');

    const handleFavorite = async () => {
        if (!isAuthenticated) {
            return;
        }

        try {
            if (values.favorited) {
                await dispatch(unfavoriteArticle(values.slug)).unwrap();
            } else {
                await dispatch(favoriteArticle(values.slug)).unwrap();
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <div className={styles.articleCard}>
            <div className={styles.articleCardContent}>
                <div className={styles.articleCardHeader}>
                    <Link to={`/article/${values.slug}`} className={styles.articleLink}>
                        <h2 className={styles.articleCardTitle}>{values.title}</h2>
                    </Link>
                    <div className={styles.likeContainer}>
                        <Button
                            type="text"
                            icon={values.favorited ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                            onClick={handleFavorite}
                            disabled={!isAuthenticated}
                            className={styles.likeButton}
                        />
                        <span className={styles.likeCount}>{values.favoritesCount}</span>
                    </div>
                </div>
                <div className={styles.tagContainer}>
                    {values.tagList.map((tag) => (
                        <Tag style={{color: '#00000080'}} key={tag}>{tag}</Tag>
                    ))}
                </div>
                <p className={styles.articleCardDescription}>{values.description}</p>
            </div>
            <div className={styles.authorContainer}>
                <div className={styles.authorInfo}>
                    <div className={styles.authorName}>{values.author.username}</div>
                    <div className={styles.articleDate}>
                        {moment(values.createdAt).format('MMMM D, YYYY')}
                    </div>
                </div>
                <img src={values.author.image} className={styles.avatar} />
            </div>
        </div>
    );
};