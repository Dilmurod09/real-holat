const STATUS_TONES = {
  active: 'green',
  approved: 'green',
  completed: 'green',
  done: 'green',
  inprocess: 'yellow',
  'in-process': 'yellow',
  in_progress: 'yellow',
  pending: 'red',
  open: 'red',
  rejected: 'red',
  canceled: 'gray',
  cancelled: 'gray',
  closed: 'gray',
  draft: 'gray',
  inactive: 'gray',
  'not-verified': 'gray',
  archived: 'gray',
}

const STATUS_ORDER = ['red', 'yellow', 'green', 'gray']

function normalizeStatusKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function toCoordinates(latitude, longitude) {
  const lat = toNumber(latitude)
  const lng = toNumber(longitude)

  if (lat === null || lng === null) {
    return null
  }

  return [lng, lat]
}

function formatStatusLabel(value) {
  const normalized = normalizeStatusKey(value)

  if (!normalized) {
    return ''
  }

  return normalized
    .split(/[-_]/g)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')
}

function getStatusTone(value) {
  const normalized = normalizeStatusKey(value)
  return STATUS_TONES[normalized] ?? 'gray'
}

function getStatusLabel(value, statuses = []) {
  const tone = getStatusTone(value)
  const localizedStatus = statuses.find((status) => status.tone === tone)?.label

  if (localizedStatus) {
    return localizedStatus
  }

  return formatStatusLabel(value)
}

function formatRating(value, noDataLabel) {
  const rating = toNumber(value)

  if (rating === null) {
    return noDataLabel
  }

  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1)
}

function createPointFromInfrastructure(infrastructure, map) {
  const coordinates = toCoordinates(infrastructure.latitude, infrastructure.longitude)

  if (!coordinates) {
    return null
  }

  const noDataLabel = map?.ui?.noDataLabel ?? 'N/A'
  const statusTone = getStatusTone(infrastructure.status)
  const statusLabel = getStatusLabel(infrastructure.status, map?.statuses)

  return {
    id: infrastructure.id,
    title: infrastructure.name || map?.ui?.untitledLabel || noDataLabel,
    region: infrastructure.address || noDataLabel,
    rating: formatRating(infrastructure.overall_rating, noDataLabel),
    statusLabel,
    statusTone,
    coordinates,
    description: infrastructure.description || noDataLabel,
    address: infrastructure.address || noDataLabel,
    contractorName: infrastructure.contractor_name || noDataLabel,
    checkItemsCount: Array.isArray(infrastructure.check_items)
      ? infrastructure.check_items.length
      : 0,
    verifiedReportsCount: toNumber(infrastructure.verified_reports_count) ?? 0,
    latitude: coordinates[1],
    longitude: coordinates[0],
  }
}

function createLeaderboardRow(point) {
  return {
    name: point.title,
    status: point.statusLabel,
    statusTone: point.statusTone,
    rating: point.rating,
  }
}

function createSchoolRow(infrastructure, index, ui) {
  const noDataLabel = ui?.noDataLabel ?? 'N/A'
  const complaints = toNumber(infrastructure.verified_reports_count)

  return {
    num: index + 1,
    name: infrastructure.name || ui?.untitledLabel || noDataLabel,
    region: infrastructure.address || noDataLabel,
    complaints: complaints ?? 0,
    rating: formatRating(infrastructure.overall_rating, noDataLabel),
    highlight: index === 0,
  }
}

function buildStatuses(points, fallbackStatuses = []) {
  const toneSet = new Set(points.map((point) => point.statusTone))
  const localizedMatches = fallbackStatuses.filter((status) => toneSet.has(status.tone))

  if (localizedMatches.length > 0) {
    return localizedMatches.sort(
      (left, right) => STATUS_ORDER.indexOf(left.tone) - STATUS_ORDER.indexOf(right.tone),
    )
  }

  return fallbackStatuses
}

export function buildInfrastructureContent({
  map,
  leaderboard,
  infrastructures = [],
  count = 0,
} = {}) {
  const points = infrastructures
    .map((infrastructure) => createPointFromInfrastructure(infrastructure, map))
    .filter(Boolean)

  const limit = leaderboard?.rows?.length || 5
  const rows = points.slice(0, limit).map(createLeaderboardRow)
  const statuses = buildStatuses(points, map?.statuses)
  const maxZoom = Math.max(Number(map?.view?.maxZoom) || 0, 18)

  return {
    count,
    points,
    map: {
      ...map,
      points,
      statuses,
      view: {
        ...map?.view,
        maxZoom,
      },
    },
    leaderboard: leaderboard
      ? {
          ...leaderboard,
          rows,
        }
      : leaderboard,
  }
}

export function buildSchoolsTableContent({
  schoolsTable,
  infrastructures = [],
  count = 0,
} = {}) {
  const rows = infrastructures.map((infrastructure, index) =>
    createSchoolRow(infrastructure, index, schoolsTable?.ui),
  )

  return {
    count,
    schoolsTable: {
      ...schoolsTable,
      rows,
    },
  }
}
