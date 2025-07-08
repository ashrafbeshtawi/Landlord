'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import theme from '@/theme/theme';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CONTENT_WIDTH = '800px';

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
      setError('An unexpected error occurred.' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, md: 10 },
      }}
    >
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <Box
          sx={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 5,
            p: { xs: 4, md: 6 },
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            maxWidth: CONTENT_WIDTH,
            width: '100%',
            mx: 'auto',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50, #2196F3)`,
              borderRadius: '5px 5px 0 0'
            }
          }}
        >
          <Typography
            variant="h3"
            sx={{ color: 'white', fontWeight: 700, mb: 3, textAlign: 'center' }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="body1"
            sx={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', textAlign: 'center', mb: 4 }}
          >
            We’d love to hear from you! Whether you have questions, feedback, or want to learn more about our project, please fill out the form below and we’ll get back to you as soon as possible.
          </Typography>

          <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={form.name}
              onChange={handleChange('name')}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '& input': {
                    color: 'white',
                  },
                },
              }}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={form.email}
              onChange={handleChange('email')}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              type="email"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '& input': {
                    color: 'white',
                  },
                },
              }}
            />
            <TextField
              label="Message"
              variant="outlined"
              fullWidth
              multiline
              minRows={4}
              value={form.message}
              onChange={handleChange('message')}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '& textarea': {
                    color: 'white',
                  },
                },
              }}
            />

            {error && (
              <Typography sx={{ color: 'red', mb: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography sx={{ color: '#00FF00', mb: 2, textAlign: 'center' }}>
                Your message has been sent successfully!
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, #4CAF50)`,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, #45a049)`,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.4)'
                }
              }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
