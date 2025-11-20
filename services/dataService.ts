import { EquipmentData, DatasetSummary } from '../types';

// Helper to parse CSV content manually
export const parseCSV = (csvText: string): EquipmentData[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const data: EquipmentData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    if (row.length < headers.length) continue;

    const entry: any = { id: `row-${i}` };
    headers.forEach((header, index) => {
      let value: any = row[index]?.trim();
      if (['flowrate', 'pressure', 'temperature'].includes(header)) {
        value = parseFloat(value);
        if (isNaN(value)) value = 0;
      }
      entry[header] = value;
    });

    // Fallback if type is missing
    if (!entry.type) entry.type = 'Unknown';
    
    // Simple status logic simulation
    if (entry.temperature > 100 || entry.pressure > 500) {
      entry.status = 'Critical';
    } else if (entry.temperature > 80 || entry.pressure > 300) {
      entry.status = 'Warning';
    } else {
      entry.status = 'Normal';
    }

    data.push(entry as EquipmentData);
  }
  return data;
};

export const analyzeDataset = (data: EquipmentData[], fileName: string): DatasetSummary => {
  const totalCount = data.length;
  if (totalCount === 0) {
     throw new Error("Dataset is empty");
  }

  const flowrates = data.map(d => d.flowrate);
  const pressures = data.map(d => d.pressure);
  const temperatures = data.map(d => d.temperature);

  const avgFlowrate = flowrates.reduce((a, b) => a + b, 0) / totalCount;
  const avgPressure = pressures.reduce((a, b) => a + b, 0) / totalCount;
  const avgTemperature = temperatures.reduce((a, b) => a + b, 0) / totalCount;

  // Outlier Detection (Simple IQR for Temperature)
  const sortedTemp = [...temperatures].sort((a, b) => a - b);
  const q1 = sortedTemp[Math.floor(totalCount * 0.25)];
  const q3 = sortedTemp[Math.floor(totalCount * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  const outlierCount = temperatures.filter(t => t < lowerBound || t > upperBound).length;

  // Type Distribution
  const typeDistribution: Record<string, number> = {};
  data.forEach(d => {
    typeDistribution[d.type] = (typeDistribution[d.type] || 0) + 1;
  });

  // Data Quality Score (mock logic)
  const missingFields = data.filter(d => !d.equipment_id || isNaN(d.flowrate)).length;
  const qualityScore = Math.max(0, 100 - (missingFields * 2) - (outlierCount * 1));

  return {
    id: Date.now().toString(),
    fileName,
    uploadDate: new Date().toLocaleString(),
    totalCount,
    avgFlowrate,
    avgPressure,
    avgTemperature,
    outlierCount,
    typeDistribution,
    dataQualityScore: qualityScore,
    aiInsights: undefined, // To be filled by analysis service
    classification: 'Pending AI Analysis'
  };
};

// Generate mock CSV data for testing
export const generateMockCSV = () => {
  const headers = "timestamp,equipment_id,type,flowrate,pressure,temperature";
  let rows = [headers];
  const types = ['Reactor', 'Pump', 'Heat Exchanger', 'Separator'];
  
  for(let i=0; i<50; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const flow = (Math.random() * 100 + 50).toFixed(2);
    const press = (Math.random() * 500 + 100).toFixed(2);
    const temp = (Math.random() * 150 + 20).toFixed(2);
    const time = new Date(Date.now() - i * 3600000).toISOString();
    rows.push(`${time},EQ-${1000+i},${type},${flow},${press},${temp}`);
  }
  return rows.join('\n');
}
