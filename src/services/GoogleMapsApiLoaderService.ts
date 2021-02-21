import { Loader } from '@googlemaps/js-api-loader';

class GoogleMapsApiLoaderService {
  private loader: Loader;
  private map: google.maps.Map | null = null;

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

  public initializeMap(options?: google.maps.MapOptions) {
    const mapContainerEl = document.getElementById('map-container') as HTMLElement;
    return (this.map = new google.maps.Map(mapContainerEl, options));
  }
}

export default new GoogleMapsApiLoaderService();
