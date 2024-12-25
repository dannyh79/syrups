import { type Employee } from '@/lib/db/schema/employees';
import {
  type PerformanceReview,
  type CompletePerformanceReview,
} from '@/lib/db/schema/performanceReviews';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<PerformanceReview>) => void;

export const useOptimisticPerformanceReviews = (
  performanceReviews: CompletePerformanceReview[],
  employees: Employee[],
) => {
  const [optimisticPerformanceReviews, addOptimisticPerformanceReview] = useOptimistic(
    performanceReviews,
    (
      currentState: CompletePerformanceReview[],
      action: OptimisticAction<PerformanceReview>,
    ): CompletePerformanceReview[] => {
      const { data } = action;

      const employeeMap = new Map(employees.map((employee) => [employee.id, employee]));
      const employee = employeeMap.get(data.employeeId)!;
      const assignee = employeeMap.get(data.assigneeId)!;

      const optimisticEmployee = {
        ...employee,
        lastName: employee.lastName ?? null,
        role: employee.role ?? null,
      };
      const optimisticAssignee = {
        ...assignee,
        lastName: employee.lastName ?? null,
        role: employee.role ?? null,
      };

      const optimisticPerformanceReview = {
        ...data,
        submittedAt: data.submittedAt ?? null,
        feedback: data.feedback ?? null,
        employee: optimisticEmployee,
        assignee: optimisticAssignee,
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticPerformanceReview]
            : [...currentState, optimisticPerformanceReview];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticPerformanceReview } : item,
          );
        case 'delete':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: 'delete' } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticPerformanceReview, optimisticPerformanceReviews };
};
