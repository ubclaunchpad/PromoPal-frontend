class GeometryService {
  /**
   * Computes the distance between two points: an origin point and a destination point.
   *
   * @param fromLat - Latitude of origin
   * @param fromLng - Longitude of origin
   * @param toLat - Latitude of destination
   * @param toLng - Longitude of destination
   */
  public computeDistance(fromLat: number, fromLng: number, toLat: number, toLng: number): number {
    const { LatLng } = google.maps;
    const { computeDistanceBetween } = google.maps.geometry.spherical;

    const from = new LatLng(fromLat, fromLng);
    const to = new LatLng(toLat, toLng);
    return computeDistanceBetween(from, to) ?? 0;
  }
}

export default new GeometryService();
