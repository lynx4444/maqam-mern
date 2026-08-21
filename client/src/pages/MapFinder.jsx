import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Search, Navigation, MapPin, Calendar, CreditCard, Sparkles, AlertCircle, Eye, ExternalLink } from 'lucide-react';
import { Toast } from '../components/Toast';

const DEFAULT_CENTER = { lat: 2.9096780355990672, lng: 101.46449890505642 };
const GOOGLE_MAPS_KEY = 'AIzaSyCG0N76OUBZvuTEyKbeafBzHuXgai4OdSw';

export const MapFinder = () => {
  const { t } = useLanguage();
  const mapRef = useRef(null);
  const googleMapInstance = useRef(null);
  const markersRef = useRef([]);
  const directionsRendererRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const infoWindowRef = useRef(null);

  const [query, setQuery] = useState('');
  const [graves, setGraves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedGrave, setSelectedGrave] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps Script
  useEffect(() => {
    const existingScript = document.getElementById('google-maps-script');
    if (!window.google && !existingScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else if (window.google) {
      initMap();
    }
  }, []);

  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: 19,
      mapTypeId: 'satellite',
      streetViewControl: false,
      mapTypeControl: true,
      fullscreenControl: true,
      zoomControl: true,
    });

    googleMapInstance.current = map;

    // Directions
    directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      map: map,
      polylineOptions: {
        strokeColor: '#10B981',
        strokeOpacity: 0.9,
        strokeWeight: 6,
      },
    });

    infoWindowRef.current = new window.google.maps.InfoWindow();

    // Default center marker
    new window.google.maps.Marker({
      position: DEFAULT_CENTER,
      map: map,
      title: 'Cemetery Main Area',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      },
    });

    setMapLoaded(true);
    fetchInitialGraves(map);
  };

  const fetchInitialGraves = async (mapInstance) => {
    try {
      setLoading(true);
      const res = await api.get('/graves');
      setGraves(res.data);
      if (mapInstance) {
        plotMarkers(res.data, mapInstance);
      }
    } catch (err) {
      console.error('Failed to load graves', err);
    } finally {
      setLoading(false);
    }
  };

  const plotMarkers = (graveList, mapInstance = googleMapInstance.current) => {
    if (!mapInstance || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();
    let hasValidCoords = false;

    graveList.forEach((grave) => {
      const lat = parseFloat(grave.gps_lat);
      const lng = parseFloat(grave.gps_lng);

      if (!isNaN(lat) && !isNaN(lng)) {
        hasValidCoords = true;
        const position = { lat, lng };

        const marker = new window.google.maps.Marker({
          position,
          map: mapInstance,
          title: grave.name,
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          },
        });

        marker.addListener('click', () => {
          setSelectedGrave(grave);
          showInfoWindow(marker, grave);
        });

        markersRef.current.push(marker);
        bounds.extend(position);
      }
    });

    if (hasValidCoords && markersRef.current.length > 0) {
      mapInstance.fitBounds(bounds);
      if (markersRef.current.length === 1) {
        mapInstance.setZoom(20);
      }
    }
  };

  const showInfoWindow = (marker, grave) => {
    if (!infoWindowRef.current || !googleMapInstance.current) return;

    const photoUrl = grave.photo
      ? grave.photo.startsWith('http')
        ? grave.photo
        : `${grave.photo}`
      : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop&q=60';

    const contentString = `
      <div style="font-family: 'Poppins', sans-serif; max-width: 260px; padding: 6px;">
        <div style="border-radius: 8px; overflow: hidden; height: 120px; margin-bottom: 8px; background: #e2e8f0;">
          <img src="${photoUrl}" alt="${grave.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop&q=60'"/>
        </div>
        <h3 style="font-weight: 700; font-size: 15px; color: #065f46; margin: 0 0 4px 0;">${grave.name}</h3>
        <p style="font-size: 12px; color: #4b5563; margin: 2px 0;"><strong>IC:</strong> ${grave.ic_number || 'N/A'}</p>
        <p style="font-size: 12px; color: #4b5563; margin: 2px 0;"><strong>Plot:</strong> ${grave.plot_number || 'N/A'}</p>
        <p style="font-size: 12px; color: #4b5563; margin: 2px 0;"><strong>Date:</strong> ${grave.date_of_death || 'N/A'}</p>
        <div style="margin-top: 10px; display: flex; gap: 6px;">
          <button id="btn-directions-${grave._id}" style="background: #059669; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; width: 100%; justify-content: center;">
            🚗 ${t('directions')}
          </button>
        </div>
      </div>
    `;

    infoWindowRef.current.setContent(contentString);
    infoWindowRef.current.open(googleMapInstance.current, marker);

    // Attach click event to info window button
    setTimeout(() => {
      const btn = document.getElementById(`btn-directions-${grave._id}`);
      if (btn) {
        btn.onclick = () => getDirections(grave.gps_lat, grave.gps_lng);
      }
    }, 150);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    if (!query.trim()) {
      fetchInitialGraves(googleMapInstance.current);
      setToast({ message: 'Showing all graves', type: 'info' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/graves/search?query=${encodeURIComponent(query.trim())}`);
      setGraves(res.data);
      plotMarkers(res.data);

      if (res.data.length === 0) {
        setToast({ message: t('no_graves_found'), type: 'warning' });
      } else {
        setToast({
          message: `Found ${res.data.length} record(s).`,
          type: 'success',
        });
      }
    } catch (err) {
      console.error('Search error:', err);
      setToast({ message: 'Search failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getDirections = (latStr, lngStr) => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) {
      setToast({ message: 'Invalid coordinates.', type: 'error' });
      return;
    }

    const destination = { lat, lng };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (directionsServiceRef.current && directionsRendererRef.current) {
            directionsRendererRef.current.setDirections({ routes: [] });

            const request = {
              origin: userLocation,
              destination: destination,
              travelMode: window.google.maps.TravelMode.WALKING,
            };

            directionsServiceRef.current.route(request, (result, status) => {
              if (status === 'OK') {
                directionsRendererRef.current.setDirections(result);
                setToast({
                  message: t('walking_directions_shown'),
                  type: 'success',
                });
                if (googleMapInstance.current) {
                  googleMapInstance.current.fitBounds(result.routes[0].bounds);
                }
              } else {
                setToast({
                  message: `Directions route failed: ${status}`,
                  type: 'warning',
                });
              }
            });
          }

          // Open Google Maps external link as backup
          const extUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${lat},${lng}`;
          window.open(extUrl, '_blank');
        },
        (error) => {
          setToast({ message: `${t('geo_error')}: ${error.message}`, type: 'error' });
          const directUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
          window.open(directUrl, '_blank');
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    } else {
      setToast({ message: 'Geolocation is not supported by your browser.', type: 'error' });
      const directUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(directUrl, '_blank');
    }
  };

  const focusOnGrave = (grave) => {
    setSelectedGrave(grave);
    const lat = parseFloat(grave.gps_lat);
    const lng = parseFloat(grave.gps_lng);

    if (!isNaN(lat) && !isNaN(lng) && googleMapInstance.current) {
      const pos = { lat, lng };
      googleMapInstance.current.setCenter(pos);
      googleMapInstance.current.setZoom(20);

      // Find marker and trigger infoWindow
      const foundMarker = markersRef.current.find(
        (m) =>
          Math.abs(m.getPosition().lat() - lat) < 0.00001 &&
          Math.abs(m.getPosition().lng() - lng) < 0.00001
      );

      if (foundMarker) {
        showInfoWindow(foundMarker, grave);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-lime-100 to-gray-50 py-8 px-4 sm:px-6 lg:px-8 border-b border-lime-200/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-lime-200 text-lime-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive GPS cemetery map</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            {t('finder')}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            {t('description')}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mt-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row shadow-xl rounded-2xl overflow-hidden border border-lime-300 bg-white">
              <div className="relative flex-grow flex items-center px-4">
                <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full py-4 text-gray-800 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      fetchInitialGraves(googleMapInstance.current);
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 bg-gray-100 rounded-md"
                  >
                    Clear
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-lime-600 hover:bg-lime-700 text-white font-bold px-8 py-4 transition flex items-center justify-center space-x-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Searching...' : t('search')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow flex flex-col lg:flex-row gap-6">
        {/* Map View Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border-4 border-lime-500 overflow-hidden relative min-h-[500px] flex flex-col">
          <div ref={mapRef} className="w-full h-full min-h-[500px] flex-grow bg-gray-200" />
          {!mapLoaded && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-lime-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">Loading Map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Side Results List */}
        <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-xl border border-gray-100 p-5 h-auto max-h-[600px]">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center">
              <MapPin className="w-5 h-5 text-lime-600 mr-2" />
              Records ({graves.length})
            </h3>
            {query && (
              <span className="text-xs bg-lime-100 text-lime-800 px-2 py-0.5 rounded-full font-medium">
                Query: {query}
              </span>
            )}
          </div>

          <div className="overflow-y-auto space-y-3 pr-1 flex-grow">
            {graves.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm font-medium">{t('no_graves_found')}</p>
              </div>
            ) : (
              graves.map((grave) => (
                <div
                  key={grave._id}
                  onClick={() => focusOnGrave(grave)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                    selectedGrave?._id === grave._id
                      ? 'border-lime-500 bg-lime-50 shadow-md ring-2 ring-lime-400'
                      : 'border-gray-200 hover:border-lime-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      {grave.photo ? (
                        <img
                          src={grave.photo}
                          alt={grave.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-lime-100 text-lime-800 text-xs font-bold">
                          {grave.plot_number}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">
                        {grave.name}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center mt-0.5">
                        <CreditCard className="w-3 h-3 mr-1 text-gray-400" />
                        IC: {grave.ic_number || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center mt-0.5">
                        <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                        DOD: {grave.date_of_death}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-block bg-gray-100 text-gray-800 text-[11px] font-semibold px-2 py-0.5 rounded">
                          Plot {grave.plot_number}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            getDirections(grave.gps_lat, grave.gps_lng);
                          }}
                          className="inline-flex items-center text-xs font-bold text-lime-700 hover:text-lime-800"
                        >
                          <Navigation className="w-3 h-3 mr-1" />
                          Directions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
