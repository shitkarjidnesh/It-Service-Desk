# to initalise vite project

used npm create vite command

# to install tailwindcss

use " npm install tailwindcss @tailwindcss/vite" command

## add this into vite.config.js

import { defineConfig } from 'vite'
=> import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
plugins: [
=> tailwindcss(),
],
})

## add this in index.css

@import "tailwindcss";
