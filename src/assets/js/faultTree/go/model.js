import mt from '../mt/mt'
const elementDefault = '#mySavedModel'

export default {
  modelFromJson: function (diagram, model, Model) {
    // console.log(arguments);
    switch (typeof (model)) {
      case 'string':
        diagram.model = go.Model.fromJson(model);
        break;
      case 'object':
        if (!Model) Model = go.GraphLinksModel;
        diagram.model = go.GraphObject.make(Model, model);
        break;
      case 'undefined':
        let element = mt.$(elementDefault);
        if (element) {
          diagram.model = go.Model.fromJson(element.value);
        }
        break;
      default:
        console.log(model);
        return;
    }
    diagram.initialPosition = go.Point.parse(diagram.model.modelData.position);// load position
    return diagram
  },
  iniModelFromJson: function (diagram, model, Model) {
    return this.modelFromJson(diagram, model, Model)
  },
  setModelFromJson: function (diagram, model, Model) {
    // console.log(arguments);
    // FIXME Change not within a transaction: !d isTreeLeaf: 6 old: false new: true
    // diagram.startTransaction('setModelFromJson');
    this.modelFromJson(diagram, model, Model);
    // diagram.commitTransaction('setModelFromJson');
  },
  getModelToJson: function (diagram) {
    diagram.isModified = false;
    diagram.model.modelData.position = go.Point.stringify(diagram.position);// save position
    console.log(diagram);
    return diagram.modelJson();
  }
}
