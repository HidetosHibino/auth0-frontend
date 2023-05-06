import React, { useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

interface Article {
  title: string,
  caption: string
}

function App() {
  const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently} = useAuth0();
  const [token,setToken] = useState<string>('');
  const [articles,setArticles] = useState<Article[]>()

  const fetchArticles = () => {
    axios.get('http://localhost:3010/api/v1/articles')
    .then((res) => {
      setArticles(res.data)
    })
  }

  useEffect(() => {
    const getToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({})
        setToken(accessToken)
      } catch (e: any) {
        console.log(e.message)
      }
    }
    getToken()
    // firefoxでリロード時にログインされないのは火孤のcookie関連の設定の模様。(chrome では再現せず)
    //この辺の対応が必要そう　https://future-architect.github.io/articles/20221007a/
  }, [])

  const createPosts = async () => {
    const accessToken = await getAccessTokenSilently({})
    const headers = {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      }
    }
    const data = {
      title: 'タイトル2',
      caption: '説明2'
    }
    axios.post('http://localhost:3010/api/v1/articles',data,headers)
  }

  return (
    <div className="App">
      <div style={{padding:'20px'}}>
        <h2>ログインボタン</h2>
          <button onClick={() => loginWithRedirect()}>ログイン</button>
        <h2>ログアウトボタン</h2>
          <button onClick={() => logout()}>ログアウト</button>
        <h2>ログイン状態</h2>
        {
          isAuthenticated ?
          <p>ログイン</p>
          :
          <p>ログアウト</p>
        }
      </div>
      <h2>投稿作成</h2>
          <button onClick={createPosts}>投稿作成</button>
      <h2>投稿一覧</h2>
      <button onClick={fetchArticles}>投稿取得</button>
        {articles?.map((article :Article,index:number) => 
        <div key={index}>
          <p>{article.title}</p>
          <p>{article.caption}</p>
        </div>
        )}
    </div>
  );
}

export default App;
