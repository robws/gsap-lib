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


/*
+---------------------------------------------
|       # Timing functions
+---------------------------------------------
*/

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


/*
+---------------------------------------------
|       # Helpers
+---------------------------------------------
*/

/**
 * Helper function to set a bunch of shortcuts to objects with an array
 * @param {array} thingIds - array, defined globally (probably)
 * @returns {} of indexed selectors
 */
function setShortcuts(thingIds) {
	return thingIds.reduce((things, id) => {
	  
	  things[id] = document.querySelector(`#${id}`);
	  return things;
	}, {});
  }

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


/*
+---------------------------------------------
|       # Movement
+---------------------------------------------
*/


/**
 * Animates an element relative to another one
 */
function moveRelative(timeline, movedItem, targetItem, movedItemRef, targetItemRef, duration, xOffset = 0) {
  timeline.add(
    gsap.to(movedItem, {
      duration: duration,
      ease: "power1.inOut",
      x: function() {
        var moveUnitRef = MotionPathPlugin.getRelativePosition(movedItem, targetItem, movedItemRef, targetItemRef);
        console.log("Calculated move units: " + moveUnitRef.x + "," + moveUnitRef.y);
        return "+=" + (moveUnitRef.x + xOffset);
      },
      y: function() {
        var moveUnitRef = MotionPathPlugin.getRelativePosition(movedItem, targetItem, movedItemRef, targetItemRef);
        return "+=" + moveUnitRef.y;
      }
    })
  );
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


/*
+---------------------------------------------
|       # Antics and Behaviors
+---------------------------------------------
*/
function fadeIn(timeline, elementId, playDuration = 1, timelinePosition = null) {
	const tween = gsap.to(elementId, {
	  duration: playDuration,
	  ease: "power1.inOut",
	  opacity: 100
	});
  
	if (timelinePosition === null) {
	  timeline.add(tween);
	  console.log("Added without timelinePosition");
	} else {
	  timeline.add(tween, timelinePosition);
	  console.log("Added with timelinePosition");
	}
  }

function fadeOut(timeline, elementId, playDuration = 1, timelinePosition = null) {
	const tween = gsap.to(elementId, {
	  duration: playDuration,
	  ease: "power1.inOut",
	  opacity: 0
	});
  
	if (timelinePosition === null) {
	  timeline.add(tween);
	  console.log("Added without timelinePosition");
	} else {
	  timeline.add(tween, timelinePosition);
	  console.log("Added with timelinePosition");
	}
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
 * @description take a 2d rectnagle door and opens it from left to right
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
 * Wiggles an SVG path sideways as a part of a GSAP timeline.
 * @param {gsap.core.Timeline} timeline - The GSAP timeline to which the animation will be added.
 * @param {string} pathSelector - The CSS selector for the SVG path to animate.
 * @param {number} numberOfPixels - The number of pixels to move the path.
 * @param {number} duration - The duration of the side movement.
 * @param {number} repeat - The number of times the animation should repeat.
 * @param {string} position - The position in the timeline for this animation sequence to start.
 */
function wiggleSideways(timeline, pathSelector, numberOfPixels, totalDuration, repeat, position = startAfterPrevious()) {
  const originalX = gsap.getProperty(pathSelector, "x");

  // Calculate the duration for the yoyo movement
    const yoyoDuration = (totalDuration - 0.5) / repeat; // Adjusting for total duration divided by the number of repeats

    // Move path left by numberOfPixels (relative movement) for 0.25 seconds
    timeline.add(gsap.to(pathSelector, { x: `-=${numberOfPixels}`, duration: 0.25 }), position);

    // Move path right by numberOfPixels * 2 (relative movement) and yoyo
    timeline.add(gsap.to(pathSelector, {
        x: `+=${numberOfPixels * 2}`,
        duration: yoyoDuration,
        repeat: repeat,
        yoyo: true,
        yoyoEase: true
    }));

    // Restore path to its original position, taking 0.25 seconds
    timeline.add(gsap.to(pathSelector, { x: originalX, duration: 0.25 }));

}

/**
 * Zooms to a specified area of an SVG element by updating its viewBox attribute.
 *
 * @param {GSAPTimeline} timeline - The GSAP animation timeline to add the zoom animation to.
 * @param {string} id - The selector for the SVG element to apply the zoom effect.
 * @param {string} viewBoxParams - The viewBox attribute values to zoom to, in the format "minX minY width height".
 */
function zoomTo(timeline, id, viewBoxParams) {
	timeline.add(
		gsap.to(id, {
		duration: 1,
		attr: { viewBox: viewBoxParams },
		ease: "power3.inOut",
		onComplete: () => console.log("Zoom completed"),
	}));
}

/* ## Utility functions */

/**
 * Binds an event function to a button by query selector
 *
 * @param {selector} string -
 * @param {clickEvent} string - 
  */
function hookButton(selector, clickEvent) {
	var element = document.querySelector(selector);
	if (element) {
	  element.addEventListener("click", clickEvent);
	} else {
	  console.error('Element with selector "' + selector + '" not found.');
	}
  }