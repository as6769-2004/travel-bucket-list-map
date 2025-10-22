export async function GET() {
  return Response.json({
    success: true,
    analytics: {
      totalBookings: 10,
      totalRevenue: 500000,
      popularPackages: []
    }
  });
}