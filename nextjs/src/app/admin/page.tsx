'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import theme from '@/theme/theme';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const TITLE_COLOR = '#FFFFFF';
const BODY_COLOR = '#34C6A3';
const CONTENT_WIDTH = '800px';

export default function ContactAdminPage() {
  const [auth, setAuth] = useState({ username: '', password: '' });
  const [authorized, setAuthorized] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [error, setError] = useState('');

  const fetchContacts = async () => {
    setError('');
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
    } catch (err: any) {
      setError(err.message);
      setAuthorized(false);
    }
  };

  const handleDelete = async (id: string) => {
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
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
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
      {/* Page Title */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <Box sx={{ maxWidth: CONTENT_WIDTH, width: '100%', mx: 'auto' }}>
          <Typography
            variant="h3"
            sx={{ color: TITLE_COLOR, fontWeight: 700, mt: 8, mb: 4, textAlign: 'center' }}
          >
            Admin Control Panel
          </Typography>
        </Box>
      </motion.div>

      {/* Auth Form */}
      {!authorized ? (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <Box sx={{ maxWidth: CONTENT_WIDTH, width: '100%', mx: 'auto' }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => setAuth({ ...auth, username: e.target.value })}
              value={auth.username}
              InputLabelProps={{ style: { color: BODY_COLOR } }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => setAuth({ ...auth, password: e.target.value })}
              value={auth.password}
              InputLabelProps={{ style: { color: BODY_COLOR } }}
            />
            {error && (
              <Typography sx={{ color: 'red', mb: 2 }}>{error}</Typography>
            )}
            <Button
              variant="contained"
              onClick={fetchContacts}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.main,
                },
              }}
            >
              <strong>Login</strong>
            </Button>
          </Box>
        </motion.div>
      ) : (
        // Contact List
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <Box sx={{ maxWidth: CONTENT_WIDTH, width: '100%', mx: 'auto', mt: 4 }}>
            {contacts.length === 0 ? (
              <Typography sx={{ color: BODY_COLOR, textAlign: 'center' }}>
                No contacts available.
              </Typography>
            ) : (
              <List>
                {contacts.map((contact) => (
                  <React.Fragment key={contact.id}>
                    <ListItem
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ color: BODY_COLOR }}>
                        <strong>{contact.name}</strong> – {contact.email}
                      </Typography>
                      <Typography variant="body2" sx={{ color: BODY_COLOR, mb: 1 }}>
                        {contact.message}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(contact.id)}
                      >
                        ❌ Delete
                      </Button>
                    </ListItem>
                    <Divider sx={{ backgroundColor: BODY_COLOR, mb: 2 }} />
                  </React.Fragment>
                ))}
              </List>
            )}

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                onClick={() => setAuthorized(false)}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                🔐 Logout
              </Button>
            </Box>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
