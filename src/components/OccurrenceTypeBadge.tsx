
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { OccurrenceType } from '@/types/occurrence';
import { cn } from '@/lib/utils';

interface OccurrenceTypeBadgeProps {
  type: OccurrenceType;
  className?: string;
}

const OccurrenceTypeBadge: React.FC<OccurrenceTypeBadgeProps> = ({ type, className }) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'damage':
        return {
          label: 'Avaria',
          className: 'bg-yellow-500 hover:bg-yellow-600',
        };
      case 'loss':
        return {
          label: 'Extravio',
          className: 'bg-red-500 hover:bg-red-600',
        };
      case 'refused':
        return {
          label: 'Recusa',
          className: 'bg-orange-500 hover:bg-orange-600',
        };
      case 'other':
        return {
          label: 'Outro',
          className: 'bg-blue-500 hover:bg-blue-600',
        };
      default:
        return {
          label: type,
          className: 'bg-gray-500 hover:bg-gray-600',
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};

export default OccurrenceTypeBadge;
