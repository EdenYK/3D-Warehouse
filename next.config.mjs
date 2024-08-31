/** @type {import('next').NextConfig} */
import os from "os";

const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
};

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const ip = getLocalIPAddress();
      console.log(`Local IP: http://${ip}:10008`); // 打印IP地址
    }
    return config;
  },
};

export default nextConfig;
