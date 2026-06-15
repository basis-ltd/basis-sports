import { useEffect, useRef, useState } from 'react'
import { DrawPitch } from 'draw-football-pitch-library'
import { HERO_PITCH_ZONES, zoneHeatColor, zoneToPixels } from '@/components/landing/pitch-zones'
import { cn } from '@/lib/utils'

const PITCH_ASPECT = 5 / 8

type ZoneOverlayProps = {
  pitchWidth: number
  pitchHeight: number
}

function ZoneOverlay({ pitchWidth, pitchHeight }: ZoneOverlayProps) {
  return (
    <>
      {HERO_PITCH_ZONES.map((zone, index) => {
        const { x, y, width, height } = zoneToPixels(zone, pitchWidth, pitchHeight)
        return (
          <rect
            key={zone.id}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={zoneHeatColor(zone.intensity)}
            className="zone-reveal"
            style={{
              opacity: 0,
              animation: 'zoneFadeIn 0.5s ease forwards',
              animationDelay: `${index * 80}ms`,
            }}
          />
        )
      })}
    </>
  )
}

export function PitchHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 640, height: 400 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateDimensions = () => {
      const width = container.clientWidth
      setDimensions({
        width,
        height: Math.round(width * PITCH_ASPECT),
      })
    }

    updateDimensions()

    const observer = new ResizeObserver(updateDimensions)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden rounded-xl ring-1 ring-border shadow-lg',
        'bg-[oklch(0.45_0.14_145)]',
      )}
      aria-hidden="true"
    >
      <style>{`
        @keyframes zoneFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <DrawPitch
        width={dimensions.width}
        height={dimensions.height}
        orientation="horizontal"
        grassColor="transparent"
        lineColor="#ffffff"
        lineWidth={2}
        goalPostColor="#ffffff"
        cornerR={2}
      >
        <ZoneOverlay pitchWidth={dimensions.width} pitchHeight={dimensions.height} />
      </DrawPitch>
      <div className="absolute bottom-3 left-3 rounded-md bg-background/90 px-2.5 py-1.5 text-xs tabular-nums backdrop-blur-sm">
        <span className="text-muted-foreground">Hot zone · </span>
        <span className="font-medium text-foreground">Attacking right center</span>
        <span className="text-heat-warm"> · 47 touches</span>
      </div>
    </div>
  )
}