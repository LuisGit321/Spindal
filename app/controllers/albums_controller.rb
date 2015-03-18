class AlbumsController < ApplicationController
  respond_to :json

  def test
    @albums = Album.all

    respond_with @albums
  end
end
