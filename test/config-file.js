var async = require('async');
var APP_JSON = 'api/app.json';
var ConfigFile = require('../app').models.ConfigFile;
var assert = require('assert');
var testData;

describe('ConfigFile', function() {
  beforeEach(function(done) {
    testData = {hello: 'world'};
    ConfigFile.create({
      path: APP_JSON,
      data: testData
    }, done);
  });

  describe('ConfigFile.loadFromPath(path, cb)', function() {
    it('should load a config file at the given workspace relative path', function(done) {
      ConfigFile.loadFromPath(APP_JSON, function(err, configFile) {
        assertValidAppConfig(configFile);
        done();
      });
    });
  });

  describe('configFile.load(cb)', function() {
    it('should load the configFile data', function(done) {
      var configFile = new ConfigFile({
        path: APP_JSON
      });

      configFile.load(function(err) {
        assertValidAppConfig(configFile);
        done();
      });
    });
  });

  describe('configFile.exists(cb)', function() {
    it('should return true if the file exists', function(done) {
      var configFile = new ConfigFile({
        path: APP_JSON
      });

      configFile.exists(function(err, exists) {
        expect(exists).to.equal(true);
        done();
      });
    });
  });

  describe('configFile.save(cb)', function() {
    it('should save the configFile data', function(done) {
      var configFile = new ConfigFile({
        path: APP_JSON,
        data: {foo: 'bar'}
      });

      configFile.save(function(err) {
        if(err) return done(err);
        configFile.load(function(err) {
          if(err) return done(err);
          expect(configFile.data.foo).to.equal('bar');
          done();
        });
      });
    });
  });

  describe('configFile.remove(cb)', function() {
    it('should remove the configFile', function(done) {
      var configFile = new ConfigFile({
        path: APP_JSON,
        data: {foo: 'bar'}
      });

      configFile.remove(function(err) {
        if(err) return done(err);
        configFile.exists(function(err, exists) {
          if(err) return done(err);
          expect(exists).to.equal(false);
          done();
        });
      });
    });
  });

  describe('ConfigFile.find(cb)', function() {
    beforeEach(function(done) {
      var files = this.testFiles = [
        APP_JSON,
        'my-app/datasources.json',
        'my-app/models.json',
        'my-app/models/todo.json',
      ];

      files = files.map(function(file) {
        return {path: file}
      });

      async.each(files, ConfigFile.create, done);
    });
    it('should list all files in the workspace', function(done) {
      var testFiles = this.testFiles;
      ConfigFile.find(function(err, configFiles) {
        var fileNames = configFiles.map(function(configFile) {
          return configFile.path;
        });

        expect(fileNames.sort()).to.eql(testFiles.sort());
        done();
      });
    });
  });

  describe('configFile.getAppName()', function() {
    it('should be the name of the app', function() {
      
      expectAppForPath('my-app', 'my-app/datasource.json');
      expectAppForPath('my-app', 'my-app/models/todo.json');
      expectAppForPath(ConfigFile.ROOT_APP, 'app.json');

      function expectAppForPath(app, path) {
        var configFile = new ConfigFile({
          path: path
        });

        expect(configFile.getAppName()).to.equal(app);
      }
    });
  });

  describe('configFile.getDirName()', function() {
    it('should be the name of the app', function() {
      expectDirName('foo/bar/bat/baz.json', 'bat');
      expectDirName('baz.json', '.');

      function expectDirName(path, dir) {
        var configFile = new ConfigFile({
          path: path
        });

        expect(configFile.getDirName()).to.equal(dir);
      }
    });
  });

  describe('configFile.getExtension()', function() {
    it('should be the extension of the file at the given path', function() {
      var configFile = new ConfigFile({
        path: 'foo/bar.bat.baz.json'
      });
      expect(configFile.getExtension()).to.equal('.json');
    });
  });

  describe('ConfigFile.toAbsolutePath(relativePath)', function() {
    it('should resolve a relative workspace path to an absolute path', function() {
      var abs = ConfigFile.toAbsolutePath('.');
      expect(abs).to.equal(SANDBOX);
    });
  });
});

function assertValidAppConfig(configFile) {
  assertIsConfigFile(configFile);
  expect(configFile.data).to.eql(testData);
}

function assertIsConfigFile(configFile) {
  assert(configFile instanceof ConfigFile);
}