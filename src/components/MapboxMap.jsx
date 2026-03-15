import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react'

import { fetchDrivingRoute } from '@/services/requests/routingRequests'

const statusColors = {
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#facc15',
  gray: '#94a3b8',
}

const statusBadgeClasses = {
  info: 'border-[#FFD9C7] bg-white/95 text-[#1F1F1F]',
  success: 'border-[#CDEFD9] bg-white/95 text-[#17663C]',
  error: 'border-[#FFD3D3] bg-white/95 text-[#A12C2C]',
}

const DEFAULT_CENTER = [69.2401, 41.2995]
const DEFAULT_ZOOM = 5.5
const DEFAULT_MAX_ZOOM = 18

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

function buildRoute(startLat, startLng, destLat, destLng) {
  return {
    type: 'placeholder',
    coordinates: [
      [startLat, startLng],
      [destLat, destLng],
    ],
  }
}

function createUserLocationIcon(L) {
  return L.divIcon({
    className: '',
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    html: `
      <div style="width:28px;height:38px;display:flex;align-items:flex-end;justify-content:center;">
        <svg width="28" height="38" viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M14 1.5C7.09644 1.5 1.5 7.09644 1.5 14C1.5 22.6239 12.0612 33.9886 13.2388 35.2336C13.654 35.6725 14.346 35.6725 14.7612 35.2336C15.9388 33.9886 26.5 22.6239 26.5 14C26.5 7.09644 20.9036 1.5 14 1.5Z" fill="#0F7FFF" stroke="white" stroke-width="2"/>
          <circle cx="14" cy="14" r="4.5" fill="white"/>
        </svg>
      </div>
    `,
  })
}

function createInfoRow(label, value) {
  const row = document.createElement('div')
  row.style.display = 'grid'
  row.style.gap = '2px'

  const labelElement = document.createElement('span')
  labelElement.textContent = label
  labelElement.style.fontSize = '11px'
  labelElement.style.lineHeight = '16px'
  labelElement.style.fontWeight = '700'
  labelElement.style.letterSpacing = '0.05em'
  labelElement.style.textTransform = 'uppercase'
  labelElement.style.color = '#94a3b8'

  const valueElement = document.createElement('span')
  valueElement.textContent = value
  valueElement.style.fontSize = '13px'
  valueElement.style.lineHeight = '18px'
  valueElement.style.color = '#1f2937'

  row.append(labelElement, valueElement)

  return row
}

function buildPopupNode(point, ui, onAction, actionLabel) {
  const wrapper = document.createElement('div')
  wrapper.style.display = 'grid'
  wrapper.style.gap = '10px'
  wrapper.style.minWidth = '200px'
  wrapper.style.padding = '2px 0'

  const title = document.createElement('strong')
  title.textContent = point.title
  title.style.fontSize = '15px'
  title.style.lineHeight = '20px'
  title.style.color = '#111827'

  const grid = document.createElement('div')
  grid.style.display = 'grid'
  grid.style.gap = '8px'

  grid.append(
    createInfoRow(ui?.statusLabel ?? 'Status', point.statusLabel),
    createInfoRow(ui?.ratingLabel ?? 'Rating', point.rating),
  )

  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = actionLabel ?? ui?.routeButtonLabel ?? 'Build Route'
  button.style.border = 'none'
  button.style.borderRadius = '12px'
  button.style.background = '#ff622e'
  button.style.color = '#ffffff'
  button.style.padding = '10px 14px'
  button.style.fontSize = '13px'
  button.style.fontWeight = '700'
  button.style.cursor = 'pointer'
  button.style.boxShadow = '0 10px 20px rgba(255, 98, 46, 0.24)'

  const handleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onAction(point)
  }

  button.addEventListener('click', handleClick)
  wrapper.append(title, grid, button)

  return {
    node: wrapper,
    cleanup: () => {
      button.removeEventListener('click', handleClick)
    },
  }
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    })
  })
}

function loadStyleSheetWithFallback(id, sources) {
  return new Promise((resolve, reject) => {
    let index = 0

    const loadNext = () => {
      if (index >= sources.length) {
        reject(new Error('Could not load Leaflet styles'))
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
        reject(new Error('Could not load Leaflet library'))
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
    return Promise.reject(new Error('Leaflet is only available in the browser'))
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
          throw new Error('Leaflet loaded incorrectly')
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

export default function MapboxMap({
  map,
  onPointSelect,
  onPopupAction,
  popupActionLabel,
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const leafletRef = useRef(null)
  const markersLayerRef = useRef(null)
  const routeLayerRef = useRef(null)
  const userMarkerRef = useRef(null)
  const routeAbortControllerRef = useRef(null)
  const popupCleanupRef = useRef([])
  const [mapError, setMapError] = useState(null)
  const [locationState, setLocationState] = useState({
    message: '',
    tone: 'info',
    isLocating: false,
  })
  const hasCustomPopupAction = Boolean(onPopupAction)

  const resolvedCenter =
    toValidCoordinates(map?.view?.center) ?? map?.points?.[0]?.coordinates ?? DEFAULT_CENTER
  const resolvedZoom = Number.isFinite(Number(map?.view?.zoom))
    ? Number(map.view.zoom)
    : DEFAULT_ZOOM
  const resolvedMaxZoom = Math.max(Number(map?.view?.maxZoom) || 0, DEFAULT_MAX_ZOOM)
  const initialViewRef = useRef({
    center: resolvedCenter,
    zoom: resolvedZoom,
    maxZoom: resolvedMaxZoom,
  })

  const clearPopupListeners = useEffectEvent(() => {
    popupCleanupRef.current.forEach((cleanup) => cleanup())
    popupCleanupRef.current = []
  })

  const setStatusMessage = useEffectEvent((message, tone = 'info', isLocating = false) => {
    startTransition(() => {
      setLocationState({
        message,
        tone,
        isLocating,
      })
    })
  })

  const locateUser = useEffectEvent(async ({ shouldFlyTo = true, announceSuccess = true } = {}) => {
    const instance = mapRef.current
    const L = leafletRef.current

    if (!instance || !L) {
      return null
    }

    setStatusMessage(
      map?.ui?.locatingButtonLabel ?? 'Locating...',
      'info',
      true,
    )

    try {
      const position = await getCurrentPosition()
      const userCoordinates = [
        position.coords.latitude,
        position.coords.longitude,
      ]

      if (!mapRef.current || !leafletRef.current) {
        return null
      }

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(userCoordinates)
      } else {
        userMarkerRef.current = leafletRef.current.marker(userCoordinates, {
          icon: createUserLocationIcon(leafletRef.current),
          zIndexOffset: 1000,
        }).addTo(mapRef.current)
      }

      if (shouldFlyTo) {
        mapRef.current.flyTo(userCoordinates, Math.max(mapRef.current.getZoom(), 14), {
          duration: 1.1,
        })
      }

      if (announceSuccess) {
        setStatusMessage(
          map?.ui?.locationReadyLabel ?? 'Location detected',
          'success',
          false,
        )
      } else {
        setStatusMessage('', 'info', false)
      }

      return {
        lat: userCoordinates[0],
        lng: userCoordinates[1],
      }
    } catch {
      setStatusMessage(
        announceSuccess
          ? map?.ui?.locationErrorLabel ?? 'Could not determine your location'
          : map?.ui?.routeErrorLabel ?? 'Could not build the route',
        'error',
        false,
      )

      return null
    }
  })

  const handleBuildRoute = useEffectEvent(async (point) => {
    const instance = mapRef.current
    const L = leafletRef.current

    if (!instance || !L) {
      return
    }

    setStatusMessage(
      map?.ui?.routePendingLabel ?? 'Preparing route...',
      'info',
      true,
    )

    const userLocation = await locateUser({
      shouldFlyTo: false,
      announceSuccess: false,
    })

    if (!userLocation || !routeLayerRef.current) {
      return
    }

    if (routeAbortControllerRef.current) {
      routeAbortControllerRef.current.abort()
    }

    const controller = new AbortController()
    routeAbortControllerRef.current = controller

    let route = null
    let usedFallbackRoute = false

    try {
      route = await fetchDrivingRoute({
        startLat: userLocation.lat,
        startLng: userLocation.lng,
        destLat: point.latitude,
        destLng: point.longitude,
        signal: controller.signal,
      })
    } catch (error) {
      if (error.name === 'AbortError') {
        return
      }

      route = buildRoute(
        userLocation.lat,
        userLocation.lng,
        point.latitude,
        point.longitude,
      )
      usedFallbackRoute = true
    } finally {
      if (routeAbortControllerRef.current === controller) {
        routeAbortControllerRef.current = null
      }
    }

    routeLayerRef.current.clearLayers()

    const routeLine = L.polyline(route.coordinates, {
      color: '#ff622e',
      weight: 4,
      opacity: 0.9,
      dashArray: '10 8',
    }).addTo(routeLayerRef.current)

    instance.fitBounds(routeLine.getBounds(), {
      padding: [56, 56],
      maxZoom: resolvedMaxZoom,
    })

    setStatusMessage(
      usedFallbackRoute
        ? map?.ui?.routeFallbackLabel ?? 'Showing simplified route'
        : map?.ui?.routeReadyLabel ?? 'Route is ready',
      usedFallbackRoute ? 'info' : 'success',
      false,
    )
  })

  const handlePointSelection = useEffectEvent((point) => {
    onPointSelect?.(point)
  })

  const handlePopupAction = useEffectEvent((point) => {
    handlePointSelection(point)

    if (onPopupAction) {
      onPopupAction(point)
      return
    }

    handleBuildRoute(point)
  })

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    let isDisposed = false
    let resizeObserver = null
    let resizeHandler = null

    async function initialiseMap() {
      try {
        startTransition(() => {
          setMapError(null)
        })

        const L = await loadLeaflet()

        if (!containerRef.current || isDisposed) {
          return
        }

        leafletRef.current = L
        const initialView = initialViewRef.current

        const instance = L.map(containerRef.current, {
          zoomControl: false,
          attributionControl: false,
          preferCanvas: true,
          zoomSnap: 0.25,
          zoomDelta: 0.5,
          wheelPxPerZoomLevel: 100,
          maxZoom: initialView.maxZoom,
        }).setView(toLeafletCoordinates(initialView.center), initialView.zoom)

        mapRef.current = instance
        markersLayerRef.current = L.layerGroup().addTo(instance)
        routeLayerRef.current = L.layerGroup().addTo(instance)

        L.control.zoom({ position: 'topright' }).addTo(instance)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: initialView.maxZoom,
          maxNativeZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(instance)

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

        window.setTimeout(() => {
          if (!isDisposed) {
            instance.invalidateSize(false)
          }
        }, 0)
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
      clearPopupListeners()

      if (resizeObserver) {
        resizeObserver.disconnect()
      }

      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler)
      }

      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }

      if (routeAbortControllerRef.current) {
        routeAbortControllerRef.current.abort()
        routeAbortControllerRef.current = null
      }

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      markersLayerRef.current = null
      routeLayerRef.current = null
      leafletRef.current = null
    }
  }, [])

  useEffect(() => {
    const instance = mapRef.current
    const L = leafletRef.current

    if (!instance || !L || !markersLayerRef.current) {
      return
    }

    clearPopupListeners()
    markersLayerRef.current.clearLayers()
    routeLayerRef.current?.clearLayers()

    const points = (map?.points ?? [])
      .map((point) => ({
        ...point,
        coordinates: toValidCoordinates(point.coordinates),
      }))
      .filter((point) => point.coordinates)
    const resolvedPopupActionLabel = hasCustomPopupAction
      ? popupActionLabel ?? map?.ui?.reportButtonLabel ?? 'Жаловаться'
      : popupActionLabel ?? map?.ui?.routeButtonLabel ?? 'Build Route'

    if (points.length === 0) {
      instance.setView(toLeafletCoordinates(resolvedCenter), resolvedZoom, {
        animate: false,
      })
      return
    }

    const markerCoordinates = []

    points.forEach((point) => {
      const leafletCoordinates = toLeafletCoordinates(point.coordinates)
      const popup = buildPopupNode(
        point,
        map?.ui,
        handlePopupAction,
        resolvedPopupActionLabel,
      )

      popupCleanupRef.current.push(popup.cleanup)

      const marker = L.circleMarker(leafletCoordinates, {
        radius: 8,
        weight: 3,
        color: '#ffffff',
        fillColor: statusColors[point.statusTone] ?? '#94a3b8',
        fillOpacity: 1,
      }).addTo(markersLayerRef.current)

      marker.on('click', () => {
        handlePointSelection(point)
        marker.openPopup()
      })

      marker.bindPopup(popup.node, {
        maxWidth: 280,
        closeButton: false,
      })

      markerCoordinates.push(leafletCoordinates)
    })

    if (points.length === 1) {
      instance.setView(markerCoordinates[0], Math.max(resolvedZoom, 13), {
        animate: false,
      })
      return
    }

    instance.fitBounds(L.latLngBounds(markerCoordinates), {
      padding: [48, 48],
      maxZoom: resolvedMaxZoom,
    })
  }, [
    hasCustomPopupAction,
    map?.points,
    map?.ui,
    popupActionLabel,
    resolvedCenter,
    resolvedMaxZoom,
    resolvedZoom,
  ])

  useEffect(() => {
    if (!locationState.message) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setLocationState((currentState) => ({
          ...currentState,
          message: '',
        }))
      })
    }, 3600)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [locationState.message])

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

      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            locateUser()
          }}
          disabled={locationState.isLocating}
          className="pointer-events-auto inline-flex items-center rounded-full border border-[#FFD9C7] bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#1F1F1F] shadow-[0_12px_26px_rgba(18,28,45,0.10)] transition hover:border-[#FFB597] hover:bg-white disabled:cursor-wait disabled:opacity-70"
        >
          {locationState.isLocating
            ? map?.ui?.locatingButtonLabel ?? 'Locating...'
            : map?.ui?.locationButtonLabel ?? 'My Location'}
        </button>

        {map?.isLoading ? (
          <div className="rounded-full border border-[#D8E3EC] bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#4A6174] shadow-[0_12px_26px_rgba(18,28,45,0.08)]">
            {map?.ui?.loadingLabel ?? 'Loading infrastructure...'}
          </div>
        ) : null}
      </div>

      {map?.fetchError ? (
        <div className="pointer-events-none absolute inset-x-4 top-[4.75rem]">
          <div className="rounded-[18px] border border-[#FFD1C2] bg-white/95 px-4 py-3 text-sm leading-6 text-[#8A3D20] shadow-[0_14px_30px_rgba(18,28,45,0.10)]">
            {map?.ui?.apiErrorDescription ??
              'Не удалось загрузить инфраструктуру. Карта продолжает работать без маркеров.'}
          </div>
        </div>
      ) : null}

      {!map?.isLoading && !map?.fetchError && !(map?.points?.length > 0) ? (
        <div className="pointer-events-none absolute inset-x-4 bottom-4">
          <div className="rounded-[18px] border border-[#D8E3EC] bg-white/95 px-4 py-3 text-sm leading-6 text-[#4A6174] shadow-[0_14px_30px_rgba(18,28,45,0.10)]">
            {map?.ui?.emptyStateLabel ?? 'Инфраструктура пока не найдена.'}
          </div>
        </div>
      ) : null}

      {locationState.message ? (
        <div className="pointer-events-none absolute inset-x-4 bottom-20 flex justify-start">
          <div
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.06em] shadow-[0_12px_26px_rgba(18,28,45,0.10)] ${
              statusBadgeClasses[locationState.tone] ?? statusBadgeClasses.info
            }`}
          >
            {locationState.message}
          </div>
        </div>
      ) : null}
    </div>
  )
}
