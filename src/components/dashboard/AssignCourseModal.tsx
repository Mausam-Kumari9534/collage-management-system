import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStudentAssignments } from '@/hooks/useStudentAssignments';
import { useCourses } from '@/hooks/useCourses';
import { UserPlus, Check, X } from 'lucide-react';

interface AssignCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssignCourseModal = ({ isOpen, onClose }: AssignCourseModalProps) => {
  const { studentProfiles, assignCourse, unassignCourse, isAssigned, getAssignmentId, loading } = useStudentAssignments();
  const { courses } = useCourses();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const handleToggleAssignment = async (studentId: string, courseId: string) => {
    if (isAssigned(studentId, courseId)) {
      const assignmentId = getAssignmentId(studentId, courseId);
      if (assignmentId) {
        await unassignCourse(assignmentId);
      }
    } else {
      await assignCourse(studentId, courseId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-gradient font-display text-xl flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            Assign Courses to Students
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden gap-4">
          {/* Students List */}
          <div className="w-1/3 border-r border-border pr-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Students
            </h3>
            {studentProfiles.length === 0 ? (
              <p className="text-muted-foreground text-sm">No students found</p>
            ) : (
              <div className="space-y-2">
                {studentProfiles.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedStudent === student.id
                        ? 'bg-primary/20 border border-primary'
                        : 'bg-muted/30 border border-transparent hover:bg-muted/50'
                    }`}
                  >
                    <div className="font-medium text-foreground truncate">
                      {student.name || 'Unnamed'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {student.email}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Courses Assignment */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Courses
            </h3>
            {!selectedStudent ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Select a student to assign courses
              </p>
            ) : courses.length === 0 ? (
              <p className="text-muted-foreground text-sm">No courses available</p>
            ) : (
              <div className="space-y-2">
                {courses.map((course) => {
                  const assigned = isAssigned(selectedStudent, course.id);
                  return (
                    <div
                      key={course.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        assigned
                          ? 'bg-neon-green/10 border-neon-green/50'
                          : 'bg-muted/30 border-border'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">
                          {course.title}
                        </div>
                        {course.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {course.description}
                          </div>
                        )}
                      </div>
                      <Button
                        variant={assigned ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleAssignment(selectedStudent, course.id)}
                        disabled={loading}
                        className={assigned ? 'bg-neon-green text-background hover:bg-neon-green/80' : ''}
                      >
                        {assigned ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Assigned
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-1" />
                            Assign
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
