/*
  Warnings:

  - You are about to drop the column `recurringDays` on the `schedules` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE `recurring_days` (
    `id` VARCHAR(191) NOT NULL,
    `scheduleId` VARCHAR(191) NOT NULL,
    `dayOfWeek` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `recurring_days_scheduleId_idx`(`scheduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recurring_days` ADD CONSTRAINT `recurring_days_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `schedules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing data from JSON field to the new table
INSERT INTO `recurring_days` (`id`, `scheduleId`, `dayOfWeek`, `createdAt`, `updatedAt`)
SELECT
    UUID(),
    `id`,
    JSON_EXTRACT(`recurringDays`, CONCAT('$[', numbers.n, ']')),
    NOW(),
    NOW()
FROM
    `schedules`,
    (
        SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL
        SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
    ) AS numbers
WHERE
    `isRecurring` = 1
    AND `recurringDays` IS NOT NULL
    AND JSON_EXTRACT(`recurringDays`, CONCAT('$[', numbers.n, ']')) IS NOT NULL;

-- DropColumn
ALTER TABLE `schedules` DROP COLUMN `recurringDays`;
