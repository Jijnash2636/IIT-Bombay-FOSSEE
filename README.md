# Chemical Equipment Parameter Visualizer

A comprehensive web application for analyzing and visualizing chemical equipment parameter data. This tool allows users to upload CSV files containing equipment data, analyze key metrics, and create professional reports with interactive charts.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Data Format](#data-format)
- [AI Integration](#ai-integration)
- [Report Generation](#report-generation)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

### Data Analysis
- Upload CSV files containing chemical equipment parameter data
- Automatic parsing and validation of equipment data
- Calculation of key metrics including:
  - Average flowrate, pressure, and temperature
  - Equipment count and type distribution
  - Anomaly detection and outlier identification
  - Data quality scoring

### Visualization
- Interactive area charts for flowrate and pressure trends
- Pie charts for equipment type composition
- Color-coded status indicators for equipment conditions
- Responsive design that works on all device sizes

### AI-Powered Insights
- Advanced data analysis capabilities
- Automated executive summaries of equipment performance
- Classification of equipment batches
- Safety risk assessments based on parameter data

### Reporting
- Professional report generation with print-ready formatting
- PDF export functionality
- Comprehensive data snapshots
- Key metrics summary tables

### User Experience
- Clean, modern dashboard interface
- Intuitive drag-and-drop file upload
- Sample data for demonstration purposes
- Session management for data persistence

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Charting**: Recharts library
- **State Management**: React Hooks
- **Routing**: React Router
- **PDF Generation**: jsPDF and html2canvas
- **Data Analysis**: Advanced algorithms
- **Build Tool**: Vite
- **Package Management**: npm

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm (usually comes with Node.js)
- A modern web browser (Chrome, Firefox, Edge, Safari)

## Installation

1. Clone the repository or download the project files
2. Navigate to the project directory:
   ```bash
   cd chemical-equipment-parameter-visualizer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Create a `.env.local` file in the project root for environment configuration
   
2. Start the development server:
   ```bash
   npm run dev
   ```
   
3. Open your browser and navigate to `http://localhost:3000` (or the port shown in the terminal)

## Usage Guide

### 1. Login
- Access the application through your web browser
- Use any username and password to log in (demo credentials for demonstration)

### 2. Upload Data
- Click "Select File" to choose a CSV file from your computer
- Alternatively, click "Load Sample Data" to use pre-loaded demonstration data
- The application will automatically parse and analyze the data

### 3. Dashboard Analysis
- View key metrics in the summary cards at the top
- Examine the area chart showing flowrate and pressure trends
- Review the pie chart displaying equipment type distribution
- Check the data quality score and anomaly count

### 4. AI Insights
- The system automatically generates AI-powered analysis
- View the executive summary and equipment classification
- Assess safety risks based on parameter data

### 5. Report Generation
- Click "Download Report" to view the full analysis report
- Use "Print View" to preview the report before printing
- Click "Download PDF" to save the report as a PDF file

## Project Structure

```
chemical-equipment-parameter-visualizer/
├── components/
│   ├── Icons.tsx          # Custom SVG icons
│   └── StatsCard.tsx      # Reusable statistics card component
├── services/
│   ├── dataService.ts     # Data parsing and analysis functions
│   └── geminiService.ts   # Data analysis service
├── App.tsx                # Main application component
├── index.html             # HTML template with Tailwind CSS configuration
├── index.tsx              # React entry point
├── metadata.json          # Application metadata
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── types.ts               # TypeScript type definitions
└── vite.config.ts         # Vite build configuration
```

## Data Format

The application expects CSV files with the following columns:

| Column Name | Description | Data Type | Example |
|-------------|-------------|-----------|---------|
| equipment_id | Unique identifier for each equipment unit | String | EQ-001 |
| type | Equipment type/category | String | Reactor, Pump, Valve |
| flowrate | Flow rate measurement | Number | 125.4 |
| pressure | Pressure measurement | Number | 45.2 |
| temperature | Temperature measurement | Number | 85.7 |
| status | Operational status | String | Normal, Warning, Critical |

### Sample Data
```csv
equipment_id,type,flowrate,pressure,temperature,status
EQ-001,Reactor,125.4,45.2,85.7,Normal
EQ-002,Pump,68.3,22.1,72.4,Normal
EQ-003,Valve,0.0,15.7,68.9,Warning
```

## AI Integration

The application provides advanced data analysis capabilities:

### Setup
1. Configure your environment variables in `.env.local`
2. Add the key to your `.env.local` file as `API_KEY=your_key_here`

### Features
- Automated executive summaries
- Equipment batch classification
- Safety risk assessment
- Performance trend analysis

### Fallback Mode
If no API key is provided, the application will use mock responses to demonstrate functionality.

## Report Generation

### Print View
- Click "Print View" to see a printer-friendly version of the report
- All charts and data are formatted for optimal printing
- Use your browser's print function to save as PDF

### PDF Export
- Click "Download PDF" to automatically generate and download a PDF
- The PDF contains all report data in a professional format
- Charts and tables are preserved with high quality

### Report Sections
1. **Executive Summary**: AI-generated analysis of equipment performance
2. **Key Metrics**: Summary of flowrate, pressure, temperature, and anomalies
3. **Visual Trends**: Interactive charts showing parameter trends
4. **Equipment Composition**: Pie chart and table of equipment types
5. **Data Snapshot**: Detailed view of the first 20 equipment records

## Customization

### Styling
- The application uses Tailwind CSS for styling
- Custom colors and themes can be modified in `index.html`
- Responsive design works on mobile, tablet, and desktop

### Chart Configuration
- Chart appearance can be customized in `App.tsx`
- Colors, fonts, and layouts are defined in the chart components
- Additional chart types can be added using Recharts

### AI Prompts
- The AI analysis prompt can be modified in `services/geminiService.ts`
- Customize the analysis focus by editing the prompt template

## Troubleshooting

### Common Issues

#### Blank PDF Generation
- Ensure all content is fully loaded before generating PDF
- Check browser console for JavaScript errors
- Try using the Print View option and saving as PDF manually

#### Charts Not Displaying
- Verify data format matches expected CSV structure
- Check browser console for parsing errors
- Ensure all required columns are present in the CSV

#### AI Analysis Not Working
- Verify API key is correctly set in `.env.local`
- Check internet connection for API access
- Verify environment variables are correctly configured

### Browser Compatibility
- Best experienced in Chrome, Firefox, Edge, or Safari
- JavaScript must be enabled
- PDF generation works best in Chrome and Edge

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Please ensure your code follows the existing style and includes appropriate documentation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Chemical Equipment Parameter Visualizer - Analyze, Visualize, and Optimize Your Chemical Process Data*