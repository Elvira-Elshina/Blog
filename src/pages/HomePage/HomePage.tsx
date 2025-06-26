import { Layout, Pagination, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/customHooks';
import { fetchArticles } from '../../store/blogAppSlice';
import { ArticleCard } from '../../components/ArticleCard/ArticleCard';
import styles from './HomePage.module.scss';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

export const HomePage = () => {
  const [paginationValue, setPaginationValue] = useState(1);
  const articles = useAppSelector(state => state.articleSliceReducer.articles);
  const articlesCount = useAppSelector(state => state.articleSliceReducer.articlesCount);
  const isLoading = useAppSelector(state => state.articleSliceReducer.isLoading);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();
  const query = queryString.parse(location.search);
  const activePage = query?.page || 1;

  useEffect(() => {
    dispatch(fetchArticles(Number(activePage)));
  }, [paginationValue]);

  function handlePaginationChange(e: number) {
    setPaginationValue(e);
    history.push(`${location.pathname}?page=${e}`);
  }

  return (
    <>
      <Layout.Content style={{ position: 'relative', padding: '24px 0' }}>
        <Spin spinning={isLoading}>
          <div className={styles.generalContainerCards}>
            {articles.map((el) => {
              return (
                <ArticleCard values={el} key={el.slug}/>
              )
            })}
          </div>
        </Spin>
      </Layout.Content>
      <Layout.Footer style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#e4e9f1',}}>
        <Pagination
          defaultCurrent={Number(activePage)}
          showSizeChanger={false}
          total={articlesCount}
          onChange={handlePaginationChange}/>
      </Layout.Footer>
    </>
  );
}; 