import test from 'node:test';
import assert from 'node:assert/strict';

import {
  formatPrice,
  formatDate,
  statusLabel,
  statusTone,
  getStatusLabel,
  isProductAvailable,
  userStatusLabel,
  getProductImage,
} from '../src/lib/format.js';

test('formatPrice multiplies the stored value by 1000 exactly once', () => {
  assert.match(formatPrice(60), /60\.000/);
  assert.match(formatPrice(210), /210\.000/);
  assert.match(formatPrice('60'), /60\.000/);
});

test('formatPrice falls back to zero for missing or invalid values', () => {
  assert.match(formatPrice(undefined), /0/);
  assert.match(formatPrice(null), /0/);
  assert.match(formatPrice('bukan angka'), /0/);
});

test('formatPrice renders the same value no matter how it is typed', () => {
  assert.equal(formatPrice(60), formatPrice('60'));
  assert.equal(formatPrice(60), formatPrice(60.0));
});

test('formatDate renders an Indonesian date and survives bad input', () => {
  assert.match(formatDate('2026-01-04'), /2026/);
  assert.equal(formatDate(null), '-');
  assert.equal(formatDate('bukan tanggal'), 'bukan tanggal');
});

test('statusLabel translates the database status into Indonesian', () => {
  assert.equal(statusLabel('pending'), 'Menunggu');
  assert.equal(statusLabel('approved'), 'Disetujui');
  assert.equal(statusLabel('completed'), 'Selesai');
  assert.equal(statusLabel('rejected'), 'Ditolak');
  assert.equal(statusLabel('unknown-status'), 'unknown-status');
  assert.equal(statusLabel(''), '-');
});

test('statusTone always returns a class string', () => {
  assert.ok(statusTone('pending').includes('bg-warning-container'));
  assert.ok(statusTone('tidak-ada').includes('bg-surface-container-high'));
});

test('getStatusLabel maps the product availability status', () => {
  assert.equal(getStatusLabel('available'), 'Tersedia');
  assert.equal(getStatusLabel('AVAILABLE'), 'Tersedia');
  assert.equal(getStatusLabel('unavailable'), 'Tidak Tersedia');
  assert.equal(getStatusLabel(undefined), 'Tersedia');
});

test('isProductAvailable treats the accepted status spellings as available', () => {
  assert.equal(isProductAvailable({ status: 'available' }), true);
  assert.equal(isProductAvailable({ status: 'tersedia' }), true);
  assert.equal(isProductAvailable({ status: 'unavailable' }), false);
  assert.equal(isProductAvailable({}), true);
});

test('userStatusLabel translates the account status', () => {
  assert.equal(userStatusLabel('verified'), 'Terverifikasi');
  assert.equal(userStatusLabel('blacklist'), 'Diblokir');
  assert.equal(userStatusLabel(undefined), '-');
});

test('getProductImage returns the placeholder when there is no image', () => {
  assert.equal(getProductImage(''), '/product-placeholder.svg');
  assert.equal(getProductImage(null), '/product-placeholder.svg');
});

test('getProductImage keeps absolute URLs untouched', () => {
  assert.equal(getProductImage('https://cdn.example.com/a.jpg'), 'https://cdn.example.com/a.jpg');
});

test('getProductImage builds an absolute URL for a stored file name', () => {
  assert.match(getProductImage('camera.jpg'), /\/uploads\/products\/camera\.jpg$/);
  assert.match(getProductImage('/uploads/products/camera.jpg'), /\/uploads\/products\/camera\.jpg$/);
});
