import { employees, addEmployee } from '@/lib/mock-data';
import { Employee } from '@/types';

export function getAllEmployees(): Employee[] {
  return Array.from(employees.values());
}

export function createEmployee(
  data: Omit<Employee, 'id' | 'employeeId' | 'createdAt' | 'updatedAt'>
): Employee {
  return addEmployee(data);
}
