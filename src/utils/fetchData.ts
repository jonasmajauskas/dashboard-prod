type DataSource = {
  id: string;
  endpoint: string;
  title: string;
  icon: React.ReactNode;
  type: string;
};
export async function fetchDashboardData(dataSources: DataSource[]): Promise<Record<string, any>> {
  // Create an object to hold all the fetched data
  const dashboardData: Record<string, any> = {};
  // Create an array of promises to fetch data from all endpoints
  const fetchPromises = dataSources.map(async source => {
    try {
      const response = await fetch(source.endpoint);
      if (!response.ok) {
        throw new Error(`Error fetching data from ${source.endpoint}`);
      }
      const data = await response.json();
      dashboardData[source.id] = data;
    } catch (error) {
      console.error(`Failed to fetch data for ${source.id}:`, error);
      dashboardData[source.id] = []; // Set empty array on error
    }
  });
  // Wait for all fetches to complete
  await Promise.all(fetchPromises);
  // Simulate a slight delay to show loading state
  await new Promise(resolve => setTimeout(resolve, 1000));
  return dashboardData;
}