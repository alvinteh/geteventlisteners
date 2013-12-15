(function(factory) {
    if (typeof define === "function" && define.amd) {
        //jQuery was loaded via AMD
        define(["jquery"], factory);
    }
    else {
        //jQuery was loaded globally
        factory(jQuery);
    }
}(function($) {
    "use strict";

    /*
        $.hasEventListeners(
            event                               String representing the event name
            [, args = {                         Object containing optional arguments
                includeDelegated = false        Boolean indicating whether delegated event handlers should be included
            }]
        )

        Returns a boolean whether the referenced element has any registered event handlers for the specified event.
    */

    $.fn.hasEventListeners = function(event, args) {
        var includeDelegates = args && typeof args.includeDelegates === "boolean" ? args.includeDelegates : false;

        var hasEventListeners = false;

        var eventListenerData = $._data($(this)[0], "events");
        var eventListeners = typeof eventListenerData === "object" && eventListenerData[event] !== undefined ?
            eventListenerData[event] :
            [];

        if (eventListeners.length > 0) {
            hasEventListeners = true;
        }

        if (!hasEventListeners && includeDelegates) {
            //Use with care as this can be processor intensive for elements deep in the DOM tree as it involves
            //iteration of all the element's parents.

            var currentElement = $(this);

            outerLoop:
            do {
                currentElement = currentElement.parent();

                eventListenerData = $._data(currentElement[0], "events");
                eventListeners = eventListenerData !== undefined && eventListenerData[event] !== undefined ?
                    eventListenerData[event] :
                    [];
                
                if (eventListeners.length > 0  && eventListeners.delegateCount > 0) {
                    //Iterate event listeners and check if the event target fits any of their selectors.
                    for (var i = 0, length = eventListeners.length; i < length; i++) {
                        var eventListener = eventListeners[i];

                        if (eventListener.selector !== undefined && $(this).is(eventListener.selector)) {
                            
                            hasEventListeners = true;
                            break outerLoop;
                        }
                    }
                }

            } while (currentElement.parent().prop("tagName") !== "HTML");
        }

        return hasEventListeners;
    };

    /*
        $.getEventListeners(
            event                               String representing the event name
            [, args = {                         Object containing optional arguments
                includeDelegated = false        Boolean indicating whether delegated event handlers should be included
            }]
        )

        Returns an array containing the registered event handlers for the specified event and referenced element. The
        retuned array adheres to the following format:

        [
            {
                element,                    jQuery element representing the DOM element the event listener is attached
                                            or delegated to
                selector,                   String representing the CSS selector for the element.
                is_delegate,                Boolean indicating whether the event listener is delegated.
                event_listener              Function reference to the event listener
            },
            [...]
        ]
    */

    $.fn.getEventListeners = function(event, args) {
        var includeDelegates = args && typeof args.includeDelegates === "boolean" ? args.includeDelegates : false;

        var returnEventListeners = [];

        var currentElement = $(this);
        var isProcessingParents = false;

        do {
            var eventListenerData = $._data(currentElement[0], "events");
            var eventListeners = eventListenerData !== undefined && eventListenerData[event] !== undefined ?
                eventListenerData[event] :
                [];

            if (eventListeners.length > 0 && (!isProcessingParents || eventListeners.delegateCount > 0)) {
                //Iterate event listeners and check if the event target fits any of their selectors.
                for (var i = 0, length = eventListeners.length; i < length; i++) {
                    var eventListener = eventListeners[i];

                    if (!isProcessingParents ||
                        (eventListener.selector !== undefined && $(this).is(eventListener.selector))
                        ) {
                        /*jshint -W106 */
                        returnEventListeners.push({
                            element: currentElement,
                            selector: isProcessingParents ? eventListener.selector : null,
                            is_delegate: isProcessingParents,
                            event_listener: eventListener.handler
                        });
                        /*jshint +W106 */
                    }
                }
            }

            if (includeDelegates) {
                //Use with care as this can be processor intensive for elements deep in the DOM tree as it involves
                //iteration of all the element's parents.
                currentElement = currentElement.parent();
                isProcessingParents = true;
            }
            else {
                break;
            }

        } while (currentElement.parent().prop("tagName") !== "HTML");

        return returnEventListeners;
    };

}));