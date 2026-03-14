import { startTransition, useEffect, useRef, useState } from 'react'

const statusColors = {
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#facc15',
  gray: '#94a3b8',
}

function buildPopupNode(point, ui) {
  const wrapper = document.createElement('div')
  wrapper.style.display = 'grid'
  wrapper.style.gap = '6px'
  wrapper.style.padding = '2px 0'

  const title = document.createElement('strong')
  title.textContent = point.title
  title.style.fontSize = '14px'
  title.style.lineHeight = '20px'
  title.style.color = '#111827'

  const meta = document.createElement('span')
  meta.textContent = point.region
  meta.style.fontSize = '12px'
  meta.style.lineHeight = '18px'
  meta.style.color = '#475569'

  const status = document.createElement('span')
  status.textContent = `${point.statusLabel} · ${ui?.ratingLabel ?? 'Рейтинг'} ${point.rating}`
  status.style.fontSize = '12px'
  status.style.lineHeight = '18px'
  status.style.fontWeight = '700'
  status.style.color = statusColors[point.statusTone] ?? '#475569'

  wrapper.append(title, meta, status)

  return wrapper
}

function buildMarkerElement(point) {
  const marker = document.createElement('button')
  marker.type = 'button'
  marker.setAttribute('aria-label', point.title)
  marker.style.width = '18px'
  marker.style.height = '18px'
  marker.style.borderRadius = '999px'
  marker.style.border = '3px solid white'
  marker.style.background = statusColors[point.statusTone] ?? '#94a3b8'
  marker.style.boxShadow = '0 10px 18px rgba(15, 23, 42, 0.18)'
  marker.style.cursor = 'pointer'

  return marker
}

export default function MapboxMap({ map }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [mapError, setMapError] = useState(null)

  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (!containerRef.current || !accessToken) {
      return undefined
    }

    let isDisposed = false
    const markers = []

    async function initialiseMap() {
      try {
        const [{ default: mapboxgl }] = await Promise.all([
          import('mapbox-gl'),
          import('mapbox-gl/dist/mapbox-gl.css'),
        ])

        if (!containerRef.current || isDisposed) {
          return
        }

        startTransition(() => {
          setMapError(null)
        })

        const points = map?.points ?? []
        const mapUi = map?.ui

        mapboxgl.accessToken = accessToken

        const instance = new mapboxgl.Map({
          container: containerRef.current,
          style:
            map?.styleUrl ??
            import.meta.env.VITE_MAPBOX_STYLE_URL ??
            'mapbox://styles/mapbox/light-v11',
          center: map?.view?.center ?? [69.2401, 41.2995],
          zoom: map?.view?.zoom ?? 5.5,
          pitch: map?.view?.pitch ?? 0,
          bearing: map?.view?.bearing ?? 0,
          attributionControl: false,
        })

        mapRef.current = instance
        instance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

        if (points.length > 0) {
          const bounds = new mapboxgl.LngLatBounds()

          points.forEach((point) => {
            bounds.extend(point.coordinates)

            const popup = new mapboxgl.Popup({
              offset: 16,
              closeButton: false,
              maxWidth: '240px',
            }).setDOMContent(buildPopupNode(point, mapUi))

            const marker = new mapboxgl.Marker({
              element: buildMarkerElement(point),
            })
              .setLngLat(point.coordinates)
              .setPopup(popup)
              .addTo(instance)

            markers.push(marker)
          })

          instance.once('load', () => {
            if (isDisposed) {
              return
            }

            if (points.length === 1) {
              instance.flyTo({
                center: points[0].coordinates,
                zoom: map?.view?.zoom ?? 10,
                essential: true,
              })

              return
            }

            instance.fitBounds(bounds, {
              padding: 48,
              maxZoom: map?.view?.maxZoom ?? 11,
              duration: 0,
            })
          })
        }

        instance.on('error', (event) => {
          if (isDisposed || !event?.error) {
            return
          }

          startTransition(() => {
            setMapError(event.error)
          })
        })
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
      markers.forEach((marker) => marker.remove())

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [accessToken, map])

  if (!accessToken) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(233,239,244,0.75))] p-6 text-center">
        <div className="max-w-sm">
          <p className="text-base font-semibold text-[#1F1F1F]">
            {map?.ui?.missingTokenTitle ??
              'Подключите токен Mapbox, чтобы отобразить интерактивную карту'}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#66768A]">
            {map?.ui?.missingTokenDescription ??
              'Добавьте `VITE_MAPBOX_ACCESS_TOKEN` в `.env.local`, и карта автоматически появится в этом блоке.'}
          </p>
        </div>
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(233,239,244,0.75))] p-6 text-center">
        <div className="max-w-sm">
          <p className="text-base font-semibold text-[#1F1F1F]">
            {map?.ui?.loadErrorTitle ?? 'Не удалось загрузить карту Mapbox'}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#66768A]">
            {map?.ui?.loadErrorDescription ??
              'Проверьте токен, стиль карты и сетевое подключение. После этого блок перерисуется автоматически.'}
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
