import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Header } from './components/header/Header';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { HomePage } from './pages/HomePage/HomePage';
import { ArticlePage } from './pages/ArticlePage/ArticlePage';
import { SignInPage } from './pages/SignInPage/SignInPage';
import { SignUpPage } from './pages/SignUpPage/SignUpPage';
import { EditProfilePage } from './pages/EditProfilePage/EditProfilePage';
import { CreateArticle } from './pages/CreateArticle/CreateArticle';

function BlogApp() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/article/:slug">
            <ArticlePage />
          </Route>
          <Route path="/sign-in">
            <SignInPage />
          </Route>
          <Route path="/sign-up">
            <SignUpPage />
          </Route>
          <ProtectedRoute path="/profile">
            <EditProfilePage />
          </ProtectedRoute>
          <ProtectedRoute path="/new-article">
            <CreateArticle />
          </ProtectedRoute>
          <ProtectedRoute path="/articles/:slug/edit">
            <CreateArticle />
          </ProtectedRoute>
        </Switch>
      </Layout>
    </Router>
  );
}

export default BlogApp;
