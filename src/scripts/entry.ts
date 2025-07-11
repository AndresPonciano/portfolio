import { qs } from './utils'
import { TCanvas } from './TCanvas'

const canvas = new TCanvas(qs<HTMLDivElement>('.canvas-container'))

window.addEventListener('beforeunload', () => {
  canvas.dispose()
})