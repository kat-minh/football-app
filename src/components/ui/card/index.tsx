import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '../../../utils/cn';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <View
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100 p-4',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
};

export const CardHeader = ({ children, className, ...props }: CardProps) => {
  return (
    <View className={cn('mb-4 pb-2 border-b border-gray-100', className)} {...props}>
      {children}
    </View>
  );
};

export const CardContent = ({ children, className, ...props }: CardProps) => {
  return (
    <View className={cn('', className)} {...props}>
      {children}
    </View>
  );
};

export const CardFooter = ({ children, className, ...props }: CardProps) => {
  return (
    <View className={cn('mt-3 pt-3 border-t border-gray-100', className)} {...props}>
      {children}
    </View>
  );
};
