import Counter from "../models/Counter.js";

/**
 * Reusable Custom ID Generator
 * @param {string} counterName - Name of the counter in the DB (e.g. 'user', 'technician')
 * @param {string} prefix - Custom ID prefix (e.g. 'USR', 'TEC')
 * @param {number} length - Number of padding zeros (default: 6)
 * @returns {Promise<string>} The generated custom ID
 */
export async function generateId(counterName, prefix, length = 6) {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      returnNewDocument: true,
      upsert: true,
    },
  );

  return `${prefix}-${String(counter.sequence).padStart(length, "0")}`;
}

/**
 * Ticket ID Generator with Year
 * @returns {Promise<string>} The generated custom Ticket ID (e.g. INC-2026-000001)
 */
export async function generateTicketId() {
  const year = new Date().getFullYear();

  const counter = await Counter.findByIdAndUpdate(
    `ticket-${year}`,
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      returnNewDocument: true,
      upsert: true,
    },
  );

  return `INC-${year}-${String(counter.sequence).padStart(6, "0")}`;
}
