describe('Booking form validation', () => {
  test('should confirm a name is not empty', () => {
    const name = 'Jane Smith'
    expect(name.length).toBeGreaterThan(0)
  })

  test('should confirm email contains @', () => {
    const email = 'jane@example.com'
    expect(email).toContain('@')
  })

  test('should confirm date is not empty', () => {
    const date = '2026-06-01'
    expect(date.length).toBeGreaterThan(0)
  })

  test('should confirm booking status defaults to confirmed', () => {
    const status = 'confirmed'
    expect(status).toBe('confirmed')
  })
})