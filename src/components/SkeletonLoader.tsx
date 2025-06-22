
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'detail';
  count?: number;
}

export const SkeletonLoader = ({ variant = 'card', count = 1 }: SkeletonLoaderProps) => {
  const skeletons = Array.from({ length: count }, (_, index) => {
    switch (variant) {
      case 'card':
        return (
          <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3">
            <Skeleton className="h-48 w-full rounded-lg bg-gray-800" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 bg-gray-800" />
              <Skeleton className="h-4 w-1/2 bg-gray-800" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-4 w-16 bg-gray-800" />
              <Skeleton className="h-4 w-16 bg-gray-800" />
              <Skeleton className="h-4 w-16 bg-gray-800" />
            </div>
          </div>
        );

      case 'list':
        return (
          <div key={index} className="flex gap-4 p-4 bg-gray-900 border border-gray-800 rounded-lg">
            <Skeleton className="h-16 w-16 rounded-lg bg-gray-800" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4 bg-gray-800" />
              <Skeleton className="h-4 w-1/2 bg-gray-800" />
              <Skeleton className="h-4 w-1/4 bg-gray-800" />
            </div>
          </div>
        );

      case 'detail':
        return (
          <div key={index} className="space-y-6">
            <Skeleton className="h-80 w-full rounded-lg bg-gray-800" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 bg-gray-800" />
              <Skeleton className="h-6 w-1/2 bg-gray-800" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-20 bg-gray-800" />
                <Skeleton className="h-12 w-20 bg-gray-800" />
                <Skeleton className="h-12 w-20 bg-gray-800" />
              </div>
              <Skeleton className="h-24 w-full bg-gray-800" />
            </div>
          </div>
        );

      default:
        return null;
    }
  });

  return <>{skeletons}</>;
};
