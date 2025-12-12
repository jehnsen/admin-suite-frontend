// Central exports for all API services
export * from './auth.service';
export * from './personnel.service';
export * from './procurement.service';
export * from './inventory.service';
export * from './finance.service';

// Re-export singleton instances for convenience
export { authService } from './auth.service';
export { personnelService } from './personnel.service';
export { procurementService } from './procurement.service';
export { inventoryService } from './inventory.service';
export { financeService } from './finance.service';
