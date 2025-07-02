
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface AIAnalysisResult {
  reasoning: string;
  confidence: number;
  recommendation: 'approve' | 'reject' | 'review';
  analysisTimestamp: string;
}

interface ImageAnalysisState {
  [imageType: string]: {
    isAnalyzing: boolean;
    result?: AIAnalysisResult;
    error?: string;
  };
}

export const useImageAIAnalysis = () => {
  const [analysisState, setAnalysisState] = useState<ImageAnalysisState>({});
  const { toast } = useToast();

  const analyzeImage = async (imageType: string, imageUrl: string): Promise<AIAnalysisResult | null> => {
    setAnalysisState(prev => ({
      ...prev,
      [imageType]: { isAnalyzing: true }
    }));

    try {
      console.log(`Starting AI analysis for ${imageType} image:`, imageUrl);
      
      // Simulate AI analysis with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      // Mock AI analysis results based on image type
      const mockResults: { [key: string]: AIAnalysisResult } = {
        before: {
          reasoning: "Image shows clear pre-work conditions. Electrical equipment is visible and properly positioned. Safety barriers are in place. Good lighting and angle provide comprehensive view of the work area. Image quality is sufficient for documentation purposes.",
          confidence: 0.92,
          recommendation: 'approve',
          analysisTimestamp: new Date().toISOString()
        },
        during: {
          reasoning: "Work in progress image captures active installation phase. Personnel are visible wearing appropriate PPE. Tools and equipment are properly positioned. However, some cable management could be improved for better visibility of connections.",
          confidence: 0.78,
          recommendation: 'review',
          analysisTimestamp: new Date().toISOString()
        },
        after: {
          reasoning: "Completed work shows professional installation. All connections are secure and properly terminated. Work area is clean and organized. Equipment labeling is clearly visible. Documentation requirements are fully met.",
          confidence: 0.95,
          recommendation: 'approve',
          analysisTimestamp: new Date().toISOString()
        }
      };

      const result = mockResults[imageType] || {
        reasoning: "AI analysis completed. Image shows standard work documentation with acceptable quality and content.",
        confidence: 0.85,
        recommendation: 'approve' as const,
        analysisTimestamp: new Date().toISOString()
      };

      setAnalysisState(prev => ({
        ...prev,
        [imageType]: { 
          isAnalyzing: false, 
          result 
        }
      }));

      toast({
        title: "AI Analysis Complete",
        description: `Analysis completed for ${imageType} image with ${Math.round(result.confidence * 100)}% confidence.`,
      });

      console.log(`AI analysis result for ${imageType}:`, result);
      return result;
      
    } catch (error) {
      console.error(`Error analyzing ${imageType} image:`, error);
      const errorMessage = `Failed to analyze ${imageType} image. Please try again.`;
      
      setAnalysisState(prev => ({
        ...prev,
        [imageType]: { 
          isAnalyzing: false, 
          error: errorMessage 
        }
      }));

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  };

  const getAnalysisForType = (imageType: string) => {
    return analysisState[imageType];
  };

  const clearAnalysis = (imageType: string) => {
    setAnalysisState(prev => {
      const newState = { ...prev };
      delete newState[imageType];
      return newState;
    });
  };

  return {
    analyzeImage,
    getAnalysisForType,
    clearAnalysis,
    analysisState
  };
};
