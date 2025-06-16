import { Link } from 'react-router-dom';
import styles from './ArticleCard.module.scss';
import { Tag } from 'antd';

interface ArticleCardProps {
    values: {
        slug: string;
        title: string;
        description: string;
        body: string;
        tagList: string[];
        createdAt: string;
        favoritesCount: number;
        author: {
            username: string;
            image: string;
        };
    };
}

export const ArticleCard = ({ values }: ArticleCardProps) => {
    return (
        <div className={styles.articleCard}>
            <div className={styles.articleCardContent}>
                <div className={styles.articleCardHeader}>
                    <Link to={`/article/${values.slug}`} className={styles.articleLink}>
                        <h2 className={styles.articleCardTitle}>{values.title}</h2>
                    </Link>
                    <div className={styles.likeContainer}>
                        <p className={styles.like}></p>
                        {values.favoritesCount}
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
                        {new Date(values.createdAt).toLocaleDateString()}
                    </div>
                </div>
                <img src={values.author.image} className={styles.avatar} />
            </div>
        </div>
    );
};