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
      lat: point.x,
      lng: point.y
    }
  })
}
