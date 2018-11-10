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
  prepareModel: function (diagram, model) {
    // console.log(arguments);
    diagram.weight = model.weight;
    delete model.weight;// Error: "Trying to set undefined property "weight" on object: GraphLinksModel"
    // console.log(diagram.weight);
    diagram.colors = model.colors;
    delete model.colors;// Error: "Trying to set undefined property "colors" on object: GraphLinksModel"
    // console.log(diagram.colors);
    let a = model.nodeDataArray;
    for (let i = 0; i < a.length; i++) {
      diagram.totalScore(a[i]);
    }
    return diagram
  },
  // 初始化流程图
  iniModelFromJson: function (diagram, model, Model) {
    let o1 = this.prepareModel(diagram, model)
    let o2 = this.modelFromJson(diagram, model, Model)
    let o = Object.assign(o1, o2)
    return o
  },
  setModelFromJson: function (diagram, model, Model) {
    let o1 = this.prepareModel(diagram, model)
    let o2 = this.modelFromJson(diagram, model, Model)
    let o = Object.assign(o1, o2)
    return o
  },
  getModelToJson: function (diagram) {
    diagram.isModified = false;
    diagram.model.modelData.position = go.Point.stringify(diagram.position);// save position
    console.log(diagram);
    return diagram.modelJson();
  }
}
