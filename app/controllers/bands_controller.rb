class BandsController < ApplicationController

	def show
    if user_signed_in?
	    @band = current_user.band
	  else
	  	#TODO: @band = Band.find(params[:id])
	  	@band = Band.first  
	  end

    render text: "totally blank", layout: 'application'

	end

end