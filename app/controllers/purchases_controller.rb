
class PurchasesController < ApplicationController

  def initiate

  	if params[:type] == "album"
	    recording = Album.find(params[:id])
	  elsif params[:type] == "song"
	  	recording = Song.find(params[:id])
	  end
    
    host=request.host.to_s
    port=request.port.to_s   

    cancelURL = cancel_purchases_url
    returnURL = checkout_purchases_url

    gateway = Paypal.new

    @transaction = gateway.initiate_checkout(recording, cancelURL, returnURL)

    if @transaction.success? 
      @token = @transaction.response["TOKEN"].first.to_s
      session[:paypal_token] = @token.inspect
      render :json => {:purchaseKey => @token, :purchaseUrl => App.paypal[:setECURL]}
    else
      session[:paypal_error] = @transaction.response
      logger.debug @transaction.inspect
      render :json => {:purchaseKey => "", :purchaseError => true, :purchaseErrorReason => ""}
    end

    rescue Errno::ENOENT => exception
      session[:paypal_error] = exception.message
      logger.error exception.backtrace
      logger.error exception.message
      render :json => {:purchaseKey => "", :purchaseError => true, :purchaseErrorReason => ""}
  end
	
	def checkout
		@transaction = Purchase.where(token: params[:token]).first
		@transaction.update_attributes(
        payer_id: params[:PayerID],
        status: Purchase::STATES[:authorized]
      )

		gateway = Paypal.new
		@result = gateway.complete_checkout(@transaction)
    
    logger.debug @result.inspect

    if @result.success? && @result.response["ACK"].first == "Success"
			@transaction.update_attribute(:status, "paid")
      # Automatically start download OR generate link OR both
      render layout: false
		else
      render action: "checkout_failed", layout: false 
		end

    session[:paypal_token] = nil
  end

  def cancel
    session[:paypal_token] = nil
    render layout: false
  end

end