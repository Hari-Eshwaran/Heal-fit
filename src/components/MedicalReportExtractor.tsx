import React, { useState } from 'react';
import { FileText, Upload, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyBTuhevuFKGRA4ZFZiHTJJz0kunCnC72Es");

interface ExtractedMedicalInfo {
  patientName: string;
  ageGender: string;
  dob: string;
  mrn: string;
  dateOfVisit: string;
  physician: string;
  chiefComplaint: string;
  vitals: string;
  diagnosis: string;
  plan: string;
}

// Mock medical data
const mockMedicalData: ExtractedMedicalInfo = {
  patientName: "John Smith",
  ageGender: "45/Male",
  dob: "1979-03-15",
  mrn: "MRN123456",
  dateOfVisit: "2024-03-15",
  physician: "Dr. Sarah Johnson",
  chiefComplaint: "Persistent cough and mild fever for 3 days",
  vitals: "BP: 120/80, HR: 72, Temp: 99.2°F, SpO2: 98%",
  diagnosis: "Upper Respiratory Tract Infection",
  plan: "1. Prescribed antibiotics for 5 days\n2. Rest and hydration\n3. Follow-up in 1 week if symptoms persist"
};

const MedicalReportExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedMedicalInfo>(mockMedicalData);
  const [suggestions, setSuggestions] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showMockData, setShowMockData] = useState(true);

  const extractMedicalInfo = async (text: string): Promise<ExtractedMedicalInfo> => {
    try {
      const patterns = {
        patientName: /Patient Name:\s*(.+)/i,
        ageGender: /Age\/Gender:\s*(.+)/i,
        dob: /DOB:\s*(\d{4}-\d{2}-\d{2})/i,
        mrn: /MRN(?:\s*\(Medical Record Number\))?:\s*([A-Z0-9]+)/i,
        dateOfVisit: /Date of (?:Visit|Note):\s*(\d{4}-\d{2}-\d{2})/i,
        physician: /(?:Provider|Attending Physician):\s*(.+)/i,
        chiefComplaint: /Chief Complaint:\s*(.+)/i,
        vitals: /Vital Signs:\s*([\s\S]+?)(?=\n\n|\n[A-Z])/i,
        diagnosis: /(?:Diagnosis|Assessment):\s*([\s\S]+?)(?=\n\n|\n[A-Z])/i,
        plan: /Plan:\s*([\s\S]+?)(?=\n\n|$)/i,
      };

      const extracted: Partial<ExtractedMedicalInfo> = {};
      
      Object.entries(patterns).forEach(([key, pattern]) => {
        const match = text.match(pattern);
        extracted[key as keyof ExtractedMedicalInfo] = match?.[1]?.trim() || 'Not found';
      });

      return extracted as ExtractedMedicalInfo;
    } catch (error) {
      console.error('Error extracting medical info:', error);
      return mockMedicalData;
    }
  };

  const getHealthSuggestions = async (data: ExtractedMedicalInfo) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Given this medical report data, provide health suggestions, lifestyle improvements, and follow-up actions:
        ${Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n')}
        
        Please provide clear, concise, and medically insightful recommendations in the following format:
        1. Key Health Insights
        2. Lifestyle Recommendations
        3. Follow-up Actions
        4. Preventive Measures`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating health suggestions:', error);
      return `
1. Key Health Insights
- Upper respiratory infection identified
- Vital signs are within normal range
- Early intervention is important

2. Lifestyle Recommendations
- Get adequate rest (8+ hours nightly)
- Stay hydrated with water and warm fluids
- Maintain good hand hygiene
- Use a humidifier if available

3. Follow-up Actions
- Complete full course of prescribed antibiotics
- Monitor temperature and symptoms
- Schedule follow-up if symptoms persist
- Keep track of any new symptoms

4. Preventive Measures
- Boost immune system with vitamin C
- Practice regular hand washing
- Avoid close contact with sick individuals
- Consider flu vaccination if not current`;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setShowMockData(false);
    } else {
      setError('Please upload a PDF file');
      setShowMockData(true);
      setExtractedData(mockMedicalData);
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setShowMockData(true);
      setExtractedData(mockMedicalData);
      const mockSuggestions = await getHealthSuggestions(mockMedicalData);
      setSuggestions(mockSuggestions);
      return;
    }

    setIsLoading(true);
    setError('');
    setShowMockData(false);

    try {
      const text = await file.text();
      const extracted = await extractMedicalInfo(text);
      setExtractedData(extracted);
      
      const aiSuggestions = await getHealthSuggestions(extracted);
      setSuggestions(aiSuggestions);
    } catch (err) {
      setError('Failed to process the medical report');
      setShowMockData(true);
      setExtractedData(mockMedicalData);
      const mockSuggestions = await getHealthSuggestions(mockMedicalData);
      setSuggestions(mockSuggestions);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8 text-center">
        <FileText className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Medical Report Extractor</h2>
        <p className="text-gray-600 mt-2">Upload a medical report PDF to extract information and get AI-powered health suggestions</p>
        {showMockData && (
          <p className="text-sm text-indigo-600 mt-2">
            Showing sample medical data. Upload a PDF to analyze your own report.
          </p>
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF files only</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </label>
        </div>
        {file && (
          <div className="mt-4 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <span className="text-sm text-gray-600">{file.name}</span>
            <button
              onClick={handleExtract}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                'Extract Data'
              )}
            </button>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="space-y-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Medical Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(extractedData).map(([key, value]) => (
              <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="mt-1 text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {suggestions && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Health Suggestions</h3>
            <div className="prose prose-indigo max-w-none">
              {suggestions.split('\n').map((line, index) => (
                <p key={index} className="mb-2">{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalReportExtractor;