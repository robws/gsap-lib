/**
 * @fileoverview Common library for GSAP abstraction
 * about its dependencies.
 * @notes
 * - for animation methods:
 *    - methods return a timeline
 *    - methods take a timeline by reference
 * @package
 * @dependencies
 *
 */

/**
 * Enum for specifying the transform origin of an element using
 * descriptive keywords, each corresponding to a percentage-based
 * position within the element's bounding box.
 * @enum {string}
 */
const TransformOrigin = {
	topLeft: "0% 0%",
	topCenter: "50% 0%",
	topRight: "100% 0%",
	centerLeft: "0% 50%",
	center: "50% 50%",
	centerRight: "100% 50%",
	bottomLeft: "0% 100%",
	bottomCenter: "50% 100%",
	bottomRight: "100% 100%",
};

/**
 * Enum for specifying relative positions to be used as `fromOrigin` and `toOrigin`
 * in the `MotionPathPlugin.getRelativePosition` method. This enum provides predefined
 * array values representing progress values along the x and y axes of an element's
 * bounding box, facilitating precise alignment of elements.
 * @enum {Array}
 */
const PositionReference = {
	centerTop: [0.5, 0],
	centerBottom: [0.5, 1],
	centerCenter: [0.5, 0.5],
	topLeft: [0, 0],
	topCenter: [0.5, 0],
	topRight: [1, 0],
	centerLeft: [0, 0.5],
	centerRight: [1, 0.5],
	bottomLeft: [0, 1],
	bottomCenter: [0.5, 1],
	bottomRight: [1, 1],
};

/**
 * Helper function to select an element by its ID.
 * @param {string} identifier - The ID of the element to select.
 * @returns {Element} The DOM element associated with the ID.
 */
const make = (identifier) => document.querySelector(`#${identifier}`);

/**
 * Helper function to select all matching elements by a selector (like a class)
 * @param {string} selector - The selector of the elements to select.
 * @returns {Element} The DOM element associated with the ID.
 */
const makeAll = (selector) => document.querySelectorAll(selector);

/**
 * Loads an SVG file from a specified URL and inserts it into the HTML element with the given target ID.
 * Also sets the position of the SVG using the GSAP library.
 *
 * @param {string} url The URL of the SVG file to load.
 * @param {string} target The ID of the HTML element where the SVG is to be inserted.
 * @param {number} x The x-coordinate to set for the SVG's position.
 * @param {number} y The y-coordinate to set for the SVG's position.
 */
function loadSVG(url, target, x, y, callback) {
	fetch(url)
		.then((response) => response.text())
		.then((svg) => {
			document.getElementById(target).innerHTML = svg;
			gsap.set(`#${target} svg`, { x: x, y: y });
			if (callback) callback(); // Execute the callback if provided
		})
		.catch((error) => console.error("Error loading SVG:", error));
}

/**
 * makes any items with class .spinnable, spin
 *
 * @param {timeline} GSAP timeline
 * @param {duration} how long for each rotation
 */
function spinTheThings(timeline, duration) {
	timeline.to(".spinnable", {
		duration: duration,
		rotation: "+=360",
		transformOrigin: "50% 50%",
		ease: "linear",
		repeat: -1,
	});
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
		x: "0%", // Keeps the left side fixed
		scaleX: 0, // Narrows down the door until it disappears
		transformOrigin: "left center", // Keeps the left side as the pivot
		ease: "power2.out",
	});
}

/**
 * @function bringToFront
 * @description
 * @param {string} elementId
 * @returns
 * @example
 */
function bringToFront(elementId) {
	var element = document.getElementById(elementId);
	element.parentNode.appendChild(element);
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
		);
	});
}

/**
 * Animates an element along a predefined path.
 * @param {GSAPTimeline} timeline - The GSAP timeline to use for the animation.
 * @param {string} elementId - The ID of the element to animate.
 * @param {string} pathId - The ID of the path to follow.
 * @param {string} position - Timeline position parameter (optional). Can use startWithPrevious and startAfterPrevious functions here
 * @param {number} repeat - Number of times to repeat the animation.
 */
function moveAlong(timeline, elementId, pathId, position = null, repeat = 0) {
	timeline.to(
		elementId,
		{
			duration: 1,
			ease: "power1.inOut",
			motionPath: {
				path: pathId,
				align: pathId,
				alignOrigin: [0.5, 0.5],
			},
			repeat: repeat,
		},
		position
	);
}

/**
 * @function moveOnPath
 * @description
 * @param {string} timeline
 * @param {string} id
 * @param {string} path
 * @param {string} duration
 * @param {string} startWithPrevious = false
 * @returns
 * @example
 */
function moveOnPath(timeline, id, path, duration, startWithPrevious = false) {
	const position = startWithPrevious ? "<" : "+=0";

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
	);
}

/**
 * Returns a string for GSAP's timeline position parameter to start with the previous animation
 * @param {number} secondsOffset - Offset in seconds for the timeline position.
 * @returns {string} The timeline position parameter.
 */
function startWithPrevious(secondsOffset = 0) {
	return secondsOffset === 0 ? "<" : `<${secondsOffset}`;
}

/**
 * Returns a string for GSAP's timeline position parameter to start after the previous animation
 * @param {number} secondsOffset - Offset in seconds for the timeline position.
 * @returns {string} The timeline position parameter.
 */
function startAfterPrevious(secondsOffset = 0) {
	return secondsOffset === 0 ? "+=0" : `+=${secondsOffset}`;
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
	});
}
