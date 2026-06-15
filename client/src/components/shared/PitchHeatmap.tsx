import { useEffect, useRef, useState } from 'react'
import { DrawPitch } from 'draw-football-pitch-library'
import type { HeatmapZone } from '@/lib/football'
import { getZoneShare, zoneHeatColor, zoneToPixels } from '@/lib/football'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const PITCH_ASPECT = 5 / 8

type ZoneOverlayProps = {
  zones: HeatmapZone[]
  pitchWidth: number
  pitchHeight: number
  totalActions: number
  highlightedZoneId: string | null
  onZoneHover: (zoneId: string | null) => void
}

function ZoneOverlay({
  zones,
  pitchWidth,
  pitchHeight,
  totalActions,
  highlightedZoneId,
  onZoneHover,
}: ZoneOverlayProps) {
  return (
    <>
      {zones.map((zone) => {
        const { x, y, width, height } = zoneToPixels(zone, pitchWidth, pitchHeight)
        const share = getZoneShare(zone.count, totalActions)

        return (
          <rect
            key={zone.id}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={zoneHeatColor(zone.intensity)}
            className={cn(
              'cursor-pointer transition-opacity',
              highlightedZoneId && highlightedZoneId !== zone.id && 'opacity-40',
            )}
            onMouseEnter={() => onZoneHover(zone.id)}
            onMouseLeave={() => onZoneHover(null)}
          >
            <title>
              Zone: {zone.label} | Touches: {zone.count} ({share}%)
            </title>
          </rect>
        )
      })}
    </>
  )
}

type PitchHeatmapProps = {
  zones: HeatmapZone[]
  totalActions: number
  isLoading?: boolean
  highlightedZoneId?: string | null
  onZoneHover?: (zoneId: string | null) => void
}

export function PitchHeatmap({
  zones,
  totalActions,
  isLoading = false,
  highlightedZoneId = null,
  onZoneHover = () => undefined,
}: PitchHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 720, height: 450 })

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

  if (isLoading) {
    return <Skeleton className="aspect-[8/5] w-full rounded-xl" />
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl bg-[oklch(0.45_0.14_145)] ring-1 ring-border"
    >
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
        <ZoneOverlay
          zones={zones}
          pitchWidth={dimensions.width}
          pitchHeight={dimensions.height}
          totalActions={totalActions}
          highlightedZoneId={highlightedZoneId}
          onZoneHover={onZoneHover}
        />
      </DrawPitch>
    </div>
  )
}