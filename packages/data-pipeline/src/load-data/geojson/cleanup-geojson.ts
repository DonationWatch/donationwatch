export const cleanupGeojson = async (geojson: any, name: (properties: Record<string, any>) => string) => {
  return {
    ...geojson,
    features: geojson.features.map((feature: any) => {
      return {...feature, properties: {name: name(feature.properties)}}
    })
  }
}