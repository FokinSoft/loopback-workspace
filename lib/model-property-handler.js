'use strict';

const workspaceHandler = require('./workspace-handler');
const Model = require('./datamodel/model');
const ModelConfig = require('./datamodel/model-config');
const ModelProperty = require('./datamodel/model-property');
const ModelMethod = require('./datamodel/model-method');
const mixin = require('./util/mixin');
const fsUtility = require('./util/file-utility');

class ModelPropertyActions {
  create(modelId, cb) {
    const workspace = this.getWorkspace();
    const model = workspace.getModel(modelId);
    model.setProperty(this);
    fsUtility.writeModel(model, cb);
  }
}

mixin(ModelProperty.prototype, ModelPropertyActions.prototype);

class ModelMethodActions {
  create(modelId, cb) {
    const workspace = this.getWorkspace();
    const model = workspace.getModel(modelId);
    model.setMethod(this);
    fsUtility.writeModel(model, cb);
  }
}

mixin(ModelMethod.prototype, ModelMethodActions.prototype);