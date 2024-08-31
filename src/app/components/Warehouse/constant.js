export const shelvesData2 = [];

// 定义区域
const regions = ["A", "B", "C"];
// 每个区域有6列，每列6个架子，每个架子3层
const maxCols = 6;
const maxShelvesPerCol = 6;
const maxLevelsPerShelf = 3;

// 生成货架数据
regions.forEach((region) => {
  for (let col = 1; col <= maxCols; col++) {
    for (let shelf = 1; shelf <= maxShelvesPerCol; shelf++) {
      for (let level = 1; level <= maxLevelsPerShelf; level++) {
        // 生成货架ID
        const shelfId = `${region}${col}-${shelf}-${level}`;
        const currentLoad = Math.floor(Math.random() * 10);
        const maxCapacity = 10; // 假设每个货架的最大容量为10
        let goodColor = "";
        if (currentLoad > maxCapacity - 2) {
          goodColor = "#FF4500";
        } else if (currentLoad <= 8 && currentLoad >= 6) {
          goodColor = "#FFA500";
        } else if (currentLoad < 6 && currentLoad > 3) {
          goodColor = "#6DAEDB";
        } else {
          goodColor = "#6DAEDB";
        }
        // 生成货架数据
        shelvesData2.push({
          region,
          col,
          shelfId,
          maxCapacity: 10, // 假设每个货架的最大容量为10
          currentLoad, // 随机生成当前存放数量
          color: goodColor,
        });
      }
    }
  }
});

// 转换为多维数组结构
export const structuredData = [];

regions.forEach((region) => {
  const regionData = {
    region,
    cols: [],
  };

  for (let col = 1; col <= maxCols; col++) {
    const colData = {
      col,
      shelves: [],
    };

    for (let shelf = 1; shelf <= maxShelvesPerCol; shelf++) {
      const shelfData = [];

      for (let level = 1; level <= maxLevelsPerShelf; level++) {
        const shelfId = `${region}${col}-${shelf}-${level}`;
        const shelfInfo = shelvesData2.find((item) => item.shelfId === shelfId);

        if (shelfInfo) {
          shelfData.push(shelfInfo);
        }
      }

      colData.shelves.push(shelfData);
    }

    regionData.cols.push(colData);
  }

  structuredData.push(regionData);
});
