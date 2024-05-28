/**
 * @fileoverview Common library for GSAP abstraction
 * about its dependencies.
 * @notes
 * - for animation methods:
 *    - methods return a timeline
 *    - methods take a timeline by reference
 * @package
 * @dependencies
 * (list gsap dependencies here)
 */
/**
 * Loads an SVG file from a specified URL and inserts it into the HTML element with the given target ID.
 * Also sets the position of the SVG using the GSAP library.
 *
 * @param {string} url The URL of the SVG file to load.
 * @param {string} target The ID of the HTML element where the SVG is to be inserted.
 * @param {number} x The x-coordinate to set for the SVG's position.
 * @param {number} y The y-coordinate to set for the SVG's position.
 */
function loadSVG(url, target, x, y) {
    fetch(url)
       .then((response) => response.text())
       .then((svg) => {
          document.getElementById(target).innerHTML = svg
          gsap.set(`#${target} svg`, { x: x, y: y })
       })
       .catch((error) => console.error("Error loading SVG:", error))
 }
 
 /**
 * @function openDoorLeft
 * @description
 * @param {string} timeline
 * @param {string} doorId
 * @returns
 * @example
 */
 function openDoorLeft(timeline, doorId) {
    timeline.to(doorId, {
       duration: 1.5,
       x: "0%",    // Keeps the left side fixed
       scaleX: 0, // Narrows down the door until it disappears
       transformOrigin: "left center",  // Keeps the left side as the pivot
       ease: "power2.out",
    })
 
 }
 
 /**
 * @function bringToFront
 * @description
 * @param {string} elementId
 * @returns
 * @example
 */
 function bringToFront(elementId) {
    var element = document.getElementById(elementId)
    element.parentNode.appendChild(element)
 }
 
 /**
 * @function switchLights
 * @description
 * @param {string} lights
 * @param {string} timeline
 * @param {string} delay
 * @returns
 * @example
 */
 function switchLights(lights, timeline, delay) {
    lights.forEach((light, index) => {
       timeline.to(
          light,
          {
             attr: { fill: "green" },
             duration: 0.5,
             ease: "none",
          },
          `+=${delay * index}`
       )
    })
 }
 
 /**
  * @function moveOnPath
  * @description
  * @param {string} timeline
  * @param {string}  id
  * @param {string}  path
  * @param {string}  duration
  * @param {string}  startWithPrevious = false
  * @returns
  * @example
  */
 function moveOnPath(timeline, id, path, duration, startWithPrevious = false) {
    const position = startWithPrevious ? "<" : "+=0"
 
    timeline.to(
       id,
       {
          motionPath: {
             path: path,
             align: path,
             alignOrigin: [0.5, 0.5],
             autoRotate: false,
          },
          duration: duration,
          ease: "power1.inOut",
       },
       position
    )
 }
 
 
 /**
  * Zooms to a specified area of an SVG element by updating its viewBox attribute.
  *
  * @param {GSAPTimeline} timeline - The GSAP animation timeline to add the zoom animation to.
  * @param {string} id - The selector for the SVG element to apply the zoom effect.
  * @param {string} viewBoxParams - The viewBox attribute values to zoom to, in the format "minX minY width height".
  */
 function zoomTo(timeline, id, viewBoxParams) {
    timeline.to(id, {
       duration: 1,
       attr: { viewBox: viewBoxParams },
       ease: "power3.inOut",
       onComplete: () => console.log("Zoom completed"),
    })
 }