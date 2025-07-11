import { PrismaClient } from '@prisma/client';

// Nigeria timezone constant
const NIGERIA_TIMEZONE = 'Africa/Lagos';

// Create a singleton instance of PrismaClient
const prisma = new PrismaClient();

// Export the singleton instance
export default prisma;
