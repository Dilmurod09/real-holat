import { startTransition, useEffect, useRef, useState } from 'react'

const statusColors = {
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#facc15',
  gray: '#94a3b8',
}

const DEFAULT_CENTER = [69.2401, 41.2995]
const DEFAULT_ZOOM = 5.5
const DEFAULT_MAX_ZOOM = 16

const LEAFLET_CSS_ID = 'leaflet-css'
const LEAFLET_SCRIPT_ID = 'leaflet-script'

const LEAFLET_CSS_SOURCES = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css',
]

const LEAFLET_SCRIPT_SOURCES = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js',
]

let leafletPromise = null

function toValidCoordinates(value) {
  if (!Array.isArray(value) || value.length !== 2) {
    return null
  }

  const lng = Number(value[0])
  const lat = Number(value[1])

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return null
  }

  return [lng, lat]
}

function toLeafletCoordinates(lngLat) {
  if (!lngLat) {
    return null
  }

  return [lngLat[1], lngLat[0]]
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildPopupMarkup(point, ui) {
  const title = escapeHtml(point.title)
  const region = escapeHtml(point.region)
  const statusLabel = escapeHtml(point.statusLabel)
  const ratingLabel = escapeHtml(ui?.ratingLabel ?? 'Рейтинг')
  const rating = escapeHtml(point.rating)
  const statusColor = statusColors[point.statusTone] ?? '#475569'

  return `
    <div style="display:grid;gap:6px;padding:2px 0;">
      <strong style="font-size:14px;line-height:20px;color:#111827;">${title}</strong>
      <span style="font-size:12px;line-height:18px;color:#475569;">${region}</span>
      <span style="font-size:12px;line-height:18px;font-weight:700;color:${statusColor};">
        ${statusLabel} · ${ratingLabel} ${rating}
      </span>
    </div>
  `
}

function loadStyleSheetWithFallback(id, sources) {
  return new Promise((resolve, reject) => {
    let index = 0

    const loadNext = () => {
      if (index >= sources.length) {
        reject(new Error('Не удалось загрузить стили Leaflet'))
        return
      }

      const existing = document.getElementById(id)
      if (existing) {
        existing.remove()
      }

      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = sources[index]
      link.crossOrigin = 'anonymous'

      link.onload = () => {
        resolve()
      }

      link.onerror = () => {
        link.remove()
        index += 1
        loadNext()
      }

      document.head.append(link)
    }

    if (document.getElementById(id)) {
      resolve()
      return
    }

    loadNext()
  })
}

function loadScriptWithFallback(id, sources) {
  return new Promise((resolve, reject) => {
    let index = 0

    const loadNext = () => {
      if (index >= sources.length) {
        reject(new Error('Не удалось загрузить библиотеку Leaflet'))
        return
      }

      const existing = document.getElementById(id)
      if (existing) {
        existing.remove()
      }

      const script = document.createElement('script')
      script.id = id
      script.async = true
      script.defer = true
      script.src = sources[index]
      script.crossOrigin = 'anonymous'

      script.onload = () => {
        resolve()
      }

      script.onerror = () => {
        script.remove()
        index += 1
        loadNext()
      }

      document.head.append(script)
    }

    if (window.L) {
      resolve()
      return
    }

    loadNext()
  })
}

function loadLeaflet() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Leaflet доступен только в браузере'))
  }

  if (window.L) {
    return Promise.resolve(window.L)
  }

  if (!leafletPromise) {
    leafletPromise = Promise.all([
      loadStyleSheetWithFallback(LEAFLET_CSS_ID, LEAFLET_CSS_SOURCES),
      loadScriptWithFallback(LEAFLET_SCRIPT_ID, LEAFLET_SCRIPT_SOURCES),
    ])
      .then(() => {
        if (!window.L) {
          throw new Error('Leaflet загрузился некорректно')
        }

        return window.L
      })
      .catch((error) => {
        leafletPromise = null
        throw error
      })
  }

  return leafletPromise
}

export default function MapboxMap({ map }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [mapError, setMapError] = useState(null)

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    let isDisposed = false
    let resizeObserver = null
    let resizeHandler = null
    const markerInstances = []

    async function initialiseMap() {
      try {
        startTransition(() => {
          setMapError(null)
        })

        const L = await loadLeaflet()

        if (!containerRef.current || isDisposed) {
          return
        }

        const points = (map?.points ?? [])
          .map((point) => {
            const coordinates = toValidCoordinates(point?.coordinates)
            if (!coordinates) {
              return null
            }

            return {
              ...point,
              coordinates,
            }
          })
          .filter(Boolean)

        const center =
          toValidCoordinates(map?.view?.center) ?? points[0]?.coordinates ?? DEFAULT_CENTER

        const initialZoom = Number.isFinite(Number(map?.view?.zoom))
          ? Number(map.view.zoom)
          : DEFAULT_ZOOM

        const maxZoom = Number.isFinite(Number(map?.view?.maxZoom))
          ? Number(map.view.maxZoom)
          : DEFAULT_MAX_ZOOM

        const instance = L.map(containerRef.current, {
          zoomControl: false,
          attributionControl: false,
          preferCanvas: true,
        }).setView(toLeafletCoordinates(center), initialZoom)

        mapRef.current = instance

        L.control.zoom({ position: 'topright' }).addTo(instance)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(instance)

        points.forEach((point) => {
          const marker = L.circleMarker(toLeafletCoordinates(point.coordinates), {
            radius: 8,
            weight: 3,
            color: '#ffffff',
            fillColor: statusColors[point.statusTone] ?? '#94a3b8',
            fillOpacity: 1,
          }).addTo(instance)

          marker.bindPopup(buildPopupMarkup(point, map?.ui), {
            maxWidth: 240,
            closeButton: false,
          })

          markerInstances.push(marker)
        })

        if (points.length > 1) {
          const bounds = L.latLngBounds(
            points.map((point) => toLeafletCoordinates(point.coordinates)),
          )

          instance.fitBounds(bounds, {
            padding: [48, 48],
            maxZoom,
          })
        }

        if (points.length === 1) {
          instance.setView(toLeafletCoordinates(points[0].coordinates), Math.max(initialZoom, 10), {
            animate: false,
          })
        }

        setTimeout(() => {
          if (!isDisposed) {
            instance.invalidateSize(false)
          }
        }, 0)

        resizeHandler = () => {
          if (!isDisposed) {
            instance.invalidateSize(false)
          }
        }

        window.addEventListener('resize', resizeHandler)

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => {
            if (!isDisposed) {
              instance.invalidateSize(false)
            }
          })

          resizeObserver.observe(containerRef.current)
        }
      } catch (error) {
        if (isDisposed) {
          return
        }

        startTransition(() => {
          setMapError(error)
        })
      }
    }

    initialiseMap()

    return () => {
      isDisposed = true

      markerInstances.forEach((marker) => marker.remove())

      if (resizeObserver) {
        resizeObserver.disconnect()
      }

      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler)
      }

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [map])

  if (mapError) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(233,239,244,0.75))] p-6 text-center">
        <div className="max-w-sm">
          <p className="text-base font-semibold text-[#1F1F1F]">
            {map?.ui?.loadErrorTitle ?? 'Не удалось загрузить карту'}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#66768A]">
            {map?.ui?.loadErrorDescription ??
              'Проверьте подключение к интернету и перезагрузите страницу.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-[24px]">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  )
}
