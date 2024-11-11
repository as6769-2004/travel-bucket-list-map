const testRoutes = async () => {
  const baseUrl = 'http://localhost:3000';
  
  const routes = [
    { name: 'Packages', url: '/api/packages' },
    { name: 'Destinations', url: '/api/destinations' },
    { name: 'Hotels', url: '/api/hotels' },
    { name: 'Bookings', url: '/api/bookings' },
    { name: 'Analytics', url: '/api/analytics' }
  ];

  
  console.log('🧪 Testing API Routes...\n');

  for (const route of routes) {
    try {
      const response = await fetch(`${baseUrl}${route.url}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${route.name}: Working`);
        if (data.packages) console.log(`   - Found ${data.packages.length} packages`);
        if (data.destinations) console.log(`   - Found ${data.destinations.length} destinations`);
        if (data.hotels) console.log(`   - Found ${data.hotels.length} hotels`);
        if (data.data) console.log(`   - Found ${data.data.length} records`);
      } else {
        console.log(`❌ ${route.name}: Failed (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${route.name}: Error - ${error.message}`);
    }
  }

  console.log('\n🎯 Testing Complete!');
};

testRoutes();