import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await expect(page.getByText('Welcome to BookEasy')).toBeVisible()
})

test('services page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/services')
  await expect(page.getByText('Our Services')).toBeVisible()
})

test('booking form loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/booking')
  await expect(page.getByText('Book an Appointment')).toBeVisible()
})

test('admin dashboard loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/admin')
  await expect(page.getByText('Admin Dashboard')).toBeVisible()
})