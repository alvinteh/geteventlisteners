geteventlistenrs
=========

A jQuery plugin that allows detection and retrieval of event listeners.

Usage
-------

    $.hasEventListeners(
        event       						String representing the event name
        [, args = {							Object containing optional arguments
        	includeDelegated = false		Boolean indicating whether delegated event handlers should be included
    	}]
    )

Returns a boolean whether the referenced element has any registered event handlers for the specified event.

	$.getEventListeners(
        event                               String representing the event name
        [, args = {                         Object containing optional arguments
            includeDelegated = false        Boolean indicating whether delegated event handlers should be included
        }]
    )

Returns an array containing the registered event handlers for the specified event and referenced element. The retuned
array adheres to the following format:

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

Use the includeDelegated options with care as it can be processor intensive, particularly for elements deep in the DOM
tree as it involves iterating through all the elements' parents.

Dependencies
-------

* jQuery 1.8+

License
-------
Copyright 2013 Alvin Teh.
Licensed under the MIT license.