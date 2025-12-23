import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCourseContents, CourseContent } from '@/hooks/useCourseContents';
import { CourseContentUpload } from './CourseContentUpload';
import { Video, FileText, Trash2, ExternalLink, Upload, Plus } from 'lucide-react';

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    description?: string | null;
  };
  isAdmin?: boolean;
}

export const CourseDetailsModal = ({
  isOpen,
  onClose,
  course,
  isAdmin = false,
}: CourseDetailsModalProps) => {
  const { contents, loading, uploadContent, deleteContent } = useCourseContents(course.id);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const videos = contents.filter(c => c.content_type === 'video');
  const notes = contents.filter(c => c.content_type === 'notes');

  const handleUpload = async (file: File, contentType: 'video' | 'notes', title: string) => {
    await uploadContent(file, contentType, title);
  };

  const handleDelete = async (content: CourseContent) => {
    await deleteContent(content.id, content.file_url, content.content_type);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gradient font-display text-2xl">
              {course.title}
            </DialogTitle>
            {course.description && (
              <p className="text-muted-foreground mt-2">{course.description}</p>
            )}
          </DialogHeader>

          {isAdmin && (
            <Button
              onClick={() => setShowUploadModal(true)}
              className="cyber-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Content
            </Button>
          )}

          <div className="space-y-6 mt-4">
            {/* Videos Section */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
                <Video className="w-5 h-5 text-primary" />
                Videos ({videos.length})
              </h3>
              {videos.length === 0 ? (
                <p className="text-muted-foreground text-sm p-4 border border-dashed border-border rounded-lg text-center">
                  No videos uploaded yet
                </p>
              ) : (
                <div className="space-y-2">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Video className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-foreground truncate">{video.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(video.file_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(video)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
                <FileText className="w-5 h-5 text-accent" />
                Notes ({notes.length})
              </h3>
              {notes.length === 0 ? (
                <p className="text-muted-foreground text-sm p-4 border border-dashed border-border rounded-lg text-center">
                  No notes uploaded yet
                </p>
              ) : (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-foreground truncate">{note.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(note.file_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(note)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CourseContentUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        courseTitle={course.title}
      />
    </>
  );
};
