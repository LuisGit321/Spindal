class Api::VideosController < ApplicationController
	respond_to :json

	def create

    @video = Video.new(params[:video])
    # TODO: @video.band = current_user.band
    
    if @video.save
      respond_with @video, status: :created, location: api_video_path(@video)
    else
      respond_with @video, status: :unprocessable_entity
    end
  end

  def update
    @video = Video.find(params[:id])

      if @video.update_attributes(params[:video])
        respond_with(@video)
      else
        respond_with @video.errors, status: :unprocessable_entity
      end
  end

   def destroy
    @video = Video.find(params[:id])
    @video.destroy

    respond_with(@video)
  end

end
