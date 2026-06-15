declare module 'draw-football-pitch-library' {
  import type { ReactNode } from 'react'

  export type DrawPitchProps = {
    width?: number | string
    height?: number | string
    orientation?: 'horizontal' | 'vertical'
    grassColor?: string
    lineColor?: string
    lineWidth?: number
    goalPostColor?: string
    cornerR?: number
    children?: ReactNode
  }

  export function DrawPitch(props: DrawPitchProps): ReactNode

  export type HeatmapPoint = {
    x: number
    y: number
    value?: number
  }

  export type HeatmapLayerProps = {
    data: HeatmapPoint[]
    color?: string
    radius?: number
    opacity?: number
  }

  export function HeatmapLayer(props: HeatmapLayerProps): ReactNode
}