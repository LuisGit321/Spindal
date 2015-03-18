;(function ( $, window, document, undefined ) {
 
    $.widget( "spindal.validate" , {
 
        //Options to be used as defaults
        options: {
          regex: /.*/,
          errorMsg: "This is invalid",
          defaultPlaceholder: ""
        },
        _create: function () {

        },
 
        destroy: function () {
          $.Widget.prototype.destroy.call( this );
        },
 
        check: function ( event ) {

      		var that = this;
          if(this.element.val()) {
            if(this.options.regex.test(this.element.val())) {
              return true;            
            }
            else {
        			this.element.attr('value', '');
      				this.element.addClass('error-placeholder');
              this.element.attr('placeholder', this.options.errorMsg);                            

    					this.element.one("click", function() {
    						that.element.removeClass('error-placeholder');
    						that.element.attr('placeholder', that.options.defaultPlaceholder);
    					});
              return false;
            }
          } else {
            return true;
          }
        },
 
        methodA: function ( event ) {
          this._trigger( "dataChanged", event, {
              key: value
          });
        },
 
        _setOption: function ( key, value ) {
          switch ( key ) {
          case "someValue":
            // this.options.someValue = doSomethingWith( value );
            break;
          default:
            // this.options[ key ] = value;
            break;
          }

          $.Widget.prototype._setOption.apply( this, arguments );
        }
    });
 
})( jQuery, window, document );