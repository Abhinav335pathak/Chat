const cron = require('node-cron');
const Status = require('../models/Status');
const cloudinary = require('../config/cloudinary');

// Run every hour to clean up expired statuses
const initStatusCleanup = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Find statuses older than 24 hours
      const expiredStatuses = await Status.find({
        createdAt: { $lt: twentyFourHoursAgo }
      });

      console.log(`[Status Cleanup] Found ${expiredStatuses.length} expired statuses`);

      // Delete each status from Cloudinary and DB
      for (const status of expiredStatuses) {
        try {
          // Delete from Cloudinary
          await cloudinary.uploader.destroy(status.publicId, {
            resource_type: status.type
          });

          // Delete from DB
          await Status.findByIdAndDelete(status._id);
          console.log(`[Status Cleanup] Deleted status ${status._id}`);
        } catch (error) {
          console.error(`[Status Cleanup Error] Failed to delete status ${status._id}:`, error.message);
        }
      }

      console.log(`[Status Cleanup] Completed. Removed ${expiredStatuses.length} statuses`);
    } catch (error) {
      console.error('[Status Cleanup Error]:', error.message);
    }
  });

  console.log('[Status Cleanup] Cron job initialized - runs every hour');
};

module.exports = { initStatusCleanup };
