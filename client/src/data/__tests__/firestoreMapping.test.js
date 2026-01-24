import { normalizeProductData } from '../firestoreMapping';

test('returns defaults for missing fields', () => {
  const input = {};
  const out = normalizeProductData(input, 'abc123');

  expect(out._id).toBe('abc123');
  expect(out.id).toBe('abc123');
  expect(out.name).toBe('');
  expect(out.category).toBe('');
  expect(out.brand).toBe('');
  expect(out.image).toBe('');
  expect(Array.isArray(out.images)).toBe(true);
  expect(out.images.length).toBe(0);
  expect(Array.isArray(out.sizes)).toBe(true);
  expect(out.price).toBe(0);
  expect(typeof out.createdAt).toBe('number');
});

test('normalizes dates and timestamps to milliseconds', () => {
  const date = new Date(2020, 0, 2);
  const input = { name: 'X', createdAt: date };
  const out = normalizeProductData(input, 'd1');
  expect(out.createdAt).toBe(date.getTime());

  // Firestore Timestamp-like object
  const tsLike = { toMillis: () => 1609459200000 };
  const out2 = normalizeProductData({ createdAt: tsLike }, 'd2');
  expect(out2.createdAt).toBe(1609459200000);
});

test('normalizes sizes object and array shapes', () => {
  const inputArray = { sizes: [{ size: 'SIZE 8', stock: '3' }] };
  const out = normalizeProductData(inputArray, 's1');
  expect(Array.isArray(out.sizes)).toBe(true);
  expect(out.sizes[0].size).toBe('SIZE 8');
  expect(out.sizes[0].stock).toBe(3);

  const inputObj = { sizes: { '8': 5, '9': '2' } };
  const out2 = normalizeProductData(inputObj, 's2');
  expect(out2.sizes.find(s => s.size === '8').stock).toBe(5);
  expect(out2.sizes.find(s => s.size === '9').stock).toBe(2);
});
