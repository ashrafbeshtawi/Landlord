'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  IconButton,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import InboxIcon from '@mui/icons-material/Inbox';
import theme from '@/theme/theme';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

type Contact = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
};

export default function ContactAdminPage() {
  const [auth, setAuth] = useState({ username: '', password: '' });
  const [authorized, setAuthorized] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchContacts = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'GET',
        headers: {
          Authorization: 'Basic ' + btoa(`${auth.username}:${auth.password}`),
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Unauthorized');
      }

      const data = await res.json();
      setContacts(data);
      setAuthorized(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Basic ' + btoa(`${auth.username}:${auth.password}`),
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      setContacts(contacts.filter((c) => c.id !== id));
    } catch (err: unknown) {
      setError('Error deleting: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    setAuthorized(false);
    setContacts([]);
    setAuth({ username: '', password: '' });
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
      '& input': { color: 'white' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 12, md: 14 },
        pb: 8,
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AdminPanelSettingsIcon sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Admin Panel
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {authorized ? `${contacts.length} contacts` : 'Login required'}
                  </Typography>
                </Box>
              </Box>

              {authorized && (
                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    borderColor: 'rgba(255,107,107,0.5)',
                    color: '#ff6b6b',
                    '&:hover': {
                      borderColor: '#ff6b6b',
                      bgcolor: 'rgba(255,107,107,0.1)',
                    },
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Paper>
        </motion.div>

        {/* Login Form */}
        {!authorized ? (
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                maxWidth: 450,
                mx: 'auto',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <LockIcon sx={{ fontSize: 50, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  Admin Authentication
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(244,67,54,0.15)', color: '#f44336' }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={auth.username}
                  onChange={(e) => setAuth({ ...auth, username: e.target.value })}
                  sx={textFieldSx}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  value={auth.password}
                  onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && fetchContacts()}
                  sx={textFieldSx}
                />
                <Button
                  variant="contained"
                  onClick={fetchContacts}
                  disabled={loading}
                  size="large"
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
              </Box>
            </Paper>
          </motion.div>
        ) : (
          /* Contacts List */
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            {contacts.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <InboxIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  No contacts yet
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                <AnimatePresence>
                  {contacts.map((contact, index) => (
                    <Grid key={contact.id} size={{ xs: 12, md: 6 }}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          sx={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 3,
                            '&:hover': {
                              border: '1px solid rgba(255,255,255,0.2)',
                            },
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <PersonIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                  <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                                    {contact.name}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <EmailIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {contact.email}
                                  </Typography>
                                </Box>
                              </Box>
                              <IconButton
                                onClick={() => handleDelete(contact.id)}
                                disabled={deletingId === contact.id}
                                size="small"
                                sx={{
                                  color: '#ff6b6b',
                                  '&:hover': { bgcolor: 'rgba(255,107,107,0.1)' },
                                }}
                              >
                                {deletingId === contact.id ? (
                                  <CircularProgress size={18} color="inherit" />
                                ) : (
                                  <DeleteIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Box>

                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                              {contact.message}
                            </Typography>

                            {contact.created_at && (
                              <Chip
                                label={new Date(contact.created_at).toLocaleDateString()}
                                size="small"
                                sx={{
                                  mt: 2,
                                  bgcolor: 'rgba(255,255,255,0.1)',
                                  color: 'rgba(255,255,255,0.6)',
                                  fontSize: '0.75rem',
                                }}
                              />
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            )}
          </motion.div>
        )}
      </Box>
    </Box>
  );
}
