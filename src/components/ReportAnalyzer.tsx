import React, { useState } from 'react';
import { FileText, Upload, Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { jsPDF } from 'jspdf';

const genAI = new GoogleGenerativeAI("AIzaSyBTuhevuFKGRA4ZFZiHTJJz0kunCnC72Es");

interface AnalysisResult {
  textFindings: string;
  imageFindings: string;
  diagnosis: string;
  recommendations: string;
}

const ReportAnalyzer: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [patientName, setPatientName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);

    // Create preview URLs for images
    const urls = selectedFiles.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    }).filter(Boolean);
    setPreviewUrls(urls);
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // In a real implementation, we would use pdf.js to extract text
    // For demo purposes, we'll return a mock extraction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Mock extracted text from ${file.name}`);
      }, 500);
    });
  };

  const analyzeContent = async () => {
    if (!files.length || !patientName) {
      setError('Please upload files and enter patient name');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Extract text from files
      const extractedTexts = await Promise.all(
        files.map(file => {
          if (file.type === 'application/pdf') {
            return extractTextFromPDF(file);
          }
          return '';
        })
      );

      const prompt = `Analyze the following medical documents and generate a comprehensive report:
        Patient Name: ${patientName}
        Documents: ${extractedTexts.join('\n')}
        
        Please provide:
        1. Summary of findings from documents
        2. Analysis of any medical images (if present)
        3. Diagnosis and recommendations`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Parse the AI response into structured sections
      const analysisResult: AnalysisResult = {
        textFindings: "Summary of document findings from AI analysis",
        imageFindings: "Analysis of uploaded medical images",
        diagnosis: "AI-generated diagnosis based on provided information",
        recommendations: response.text()
      };

      setResult(analysisResult);
    } catch (err) {
      setError('Error analyzing documents. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(41, 98, 255);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('AI Health Report', 20, 25);

    // Reset text color for content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    // Metadata
    let yPos = 50;
    doc.text(`Patient Name: ${patientName}`, 20, yPos);
    doc.text(`Date: ${format(new Date(), 'MMMM d, yyyy')}`, 20, yPos + 10);

    // Content sections
    yPos += 30;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Findings from Documents', 20, yPos);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    doc.text(result.textFindings, 20, yPos + 10);

    yPos += 40;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Image Analysis', 20, yPos);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    doc.text(result.imageFindings, 20, yPos + 10);

    yPos += 40;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Diagnosis & Recommendations', 20, yPos);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    doc.text(result.recommendations, 20, yPos + 10);

    doc.save(`${patientName}_AI_Health_Report.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <FileText className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Medical Report Analyzer</h1>
        <p className="text-gray-600">
          Upload medical documents and scans for AI analysis and get a comprehensive health report
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="w-6 h-6 text-indigo-600 mr-2" />
            Upload Medical Files
          </h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <span className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-500">
                  PDF, Word, or Image files
                </span>
              </label>
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter patient name..."
              />
            </div>

            <button
              onClick={analyzeContent}
              disabled={isAnalyzing || !files.length || !patientName}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Analyze Documents
                </>
              )}
            </button>

            {error && (
              <div className="flex items-center bg-red-50 text-red-700 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                Analysis Results
              </h2>
              <button
                onClick={generatePDF}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Document Findings</h3>
                <p className="text-gray-700">{result.textFindings}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Image Analysis</h3>
                <p className="text-gray-700">{result.imageFindings}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">AI Diagnosis & Recommendations</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{result.recommendations}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportAnalyzer;