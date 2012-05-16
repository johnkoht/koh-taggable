

(function($) {

  $.fn.koh_taggable = function(options) {
    
    
    //variables
    var element = this;
    var tags = options.tags;
    var source = options.source;
    var input = options.input;
    var autocomplete = options.autocomplete ? true : false;
    var autocomplete_source = options.autocomplete_source;
        
    var id = new Date().getTime();
    var wrap_id = 'koh-taggable-' + id;
    var wrap_element = '#koh-taggable-' + id;
    var list_id = 'koh-taggable-list-' + id;
    var input_id = input;
    
    
    // We need to add a few classes, divs and inputs to make this happen
    $(this).attr('data-koh-sortable-id', id); // add a data attribute
    $(this).addClass('koh-taggable-input'); // add a general class to the input
    $(this).wrap('<div class="koh_taggable" id="' + wrap_id + '" />') // Wrap the element in a custom div
    $(wrap_element).append('<input name="' + input + '" id="koh-taggable-hidden-input-' + id + '" class="koh-taggable-hidden-input" type="hidden" />'); // add the hidden input field
    
    
    // Loop over the tags and create the list items
    var list_data = "";
    
    if (tags.length) {
      $(tags).each(function(index, value) {
        list_data += create_list_item(value, id);
      });
    }
    
    // Create the UL with the data
    var tag_list =  '<ul class="koh-taggable-list" id="' + list_id + '">' + list_data + '</ul>';
    $(wrap_element).append(tag_list);
    
    
    
    // Handles input trasactions and adding to the list
    $('.koh-taggable-input').bind('keypress', function(event) {
      if ( event.which == 13 && $(this).val() != "" ) {
        event.preventDefault();
        var id = $(this).attr('data-koh-sortable-id');
        var data = $(create_list_item($(this).val(), id)).effect('pulsate', { times : 1 }, 300);
        $('#koh-taggable-list-' + id).append(data);     
        $(this).val('');
        update_hidden_input(id);
      }
    });
    
    $('a.remove-koh-taggable-item').live('click', function(e) {
      var item_id = $(this).attr('data-listitem-id');
      $('li#' + item_id).remove();
      update_hidden_input($(this).attr('data-id'));
    });
    
    
    // Is this an autocomplete input? If so, add use the source provided
    if (autocomplete && autocomplete_source.length > 0) {
      $(this).autocomplete({      
        source: autocomplete_source,
      });
    }
    
    // Update the hidden fields so it saves the data
    function update_hidden_input(id) {
      var input_value = [];      
      $('#koh-taggable-list-' + id + ' li span').each(function(index, value) {
        input_value.push($(value).text());
      });
      $('#koh-taggable-hidden-input-' + id).val(input_value);
    }
    
    // Convert a string to a slug
    function convert_to_slug(string) {
      return $.trim(string).replace(/ /g, '-').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    }
    
    // Create a list item for the tag lists
    function create_list_item(value, id) {
      var slug = convert_to_slug(value);
      var remove_btn = '<a href="#" class="remove-koh-taggable-item" data-id="' + id + '" data-listitem-id="' + slug + '">×</a>';
      var list_item = '<li class="koh-taggable-li" id="' + slug + '" style="display: inline-block; opacity:1;"><span>' + value + '</span>' + remove_btn + '</li>';
      return list_item;
    }
    
    
  }

})(jQuery);