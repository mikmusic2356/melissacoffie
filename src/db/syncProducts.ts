import { turso } from './turso';

async function updateAll() {
  console.log('Syncing products to Turso DB...');

  // prod-1: Café verde, bourbon rojo
  await turso.execute({
    sql: `UPDATE products SET 
      name = ?, 
      sub_category_id = ?, 
      short_description = ?, 
      description = ?, 
      price_unit = ?, 
      wholesale_price_min = ?, 
      unit_label = ?, 
      origin = ? 
    WHERE id = ?`,
    args: [
      'Café verde, bourbon rojo',
      'cafe-verde',
      'Sellado al vacío. Precio depende cantidad en stock.',
      'Cultivado en nuestra finca altura 1.650 msnm. 48 horas de Fermentación controlada y secado lento en camas africanas.',
      48000,
      32000,
      'Bolsa sellada al vacío',
      JSON.stringify({ finca: 'La Floresta', altitudeMeters: 1650, variety: 'Bourbon rojo', process: '48h Fermentación controlada & secado lento en camas africanas', tastingNotes: ['Bourbon rojo', 'Sellado al vacío', 'Finca La Floresta'] }),
      'prod-1'
    ]
  });

  // prod-2: Café pacamara
  await turso.execute({
    sql: `UPDATE products SET 
      name = ?, 
      sub_category_id = ?, 
      short_description = ?, 
      description = ?, 
      price_unit = ?, 
      wholesale_price_min = ?, 
      min_wholesale_quantity = ?, 
      unit_label = ?, 
      origin = ? 
    WHERE id = ?`,
    args: [
      'Café pacamara',
      'grano-entero',
      'Secado en camas africanas. Precio unidad $30.000 / Mayor $25.000 (min 10 bolsas).',
      '',
      30000,
      25000,
      10,
      'Bolsa 250g',
      JSON.stringify({ finca: 'La Floresta', altitudeMeters: 1650, variety: 'Pacamara', process: 'Secado en camas africanas', tastingNotes: ['Pacamara', 'Secado en camas africanas', 'Finca La Floresta'] }),
      'prod-2'
    ]
  });

  // prod-3: Café castillo
  await turso.execute({
    sql: `UPDATE products SET 
      name = ?, 
      sub_category_id = ?, 
      short_description = ?, 
      description = ?, 
      price_unit = ?, 
      wholesale_price_min = ?, 
      min_wholesale_quantity = ?, 
      unit_label = ?, 
      image_url = ?, 
      origin = ? 
    WHERE id = ?`,
    args: [
      'Café castillo',
      'molido-medio',
      'Secado en camas africanas. Precio unidad $27.000 / Mayor $23.000.',
      'Cultivado en nuestra finca La Floresta a 1.650 msnm con secado en camas africanas.',
      27000,
      23000,
      10,
      'Bolsa',
      '/images/cafe castillo.jpeg',
      JSON.stringify({ finca: 'La Floresta', altitudeMeters: 1650, variety: 'Castillo', process: 'Secado en camas africanas', tastingNotes: ['Castillo', 'Secado en camas africanas', 'Finca La Floresta'] }),
      'prod-3'
    ]
  });

  // prod-4: Miel Virgen de Flor de Cafeto
  await turso.execute({
    sql: `UPDATE products SET 
      short_description = ?, 
      description = ?, 
      price_unit = ?, 
      wholesale_price_min = ?, 
      min_wholesale_quantity = ?, 
      unit_label = ?, 
      image_url = ? 
    WHERE id = ?`,
    args: [
      '250 ml $23.000 | 350 ml $30.000 | 450 ml $50.000. Sin precio al por mayor.',
      'Miel 100% virgen cosechada en floración del café. Presentaciones disponibles: 250 ml ($23.000), 350 ml ($30.000) y 450 ml ($50.000). Sin precio al por mayor.',
      23000,
      0,
      0,
      'Frasco (250 ml / 350 ml / 450 ml)',
      '/images/panal-miel-abejas.jpg',
      'prod-4'
    ]
  });

  console.log('✅ Synchronized prod-1, prod-2, prod-3, prod-4 to Turso Database successfully!');
}

updateAll().catch(console.error);
