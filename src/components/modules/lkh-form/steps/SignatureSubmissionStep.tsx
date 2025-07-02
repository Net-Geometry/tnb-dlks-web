
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PenTool, RotateCcw } from 'lucide-react';

interface SignatureData {
  fullName: string;
  position: string;
  date: string;
  remarks: string;
  signatureData: string;
}

interface SignatureSubmissionStepProps {
  data: SignatureData;
  onChange: (data: Partial<SignatureData>) => void;
}

const SignatureSubmissionStep: React.FC<SignatureSubmissionStepProps> = ({ data, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 150;

    // Configure drawing context
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load existing signature if available
    if (data.signatureData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = data.signatureData;
    }
  }, [data.signatureData]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL();
      onChange({ signatureData });
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onChange({ signatureData: '' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600">
            Signature & Submission
          </CardTitle>
          <p className="text-sm text-gray-600">
            Complete your personal details and sign to submit the LKH
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={data.fullName}
                onChange={(e) => onChange({ fullName: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={data.position}
                onChange={(e) => onChange({ position: e.target.value })}
                placeholder="Enter your position/role"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className="bg-gray-50"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Additional Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              value={data.remarks}
              onChange={(e) => onChange({ remarks: e.target.value })}
              placeholder="Any additional comments or remarks"
              rows={3}
            />
          </div>

          {/* Signature Section */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-blue-600" />
                  Digital Signature *
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSignature}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <canvas
                  ref={canvasRef}
                  className="w-full border border-gray-300 rounded-lg cursor-crosshair bg-white"
                  style={{ height: '150px' }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <p className="text-xs text-gray-500">
                  Draw your signature in the box above using your mouse or touch device
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submission Declaration */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Submission Declaration</h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              By submitting this LKH (Laporan Kemajuan Hasil), I certify that all information 
              provided is accurate and complete. I understand that any false information may 
              result in disciplinary action. This submission represents the actual work 
              performed and progress made.
            </p>
          </div>

          {/* Validation Messages */}
          <div className="space-y-2">
            {!data.fullName && (
              <p className="text-sm text-red-600">• Full name is required</p>
            )}
            {!data.position && (
              <p className="text-sm text-red-600">• Position is required</p>
            )}
            {!data.signatureData && (
              <p className="text-sm text-red-600">• Digital signature is required</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignatureSubmissionStep;
