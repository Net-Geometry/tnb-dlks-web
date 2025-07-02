
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface WorkLogItem {
  id: string;
  date: Date | undefined;
  taskDescription: string;
  actionTaken: string;
  notes: string;
}

interface WorkLogStepProps {
  data: WorkLogItem[];
  onChange: (data: WorkLogItem[]) => void;
}

const WorkLogStep: React.FC<WorkLogStepProps> = ({ data, onChange }) => {
  const addTask = () => {
    const newTask: WorkLogItem = {
      id: `task-${Date.now()}`,
      date: new Date(),
      taskDescription: '',
      actionTaken: '',
      notes: '',
    };
    onChange([...data, newTask]);
  };

  const updateTask = (id: string, updates: Partial<WorkLogItem>) => {
    onChange(data.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    onChange(data.filter(task => task.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-blue-600">
              Work Log - Manual Input
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Add details for each task performed today
            </p>
          </div>
          <Button onClick={addTask} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No tasks added yet</p>
              <p className="text-sm">Click "Add Task" to get started</p>
            </div>
          ) : (
            data.map((task, index) => (
              <Card key={task.id} className="border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <h4 className="font-medium">Task {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !task.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {task.date ? format(task.date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={task.date}
                            onSelect={(date) => updateTask(task.id, { date })}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`task-desc-${task.id}`}>Task Description</Label>
                      <Input
                        id={`task-desc-${task.id}`}
                        value={task.taskDescription}
                        onChange={(e) => updateTask(task.id, { taskDescription: e.target.value })}
                        placeholder="Describe the task performed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`action-taken-${task.id}`}>Action Taken</Label>
                    <Input
                      id={`action-taken-${task.id}`}
                      value={task.actionTaken}
                      onChange={(e) => updateTask(task.id, { actionTaken: e.target.value })}
                      placeholder="Describe the actions taken"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`notes-${task.id}`}>Notes / Comments (Optional)</Label>
                    <Textarea
                      id={`notes-${task.id}`}
                      value={task.notes}
                      onChange={(e) => updateTask(task.id, { notes: e.target.value })}
                      placeholder="Additional notes or comments"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkLogStep;
