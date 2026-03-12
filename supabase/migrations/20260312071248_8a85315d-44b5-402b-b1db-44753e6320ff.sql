
-- Remove old hielo practices
DELETE FROM practices WHERE category = 'hielo';

-- Insert new hielo practices
INSERT INTO practices (id, name, display_name, category, sort_order, duration_estimated, tags, media_mode) VALUES
  ('hielo-activacion-pre', 'activacion-pre-hielo', 'Activación Pre Hielo', 'hielo', 1, '5 min', '["pre"]', 'visual'),
  ('hielo-respiracion-pre', 'respiracion-rapida-pre-hielo', 'Respiración rápida Pre Hielo', 'hielo', 2, '3 min', '["pre"]', 'visual'),
  ('hielo-respiracion-durante', 'respiracion-durante-hielo', 'Respiración durante Hielo', 'hielo', 3, '5 min', '["durante"]', 'visual'),
  ('hielo-calma-durante', 'calma-en-el-frio', 'Calma en el frío', 'hielo', 4, '3 min', '["durante"]', 'visual'),
  ('hielo-recuperacion-post', 'recuperacion-post-hielo', 'Recuperación Post Hielo', 'hielo', 5, '5 min', '["post"]', 'visual'),
  ('hielo-reset-post', 'reset-profundo-post-hielo', 'Reset profundo Post Hielo', 'hielo', 6, '10 min', '["post"]', 'visual');
