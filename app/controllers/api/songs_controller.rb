class Api::SongsController < ApplicationController
  respond_to :json

  #TODO: Fix Javascript AJAX upload returning HTML instead of JSON.
  skip_before_filter :verify_authenticity_token, only: :upload

  def show
    @song = Song.find(params[:id])

    if @song
      respond_with @song
    else
      respond_with :not_found
    end

  end

  def create
    @song = Song.new(params[:song])

    if @song.save
      respond_with @song, status: :created, location: api_song_path(@song)
    else
      respond_with @song, status: :unprocessable_entity
    end
  end

  def update
    @song = Song.find(params[:id])

    if @song.update_attributes(params[:song])
      respond_with(@song)
    else
      respond_with @song.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @song = Song.find(params[:id])
    respond_with @song.destroy
  end

  def upload
    @song      = Song.find params[:id]
    @song.file = params[:song][:file]
    @song.save
    
    respond_to do |format|
      format.html { render layout: false }
      format.json { render @song }
    end
  end

end
