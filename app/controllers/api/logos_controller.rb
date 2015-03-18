class Api::LogosController < ApplicationController
	respond_to :json
  #TODO: Fix Javascript AJAX upload returning HTML instead of JSON.
  skip_before_filter :verify_authenticity_token, only: :upload
  
	def create
    @logo = Logo.new(params[:logo])
    # TODO: @logo.band = current_user.band

    if @logo.save
      respond_with @logo, status: :created, location: api_logo_path(@logo)
    else
      respond_with @logo, status: :unprocessable_entity
    end
  end

  def update
    @logo = Logo.find(params[:id])

      if @logo.update_attributes(params[:logo])
        respond_with(@logo)
      else
        respond_with @logo.errors, status: :unprocessable_entity
      end
  end

   def destroy
    @logo = Logo.find(params[:id])
    @logo.destroy

    respond_with(@logo)
  end
  
  def upload
    @band = current_user.band

    if @band.logo
      @logo = @band.logo
    else
      @logo = Logo.create
      @band.logo = @logo
      @band.save
    end

  	@logo.file = params[:logo][:file]
  	@logo.save

    respond_to do |format|
      format.html { render layout: false }
      format.json { render @logo }
    end

  end

end
