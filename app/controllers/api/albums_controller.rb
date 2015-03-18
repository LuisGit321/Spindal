class Api::AlbumsController < ApplicationController
  respond_to :json

  #TODO: Fix Javascript AJAX upload returning HTML instead of JSON.
  skip_before_filter :verify_authenticity_token, only: :upload_cover

	def create
    @album = Album.new(params[:album])
    # TODO: @album.band = current_user.band
    
    if @album.save
      respond_with @album, status: :created, location: api_album_path(@album)
    else
      respond_with @album, status: :unprocessable_entity
    end
  end

  def update
    @album = Album.find(params[:id])

      if @album.update_attributes(params[:album])
        respond_with(@album)
      else
        respond_with @album.errors, status: :unprocessable_entity
      end
  end

   def destroy
    @album = Album.find(params[:id])
    @album.destroy

    respond_with(@album)
  end

  def upload_cover
    @album = current_user.band.albums.find(params[:id])

    @album.cover_image = params[:album][:cover_image]
    @album.save

    respond_to do |format|
      format.html { render layout: false }
      format.json { render @album.cover_image }
    end

  end

end
