-- Seed practices para Frío (hielo) y Calor
-- Frío: Protocolo Bodhi para Hielo
INSERT INTO public.practices (id, name, display_name, category, technique, duration_estimated, intensity, media_mode, for_profile, phases, tags, sort_order) VALUES
('frio-activacion-pre', 'activacion-pre-hielo', 'Activación Pre Hielo', 'hielo', 'Preparación corporal y mental antes de la exposición al frío.', '5 min', 'media', 'visual', 'ambos', '[{"name": "Activación", "duration": 60}]'::jsonb, '["pre"]'::jsonb, 10),
('frio-respiracion-pre', 'respiracion-pre-hielo', 'Respiración rápida Pre Hielo', 'hielo', 'Respiración energizante antes de entrar al frío.', '3 min', 'media', 'visual', 'ambos', '[{"name": "Hiperventilación controlada", "duration": 90}]'::jsonb, '["pre"]'::jsonb, 20),
('frio-respiracion-durante', 'respiracion-durante-hielo', 'Respiración durante el Hielo', 'hielo', 'Mantén la calma respiratoria durante la inmersión.', '5 min', 'alta', 'visual', 'ambos', '[{"name": "Respiración controlada", "duration": 300}]'::jsonb, '["durante"]'::jsonb, 30),
('frio-calma', 'calma-en-frio', 'Calma en Frío', 'hielo', 'Acepta la sensación y mantén la calma en el frío.', '3 min', 'alta', 'visual', 'ambos', '[{"name": "Presencia", "duration": 180}]'::jsonb, '["durante"]'::jsonb, 40),
('frio-recuperacion', 'recuperacion-post-hielo', 'Recuperación Post Hielo', 'hielo', 'Recuperación gradual y vuelta a la calma.', '5 min', 'baja', 'visual', 'ambos', '[{"name": "Recuperación", "duration": 300}]'::jsonb, '["post"]'::jsonb, 50),
('frio-reset', 'reset-post-hielo', 'Reset profundo Post Hielo', 'hielo', 'Reset completo del sistema nervioso tras la exposición.', '10 min', 'baja', 'visual', 'ambos', '[{"name": "Integración", "duration": 600}]'::jsonb, '["post"]'::jsonb, 60)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  category = EXCLUDED.category,
  technique = EXCLUDED.technique,
  duration_estimated = EXCLUDED.duration_estimated,
  tags = EXCLUDED.tags,
  sort_order = EXCLUDED.sort_order;

-- Calor: Protocolo Bodhi para Sauna
INSERT INTO public.practices (id, name, display_name, category, technique, duration_estimated, intensity, media_mode, for_profile, phases, tags, sort_order) VALUES
('calor-activacion-pre', 'activacion-pre-sauna', 'Activación Pre Sauna', 'calor', 'Preparación para la sesión de sauna.', '5 min', 'media', 'visual', 'ambos', '[{"name": "Activación", "duration": 60}]'::jsonb, '["pre"]'::jsonb, 10),
('calor-respiracion-pre', 'respiracion-pre-sauna', 'Respiración breve Pre Sauna', 'calor', 'Respiración para preparar el cuerpo al calor.', '3 min', 'media', 'visual', 'ambos', '[{"name": "Calentamiento", "duration": 90}]'::jsonb, '["pre"]'::jsonb, 20),
('calor-respiracion-durante', 'respiracion-durante-sauna', 'Respiración durante Sauna', 'calor', 'Respiración consciente durante la exposición al calor.', '10 min', 'media', 'visual', 'ambos', '[{"name": "Respiración", "duration": 600}]'::jsonb, '["durante"]'::jsonb, 30),
('calor-calma', 'calma-en-sauna', 'Calma en la sauna', 'calor', 'Relajación y presencia en el calor.', '5 min', 'media', 'visual', 'ambos', '[{"name": "Calma", "duration": 300}]'::jsonb, '["durante"]'::jsonb, 40),
('calor-recuperacion', 'recuperacion-post-sauna', 'Recuperación Post Sauna', 'calor', 'Enfriamiento gradual y hidratación.', '5 min', 'baja', 'visual', 'ambos', '[{"name": "Recuperación", "duration": 300}]'::jsonb, '["post"]'::jsonb, 50),
('calor-reset', 'reset-post-sauna', 'Reset completo Post Sauna', 'calor', 'Integración y reset del sistema tras la sauna.', '10 min', 'baja', 'visual', 'ambos', '[{"name": "Integración", "duration": 600}]'::jsonb, '["post"]'::jsonb, 60)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  category = EXCLUDED.category,
  technique = EXCLUDED.technique,
  duration_estimated = EXCLUDED.duration_estimated,
  tags = EXCLUDED.tags,
  sort_order = EXCLUDED.sort_order;
