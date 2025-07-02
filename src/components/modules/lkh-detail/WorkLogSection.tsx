
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';

interface WorkLogEntry {
  id: string;
  date: string;
  taskDescription: string;
  actionTaken: string;
  notes: string;
}

interface WorkLogSectionProps {
  workLog: WorkLogEntry[];
}

const WorkLogSection: React.FC<WorkLogSectionProps> = ({ workLog }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-green-600 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Work Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workLog.map((log, index) => (
            <div key={log.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Entry {index + 1}</p>
                  <p className="text-gray-900 font-semibold">{log.date}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Task Description</p>
                  <p className="text-gray-900">{log.taskDescription}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Action Taken</p>
                  <p className="text-gray-900">{log.actionTaken}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Notes</p>
                  <p className="text-gray-900">{log.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkLogSection;
