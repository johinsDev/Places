'use strict';

const _ = require('lodash')
const requireAll = require('require-all')
var fs = require('fs')
const debug = require('debug')('adonis:framework')

export default class Config {
  constructor (configPath) {
    this._configPath = configPath
    this._config = {}
    this.syncWithFileSystem();
  }

  syncWithFileSystem () {
    try {
      const files = fs.readdirSync(this._configPath);

      files.forEach((file) => {
        const name = this.filterFile(file);
        if (!name) return;
        this._config[name] = require('../../config/' + file);
      });

      debug('loaded all config files from %s', this._configPath)
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.log(error);
      }
    }
  }
  
  filterFile(filename) {
    const filter =  /(.*)\.js$/;
    if (typeof filter === 'function') {
      return filter(filename);
    }

    const match = filename.match(filter);
    if (!match) return;
      return match[1] || match[0];
  }

  get (key, defaultValue) {
    return _.get(this._config, key, defaultValue)
  }

  merge (key, defaultValues, customizer) {
    const value = this.get(key, {})
    return _.mergeWith(defaultValues, value, customizer)
  }
    
  set (key, value) {
    _.set(this._config, key, value)
  }
}


