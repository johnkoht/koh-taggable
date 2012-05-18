/* ========================================================
 * koh.taggable.js v1.1
 * https://github.com/johnkoht/koh-taggable
 * ========================================================
 * Copyright 2012 kohactive, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================
 *
 *    REQUIREMENTS: 
 *
 *    jQuery 1.6+
 *    jQuery UI Autocomplete (if you're going to use autocomplete)
 *
 *
 *
 *
 *    USAGE:
 *
 *    $(selector).koh_taggable({
 *      tags : ["array", "of", "prepopulate", "tags"],
 *      autocomplete : true or false,
 *      autocomplete_source : ["if", "autocomplete", "then", "prepopulated", "array"],
 *    });
 *
 */
 

(function($) {

  $.fn.koh_taggable = function(options) {
    
    
    
    /* Variables and Options
     * ============================================== */
    
    var tags = options.tags; // Prepopulated tags 
    var autocomplete = options.autocomplete ? true : false; // Is this an auto-complete input?
    var autocomplete_source = options.autocomplete_source; // If autocomplete, what is the source
        
    var element = this;
    var id = new Date().getTime(); // create a unique ID with a timestamp
    var wrap_id = 'koh-taggable-' + id; // Wrapper ID
    var wrap_element = '#koh-taggable-' + id; // Wrapper element
    var list_id = 'koh-taggable-list-' + id; // List of tags ID
    
    
    
    
    /* Default methods and functions
     * ============================================== */
     
    koh_taggable = {
      
      // Update the hidden fields so it saves the data
      update_hidden_input: function(id) {
        var input_value = [];      
        $('#koh-taggable-list-' + id + ' li span').each(function(index, value) {
          input_value.push($(value).text());
        });
        $('#koh-taggable-hidden-input-' + id).val(input_value);
      },

      // Convert a string to a slug (used for the list-items)
      convert_to_slug: function(string) {
        return $.trim(string).replace(/ /g, '-').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
      },
      
      // Create a list item for the tag lists
      create_list_item: function(value, id) {
        var slug = koh_taggable.convert_to_slug(value);
        var remove_btn = '<a href="#" class="remove-koh-taggable-item" data-id="' + id + '" data-listitem-id="' + slug + '">×</a>';
        var list_item = '<li class="koh-taggable-li" id="' + slug + '" style="display: inline-block; opacity:1;"><span>' + value + '</span>' + remove_btn + '</li>';
        return list_item;
      }
      
    };
    
    
    
    
    /* Build the HTML for the taggable element
     * ============================================== */
     
     // Wrap the element in a custom div
     $(this).wrap('<div class="koh_taggable" id="' + wrap_id + '" />')
     
     // Update and hide the real input
     $(this)
      .attr('id', 'koh-taggable-hidden-input-' + id)
      //.attr('data-koh-sortable-id', id)
      .addClass('hide')
      .addClass('koh-taggable-hidden-input');
      
     // Create a fake input field
     $(wrap_element).append('<input id="koh-taggable-input-' + id + '" data-koh-sortable-id="' + id + '" class="koh-taggable-input" />');
    
    
    
    
    /* If tags already exist than build the list
     * ============================================== */
     
    var list_data = ""; // Set the variable
    
    // Check if the tags are present
    if (tags.length) {
      // If so, then let's iterate over the tags and build list-items for each
      $(tags).each(function(index, value) {
        list_data += koh_taggable.create_list_item(value, id);
      });
    }
    
    // Create an UL with the tag list-item data
    var tag_list =  '<ul class="koh-taggable-list" id="' + list_id + '">' + list_data + '</ul>';
    // Add the UL element to our taggable element wrapper
    $(wrap_element).append(tag_list); 
    
    
    
    
    /* Input interactions and functions
     * ============================================== */
     
    // Handles input trasactions and adding to the list
    $('.koh-taggable-input').bind('keypress', function(event) {
      if ( event.which == 13 && $(this).val() != "" ) {
        event.preventDefault();
        var id = $(this).attr('data-koh-sortable-id'); // Get the ID of the taggable element
        var data = $(koh_taggable.create_list_item($(this).val(), id)).effect('pulsate', { times : 1 }, 300); // build the list item
        $('#koh-taggable-list-' + id).append(data); // append to our list
        $(this).val(''); // reset the input
        koh_taggable.update_hidden_input(id); // update the hidden input field
      }
    });
    
    // Handles removing/deleting tags
    $('a.remove-koh-taggable-item').live('click', function(e) {
      var item_id = $(this).attr('data-listitem-id'); // get the id
      $('li#' + item_id).remove(); // remove the element
      //update_hidden_input($(this).attr('data-id')); // update the hidden field
      koh_taggable.update_hidden_input($(this).attr('data-id')); // update the hidden field
    });
    
    // Is this an autocomplete input? If so, add use the source provided
    if (autocomplete && autocomplete_source.length > 0) {
      $('.koh-taggable-input').autocomplete({      
        source: autocomplete_source,
      });
    }
    
    
    
    
    // Let's set the hidden field on load
    koh_taggable.update_hidden_input(id);
    
    
  }

})(jQuery);