'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Map, Source, Layer, Popup, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { FeatureCollection, Point } from 'geojson';
import theme from '../theme/theme';

const geojsonData: FeatureCollection<Point, {
  name: string;
  color: string;
  description: string;
}> = {
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
📊 Avg. Price: ~$15,000  
💵 Rent (long-term): $150/month  
🛏️ Rent (short-term): $750/month  
📈 ROI (long-term): ~12%  
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
💵 Rent (long-term): $450/month  
🛏️ Rent (short-term): $530/month  
📈 ROI (long-term): ~7.88%  
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
📊 Avg. Price: ~$99,000  
💵 Rent (long-term): $450/month  
🛏️ Rent (short-term): $700/month  
📈 ROI (long-term): ~5.5%  
🔥 Major tourism hub with growing urban rents`
      },
      geometry: { type: 'Point', coordinates: [35.2433, 39.4] }
    }
  ]
};

export default function MapComponent() {
  const [initialViewState, setInitialViewState] = useState<null | {
    longitude: number;
    latitude: number;
    zoom: number;
  }>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    if (width < 600) {
      setInitialViewState({ longitude: 35, latitude: 34.3, zoom: 4 });
    } else if (width < 960) {
      setInitialViewState({ longitude: 35, latitude: 34.3, zoom: 4.5 });
    } else {
      setInitialViewState({ longitude: 35, latitude: 34.3, zoom: 4.7 });
    }
  }, []);

  const [hoverInfo, setHoverInfo] = useState<{
    longitude: number;
    latitude: number;
    description: string;
  } | null>(null);

  const onHover = useCallback((event: MapLayerMouseEvent) => {
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

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <Box
      sx={{
        width: '100%',
        px: { xs: 2, md: 6 },
        py: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'transparent'
      }}
    >
      <Box
        component={motion.div}
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        sx={{
          width: '100%',
          maxWidth: '1200px',
          borderRadius: 5,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(25px)',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          p: { xs: 3, md: 5 }
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          component={motion.h2}
          variants={fadeInUp}
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '1.6rem', md: '2.4rem' },
            textAlign: 'center',
            mb: 3,
            lineHeight: 1.2
          }}
        >
          🌍 Targeted Markets & Expansion Plans
        </Typography>

        {/* Legend */}
        <Box
          component={motion.div}
          variants={fadeInUp}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            p: 2,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#4CAF50' }} />
            <Typography variant="body2" sx={{ color: 'white' }}>
              Targeted Markets
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#FFD700' }} />
            <Typography variant="body2" sx={{ color: 'white' }}>
              Expansion Phase
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body1"
          component={motion.p}
          variants={fadeInUp}
          sx={{
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            mb: 3,
            fontSize: { xs: '0.9rem', md: '1rem' }
          }}
        >
          Hover over each country to view property data and ROI metrics.
        </Typography>

        {/* MAP */}
        {initialViewState && (
          <Box
            component={motion.div}
            variants={fadeInUp}
            sx={{
              height: '600px',
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Map
              mapLib={import('maplibre-gl')}
              initialViewState={initialViewState}
              style={{ width: '100%', height: '100%' }}
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
                  paint={{ 'text-color': '#ffffff' }}
                />
              </Source>

              {hoverInfo && (
                <Popup
                  longitude={hoverInfo.longitude}
                  latitude={hoverInfo.latitude}
                  closeButton={false}
                  closeOnClick={false}
                  anchor="top"
                  offset={20}
                >
                  <Box
                    sx={{
                      background: 'white',
                      color: '#333',
                      borderRadius: 2,
                      p: 1,
                      fontSize: 13,
                      whiteSpace: 'pre-line',
                      maxWidth: 250
                    }}
                  >
                    {hoverInfo.description}
                  </Box>
                </Popup>
              )}
            </Map>
          </Box>
        )}
      </Box>
    </Box>
  );
}
