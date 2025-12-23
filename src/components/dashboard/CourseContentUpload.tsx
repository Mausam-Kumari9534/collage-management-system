import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Video, FileText, Upload, X } from 'lucide-react';

interface CourseContentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, contentType: 'video' | 'notes', title: string) => Promise<any>;
  courseTitle: string;
}

export const CourseContentUpload = ({
  isOpen,
  onClose,
  onUpload,
  courseTitle,
}: CourseContentUploadProps) => {
  const [contentType, setContentType] = useState<'video' | 'notes' | null>(null);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!title) {
        setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !contentType || !title.trim()) return;
    
    setLoading(true);
    await onUpload(file, contentType, title.trim());
    setLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setContentType(null);
    setTitle('');
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gradient font-display">
            Upload Content - {courseTitle}
          </DialogTitle>
        </DialogHeader>

        {!contentType ? (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Select the type of content you want to upload:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setContentType('video')}
                className="p-6 rounded-lg border-2 border-border bg-muted/50 hover:border-primary hover:bg-primary/10 transition-all flex flex-col items-center gap-3"
              >
                <Video className="w-10 h-10 text-primary" />
                <span className="font-medium text-foreground">Upload Video</span>
              </button>
              <button
                onClick={() => setContentType('notes')}
                className="p-6 rounded-lg border-2 border-border bg-muted/50 hover:border-accent hover:bg-accent/10 transition-all flex flex-col items-center gap-3"
              >
                <FileText className="w-10 h-10 text-accent" />
                <span className="font-medium text-foreground">Upload Notes</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {contentType === 'video' ? (
                  <Video className="w-5 h-5 text-primary" />
                ) : (
                  <FileText className="w-5 h-5 text-accent" />
                )}
                <span className="font-medium">
                  {contentType === 'video' ? 'Video' : 'Notes'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setContentType(null)}
              >
                Change
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter content title"
                className="cyber-input"
              />
            </div>

            <div className="space-y-2">
              <Label>File</Label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept={contentType === 'video' ? 'video/*' : '.pdf,.doc,.docx,.txt,.ppt,.pptx'}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50">
                  <span className="text-sm text-foreground truncate flex-1">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select File
                </Button>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || !title.trim() || loading}
                className="cyber-button flex-1"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
