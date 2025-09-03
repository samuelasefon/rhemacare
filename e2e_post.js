(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'E2E Tester', email: 'tester@example.com', message: 'E2E test' })
    });
    console.log('status', res.status);
    const j = await res.json();
    console.log(j);
  } catch (e) {
    console.error('err', e);
  }
})();
