'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import theme from '@/theme/theme';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [field]: e.target.value });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async () => {
    const { name, email, message } = form;

    if (!name || !email || !message) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send message.');
      } else {
        setSuccess(true);
        setForm({ name: '', email: '', message: '' });
      }
    } catch (err: unknown) {
      setError('An unexpected error occurred.' + (err instanceof Error ? ` ${err.message}` : ''));
    } finally {
      setLoading(false);
    }
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
      '& input, & textarea': { color: 'white' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
    '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 12, md: 14 },
        pb: 8,
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div initial="initial" animate="animate" variants={fadeInUp} style={{ width: '100%', maxWidth: 600 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <EmailIcon sx={{ fontSize: 35, color: 'white' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Contact Us
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Have questions? We&apos;d love to hear from you.
            </Typography>
          </Box>

          {/* Success Message */}
          {success && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(76, 175, 80, 0.15)',
                  color: '#4CAF50',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                }}
              >
                Your message has been sent successfully! We&apos;ll get back to you soon.
              </Alert>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                bgcolor: 'rgba(244, 67, 54, 0.15)',
                color: '#f44336',
                border: '1px solid rgba(244, 67, 54, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={form.name}
              onChange={handleChange('name')}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={textFieldSx}
            />

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={textFieldSx}
            />

            <TextField
              label="Message"
              variant="outlined"
              fullWidth
              multiline
              minRows={4}
              value={form.message}
              onChange={handleChange('message')}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                      <MessageIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={textFieldSx}
            />

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              size="large"
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)',
                },
              }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
