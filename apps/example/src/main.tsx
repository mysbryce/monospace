import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'

const element = document.getElementById('app')!
render(<App />, element)
