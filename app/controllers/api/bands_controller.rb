class Api::BandsController < ApplicationController
	respond_to :json

  #TODO: Fix Javascript AJAX upload returning HTML instead of JSON.
  skip_before_filter :verify_authenticity_token, only: :upload_background

	def show
		@band = Band.includes(:live_shows, :logo).last
		respond_with @band, :include => [:live_shows, :logo]
	end

	def update
    band = current_user.band

    if band.update_attributes(params[:band])
			respond_with(band, :location => api_band_path(band), api: true)
		else
			respond_with(band, api: true)
		end
	end

  def upload_background
    logger.debug params[:band][:bg_image]
    
  	@band = current_user.band

    @band.bg_image = params[:band][:bg_image]
  	@band.save

    respond_to do |format|
      format.html { render layout: false }
      format.json { render @band.bg_image }
    end

  end


end
