'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Map, Source, Layer, Popup, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PublicIcon from '@mui/icons-material/Public';
import type { FeatureCollection, Point } from 'geojson';
import theme from '@/theme/theme';

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
      id="markets"
      sx={{
        minHeight: '100vh',
        pt: { xs: 12, md: 14 },
        pb: 8,
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        {/* Header */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, #4CAF50)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <PublicIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '2.8rem' },
              }}
            >
              Targeted Markets
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, mx: 'auto' }}>
              Explore our expansion strategy across high-potential real estate markets
            </Typography>
          </Box>
        </motion.div>

        {/* Map Card */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ delay: 0.1 }}>
          <Box
            sx={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              p: { xs: 3, md: 5 },
            }}
          >
            {/* Legend */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 2, md: 4 },
                flexWrap: 'wrap',
                p: 2,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#4CAF50' }} />
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  Targeted Markets
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#FFD700' }} />
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  Expansion Phase
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                textAlign: 'center',
                mb: 3,
              }}
            >
              Hover over each country to view property data and ROI metrics.
            </Typography>

            {/* MAP */}
            {initialViewState && (
              <Box
                sx={{
                  height: { xs: '400px', md: '500px' },
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
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
                        'circle-stroke-color': '#333',
                      }}
                    />
                    <Layer
                      id="country-labels"
                      type="symbol"
                      layout={{
                        'text-field': ['get', 'name'],
                        'text-size': 14,
                        'text-anchor': 'center',
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
                          background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
                          color: 'white',
                          borderRadius: 2,
                          p: 2,
                          fontSize: 13,
                          whiteSpace: 'pre-line',
                          maxWidth: 280,
                          border: `1px solid ${theme.palette.primary.main}30`,
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
        </motion.div>
      </Box>
    </Box>
  );
}
