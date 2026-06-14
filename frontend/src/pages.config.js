/**
 * pages.config.js
 */

import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Conteudo from './pages/Conteudo';
import Conversor from './pages/Conversor';
import Ajuda from './pages/Ajuda';

import __Layout from './Layout.jsx';

export const PAGES = {
    "Home": Home,
    "Cadastro": Cadastro,
    "Login": Login,
    "Conteudo": Conteudo,
    "Conversor": Conversor,
    "Ajuda": Ajuda,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};