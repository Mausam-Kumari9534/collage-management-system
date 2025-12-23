import { BookOpen, CheckCircle, Plus, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  id: string;
  title: string;
  description?: string | null;
  isEnrolled?: boolean;
  onEnroll?: () => void;
  onUnenroll?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  showActions?: boolean;
  showAdminActions?: boolean;
  loading?: boolean;
}

export const CourseCard = ({
  id,
  title,
  description,
  isEnrolled,
  onEnroll,
  onUnenroll,
  onDelete,
  onView,
  showActions = true,
  showAdminActions = false,
  loading,
}: CourseCardProps) => {
  return (
    <div className="cyber-card group animate-slide-up">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${isEnrolled ? 'bg-neon-green/20 text-neon-green' : 'bg-primary/20 text-primary'}`}>
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Admin Actions */}
      {showAdminActions && (
        <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View & Upload
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      {/* Student Actions */}
      {showActions && !showAdminActions && (
        <div className="mt-4 pt-4 border-t border-border/50">
          {isEnrolled ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-neon-green text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Enrolled
                </span>
                {onUnenroll && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onUnenroll}
                    disabled={loading}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    Unenroll
                  </Button>
                )}
              </div>
              {onView && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onView}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Content
                </Button>
              )}
            </div>
          ) : (
            onEnroll && (
              <Button
                onClick={onEnroll}
                disabled={loading}
                className="cyber-button w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Enroll Now
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
};
