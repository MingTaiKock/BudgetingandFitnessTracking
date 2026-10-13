import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import CharacterPreview from './CharacterPreview.tsx';
import './styles.css';
import './wellness.css';
import './prototype.css';
import './supporting.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode>{new URLSearchParams(window.location.search).has('characters')?<CharacterPreview/>:<App/>}</React.StrictMode>);
