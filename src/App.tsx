import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/header/header';
import { HomePage } from './pages/HomePage/HomePage';
import { ArticlePage } from './pages/ArticlePage/ArticlePage';

function BlogApp() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default BlogApp;
