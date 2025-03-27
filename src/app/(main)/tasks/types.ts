export type User = {
    id: string
    name: string
    email: string
    roleId: string
    createdAt: string
    updatedAt: string
  }
  
  export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    WAITING_APPROVAL = "WAITING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
  }
  
  export type TaskLabel = 'BUG' | 'FEATURE' | 'URGENT' | 'IMPROVEMENT' | null
  
  export type Task = {
    id: string
    title: string
    description: string | null
    status: TaskStatus
    label: TaskLabel
    assignedTo: User
    createdBy: User
    createdAt: string
    updatedAt: string
  }
  