class Api::PhotosController < ApplicationController
  respond_to :json

  #TODO: Fix Javascript AJAX upload returning HTML instead of JSON.
  skip_before_filter :verify_authenticity_token, only: :upload

  def upload
  	@photo = Photo.new

    if params[:band_id]
      # Check here if the band is owned by current user
      @photo.imageable = Band.find(params[:band_id])
    elsif params[:song_id]
      # Check here if the Song/Album is owned by current user
      @photo.imageable = Song.find(params[:song_id])
    end
      
  	@photo.file = params[:photo][:file]
    @photo.order = params[:order]
  	@photo.save

    respond_to do |format|
      format.html { render layout: false }
      format.json { render @photo }
    end
  end

  def update
    @photo = Photo.find(params[:id])

    if @photo.update_attributes(params[:photo])
      respond_with(@photo)
    else
      respond_with @photo.errors, status: :unprocessable_entity
    end
  end


  def destroy
    @photo = Photo.find(params[:id])
    respond_with @photo.destroy
  end

end