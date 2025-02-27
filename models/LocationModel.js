const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class LocationModel {
  async getDeviceLocation(deviceId) {
    try {
      const locations = await prisma.location.findMany({
        where: { deviceId },
        orderBy: { timestamp: "desc" },
      });
      return locations;
    } catch (error) {
      console.log("error from getDeviceLocation function", error);
    }
  }

  async addDeviceLocation(deviceIp, latitude, longitude) {
    try {
      // Store in database
      const res = await prisma.location.create({
        data: { deviceIp, latitude, longitude },
      });
      return res;
    } catch (error) {
      console.log("error from addDeviceLocation function", error);
    }
  }
}

module.exports = LocationModel;
