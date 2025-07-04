'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import theme from '@/theme/theme';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const TITLE_COLOR = '#FFFFFF';
const BODY_COLOR = '#34C6A3';
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
        p: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        color: BODY_COLOR,
      }}
    >
      {/* Title */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <Box sx={{ maxWidth: CONTENT_WIDTH, width: '100%', mx: 'auto' }}>
          <Typography
            variant="h3"
            sx={{ color: TITLE_COLOR, fontWeight: 700, mt: 8, mb: 3, textAlign: 'center' }}
          >
            Contact Us
          </Typography>
        </Box>
      </motion.div>

      {/* Intro Text */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
      >
        <Box sx={{ maxWidth: CONTENT_WIDTH, width: '100%', mx: 'auto', mb: 4 }}>
          <Typography
            variant="body1"
            sx={{ lineHeight: 1.6, color: BODY_COLOR, textAlign: 'center' }}
          >
            We’d love to hear from you! Whether you have questions, feedback, or want to learn more about our project, please fill out the form below and we’ll get back to you as soon as possible.
          </Typography>
        </Box>
      </motion.div>

      {/* Contact Form */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 }}>
        <Box sx={{ maxWidth: CONTENT_WIDTH, width: '100%', mx: 'auto' }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={form.name}
            onChange={handleChange('name')}
            InputLabelProps={{ style: { color: BODY_COLOR } }}
            InputProps={{ style: { color: BODY_COLOR } }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={form.email}
            onChange={handleChange('email')}
            InputLabelProps={{ style: { color: BODY_COLOR } }}
            InputProps={{ style: { color: BODY_COLOR } }}
            type="email"
          />
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            multiline
            minRows={4}
            sx={{ mb: 3 }}
            value={form.message}
            onChange={handleChange('message')}
            InputLabelProps={{ style: { color: BODY_COLOR } }}
            InputProps={{ style: { color: BODY_COLOR } }}
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
              backgroundColor: theme.palette.primary.main,
              '&:hover': { backgroundColor: theme.palette.secondary.main },
              display: 'block',
              mx: 'auto',
              fontWeight: 700,
              px: 5,
              py: 1.5,
            }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}
