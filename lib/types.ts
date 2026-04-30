export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  createdAt: string;
};

export type Vehicle = {
  id: string;
  plateNumber: string;
  normalizedPlateNumber: string;
  make: string;
  model: string;
  color: string;
  year?: number | null;
  customerId: string;
  customer?: Customer;
  orders?: ServiceOrder[];
  createdAt: string;
  updatedAt: string;
};

export type ServiceItem = {
  id: string;
  name: string;
  category: string;
  estimatedDurationMinutes: number;
  price: number;
  description: string;
};

export type ServicePackage = {
  id: string;
  name: string;
  category: string;
  description: string;
  estimatedDurationMinutes: number;
  basePrice: number;
  includedItemIds: string;
};

export type StatusLog = {
  id: string;
  serviceOrderId: string;
  fromStatus: string;
  toStatus: string;
  note?: string | null;
  changedBy: string;
  changedAt: string;
};

export type ServiceOrder = {
  id: string;
  orderNumber: string;
  vehicleId: string;
  customerId: string;
  selectedPackageId?: string | null;
  selectedItemIds: string;
  status: string;
  currentStep: string;
  progressPercentage: number;
  priority: string;
  assignedMechanic: string;
  bay?: string | null;
  odometer?: number | null;
  notes?: string | null;
  estimatedStartTime: string;
  estimatedFinishTime: string;
  actualStartTime?: string | null;
  actualFinishTime?: string | null;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  vehicle?: Vehicle;
  customer?: Customer;
  selectedPackage?: ServicePackage | null;
  statusLogs?: StatusLog[];
};
