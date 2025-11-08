{
"name": "hizli-paragraf-atolyesi",
"version": "1.0.0",
"type": "module",
"scripts": {
"dev": "vite",
"build": "vite build",
"preview": "vite preview"
},
"dependencies": {
"react": "^18.2.0",
"react-dom": "^18.2.0",
"lucide-react": "^0.263.1"
},
"devDependencies": {
"@vitejs/plugin-react": "^4.0.0",
"vite": "^4.3.9",
"tailwindcss": "^3.3.0"
}
}
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
plugins: [react()],
})

<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HızlıParagrafAtölyesi - Hızlı Okuma & Paragraf Mastery</title>
<meta name="description" content="8 haftalık interaktif hızlı okuma ve paragraf çözme programı">
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
</body>
</html>

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
<App />
</React.StrictMode>,
)
