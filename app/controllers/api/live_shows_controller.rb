class Api::LiveShowsController < ApplicationController
  respond_to :json	
	def create
    @live_show = LiveShow.new(params[:live_show])

    if @live_show.save
      respond_with @live_show, status: :created, location: api_live_show_path(@live_show)
    else
      respond_with @live_show, status: :unprocessable_entity
    end
  end

  def update
    @live_show = LiveShow.find(params[:id])

      if @live_show.update_attributes(params[:live_show])
        respond_with(@live_show)
      else
        respond_with @live_show.errors, status: :unprocessable_entity
      end
  end

   def destroy
    @live_show = LiveShow.find(params[:id])
    @live_show.destroy

    respond_with(@live_show)
  end
end
