INSERT INTO service_types (id, name, description, icon_name, background_color) VALUES
  ('reboco', 'Reboco', 'Cálculo de materiais para reboco de paredes', 'Construction', 'bg-green-50'),
  ('piso', 'Piso', 'Cálculo de materiais para assentamento de pisos', 'Layers', 'bg-yellow-50'),
  ('pladur', 'Pladur', 'Cálculo de materiais para instalação de pladur', 'LayoutGrid', 'bg-orange-50'),
  ('alvenaria', 'Alvenaria', 'Cálculo de materiais para alvenaria', 'Grid3x3', 'bg-purple-50'),
  ('capoto', 'Capoto', 'Cálculo de materiais para sistema capoto', 'Layers', 'bg-pink-50'),
  ('concreto', 'Concreto', 'Cálculo de materiais para concretagem', 'Grid3x3', 'bg-rose-50'),
  ('pintura', 'Pintura', 'Cálculo de materiais para pintura', 'Paintbrush', 'bg-blue-50')
ON CONFLICT (id) DO NOTHING;