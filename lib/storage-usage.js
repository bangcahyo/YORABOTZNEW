const fs = require('fs');
const path = require('path');

function getDirectoryUsage(directory, largestLimit = 5) {
  const pending = [directory];
  const largestFiles = [];
  let bytes = 0;
  let files = 0;

  while (pending.length) {
    const currentDirectory = pending.pop();
    let entries;
    try {
      entries = fs.readdirSync(currentDirectory);
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }

    for (const name of entries) {
      const filePath = path.join(currentDirectory, name);
      let stat;
      try {
        stat = fs.lstatSync(filePath);
      } catch (error) {
        if (error.code === 'ENOENT') continue;
        throw error;
      }

      if (stat.isDirectory()) {
        pending.push(filePath);
      } else if (stat.isFile()) {
        bytes += stat.size;
        files++;
        largestFiles.push({
          path: path.relative(directory, filePath),
          bytes: stat.size,
        });
      }
    }
  }

  largestFiles.sort((a, b) => b.bytes - a.bytes);
  return { bytes, files, largestFiles: largestFiles.slice(0, largestLimit) };
}

function getFilesystemUsage(pathname) {
  const stats = fs.statfsSync(pathname);
  return {
    totalBytes: stats.blocks * stats.bsize,
    availableBytes: stats.bavail * stats.bsize,
  };
}

module.exports = { getDirectoryUsage, getFilesystemUsage };