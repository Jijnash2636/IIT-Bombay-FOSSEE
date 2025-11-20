import { DatasetSummary } from "../types";

// Mock AI service - removed Google GenAI dependency

export const generateDatasetInsights = async (summary: DatasetSummary): Promise<{ aiInsights: string, classification: string }> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock insights since we've removed the AI dependency
  return {
    aiInsights: "The dataset demonstrates stable operational parameters across the majority of equipment units, with average flowrates and pressures remaining within nominal design limits. Thermal efficiency appears consistent, though specific attention should be directed toward the detected outliers which may indicate sensor drift or localized overheating events.\n\nSafety assessment indicates a low-risk profile for this batch, as the aggregated pressure metrics are well below critical thresholds. However, the presence of minor variance in the flowrate distribution suggests potential upstream feed irregularities that warrant routine maintenance checks to ensure continued optimal performance.",
    classification: "Standard Processing Batch"
  };
};