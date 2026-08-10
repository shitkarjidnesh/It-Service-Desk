# Database Models Schema

This file outlines the Mongoose schemas used in the IT Service Management backend, detailing the fields, data types, and options for each model.

## ActivityLog
- `actorId`: ObjectId (ref: actorModel)
- `actorRole`: String (enum: ["user", "technician", "admin", "system"])
- `actorModel`: String (enum: ["User", "Technician", "Admin"])
- `action`: String
- `entityType`: String (enum: ["ticket", "user", "technician", "admin", "category", "department"])
- `entityId`: ObjectId (ref: entityModel)
- `entityModel`: String (enum: ["Ticket", "User", "Technician", "Admin", "Category", "Department"])
- `description`: String
- `changes`: 
  - `before`: Mixed
  - `after`: Mixed
- `ipAddress`: String
- `userAgent`: String
- `createdAt`: Date

## Admin
- `adminId`: String (unique)
- `name`: String
- `email`: String (unique)
- `password`: String
- `phone`: String
- `role`: String (enum: ["admin", "super_admin"], default: "admin")
- `permissions`: [String]
- `accountStatus`: String (enum: ["active", "inactive", "blocked"], default: "active")
- `twoFactorEnabled`: Boolean
- `lastLoginAt`: Date
- `createdBy`: ObjectId (ref: Admin)
- `timestamps` (`createdAt`, `updatedAt`): Date

## Category
- `name`: String (unique)
- `description`: String
- `subcategories`: [{ name: String }]
- `assignedTeamId`: ObjectId (ref: Team)
- `isActive`: Boolean (default: true)
- `createdBy`: ObjectId (ref: Admin)
- `timestamps` (`createdAt`, `updatedAt`): Date

## Comment
- `ticketId`: ObjectId (ref: Ticket)
- `authorId`: ObjectId (ref: authorModel)
- `authorRole`: String (enum: ["user", "technician", "admin"])
- `authorModel`: String (enum: ["User", "Technician", "Admin"])
- `message`: String
- `commentType`: String (enum: ["public", "internal"], default: "public")
- `attachments`: [{ fileName: String, fileUrl: String, fileType: String }]
- `isEdited`: Boolean (default: false)
- `editedAt`: Date
- `timestamps` (`createdAt`, `updatedAt`): Date

## Counter
- `_id`: String
- `sequence`: Number (default: 0)

## Department
- `name`: String (unique)
- `code`: String (unique)
- `description`: String
- `managerName`: String
- `isActive`: Boolean (default: true)
- `timestamps` (`createdAt`, `updatedAt`): Date

## Notification
- `recipientId`: ObjectId (ref: recipientModel)
- `recipientRole`: String (enum: ["user", "technician", "admin"])
- `recipientModel`: String (enum: ["User", "Technician", "Admin"])
- `type`: String (enum: ["ticket_created", "ticket_assigned", "status_changed", "new_comment", "ticket_resolved", "ticket_reopened", "sla_warning", "sla_breached", "announcement"])
- `title`: String
- `message`: String
- `relatedTicketId`: ObjectId (ref: Ticket)
- `isRead`: Boolean (default: false)
- `readAt`: Date
- `createdAt`: Date

## Technician
- `technicianId`: String (unique)
- `name`: String
- `email`: String (unique)
- `password`: String
- `phone`: String
- `departmentId`: ObjectId (ref: Department)
- `teamId`: ObjectId (ref: Team)
- `specializations`: [String]
- `assignedCategories`: [ObjectId (ref: Category)]
- `role`: String (enum: ["technician"], default: "technician")
- `availabilityStatus`: String (enum: ["available", "busy", "offline", "on_leave"], default: "available")
- `accountStatus`: String (enum: ["active", "inactive", "blocked"], default: "active")
- `currentTicketCount`: Number (default: 0)
- `profileImage`: String
- `lastLoginAt`: Date
- `createdBy`: ObjectId (ref: Admin)
- `timestamps` (`createdAt`, `updatedAt`): Date

## Ticket
- `ticketId`: String (unique)
- `title`: String
- `description`: String
- `createdBy`: ObjectId (ref: User)
- `categoryId`: ObjectId (ref: Category)
- `subcategoryId`: ObjectId
- `departmentId`: ObjectId (ref: Department)
- `affectedItem`: String
- `impact`: String (enum: ["low", "medium", "high", "critical"], default: "medium")
- `urgency`: String (enum: ["low", "medium", "high", "critical"], default: "medium")
- `priority`: String (enum: ["low", "medium", "high", "critical"], default: "medium")
- `status`: String (enum: ["submitted", "acknowledged", "assigned", "in_progress", "waiting_for_user", "on_hold", "resolved", "closed", "reopened", "cancelled"], default: "submitted")
- `assignedTo`: ObjectId (ref: Technician)
- `assignedBy`: ObjectId (ref: Admin)
- `attachments`: [{ fileName: String, fileUrl: String, fileType: String, uploadedAt: Date }]
- `location`: String
- `resolution`: { summary: String, rootCause: String, workPerformed: String, resolvedBy: ObjectId (ref: Technician), resolvedAt: Date }
- `sla`: { responseDueAt: Date, resolutionDueAt: Date, firstRespondedAt: Date, responseBreached: Boolean, resolutionBreached: Boolean }
- `closedAt`: Date
- `timestamps` (`createdAt`, `updatedAt`): Date

## User
- `userId`: String (unique)
- `employeeId`: String (unique)
- `name`: String
- `email`: String (unique)
- `password`: String
- `phone`: String
- `departmentId`: ObjectId (ref: Department)
- `designation`: String
- `location`: String
- `role`: String (enum: ["user"], default: "user")
- `accountStatus`: String (enum: ["active", "inactive", "blocked"], default: "active")
- `profileImage`: String
- `notificationPreferences`: { email: Boolean, inApp: Boolean }
- `lastLoginAt`: Date
- `createdBy`: ObjectId (ref: Admin)
- `timestamps` (`createdAt`, `updatedAt`): Date
