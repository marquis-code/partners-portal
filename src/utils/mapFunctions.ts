export interface LocationType {
  lat: number,
  lng: number
}
export interface Geometry {
  x: number,
  y: number
}

export const formatGeometry = (pointList: Geometry[]): LocationType[] => {
  return pointList.map(point => {
    return {
      lng: point.x,
      lat: point.y
    }
  })
}

export const googleMapStyleId = process.env.VUE_APP_GOOGLE_MAP_STYLE_ID || '33d190257c86f190'
