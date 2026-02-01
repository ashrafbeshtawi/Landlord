'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Map, Source, Layer, Popup, MapLayerMouseEvent, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Typography, Grid, Card, CardContent, Chip, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import PublicIcon from '@mui/icons-material/Public';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import type { FeatureCollection, Point } from 'geojson';
import theme from '@/theme/theme';

interface MarketData {
  name: string;
  flag: string;
  color: string;
  priceRange: string;
  avgPrice: string;
  rentLong: string;
  rentShort: string;
  roiLong: string;
  roiShort: string;
  highlight: string;
  status: 'active' | 'expansion';
}

const marketsData: Record<string, MarketData> = {
  SYR: {
    name: 'Syria',
    flag: '🇸🇾',
    color: '#4CAF50',
    priceRange: '$10k - $30k',
    avgPrice: '~$15,000',
    rentLong: '$150/mo',
    rentShort: '$750/mo',
    roiLong: '12%',
    roiShort: '60%',
    highlight: 'Highest ROI potential',
    status: 'active',
  },
  EGY: {
    name: 'Egypt',
    flag: '🇪🇬',
    color: '#FFD700',
    priceRange: '$40k - $100k',
    avgPrice: '~$70,000',
    rentLong: '$450/mo',
    rentShort: '$530/mo',
    roiLong: '7.88%',
    roiShort: '9.11%',
    highlight: 'Strong tourism growth',
    status: 'expansion',
  },
  TUR: {
    name: 'Turkey',
    flag: '🇹🇷',
    color: '#FFD700',
    priceRange: '$60k - $200k',
    avgPrice: '~$99,000',
    rentLong: '$450/mo',
    rentShort: '$700/mo',
    roiLong: '5.75%',
    roiShort: '8.41%',
    highlight: 'Major tourism hub',
    status: 'expansion',
  },
};

const geojsonData: FeatureCollection<Point, { id: string; name: string; color: string }> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'SYR',
      properties: { id: 'SYR', name: 'Syria 🇸🇾', color: '#4CAF50' },
      geometry: { type: 'Point', coordinates: [38.5, 35] },
    },
    {
      type: 'Feature',
      id: 'EGY',
      properties: { id: 'EGY', name: 'Egypt 🇪🇬', color: '#FFD700' },
      geometry: { type: 'Point', coordinates: [30, 29] },
    },
    {
      type: 'Feature',
      id: 'TUR',
      properties: { id: 'TUR', name: 'Turkey 🇹🇷', color: '#FFD700' },
      geometry: { type: 'Point', coordinates: [35.2433, 39.4] },
    },
  ],
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function InteractiveMap() {
  const [initialViewState, setInitialViewState] = useState<null | {
    longitude: number;
    latitude: number;
    zoom: number;
  }>(null);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{
    longitude: number;
    latitude: number;
    marketId: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    if (width < 600) {
      setInitialViewState({ longitude: 34, latitude: 33, zoom: 3.2 });
    } else if (width < 960) {
      setInitialViewState({ longitude: 34, latitude: 33, zoom: 3.8 });
    } else {
      setInitialViewState({ longitude: 34, latitude: 33, zoom: 4.2 });
    }
  }, []);

  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (feature && feature.properties?.id) {
      setHoverInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        marketId: feature.properties.id,
      });
    } else {
      setHoverInfo(null);
    }
  }, []);

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (feature && feature.properties?.id) {
      setSelectedMarket(feature.properties.id);
    }
  }, []);

  const hoveredMarket = hoverInfo ? marketsData[hoverInfo.marketId] : null;

  return (
    <Box
      id="markets"
      sx={{
        minHeight: '100vh',
        pt: { xs: 12, md: 14 },
        pb: 8,
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        {/* Header */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ duration: 0.5 }}>
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
        <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.1 }}>
          <Box
            sx={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              p: { xs: 2, md: 4 },
              mb: 4,
            }}
          >
            {/* Legend */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 2, md: 4 },
                flexWrap: 'wrap',
                mb: 3,
              }}
            >
              <Chip
                icon={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#4CAF50', ml: 1 }} />}
                label="Active Market"
                sx={{
                  bgcolor: 'rgba(76, 175, 80, 0.15)',
                  color: '#4CAF50',
                  fontWeight: 600,
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                }}
              />
              <Chip
                icon={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FFD700', ml: 1 }} />}
                label="Expansion Phase"
                sx={{
                  bgcolor: 'rgba(255, 215, 0, 0.15)',
                  color: '#FFD700',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                }}
              />
            </Box>

            {/* MAP */}
            <Box
              sx={{
                height: { xs: '350px', sm: '400px', md: '450px' },
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.15)',
                position: 'relative',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              }}
            >
              {!initialViewState ? (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)',
                  }}
                >
                  <CircularProgress sx={{ color: theme.palette.primary.main }} />
                </Box>
              ) : (
                <Map
                  mapLib={import('maplibre-gl')}
                  initialViewState={initialViewState}
                  style={{ width: '100%', height: '100%' }}
                  mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                  interactiveLayerIds={['country-bubbles', 'country-labels']}
                  onMouseMove={onHover}
                  onMouseLeave={() => setHoverInfo(null)}
                  onClick={onClick}
                  cursor={hoverInfo ? 'pointer' : 'grab'}
                >
                  <NavigationControl position="top-right" showCompass={false} />

                  <Source id="countries" type="geojson" data={geojsonData}>
                    {/* Outer glow */}
                    <Layer
                      id="country-glow"
                      type="circle"
                      paint={{
                        'circle-radius': 50,
                        'circle-color': ['get', 'color'],
                        'circle-opacity': 0.2,
                        'circle-blur': 1,
                      }}
                    />
                    {/* Main bubble */}
                    <Layer
                      id="country-bubbles"
                      type="circle"
                      paint={{
                        'circle-radius': 35,
                        'circle-color': ['get', 'color'],
                        'circle-opacity': 0.85,
                        'circle-stroke-width': 3,
                        'circle-stroke-color': 'rgba(255,255,255,0.8)',
                      }}
                    />
                    {/* Labels */}
                    <Layer
                      id="country-labels"
                      type="symbol"
                      layout={{
                        'text-field': ['get', 'name'],
                        'text-size': 13,
                        'text-anchor': 'center',
                        'text-font': ['Open Sans Bold'],
                      }}
                      paint={{
                        'text-color': '#ffffff',
                        'text-halo-color': 'rgba(0,0,0,0.7)',
                        'text-halo-width': 2,
                      }}
                    />
                  </Source>

                  {hoverInfo && hoveredMarket && (
                    <Popup
                      longitude={hoverInfo.longitude}
                      latitude={hoverInfo.latitude}
                      closeButton={false}
                      closeOnClick={false}
                      anchor="bottom"
                      offset={[0, -40]}
                    >
                      <Box
                        sx={{
                          background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
                          color: 'white',
                          borderRadius: 2,
                          p: 2,
                          minWidth: 220,
                          border: `2px solid ${hoveredMarket.color}`,
                          boxShadow: `0 0 20px ${hoveredMarket.color}40`,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {hoveredMarket.flag} {hoveredMarket.name}
                          </Typography>
                          <Chip
                            label={hoveredMarket.status === 'active' ? 'Active' : 'Coming Soon'}
                            size="small"
                            sx={{
                              bgcolor: `${hoveredMarket.color}30`,
                              color: hoveredMarket.color,
                              fontWeight: 600,
                              fontSize: '0.65rem',
                              height: 20,
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, fontSize: '0.8rem' }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                              Avg. Price
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                              {hoveredMarket.avgPrice}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                              ROI (Long)
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                              {hoveredMarket.roiLong}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                              Rent (Long)
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {hoveredMarket.rentLong}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                              Rent (Short)
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {hoveredMarket.rentShort}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Popup>
                  )}
                </Map>
              )}
            </Box>

            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', mt: 2 }}
            >
              Hover over markers for details • Click to select
            </Typography>
          </Box>
        </motion.div>

        {/* Market Cards */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
          <Grid container spacing={3}>
            {Object.entries(marketsData).map(([id, market], index) => (
              <Grid key={id} size={{ xs: 12, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    onClick={() => setSelectedMarket(id)}
                    sx={{
                      background:
                        selectedMarket === id
                          ? `linear-gradient(145deg, ${market.color}20, ${market.color}10)`
                          : 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                      backdropFilter: 'blur(20px)',
                      border:
                        selectedMarket === id
                          ? `2px solid ${market.color}`
                          : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        border: `1px solid ${market.color}60`,
                        boxShadow: `0 10px 30px ${market.color}20`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="h5">{market.flag}</Typography>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                            {market.name}
                          </Typography>
                        </Box>
                        <Chip
                          label={market.status === 'active' ? 'Active' : 'Expansion'}
                          size="small"
                          sx={{
                            bgcolor: `${market.color}20`,
                            color: market.color,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>

                      {/* Stats */}
                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <HomeIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                Avg. Price
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                              {market.avgPrice}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={6}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: 'rgba(76, 175, 80, 0.1)',
                              border: '1px solid rgba(76, 175, 80, 0.2)',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <TrendingUpIcon sx={{ fontSize: 14, color: '#4CAF50' }} />
                              <Typography variant="caption" sx={{ color: '#4CAF50' }}>
                                ROI
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                              {market.roiLong}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={6}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <AttachMoneyIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                Rent (Long)
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                              {market.rentLong}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={6}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <AttachMoneyIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                Rent (Short)
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                              {market.rentShort}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Highlight */}
                      <Box
                        sx={{
                          mt: 2,
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: `${market.color}10`,
                          border: `1px solid ${market.color}30`,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: market.color, fontWeight: 600, textAlign: 'center' }}>
                          {market.highlight}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>
    </Box>
  );
}
