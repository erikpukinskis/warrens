var library = require("module-library")(require)

module.exports = library.export(
  "critter",
  [library.ref(), "web-element", "bridge-module"],
  function(lib, element, bridgeModule) {

    var critter = element.template(
      "canvas.critter",
      element.style({
        "position": "absolute",
        "background": "rgba(0,0,0,0.05)",
        "border": "none"}),
      function(bridge, globs, canvasId, width, height) {

        this.addAttribute(
          "id",
          canvasId)

        var scene = bridge.defineSingleton(
          'scene',[
          bridgeModule(
            lib,
            "./shader",
            bridge)],
          function critterScene(ShaderScene) {
            return new ShaderScene()})

        bridge.domReady([
          scene,
          canvasId],
          function critterInit(scene, canvasId) {
            var canvas = document.getElementById(
              canvasId)
            scene.init(
              canvas)})

        this.addAttributes({
          "width": width+"px",
          "height": height+"px"})

        this.__addGlobBinding = defineOn(bridge).withArgs(globs, scene)

        bridge.domReady([
          canvasId,
          scene],
          function initScene(critterCanvasId, scene) {
            var canvas = document.getElementById(
              critterCanvasId)
            scene.init(
              canvas)
            scene.setVisible(true)})})

    function defineOn(bridge) {
      var addGlobBinding = bridge.remember("critter")
      if (addGlobBinding) return addGlobBinding

      bridge.addToHead(
        element.stylesheet(
          critter))

      addGlobBinding = bridge.defineFunction(
        function addGlob(globs, scene, glob) {
          globs.push(glob)
          var points = globs.getAllPixels()
          scene.bufferPoints(points)
          scene.draw()})

      bridge.see(
        "critter",
        addGlobBinding)

      return addGlobBinding
    }

    function getAddGlobBinding(critterElement) {
      return critterElement.__addGlobBinding
    }

    critter.getAddGlobBinding = getAddGlobBinding
    critter.defineOn = defineOn

    return critter
  }
)
