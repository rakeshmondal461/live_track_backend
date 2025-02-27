const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class DeviceModel {
  async addNewDevice(name, type, ip) {
    try {
      const chkData = await prisma.device.findFirst({
        where: {
          name: name,
          type: type,
          deviceIp: ip,
        },
      });

      if (chkData) return { message: "Already exist" };
      const newDevice = await prisma.device.create({
        data: { name, type, deviceIp: ip, status: "Online" },
      });
      return newDevice;
    } catch (error) {
      console.error("error from addNewDevice function", error);
    }
  }
  async getDevices() {
    try {
      const devices = await prisma.device.findMany();
      if (!devices) return [];
      return devices;
    } catch (error) {
      console.error("error from getDevices function", error);
    }
  }
}

module.exports = DeviceModel;
