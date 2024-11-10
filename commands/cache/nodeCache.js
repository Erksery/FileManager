const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

function setCache(key, value) {
  const success = cache.set(key, value);
  if (success) {
    //console.log(`Данные с ключом "${key}" добавлены в кэш`);
  } else {
    console.error(`Не удалось добавить данные в кэш`);
  }
}

function getCache(key) {
  const value = cache.get(key);
  if (value === undefined) {
    // console.log(`Данные с ключом "${key}" не найдены в кэше`);
    return null;
  } else {
    //console.log(`Данные с ключом "${key}" найдены в кэше`);
    return value;
  }
}

function deleteCache(key) {
  const success = cache.del(key);
  if (success > 0) {
    //console.log(`Данные с ключом "${key}" удалены из кэша`);
  } else {
    //console.log(`Ключ "${key}" не найден в кэше`);
  }
}

function flushCache() {
  cache.flushAll();
  //console.log("Кэш полностью очищен");
}

module.exports = { setCache, getCache, deleteCache, flushCache };
