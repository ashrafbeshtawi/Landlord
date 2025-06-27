'use client';

import React, { useState, useCallback } from 'react';
import { Map, Source, Layer, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Typography } from '@mui/material';


const geojsonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'SYR',
      properties: {
        name: 'Syria 🇸🇾',
        color: '#4CAF50',
        description: `🇸🇾 Syria
🏠 Price Range: $10k - $30k  
📊 Avg. Price: ~$20,000  
💵 Rent (long-term): $150/month  
🛏️ Rent (short-term): $500/month  
📈 ROI (long-term): ~9%  
🔥 High potential market`
      },
      geometry: { type: 'Point', coordinates: [38.5, 35] }
    },
    {
      type: 'Feature',
      id: 'EGY',
      properties: {
        name: 'Egypt 🇪🇬',
        color: '#FFD700',
        description: `🇪🇬 Egypt
🏠 Price Range: $40k - $100k  
📊 Avg. Price: ~$70,000  
💵 Rent (long-term): $300/month  
🛏️ Rent (short-term): $700/month  
📈 ROI (long-term): ~5.1%  
🔥 Strong tourism and infrastructure growth`
      },
      geometry: { type: 'Point', coordinates: [30, 29] }
    },
    {
      type: 'Feature',
      id: 'TUR',
      properties: {
        name: 'Turkey 🇹🇷',
        color: '#FFD700',
        description: `🇹🇷 Turkey
🏠 Price Range: $60k - $200k  
📊 Avg. Price: ~$130,000  
💵 Rent (long-term): $350/month  
🛏️ Rent (short-term): $700/month  
📈 ROI (long-term): ~3.2%  
🔥 Major tourism hub with growing urban rents`
      },
      geometry: { type: 'Point', coordinates: [35.2433, 39.4] }
    }
  ]
};

export default function MapComponent() {
  const [hoverInfo, setHoverInfo] = useState<{
    longitude: number;
    latitude: number;
    description: string;
  } | null>(null);

  const onHover = useCallback((event: any) => {
    const feature = event.features?.[0];
    if (feature) {
      setHoverInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        description: feature.properties.description
      });
    } else {
      setHoverInfo(null);
    }
  }, []);

  return (
    <Box sx={{ width: { xs: '100%', md: '80%' }, mx: 'auto', mt: 4, mb: 8 }}>
      <Typography variant="h3" sx={{ mb: 3, textAlign: 'center', fontSize: { xs: '1.2rem', md: '2rem' } }}>
        Targeted Markets and Expansion Plans
      </Typography>

      {/* Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            p: 1.5,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#4CAF50', borderRadius: '50%' }} />
            <Typography variant="body2" color="common.white">
              Targeted Markets
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#FFD700', borderRadius: '50%' }} />
            <Typography variant="body2" color="common.white">
              Expansion Phase
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography
        variant="body1"
        sx={{ mb: 2, textAlign: 'center' }}
        >
        Hover over each country to get more info
        </Typography>

      {/* Map */}
      <Map
        mapLib={import('maplibre-gl')}
        initialViewState={{ longitude: 35, latitude: 34.3, zoom: 4.7 }}
        style={{ width: '100%', height: '600px' }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
        interactiveLayerIds={['country-labels']}
        onMouseMove={onHover}
        onMouseLeave={() => setHoverInfo(null)}
      >
        <Source id="countries" type="geojson" data={geojsonData}>
          <Layer
            id="country-bubbles"
            type="circle"
            paint={{
              'circle-radius': 65,
              'circle-color': ['get', 'color'],
              'circle-opacity': 0.7,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#333'
            }}
          />
          <Layer
            id="country-labels"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'],
              'text-size': 14,
              'text-anchor': 'center'
            }}
            paint={{ 'text-color': '#000' }}
          />
        </Source>

        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="top"
          >
            <div style={{ fontSize: 13, whiteSpace: 'pre-line' }}>
              {hoverInfo.description}
            </div>
          </Popup>
        )}
      </Map>
    </Box>
  );
}
