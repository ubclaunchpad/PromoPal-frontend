import { Loader } from '@googlemaps/js-api-loader';

type GoogleMap = google.maps.Map;
type MapOptions = google.maps.MapOptions;

class GoogleMapsApiLoaderService {
  private loader: Loader;
  private map: GoogleMap | null = null;

  public constructor() {
    this.loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['geometry', 'places'],
    });
  }

  public async load(): Promise<void> {
    return this.loader.load();
  }

  public initializeMap(element: HTMLElement | null, options?: MapOptions): GoogleMap | null {
    let map: GoogleMap | null = null;
    if (element) {
      map = new google.maps.Map(element, options);
    }
    return (this.map = map);
  }
}

export default new GoogleMapsApiLoaderService();
