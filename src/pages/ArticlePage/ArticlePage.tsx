import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/customHooks';
import { fetchArticle } from '../../store/blogAppSlice';
import { Layout, Spin, Tag } from 'antd';
import Markdown from 'react-markdown';
import styles from './ArticlePage.module.scss';

export const ArticlePage = () => {
    const { slug } = useParams();
    const dispatch = useAppDispatch();
    const { currentArticle, isLoading } = useAppSelector(state => state.articleSliceReducer);

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
        return <div>Статья не найдена</div>;
    }

    return (
        <Layout.Content className={styles.articleContainer}>
            <div className={styles.articlePage}>
                <div className={styles.articleHeader}>
                    <div>
                        <h2 className={styles.articleCardTitle}>{currentArticle.title}</h2>
                        <div className={styles.articleTags}>
                            {currentArticle.tagList.map((tag: string) => (
                                <Tag key={tag} style={{color: '#00000080'}}>{tag}</Tag>
                            ))}
                        </div>
                        <div className={styles.articleDescription}>
                            <Markdown>
                                {currentArticle.description}
                            </Markdown>
                        </div>
                    </div>
                    <div className={styles.articleMeta}>
                        <div className={styles.authorInfo}>
                            <div className={styles.authorName}>{currentArticle.author.username}</div>
                            <div className={styles.articleDate}>
                                {new Date(currentArticle.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <img src={currentArticle.author.image} className={styles.authorImage} />
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
